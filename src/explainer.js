/**
 * regex-lens: Regular Expression AST Explainer
 */

export function explainRegex(pattern) {
  if (!pattern || typeof pattern !== 'string') return [];

  const explanations = [];
  let p = pattern;

  if (p.startsWith('^')) {
    explanations.push({ token: '^', description: 'Asserts position at the beginning of the string/line' });
    p = p.slice(1);
  }

  // Look for common patterns
  const tokens = [
    { regex: /\\d\+/g, desc: 'Matches one or more digits [0-9]' },
    { regex: /\\d/g, desc: 'Matches any single digit [0-9]' },
    { regex: /\\w\+/g, desc: 'Matches one or more word characters (alphanumeric & underscore)' },
    { regex: /\\w/g, desc: 'Matches any single word character [a-zA-Z0-9_]' },
    { regex: /\\s\+/g, desc: 'Matches one or more whitespace characters' },
    { regex: /\\s/g, desc: 'Matches any whitespace character (space, tab, newline)' },
    { regex: /\[([a-zA-Z0-9_-]+)\]\+/g, desc: 'Matches one or more characters within set' },
    { regex: /\[([a-zA-Z0-9_-]+)\]/g, desc: 'Matches any single character within set' },
    { regex: /\((?:\?[:=!])?([^)]+)\)/g, desc: 'Group / Sub-expression' }
  ];

  for (const t of tokens) {
    const matches = pattern.matchAll(t.regex);
    for (const m of matches) {
      explanations.push({
        token: m[0],
        description: t.desc
      });
    }
  }

  if (pattern.endsWith('$')) {
    explanations.push({ token: '$', description: 'Asserts position at the end of the string/line' });
  }

  return explanations;
}

