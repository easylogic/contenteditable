---
id: ce-0006
scenarioId: scenario-paste-formatting-loss
locale: en
os: Windows
osVersion: "11"
device: Desktop or Laptop
deviceVersion: Any
browser: Chrome
browserVersion: "120.0"
keyboard: US
caseTitle: Pasting rich text into contenteditable strips markup unexpectedly
description: "When pasting content from a rich text source (such as a word processor or a web page) into a contenteditable element, the resulting DOM loses headings, lists, or inline formatting that were present in the source."
tags:
  - paste
  - clipboard
  - formatting
status: draft
domSteps:
  - label: "Clipboard"
    html: '<h3>Title</h3><ul><li><strong>Bold</strong></li><li><em>Italic</em></li></ul>'
    description: "Copied formatted content"
  - label: "❌ After Paste"
    html: 'Title<br>Bold<br>Italic'
    description: "Formatting lost, only text remains"
  - label: "✅ Expected"
    html: '<h3>Title</h3><ul><li><strong>Bold</strong></li><li><em>Italic</em></li></ul>'
    description: "Formatting maintained"
---

### Phenomenon

When pasting content from a rich text source (such as a word processor or a web page) into a
`contenteditable` element, the resulting DOM loses headings, lists, or inline formatting that were
present in the source.

### Reproduction example

1. Copy a short formatted snippet from another application or web page:
   - A heading
   - A bulleted or numbered list
   - A line with bold or italic text
2. Focus the editable area.
3. Paste the content using the keyboard shortcut or context menu.

### Observed behavior

- The pasted content appears as plain text.
- List markers become plain characters, or multiple lines collapse into one.
- Inline styles such as bold or italic are not preserved in the DOM.

### Expected behavior

- At least some structural markup (headings, lists, paragraphs) is preserved.
- Inline formatting is preserved or deliberately normalized in a documented way.

### Notes

- Compare behavior across browsers and OS combinations using the same source content.
- Decide whether the product should preserve external markup, normalize it to a limited internal
  model, or always strip it to plain text.


