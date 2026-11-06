#!/usr/bin/env node
/**
 * regex-lens: Interactive Live Demo
 */

import { explainRegex } from '../src/explainer.js';
import { scanForRedos } from '../src/redos-scanner.js';

console.log('\n🚀 Starting regex-lens Interactive Demo...\n');

// 1. Catastrophic backtracking vulnerability demo
const vulnerablePattern = '([a-zA-Z0-9]+)*';
console.log(`Analyzing Dangerous Pattern: /${vulnerablePattern}/`);
const redos = scanForRedos(vulnerablePattern);

console.log(`ReDoS Vulnerability Detected: ${redos.isVulnerable ? 'YES ⚠️' : 'NO'}`);
for (const issue of redos.issues) {
  console.log(` - Rule:           ${issue.rule}`);
  console.log(` - Dangerous Hunk: "${issue.hunk}"`);
  console.log(` - Remediation:    ${issue.recommendation}\n`);
}

// 2. Safe pattern explanation
const emailPattern = '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$';
console.log(`Explaining Pattern: /${emailPattern}/`);
const explanations = explainRegex(emailPattern);
console.log('------------------------------------------------------------');
for (const exp of explanations) {
  console.log(` • ${exp.token.padEnd(16)} -> ${exp.description}`);
}
console.log('------------------------------------------------------------');
console.log('🎉 Demo completed successfully!\n');

