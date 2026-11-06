// Unit tests for the convention scripts: node --test scripts/conventions/
const test = require('node:test');
const assert = require('node:assert/strict');
const pr = require('./pr-conventions.cjs');
const cmd = require('./issue-commands.cjs');
const rollup = require('./sub-issue-rollup.cjs');
const sync = require('./project-sync.cjs');

test('titles', () => {
  assert.deepEqual(pr.checkTitle('feat(web): link previews with the brand card'), []);
  assert.deepEqual(pr.checkTitle('[2/3] fix: the hints were vanishing'), []);
  assert.deepEqual(pr.checkTitle('docs(brand): the journey – references for the next round'), []);
  assert.equal(pr.checkTitle('Add landing page').length, 1);
  assert.equal(pr.checkTitle('feat: ends with a period.').length, 1);
  assert.equal(pr.checkTitle(`feat: ${'x'.repeat(80)}`).length, 1);
  assert.equal(pr.checkTitle('Feat: capital type').length, 1);
});

test('type label from title', () => {
  assert.equal(pr.typeFromTitle('feat(ui): x'), 'type:story');
  assert.equal(pr.typeFromTitle('[1/2] fix: x'), 'type:bug');
  assert.equal(pr.typeFromTitle('ci: x'), 'type:task');
  assert.equal(pr.typeFromTitle('docs(brand): x'), 'type:task');
  assert.equal(pr.typeFromTitle('nonsense'), null);
});

test('issue references', () => {
  const r = pr.issueReferences('Closes #12\nRefs kaffeelisten/.github#4\nFixes https://github.com/kaffeelisten/playbook/issues/7\n```\nCloses #99\n```\n<!-- Closes #98 -->', 'kaffeelisten', 'kaffeelisten');
  assert.deepEqual(r.closes, [{ repo: 'kaffeelisten/kaffeelisten', number: 12 }, { repo: 'kaffeelisten/playbook', number: 7 }]);
  assert.deepEqual(r.refs, [{ repo: 'kaffeelisten/.github', number: 4 }]);
  assert.deepEqual(pr.issueReferences('Closes #', 'o', 'r'), { closes: [], refs: [] });
});

test('evaluate', () => {
  const base = { title: 'feat: x', body: 'Closes #1', labels: [{ name: 'type:story' }], user: { login: 'arudaev' } };
  assert.deepEqual(pr.evaluate(base, 'o', 'r').problems, []);
  assert.equal(pr.evaluate({ ...base, body: 'nothing' }, 'o', 'r').problems.length, 1);
  assert.deepEqual(pr.evaluate({ ...base, body: '', labels: [{ name: 'no-issue' }] }, 'o', 'r').problems, []);
  assert.deepEqual(pr.evaluate({ ...base, body: '', user: { login: 'dependabot[bot]' } }, 'o', 'r').problems, []);
  assert.equal(pr.evaluate({ ...base, labels: [{ name: 'type:story' }, { name: 'type:bug' }] }, 'o', 'r').problems.length, 1);
});

test('issue commands', () => {
  assert.equal(cmd.parseCommand('/take'), 'take');
  assert.equal(cmd.parseCommand(' /drop \nthanks'), 'drop');
  assert.equal(cmd.parseCommand('please /take'), null);
  assert.equal(cmd.slug('[P2] Landing page für die Küche'), 'landing-page-fuer-die-kueche');
  assert.equal(cmd.branchPrefix(['type:bug']), 'fix');
  assert.equal(cmd.branchPrefix(['type:story']), 'feat');
  assert.equal(cmd.branchPrefix(['type:task', 'area:delivery']), 'ci');
  const issue = (over) => ({ number: 5, title: 'Thing', state: 'open', labels: [{ name: 'type:task' }], assignees: [], ...over });
  assert.equal(cmd.decideTake({ issue: issue(), login: 'a', openBlockers: [] }).ok, true);
  assert.equal(cmd.decideTake({ issue: issue({ labels: [{ name: 'type:epic' }] }), login: 'a', openBlockers: [] }).ok, false);
  assert.equal(cmd.decideTake({ issue: issue({ labels: [{ name: 'parked' }] }), login: 'a', openBlockers: [] }).ok, false);
  assert.equal(cmd.decideTake({ issue: issue(), login: 'a', openBlockers: ['#2'] }).ok, false);
  assert.equal(cmd.decideTake({ issue: issue({ assignees: [{ login: 'b' }] }), login: 'a', openBlockers: [] }).ok, false);
  assert.match(cmd.decideTake({ issue: issue(), login: 'a', openBlockers: [] }).reply, /chore\/5-thing/);
});

test('sub-issue roll-up', () => {
  const parent = (total, completed, labels = []) => ({ state: 'OPEN', subIssuesSummary: { total, completed }, labels: { nodes: labels.map((name) => ({ name })) } });
  assert.equal(rollup.decide({ action: 'closed', parent: parent(3, 3) }).kind, 'ready');
  assert.equal(rollup.decide({ action: 'closed', parent: parent(3, 2) }).kind, 'none');
  assert.equal(rollup.decide({ action: 'reopened', parent: parent(3, 2, ['ready-for-acceptance']) }).kind, 'unready');
  assert.equal(rollup.decide({ action: 'sweep', parent: parent(2, 2) }).kind, 'ready');
  assert.equal(rollup.decide({ action: 'sweep', parent: parent(2, 1, ['ready-for-acceptance']) }).kind, 'unready');
  assert.equal(rollup.decide({ action: 'sweep', parent: parent(0, 0) }).kind, 'none');
  assert.equal(rollup.decide({ action: 'closed', parent: null }).kind, 'none');
});

test('board status from a pull request', () => {
  assert.equal(sync.pullRequestStatus({ state: 'closed', merged: true }), 'Done');
  assert.equal(sync.pullRequestStatus({ state: 'closed', merged: false }), 'Backlog');
  assert.equal(sync.pullRequestStatus({ state: 'open', draft: true }), 'In progress');
  assert.equal(sync.pullRequestStatus({ state: 'open', draft: false }), 'In review');
});
