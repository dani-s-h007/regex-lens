/**
 * regex-lens: CLI Interface
 */

import { parseArgs } from 'node:util';
import { explainRegex } from './explainer.js';
import { scanForRedos } from './redos-scanner.js';

export async function runCli(argv = process.argv.slice(2)) {
  const options = {
    help: { type: 'boolean', short: 'h', default: false },
    version: { type: 'boolean', short: 'v', default: false },
    test: { type: 'string', short: 't' },
    json: { type: 'boolean', default: false }
  };

  let parsed;
  try {
    parsed = parseArgs({ args: argv, options, allowPositionals: true });
  } catch (err) {
    console.error(`Error: ${err.message}`);
    process.exit(1);
  }

  const { values, positionals } = parsed;

  if (values.help) {
    printHelp();
    return 0;
  }

  if (values.version) {
    console.log('regex-lens v1.0.0');
    return 0;
  }

  const patternStr = positionals[0];
  if (!patternStr) {
    printHelp();
    return 0;
  }

  const explanations = explainRegex(patternStr);
  const redos = scanForRedos(patternStr);

  let matchResult = null;
  if (values.test) {
    try {
      const reg = new RegExp(patternStr);
      const start = process.hrtime.bigint();
      const match = reg.exec(values.test);
      const end = process.hrtime.bigint();
      const durationUs = Number(end - start) / 1000;

      matchResult = {
        matched: Boolean(match),
        durationUs: Math.round(durationUs * 100) / 100,
        groups: match ? Array.from(match) : []
      };
    } catch (err) {
      matchResult = { error: err.message };
    }
  }

  if (values.json) {
    console.log(JSON.stringify({ pattern: patternStr, explanations, redos, matchResult }, null, 2));
    if (redos.isVulnerable) process.exit(1);
    return 0;
  }

  console.log('\n🔬 regex-lens - Pattern Explainer & ReDoS Scanner');
  console.log('============================================================');
  console.log(`Pattern:   \x1b[36m/${patternStr}/\x1b[0m`);
  console.log(`ReDoS Risk: ${redos.isVulnerable ? '\x1b[31m⚠️ VULNERABLE (Exponential Backtracking)\x1b[0m' : '\x1b[32m✅ SAFE\x1b[0m'}\n`);

  if (redos.isVulnerable) {
    for (const issue of redos.issues) {
      console.log(`🚨 \x1b[31m${issue.rule}\x1b[0m in "${issue.hunk}"`);
      console.log(`   👉 Fix: ${issue.recommendation}\n`);
    }
  }

  if (explanations.length > 0) {
    console.log('Structural Breakdown:');
    for (const exp of explanations) {
      console.log(`  • \x1b[1m${exp.token.padEnd(12)}\x1b[0m -> ${exp.description}`);
    }
    console.log('');
  }

  if (matchResult) {
    console.log('Test Evaluation:');
    console.log(`  Input String: "${values.test}"`);
    console.log(`  Matched:      ${matchResult.matched ? '✅ YES' : '❌ NO'}`);
    console.log(`  Exec Time:    ${matchResult.durationUs} µs`);
    if (matchResult.groups && matchResult.groups.length > 0) {
      console.log(`  Captures:     [${matchResult.groups.join(', ')}]`);
    }
    console.log('');
  }

  console.log('============================================================\n');

  if (redos.isVulnerable) {
    process.exit(1);
  }

  return 0;
}

function printHelp() {
  console.log(`
regex-lens - Regular Expression Explainer, Match Highlighter & ReDoS Scanner

USAGE:
  $ regex-lens "<regex-pattern>" [flags]

FLAGS:
  -t, --test <string>   Test string against pattern and measure execution time
      --json            Output structured JSON report
  -v, --version         Show version
  -h, --help            Show help

EXAMPLES:
  # Explain email regex:
  $ regex-lens "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$"

  # Scan for Catastrophic Backtracking (ReDoS) vulnerability:
  $ regex-lens "([a-zA-Z]+)*"

  # Test candidate string:
  $ regex-lens "\\d{3}-\\d{4}" -t "555-0199"
`);
}

