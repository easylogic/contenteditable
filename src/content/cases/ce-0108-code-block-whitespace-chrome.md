---
id: ce-0108
scenarioId: scenario-code-block-editing
locale: en
os: Windows
osVersion: "11"
device: Desktop or Laptop
deviceVersion: Any
browser: Chrome
browserVersion: "120.0"
keyboard: US
caseTitle: Multiple spaces are collapsed in code blocks despite pre tag
description: "When editing text within a <pre><code> code block, multiple consecutive spaces may still be collapsed despite the <pre> tag which should preserve whitespace. This can break code formatting."
tags:
  - code
  - pre
  - whitespace
  - chrome
status: draft
domSteps:
  - label: "Before"
    html: '<pre><code>    function test() {</code></pre>'
    description: "들여쓰기가 있는 코드 블록 (4개 공백)"
  - label: "After Editing (Bug)"
    html: '<pre><code> function test() {</code></pre>'
    description: "편집 후 여러 공백이 하나로 축약됨"
  - label: "✅ Expected"
    html: '<pre><code>    function test() {</code></pre>'
    description: "정상: &lt;pre&gt; 태그로 공백 보존"
---

### Phenomenon

When editing text within a `<pre><code>` code block, multiple consecutive spaces may still be collapsed despite the `<pre>` tag which should preserve whitespace. This can break code formatting.

### Reproduction example

1. Create a code block: `<pre><code>function test() {</code></pre>`
2. Try to type multiple spaces for indentation
3. Observe the DOM

### Observed behavior

- Multiple spaces may be collapsed to single space
- Even though `<pre>` should preserve whitespace
- Code indentation is lost
- Formatting breaks

### Expected behavior

- `<pre>` tag should preserve all whitespace
- Multiple spaces should be maintained
- Code formatting should be preserved
- Behavior should match native code editors

### Browser Comparison

- **Chrome/Edge**: May collapse spaces despite `<pre>` (this case)
- **Firefox**: Similar whitespace handling issues
- **Safari**: Whitespace preservation inconsistent

### Notes and possible direction for workarounds

- Ensure `white-space: pre` CSS is applied
- Intercept space insertion and use `&nbsp;` if needed
- Monitor and preserve whitespace in code blocks
- Consider using contenteditable="false" for code blocks and custom editing

