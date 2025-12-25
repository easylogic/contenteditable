---
id: ce-0170
scenarioId: scenario-code-block-editing
locale: en
os: Windows
osVersion: "11"
device: Desktop or Laptop
deviceVersion: Any
browser: Chrome
browserVersion: "120.0"
keyboard: US
caseTitle: Code indentation is lost when editing code blocks
description: "When editing text within a code block in Chrome, indentation (leading spaces or tabs) may be lost or converted incorrectly. This breaks code formatting and structure."
tags:
  - code
  - pre
  - indentation
  - chrome
status: draft
domSteps:
  - label: "Before"
    html: '<pre><code>    function test() {<br>        return true;<br>    }</code></pre>'
    description: "들여쓰기가 있는 코드 블록"
  - label: "After Editing (Bug)"
    html: '<pre><code>function test() {<br>return true;<br>}</code></pre>'
    description: "편집 후 들여쓰기 손실"
  - label: "✅ Expected"
    html: '<pre><code>    function test() {<br>        return true;<br>    }</code></pre>'
    description: "정상: 들여쓰기 보존"
---

### Phenomenon

When editing text within a code block in Chrome, indentation (leading spaces or tabs) may be lost or converted incorrectly. This breaks code formatting and structure.

### Reproduction example

1. Create a code block with indented code: `<pre><code>    function test() {</code></pre>`
2. Edit the code (add, delete, modify)
3. Observe indentation preservation

### Observed behavior

- Leading spaces may be lost
- Tabs may be converted to spaces or vice versa
- Indentation is not preserved
- Code structure is broken

### Expected behavior

- Indentation should be preserved
- Spaces and tabs should be maintained
- Code structure should remain intact
- Formatting should be preserved

### Browser Comparison

- **Chrome/Edge**: Indentation may be lost (this case)
- **Firefox**: Similar indentation issues
- **Safari**: Indentation preservation inconsistent

### Notes and possible direction for workarounds

- Ensure `white-space: pre` CSS is applied
- Preserve leading whitespace during editing
- Monitor and restore indentation if lost
- Handle tabs and spaces explicitly

