---
id: ce-0019
scenarioId: scenario-paste-plain-text
locale: en
os: macOS
osVersion: "Ubuntu 22.04"
device: Desktop or Laptop
deviceVersion: Any
browser: Safari
browserVersion: "120.0"
keyboard: US
caseTitle: Pasting rich text inserts unwanted formatting
description: "When pasting content from external sources (like Word documents or web pages) into a contenteditable region, unwanted formatting is often included. There is no simple way to paste as plain text wit"
tags:
  - paste
  - formatting
  - plain-text
  - safari
status: draft
domSteps:
  - label: "Clipboard"
    html: '<span style="color: red; font-weight: bold;">Formatted Text</span>'
    description: "Copied formatted text (Word document, etc.)"
  - label: "After Paste (Bug)"
    html: '<span style="color: red; font-weight: bold;">Formatted Text</span>'
    description: "Paste includes unwanted formatting (color, bold, etc.)"
  - label: "✅ Expected"
    html: 'Formatted Text'
    description: "Expected: Paste as plain text or selectable format"
---

### Phenomenon

When pasting content from external sources (like Word documents or web pages) into a contenteditable region, unwanted formatting is often included. There is no simple way to paste as plain text without manually stripping the formatting.

### Reproduction example

1. Copy formatted text from a Word document or web page (with bold, colors, fonts, etc.).
2. Paste it into a contenteditable div.
3. Observe that all the formatting is included.

### Observed behavior

- Safari pastes rich text with all formatting by default.
- There is no built-in "Paste as plain text" option.
- Manual intervention is required to strip formatting.

### Expected behavior

- There should be a way to paste as plain text (e.g., Cmd+Shift+V or a context menu option).
- The paste behavior should be controllable by the application.
- The `beforeinput` event should allow intercepting and modifying paste operations.

