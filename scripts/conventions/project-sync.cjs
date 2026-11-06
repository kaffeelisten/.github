// Keep the organisation board (config.projectUrl) in step with issues and pull requests in the
// calling repository. Needs PROJECTS_TOKEN: GITHUB_TOKEN cannot write an organisation project.
// Sets Status, Start date and Completed date only. Never closes issues, merges or deploys.

const config = require('./project-config.json');
const { issueReferences } = require('./pr-conventions.cjs');

// Same parser as the PR conventions check, so a reference that passes CI also moves the board.
function closingIssues(body, owner, repo) {
  return issueReferences(body, owner, repo).closes;
}

function pullRequestStatus(pr) {
  if (pr.state === 'closed') return pr.merged ? 'Done' : 'Backlog';
  return pr.draft ? 'In progress' : 'In review';
}

async function syncProject({ github, context, core }) {
  const { owner, repo } = context.repo;
  if (owner !== config.owner) throw new Error(`Unexpected owner ${owner}`);
  const here = `${owner}/${repo}`;
  let openPulls;
  const statuses = new Map();

  async function currentPullStatus(pr) {
    if (pr.state === 'closed' || pr.draft || !pr.node_id) return pullRequestStatus(pr);
    if (!statuses.has(pr.node_id)) {
      const result = await github.graphql('query($id:ID!){node(id:$id){... on PullRequest{reviewDecision}}}', { id: pr.node_id });
      statuses.set(pr.node_id, result.node?.reviewDecision === 'CHANGES_REQUESTED' ? 'In progress' : 'In review');
    }
    return statuses.get(pr.node_id);
  }
  async function activePulls() {
    if (!openPulls) openPulls = await github.paginate(github.rest.pulls.list, { owner, repo, state: 'open', per_page: 100 });
    return openPulls;
  }
  const field = (item, fieldId, value) => github.graphql(
    'mutation($p:ID!,$i:ID!,$f:ID!,$v:ProjectV2FieldValue!){updateProjectV2ItemFieldValue(input:{projectId:$p,itemId:$i,fieldId:$f,value:$v}){projectV2Item{id}}}',
    { p: config.projectId, i: item, f: fieldId, v: value },
  );

  async function setItem(contentId, status, dates = {}) {
    async function findItem() {
      let after = null;
      do {
        const result = await github.graphql(`query($c:ID!,$a:String){node(id:$c){
          ... on Issue{projectItems(first:100,after:$a,includeArchived:true){nodes{id project{id}} pageInfo{hasNextPage endCursor}}}
          ... on PullRequest{projectItems(first:100,after:$a,includeArchived:true){nodes{id project{id}} pageInfo{hasNextPage endCursor}}}}}`, { c: contentId, a: after });
        const page = result.node.projectItems;
        const found = page.nodes.find((entry) => entry.project.id === config.projectId);
        if (found) return found.id;
        after = page.pageInfo.hasNextPage ? page.pageInfo.endCursor : null;
      } while (after);
      return null;
    }
    let item = await findItem();
    if (!item) {
      try {
        const added = await github.graphql('mutation($p:ID!,$c:ID!){addProjectV2ItemById(input:{projectId:$p,contentId:$c}){item{id}}}', { p: config.projectId, c: contentId });
        item = added.addProjectV2ItemById.item.id;
      } catch (error) {
        item = await findItem();
        if (!item) throw error;
      }
    }
    await field(item, config.statusFieldId, { singleSelectOptionId: config.statusOptions[status] });
    if (dates.completed) {
      await field(item, config.completedDateFieldId, { date: dates.completed });
    } else if (dates.clearCompleted) {
      await github.graphql('mutation($p:ID!,$i:ID!,$f:ID!){clearProjectV2ItemFieldValue(input:{projectId:$p,itemId:$i,fieldId:$f}){projectV2Item{id}}}', { p: config.projectId, i: item, f: config.completedDateFieldId });
    }
    if (status === 'In progress' || status === 'In review') {
      const current = await github.graphql('query($id:ID!){node(id:$id){... on ProjectV2Item{fieldValueByName(name:"Start date"){... on ProjectV2ItemFieldDateValue{date}}}}}', { id: item });
      if (!current.node.fieldValueByName?.date) await field(item, config.startDateFieldId, { date: new Date().toISOString().slice(0, 10) });
    }
  }

  async function syncIssue(issue, fallback) {
    if (issue.pull_request) return;
    if (issue.state === 'closed') return setItem(issue.node_id, 'Done', { completed: issue.closed_at.slice(0, 10) });
    const [o, r] = (issue.repository_url || '').split('/').slice(-2);
    const active = (await activePulls()).filter((pr) => closingIssues(pr.body, owner, repo)
      .some((ref) => ref.number === issue.number && ref.repo === `${o}/${r}`));
    if (active.length) {
      const states = await Promise.all(active.map(currentPullStatus));
      return setItem(issue.node_id, states.includes('In progress') ? 'In progress' : 'In review', { clearCompleted: true });
    }
    if (fallback) await setItem(issue.node_id, fallback, { clearCompleted: true });
    // Unlinked open issues keep their triaged Ready, Blocked or Backlog state.
  }

  async function syncPullRequest(pr) {
    await setItem(pr.node_id, await currentPullStatus(pr), pr.merged_at ? { completed: pr.merged_at.slice(0, 10) } : { clearCompleted: true });
    for (const ref of closingIssues(pr.body, owner, repo)) {
      const [o, r] = ref.repo.split('/');
      if (o !== config.owner) continue;
      try {
        const { data: issue } = await github.rest.issues.get({ owner: o, repo: r, issue_number: ref.number });
        // A merge into another stack layer does not complete the issue.
        await syncIssue(issue, pr.state === 'closed' && !pr.merged ? 'Ready' : pr.draft ? 'In progress' : 'In review');
      } catch (error) {
        core.warning(`Could not sync ${ref.repo}#${ref.number}: ${error.message}`);
      }
    }
  }

  if (context.payload.pull_request) {
    const { data: pr } = await github.rest.pulls.get({ owner, repo, pull_number: context.payload.pull_request.number });
    await syncPullRequest(pr);
  } else if (context.payload.issue) {
    const { data: issue } = await github.rest.issues.get({ owner, repo, issue_number: context.payload.issue.number });
    await syncIssue(issue, context.payload.action === 'reopened' ? 'Ready' : context.payload.action === 'opened' ? 'Backlog' : undefined);
  } else {
    for (const pr of await activePulls()) await syncPullRequest(pr);
    for await (const response of github.paginate.iterator(github.rest.issues.listForRepo, { owner, repo, state: 'all', per_page: 100 })) {
      for (const issue of response.data) await syncIssue(issue);
    }
  }
  core.info(`${here}: board synchronized. No merge, deployment or issue-close action was performed.`);
}

module.exports = syncProject;
module.exports.closingIssues = closingIssues;
module.exports.pullRequestStatus = pullRequestStatus;
