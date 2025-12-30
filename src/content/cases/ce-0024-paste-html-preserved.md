---
id: ce-0024
scenarioId: scenario-paste-formatting-loss
locale: en
os: macOS
osVersion: "Ubuntu 22.04"
device: Desktop or Laptop
deviceVersion: Any
browser: Safari
browserVersion: "120.0"
keyboard: US
caseTitle: Pasting rich text preserves unwanted HTML structure
description: "When pasting content from external sources (like Word documents or web pages) into a contenteditable region in Safari, the HTML structure is preserved, including unwanted elements like span tags with inline styles."
tags:
  - paste
  - formatting
  - html
  - safari
status: draft
domSteps:
  - label: "Clipboard"
    html: '<span style="color: red; font-size: 14px;">Text</span>'
    description: "Copied formatted text (Word document, etc.)"
  - label: "❌ After Paste"
    html: '<span style="color: red; font-size: 14px;">Text</span>'
    description: "Unwanted HTML structure preserved (span tags, inline styles)"
  - label: "✅ Expected"
    html: '<strong>Text</strong>'
    description: "Normalized HTML structure or selectable format"
---

## Phenomenon

When pasting content from external sources (like Word documents or web pages) into a contenteditable region in Safari, the HTML structure is preserved, including unwanted elements like `<span>` tags with inline styles, `<div>` elements, and other formatting markup.

## Reproduction example

1. Copy formatted text from a Word document or web page.
2. Paste it into a contenteditable div in Safari.
3. Inspect the DOM structure of the pasted content.

## Observed behavior

- Safari preserves the full HTML structure from the source.
- Unwanted elements like `<span style="...">`, `<div>`, and other formatting tags are included.
- The pasted content may have inconsistent styling.

## Expected behavior

- The paste operation should normalize or clean the HTML structure.
- Or, there should be a way to control what gets pasted (plain text vs. formatted).

