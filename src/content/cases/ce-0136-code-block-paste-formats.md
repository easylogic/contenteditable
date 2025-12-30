---
id: ce-0136
scenarioId: scenario-code-block-editing
locale: en
os: Windows
osVersion: "11"
device: Desktop or Laptop
deviceVersion: Any
browser: Firefox
browserVersion: "120.0"
keyboard: US
caseTitle: Pasting formatted content into code block loses code structure
description: "When pasting formatted content (with HTML formatting) into a code block in Firefox, the formatting is preserved but the code block structure may be lost. The code block may be converted to regular paragraphs."
tags:
  - code
  - pre
  - paste
  - formatting
  - firefox
status: draft
domSteps:
  - label: "Before"
    html: '<pre><code>function test() {</code></pre>'
    description: "Code block structure"
  - label: "Clipboard"
    html: '<strong>Bold</strong> Code'
    description: "Copied formatted text"
  - label: "❌ After Paste (Bug)"
    html: '<p><strong>Bold</strong> Code</p>'
    description: "Code block structure lost, &lt;pre&gt;&lt;code&gt; converted to &lt;p&gt;"
  - label: "✅ Expected"
    html: '<pre><code>Bold Code</code></pre>'
    description: "Expected: Code block structure maintained, formatting removed (plain text)"
---

## Phenomenon

When pasting formatted content (with HTML formatting) into a code block in Firefox, the formatting is preserved but the code block structure may be lost. The code block may be converted to regular paragraphs.

## Reproduction example

1. Create a code block: `<pre><code>function test() {</code></pre>`
2. Paste formatted HTML content into it
3. Observe the DOM structure

## Observed behavior

- Code block structure is lost
- `<pre><code>` may be converted to `<p>` elements
- Formatting is preserved but code context is lost
- Code block is broken

## Expected behavior

- Code block structure should be maintained
- Formatting should be stripped (code should be plain text)
- Code block should remain as `<pre><code>`
- Structure should be preserved

## Browser Comparison

- **Chrome/Edge**: May preserve or break structure
- **Firefox**: More likely to break structure (this case)
- **Safari**: Most likely to break structure

## Notes and possible direction for workarounds

- Intercept paste in code blocks
- Strip all formatting from pasted content
- Preserve code block structure
- Convert HTML to plain text

