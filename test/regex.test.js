import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { explainRegex } from '../src/explainer.js';
import { scanForRedos } from '../src/redos-scanner.js';

describe('regex-lens', () => {
  describe('explainRegex', () => {
    it('breaks down tokens and anchors', () => {
      const explanations = explainRegex('^\\d{3}-\\w+$');
      assert.ok(explanations.some((e) => e.token === '^'));
      assert.ok(explanations.some((e) => e.token === '$'));
      assert.ok(explanations.some((e) => e.token.includes('\\w+')));
    });
  });

  describe('scanForRedos', () => {
    it('flags dangerous nested quantifiers', () => {
      const redos = scanForRedos('([a-z]+)+');
      assert.equal(redos.isVulnerable, true);
      assert.ok(redos.issues[0].rule.includes('Nested Quantifier'));
    });

    it('passes clean non-backtracking regexes', () => {
      const clean = scanForRedos('^[a-zA-Z0-9_-]+$');
      assert.equal(clean.isVulnerable, false);
      assert.equal(clean.issues.length, 0);
    });
  });
});

