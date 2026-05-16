#!/usr/bin/env node

/**
 * Sprint Contribution Report
 *
 * Fetches GitHub Issues and counts contributions per assignee.
 * Each assignee on a multi-assignee issue gets 1 point (not split).
 *
 * Usage:
 *   npm run report        — all closed issues, ██ per closed
 *   npm run report -- 1  — W1 issues, ██ closed + ░░ open per assignee
 */

const { execSync } = require('child_process');

// GitHub login → team nickname
const NAME_MAP = {
  'minsikpaul92':            'Paul',
  'siddiecity':              'Sid',
  'naik26m3':                'Kai',
  'kazzledazz':              'Andra',
  'GarySkywalker-droid':     'Gary',
  'SystemProgrammerWizzard': 'Dave',
};

// Parse CLI args — accepts: --sprint 1  OR just: 1
const args = process.argv.slice(2);
const sprintIdx = args.indexOf('--sprint');
const sprintNum = sprintIdx !== -1
  ? args[sprintIdx + 1]
  : args.find((a) => /^\d+$/.test(a)) ?? null;

// Fetch issues from GitHub by state
function fetchIssues(state) {
  const cmd = `gh issue list --state ${state} --json number,title,assignees,labels --limit 500 --repo codexperts2024/codexperts-web`;
  const output = execSync(cmd, { encoding: 'utf8' });
  return JSON.parse(output);
}

// Filter by sprint label (e.g. W1, W2)
function filterBySprint(issues, sprint) {
  const label = `W${sprint}`;
  return issues.filter((issue) =>
    issue.labels.some((l) => l.name === label)
  );
}

// Total mode: count closed issues per person
function aggregateTotal(closedIssues) {
  const counts = {};
  for (const name of Object.values(NAME_MAP)) counts[name] = 0;
  for (const issue of closedIssues) {
    for (const assignee of issue.assignees) {
      const name = NAME_MAP[assignee.login];
      if (name) counts[name] += 1;
    }
  }
  return counts;
}

// Sprint mode: track closed vs total assigned per person
function aggregateSprint(closedIssues, openIssues) {
  const result = {};
  for (const name of Object.values(NAME_MAP)) {
    result[name] = { closed: 0, total: 0 };
  }
  for (const issue of closedIssues) {
    for (const assignee of issue.assignees) {
      const name = NAME_MAP[assignee.login];
      if (name) { result[name].closed += 1; result[name].total += 1; }
    }
  }
  for (const issue of openIssues) {
    for (const assignee of issue.assignees) {
      const name = NAME_MAP[assignee.login];
      if (name) result[name].total += 1;
    }
  }
  return result;
}

// Total mode bar: ██ per closed issue
function barTotal(count) {
  if (count === 0) return '';
  return Array.from({ length: count }, () => '██').join(' ');
}

// Sprint mode bar: ██ closed + ░░ open (no spacing)
function barSprint(closed, total) {
  if (total === 0) return '';
  return Array.from({ length: total }, (_, i) => i < closed ? '██' : '░░').join('');
}

// Print total report
function printTotal(counts) {
  const entries = Object.entries(counts).sort((a, b) => b[1] - a[1]);
  const COL_NAME = 8;
  const COL_COUNT = 7;
  const divider = '─'.repeat(COL_NAME + COL_COUNT + 20);

  console.log('');
  console.log('Sprint Contribution Report — Total');
  console.log(divider);
  console.log('Name'.padEnd(COL_NAME) + 'Issues'.padEnd(COL_COUNT) + 'Contribution');
  console.log(divider);
  for (const [name, count] of entries) {
    console.log(name.padEnd(COL_NAME) + String(count).padEnd(COL_COUNT) + barTotal(count));
  }
  console.log(divider);
  console.log('');
}

// Print sprint report
function printSprint(sprintData, sprint) {
  const entries = Object.entries(sprintData)
    .sort((a, b) => b[1].closed - a[1].closed || b[1].total - a[1].total);
  const COL_NAME = 8;
  const COL_COUNT = 10;
  const divider = '─'.repeat(COL_NAME + COL_COUNT + 20);

  console.log('');
  console.log(`Sprint Contribution Report — Week ${sprint}`);
  console.log(divider);
  console.log('Name'.padEnd(COL_NAME) + 'Done/All'.padEnd(COL_COUNT) + 'Contribution');
  console.log(divider);
  for (const [name, { closed, total }] of entries) {
    const label = total > 0 ? `${closed}/${total}` : '0';
    console.log(name.padEnd(COL_NAME) + label.padEnd(COL_COUNT) + barSprint(closed, total));
  }
  console.log(divider);
  console.log('');
}

// Main
try {
  if (sprintNum) {
    const closed = filterBySprint(fetchIssues('closed'), sprintNum);
    const open   = filterBySprint(fetchIssues('open'),   sprintNum);
    const data   = aggregateSprint(closed, open);
    printSprint(data, sprintNum);
  } else {
    const counts = aggregateTotal(fetchIssues('closed'));
    printTotal(counts);
  }
} catch (err) {
  if (err.message.includes('gh')) {
    console.error('Error: gh CLI not found or not authenticated. Run: gh auth login');
  } else {
    console.error('Error:', err.message);
  }
  process.exit(1);
}
