---
id: ce-0157
scenarioId: scenario-code-block-editing
locale: en
os: Windows
osVersion: "11"
device: Desktop or Laptop
deviceVersion: Any
browser: Chrome
browserVersion: "120.0"
keyboard: US
caseTitle: Formatting can be applied inside code blocks
description: "When editing text within a code block in Chrome, formatting operations (bold, italic, etc.) can still be applied. This breaks the code formatting and creates invalid code structure."
tags:
  - code
  - pre
  - formatting
  - chrome
status: draft
domSteps:
  - label: "Before"
    html: '<pre><code>function test() {</code></pre>'
    description: "Code block structure"
  - label: "After Bold (Bug)"
    html: '<pre><code>function <b>test</b>() {</code></pre>'
    description: "Formatting applied inside code block, code structure damaged"
  - label: "✅ Expected"
    html: '<pre><code>function test() {</code></pre>'
    description: "Expected: Formatting blocked inside code block, plain text maintained"
---

### Phenomenon

When editing text within a code block in Chrome, formatting operations (bold, italic, etc.) can still be applied. This breaks the code formatting and creates invalid code structure.

### Reproduction example

1. Create a code block: `<pre><code>function test() {</code></pre>`
2. Select text inside the code block
3. Apply bold formatting (Ctrl+B)

### Observed behavior

- Formatting is applied: `<pre><code>function <b>test</b>() {</code></pre>`
- Code structure is broken
- Formatting should not be in code
- Invalid code structure

### Expected behavior

- Formatting should be prevented in code blocks
- Code should remain plain text
- Structure should be preserved
- Formatting operations should be blocked

### Browser Comparison

- **All browsers**: Formatting can be applied (default behavior)
- Custom implementation needed to prevent formatting

### Notes and possible direction for workarounds

- Intercept formatting operations in code blocks
- Prevent default behavior for formatting
- Block format commands (bold, italic, etc.)
- Preserve code as plain text

