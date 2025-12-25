---
id: ce-0127
scenarioId: scenario-empty-element-cleanup
locale: en
os: Windows
osVersion: "11"
device: Desktop or Laptop
deviceVersion: Any
browser: Chrome
browserVersion: "120.0"
keyboard: US
caseTitle: Empty paragraphs accumulate after deleting all text
description: "When deleting all text from a paragraph in Chrome, empty paragraph elements with only <br> tags accumulate in the DOM. These empty paragraphs cause unnecessary spacing and bloat the HTML."
tags:
  - empty
  - paragraph
  - cleanup
  - chrome
status: draft
domSteps:
  - label: "Before"
    html: '<p>Text 1</p><p>Text 2</p><p>Text 3</p>'
    description: "Text with multiple paragraphs"
  - label: "After Delete All (Bug)"
    html: '<p><br></p><p><br></p><p><br></p>'
    description: "After deleting all text, empty paragraphs (&lt;br&gt; included) accumulate"
  - label: "✅ Expected"
    html: '<p><br></p>'
    description: "Expected: Only one empty paragraph maintained for cursor placement"
---

### Phenomenon

When deleting all text from a paragraph in Chrome, empty paragraph elements with only `<br>` tags accumulate in the DOM. These empty paragraphs cause unnecessary spacing and bloat the HTML.

### Reproduction example

1. Create multiple paragraphs with text
2. Delete all text from each paragraph
3. Observe the DOM structure

### Observed behavior

- Empty `<p><br></p>` elements remain
- Multiple empty paragraphs accumulate
- DOM becomes bloated
- Unnecessary spacing appears

### Expected behavior

- Empty paragraphs should be cleaned up
- Or at least one empty paragraph should remain for cursor
- DOM should be minimal
- No unnecessary spacing

### Browser Comparison

- **Chrome/Edge**: Leaves empty paragraphs (this case)
- **Firefox**: More likely to leave empty elements
- **Safari**: Most likely to accumulate empty elements

### Notes and possible direction for workarounds

- Clean up empty paragraphs after deletion
- Keep only one empty paragraph for cursor placement
- Remove empty paragraphs that are not needed
- Normalize DOM structure regularly

