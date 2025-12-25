---
id: ce-0163
scenarioId: scenario-list-formatting-persistence
locale: en
os: Windows
osVersion: "11"
device: Desktop or Laptop
deviceVersion: Any
browser: Chrome
browserVersion: "120.0"
keyboard: US
caseTitle: Applying formatting across multiple list items breaks list structure
description: "When selecting text across multiple list items and applying formatting in Chrome, the list structure may break. List items may be converted to paragraphs or the list may be removed entirely."
tags:
  - list
  - formatting
  - multi-select
  - chrome
status: draft
domSteps:
  - label: "Before"
    html: '<ul><li>Item 1</li><li>Item 2</li><li>Item 3</li></ul>'
    description: "List structure, text selected from Item 1 and Item 2"
  - label: "After Bold (Bug)"
    html: '<p><b>Item 1</b></p><p><b>Item 2</b></p>'
    description: "After formatting applied, list structure damaged, &lt;li&gt; converted to &lt;p&gt;"
  - label: "✅ Expected"
    html: '<ul><li><b>Item 1</b></li><li><b>Item 2</b></li><li>Item 3</li></ul>'
    description: "Expected: List structure maintained, formatting applied inside each item"
---

### Phenomenon

When selecting text across multiple list items and applying formatting in Chrome, the list structure may break. List items may be converted to paragraphs or the list may be removed entirely.

### Reproduction example

1. Create a list: `<ul><li>Item 1</li><li>Item 2</li><li>Item 3</li></ul>`
2. Select text across "Item 1" and "Item 2"
3. Apply bold formatting

### Observed behavior

- List items may be converted to paragraphs
- List structure is broken
- Formatting is applied but list is lost
- DOM structure becomes: `<p><b>Item 1</b></p><p><b>Item 2</b></p>`

### Expected behavior

- List structure should be maintained
- Formatting should be applied within list items
- List items should remain as `<li>` elements
- Structure should not break

### Browser Comparison

- **Chrome/Edge**: May break structure (this case)
- **Firefox**: More likely to break structure
- **Safari**: Most likely to break structure

### Notes and possible direction for workarounds

- Intercept formatting across list items
- Apply formatting within each list item separately
- Preserve list structure
- Normalize structure after formatting

