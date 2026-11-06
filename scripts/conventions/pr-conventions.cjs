// Pull-request conventions for every kaffeelisten repository.
//
// Checks: a Conventional Commits title (optionally prefixed `[n/N] ` inside a stack), exactly one
// `type:*` label, and a linked issue. Fixes what it safely can: assigns the author to the PR and to
// the issues it closes, adds the `type:*` label the title implies, and copies the milestone from the
// closed issue. Runs from the default branch under pull_request_target and never executes PR code.

const TYPES = ['feat', 'fix', 'docs', 'refactor', 'test', 'chore', 'ci', 'perf', 'build', 'style', 'revert'];
const TITLE = new RegExp(`^(\\[\\d+/\\d+\\] )?(${TYPES.join('|')})(\\([a-z0-9][a-z0-9/._-]*\\))?!?: \\S.*$`);
const MAX_TITLE = 72;
const BOTS = /\[bot\]$/;
const TYPE_LABELS = ['type:epic', 'type:story', 'type:task', 'type:spike', 'type:bug'];

function checkTitle(title) {
  const problems = [];
  const t = title || '';
  if (!TITLE.test(t)) {
    problems.push(`Title must look like \`type(scope): summary\` with type one of ${TYPES.join(', ')}. Inside a stack, prefix it with \`[n/N] \`.`);
  }
  const bare = t.replace(/^\[\d+\/\d+\] /, '');
  if (bare.length > MAX_TITLE) problems.push(`Title is ${bare.length} characters; keep it at most ${MAX_TITLE}.`);
  if (/\.$/.test(t)) problems.push('Title must not end with a period.');
  return problems;
}

// The type label a title implies: feat -> story, fix -> bug, anything else -> task.
function typeFromTitle(title) {
  const m = TITLE.exec(title || '');
  if (!m) return null;
  if (m[2] === 'feat') return 'type:story';
  if (m[2] === 'fix') return 'type:bug';
  return 'type:task';
}

// References outside code blocks and comments. Accepts `#n`, `owner/repo#n` and issue URLs.
// Returns { closes: [{repo, number}], refs: [{repo, number}] } with repo as `owner/name`.
function issueReferences(body, owner, repo) {
  const text = (body || '').replace(/```[\s\S]*?```/g, '').replace(/<!--[\s\S]*?-->/g, '');
  const here = `${owner}/${repo}`;
  const target = '(?:([A-Za-z0-9-]+\\/[A-Za-z0-9._-]+)?#(\\d+)|https:\\/\\/github\\.com\\/([A-Za-z0-9-]+\\/[A-Za-z0-9._-]+)\\/issues\\/(\\d+))\\b';
  const collect = (keywords) => {
    const out = [];
    for (const m of text.matchAll(new RegExp(`\\b(?:${keywords})\\s*:?\\s+${target}`, 'gi'))) {
      const ref = { repo: m[1] || m[3] || here, number: Number(m[2] || m[4]) };
      if (!out.some((r) => r.repo === ref.repo && r.number === ref.number)) out.push(ref);
    }
    return out;
  };
  const closes = collect('close[sd]?|fix(?:e[sd])?|resolve[sd]?');
  const refs = collect('refs?|part of|relates to|issue')
    .filter((r) => !closes.some((c) => c.repo === r.repo && c.number === r.number));
  return { closes, refs };
}

function evaluate(pr, owner, repo) {
  const problems = checkTitle(pr.title);
  const labels = (pr.labels || []).map((l) => (typeof l === 'string' ? l : l.name));
  const exempt = BOTS.test(pr.user?.login || '') || labels.includes('no-issue');
  const refs = issueReferences(pr.body, owner, repo);
  if (!exempt && refs.closes.length + refs.refs.length === 0) {
    problems.push('Link an issue in the description: `Closes #n` for the issue this PR completes, or `Refs #n` for a stack layer or a partial step. Issues in other kaffeelisten repositories work too (`Closes kaffeelisten/playbook#n`). Add the `no-issue` label only for a trivial fix.');
  }
  const types = labels.filter((l) => TYPE_LABELS.includes(l));
  if (types.length > 1) problems.push(`Use exactly one \`type:*\` label; this PR has ${types.join(', ')}.`);
  return { problems, refs, exempt, labels };
}

async function run({ github, context, core }) {
  const { owner, repo } = context.repo;
  const { data: pr } = await github.rest.pulls.get({ owner, repo, pull_number: context.payload.pull_request.number });
  const author = pr.user.login;
  const notes = [];

  if (!BOTS.test(author) && pr.state === 'open') {
    if ((pr.assignees || []).length === 0) {
      await github.rest.issues.addAssignees({ owner, repo, issue_number: pr.number, assignees: [author] });
      notes.push(`Assigned the PR to @${author}.`);
    }
    const labels = (pr.labels || []).map((l) => l.name);
    const implied = typeFromTitle(pr.title);
    if (implied && !labels.some((l) => TYPE_LABELS.includes(l))) {
      await github.rest.issues.addLabels({ owner, repo, issue_number: pr.number, labels: [implied] });
      pr.labels = [...(pr.labels || []), { name: implied }];
      notes.push(`Labelled \`${implied}\` from the title.`);
    }
    const { closes } = issueReferences(pr.body, owner, repo);
    for (const ref of closes) {
      const [o, r] = ref.repo.split('/');
      try {
        const { data: issue } = await github.rest.issues.get({ owner: o, repo: r, issue_number: ref.number });
        if (issue.pull_request || issue.state !== 'open') continue;
        if ((issue.assignees || []).length === 0) {
          await github.rest.issues.addAssignees({ owner: o, repo: r, issue_number: ref.number, assignees: [author] });
          notes.push(`Assigned ${ref.repo}#${ref.number} to @${author}.`);
        }
        if (!pr.milestone && issue.milestone && ref.repo === `${owner}/${repo}`) {
          await github.rest.issues.update({ owner, repo, issue_number: pr.number, milestone: issue.milestone.number });
          pr.milestone = issue.milestone;
          notes.push(`Set the milestone to "${issue.milestone.title}" from #${ref.number}.`);
        }
      } catch (error) {
        core.warning(`Could not update ${ref.repo}#${ref.number}: ${error.message}`);
      }
    }
  }

  const { problems, labels } = evaluate(pr, owner, repo);
  const warnings = [];
  if (!labels.some((l) => l.startsWith('area:'))) warnings.push('No `area:*` label yet. The labeler adds one from the changed paths; add it by hand if none fits.');
  if (!pr.milestone) warnings.push('No milestone. Link an issue that has one, or set it by hand.');
  warnings.forEach((w) => core.warning(w));

  await core.summary
    .addHeading('PR conventions', 3)
    .addList(problems.length ? problems : ['Title, type label and issue link look good.'])
    .addList([...notes, ...warnings].length ? [...notes, ...warnings] : ['Nothing changed.'])
    .write();
  if (problems.length) core.setFailed(problems.join('\n'));
}

module.exports = run;
module.exports.checkTitle = checkTitle;
module.exports.typeFromTitle = typeFromTitle;
module.exports.issueReferences = issueReferences;
module.exports.evaluate = evaluate;
module.exports.TYPE_LABELS = TYPE_LABELS;
