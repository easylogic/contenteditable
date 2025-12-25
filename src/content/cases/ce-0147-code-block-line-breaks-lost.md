---
id: ce-0147
scenarioId: scenario-code-block-editing
locale: en
os: Windows
osVersion: "11"
device: Desktop or Laptop
deviceVersion: Any
browser: Chrome
browserVersion: "120.0"
keyboard: US
caseTitle: Line breaks are lost when editing code blocks
description: "When editing text within a code block in Chrome, line breaks may be lost or converted to <br> tags instead of being preserved as newlines. This breaks code formatting and structure."
tags:
  - code
  - pre
  - line-break
  - chrome
status: draft
domSteps:
  - label: "Before"
    html: '<pre><code>function test() {<br>    return true;<br>}</code></pre>'
    description: "Code block with multiple lines"
  - label: "After Editing (Bug)"
    html: '<pre><code>function test() { return true; }</code></pre>'
    description: "After editing, line breaks lost, merged into single line"
  - label: "✅ Expected"
    html: '<pre><code>function test() {<br>    return true;<br>}</code></pre>'
    description: "Expected: Line breaks preserved"
---

### Phenomenon

When editing text within a code block in Chrome, line breaks may be lost or converted to `<br>` tags instead of being preserved as newlines. This breaks code formatting and structure.

### Reproduction example

1. Create a code block with multiple lines
2. Edit the code (add, delete, modify lines)
3. Observe line break preservation

### Observed behavior

- Line breaks are lost
- Or line breaks are converted to `<br>` tags
- Code structure is broken
- Formatting is lost

### Expected behavior

- Line breaks should be preserved
- Code structure should be maintained
- Formatting should remain intact
- Behavior should match code editors

### Browser Comparison

- **Chrome/Edge**: Line breaks may be lost (this case)
- **Firefox**: Similar line break issues
- **Safari**: Line break preservation inconsistent

### Notes and possible direction for workarounds

- Ensure `white-space: pre` CSS is applied
- Intercept Enter key to insert newlines properly
- Preserve line breaks during editing
- Monitor and restore line breaks if lost

