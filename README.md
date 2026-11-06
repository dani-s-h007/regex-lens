# regex-lens 🔬

[![CI](https://github.com/dani-s-h007/regex-lens/actions/workflows/ci.yml/badge.svg)](https://github.com/dani-s-h007/regex-lens/actions)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/Node.js-%3E%3D18.0.0-green.svg)](https://nodejs.org/)
[![Zero Dependencies](https://img.shields.io/badge/dependencies-0-success.svg)](package.json)

> **Zero-dependency regular expression explainer, match highlighter & ReDoS vulnerability scanner.**

Complex regular expressions in production systems are notorious for triggering **Regular Expression Denial of Service (ReDoS)**—catastrophic exponential backtracking that locks the Node.js or Python event loop at 100% CPU usage. In addition, regexes are difficult to read and audit during code reviews. `regex-lens` breaks down regex components into clear natural English, scans for catastrophic backtracking vulnerabilities, and tests string executions with microsecond timings.

---

## ✨ Features

- **ReDoS Vulnerability Scanner**: Catches nested quantifiers `(a+)+`, `([a-z]+)*`, and ambiguous alternations before they freeze your servers.
- **Natural Language Explainer**: Demystifies character classes, lookaheads, anchors, and capturing groups.
- **Microsecond Match Tester**: Benchmarks match duration against candidate strings to evaluate execution latency.
- **Zero Runtime Dependencies**: Ultra-fast execution with zero third-party dependencies.

---

## 🚀 Installation & Demo

```bash
# Run on-demand with npx
npx regex-lens --help

# Run the live demo:
npm run demo
```

---

## 🛠️ CLI Usage

```bash
# Explain a regex pattern:
regex-lens "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$"

# Scan for catastrophic backtracking (ReDoS):
regex-lens "([a-zA-Z]+)*"

# Test match against a string:
regex-lens "\\d{3}-\\d{4}" -t "555-0199"

# JSON output for CI pipeline:
regex-lens "([a-z]+)+" --json
```

---

## 💻 Programmatic TypeScript API

```typescript
import { explainRegex, scanForRedos } from 'regex-lens';

const redos = scanForRedos('([a-z]+)+');
if (redos.isVulnerable) {
  console.error('ReDoS detected:', redos.issues[0].rule);
}
```

---

## 🧪 Testing

```bash
npm test
```

---

## 📄 License

MIT © Essentials Toolkit Authors

