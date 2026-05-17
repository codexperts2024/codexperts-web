#!/usr/bin/env node

/**
 * Replaces content between sprint report markers in README.md.
 *
 * Usage:
 *   node scripts/update-readme-report.js TOTAL "<report text>"
 *   node scripts/update-readme-report.js W1    "<report text>"
 */

const fs = require('fs');
const path = require('path');

const [,, marker, content] = process.argv;

if (!marker || !content) {
  console.error('Usage: update-readme-report.js <MARKER> "<content>"');
  process.exit(1);
}

const readmePath = path.join(__dirname, '..', 'README.md');
const readme = fs.readFileSync(readmePath, 'utf8');

const startTag = `<!-- SPRINT_REPORT_${marker}_START -->`;
const endTag   = `<!-- SPRINT_REPORT_${marker}_END -->`;

const startIdx = readme.indexOf(startTag);
const endIdx   = readme.indexOf(endTag);

if (startIdx === -1 || endIdx === -1) {
  // Marker not present in README — skip silently
  process.exit(0);
}

const before = readme.slice(0, startIdx + startTag.length);
const after  = readme.slice(endIdx);

fs.writeFileSync(readmePath, `${before}\n\`\`\`\n${content.trim()}\n\`\`\`\n${after}`);
console.log(`Updated SPRINT_REPORT_${marker}`);
