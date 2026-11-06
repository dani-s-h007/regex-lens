/**
 * regex-lens: ReDoS Vulnerability Scanner
 * Detects exponential and polynomial catastrophic backtracking patterns.
 */

const DANGEROUS_PATTERNS = [
  // Nested quantifiers: (a+)+, (a*)*, ([a-z]+)+
  {
    regex: /\((?:[^()]*(?:[+*]|\{\d+,?\d*\})){1,}[^()]*\)(?:[+*]|\{\d+,?\d*\})/g,
    name: 'Nested Quantifier Backtracking (O(2^n))',
    severity: 'critical',
    recommendation: 'Remove outer quantifier or make inner quantifier atomic / possessive.'
  },
  // Overlapping alternations with quantifier: (a|a)+ or (a|ab)+
  {
    regex: /\(([a-zA-Z0-9_]+)\|\1\)[+*]/g,
    name: 'Identical Alternation Backtracking',
    severity: 'critical',
    recommendation: 'Deduplicate branches in the alternation.'
  },
  // Repetitive group with trailing wildcard: (.*a)+
  {
    regex: /\(\.\*[^)]*\)[+*]/g,
    name: 'Dot-Star Loop Backtracking',
    severity: 'warning',
    recommendation: 'Use character class negation instead of .* (e.g. [^"]*).'
  }
];

export function scanForRedos(pattern) {
  const issues = [];

  for (const item of DANGEROUS_PATTERNS) {
    const matches = pattern.matchAll(item.regex);
    for (const m of matches) {
      issues.push({
        hunk: m[0],
        rule: item.name,
        severity: item.severity,
        recommendation: item.recommendation
      });
    }
  }

  return {
    isVulnerable: issues.length > 0,
    issues
  };
}

