// When the last sub-issue of an epic closes, flag the epic for acceptance.
// The epic is never closed automatically: it closes after its outcome is checked.
//
// Epics live in kaffeelisten/.github and their children in any organisation repository, and a
// repository's GITHUB_TOKEN can only write to itself. So there are two entry points:
// - `run` handles an issue event in any repository whose parent lives in the same repository;
// - `sweep` runs in kaffeelisten/.github on a schedule and checks every open epic there,
//   whatever repository its children are in.

const LABEL = 'ready-for-acceptance';
const MARKER = '<!-- sub-issue-rollup:ready -->';

function decide({ action, parent }) {
  if (!parent || parent.state !== 'OPEN') return { kind: 'none' };
  const { total, completed } = parent.subIssuesSummary;
  const labelled = parent.labels.nodes.some((l) => l.name === LABEL);
  const done = total > 0 && completed === total;
  if ((action === 'closed' || action === 'sweep') && done && !labelled) return { kind: 'ready', total };
  if ((action === 'reopened' || action === 'sweep') && !done && labelled) return { kind: 'unready' };
  return { kind: 'none' };
}

async function apply({ github, core, owner, repo, parent, decision, trigger }) {
  if (decision.kind === 'ready') {
    await github.rest.issues.addLabels({ owner, repo, issue_number: parent.number, labels: [LABEL] });
    const comments = await github.paginate(github.rest.issues.listComments, { owner, repo, issue_number: parent.number, per_page: 100 });
    if (!comments.some((c) => (c.body || '').includes(MARKER))) {
      await github.rest.issues.createComment({
        owner, repo, issue_number: parent.number,
        body: `${MARKER}\nAll ${decision.total} sub-issues are closed${trigger ? ` (last: ${trigger})` : ''}. Check the outcome above end to end, then close this epic.`,
      });
    }
    core.info(`#${parent.number} is ready for acceptance.`);
  } else if (decision.kind === 'unready') {
    await github.rest.issues.removeLabel({ owner, repo, issue_number: parent.number, name: LABEL });
    core.info(`A sub-issue of #${parent.number} reopened; removed ${LABEL}.`);
  }
}

async function run({ github, context, core }) {
  const { owner, repo } = context.repo;
  const number = context.payload.issue.number;
  const result = await github.graphql(
    `query($o:String!,$r:String!,$n:Int!){repository(owner:$o,name:$r){issue(number:$n){
      parent{number state repository{nameWithOwner} subIssuesSummary{total completed} labels(first:50){nodes{name}}}}}}`,
    { o: owner, r: repo, n: number },
  );
  const parent = result.repository.issue.parent;
  if (!parent) return;
  if (parent.repository.nameWithOwner !== `${owner}/${repo}`) {
    core.info(`Parent ${parent.repository.nameWithOwner}#${parent.number} is in another repository; its scheduled sweep handles it.`);
    return;
  }
  await apply({ github, core, owner, repo, parent, decision: decide({ action: context.payload.action, parent }), trigger: `#${number}` });
}

async function sweep({ github, context, core }) {
  const { owner, repo } = context.repo;
  const result = await github.graphql(
    `query($q:String!){search(type:ISSUE,query:$q,first:100){nodes{... on Issue{
      number state subIssuesSummary{total completed} labels(first:50){nodes{name}}}}}}`,
    { q: `repo:${owner}/${repo} is:issue is:open label:type:epic` },
  );
  for (const parent of result.search.nodes) {
    await apply({ github, core, owner, repo, parent, decision: decide({ action: 'sweep', parent }) });
  }
}

module.exports = run;
module.exports.sweep = sweep;
module.exports.decide = decide;
