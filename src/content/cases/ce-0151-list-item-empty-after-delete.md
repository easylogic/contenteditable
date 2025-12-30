---
id: ce-0151
scenarioId: scenario-list-item-deletion
locale: en
os: Windows
osVersion: "11"
device: Desktop or Laptop
deviceVersion: Any
browser: Safari
browserVersion: "17.0"
keyboard: US
caseTitle: Empty list items remain after deleting all text in Safari
description: "When deleting all text from a list item in Safari, empty list items may remain in the DOM. These empty <li> elements cause layout issues and make the list structure confusing."
tags:
  - list
  - empty
  - deletion
  - safari
status: draft
domSteps:
  - label: "Before"
    html: '<ul><li>Item 1</li><li>Item 2</li></ul>'
    description: "List structure"
  - label: "After Delete (Bug)"
    html: '<ul><li>Item 1</li><li></li></ul>'
    description: "After deleting Item 2 text, empty &lt;li&gt; element remains"
  - label: "✅ Expected"
    html: '<ul><li>Item 1</li></ul>'
    description: "Expected: Empty list item removed, clean list structure"
---

## Phenomenon

When deleting all text from a list item in Safari, empty list items may remain in the DOM. These empty `<li>` elements cause layout issues and make the list structure confusing.

## Reproduction example

1. Create a list: `<ul><li>Item 1</li><li>Item 2</li></ul>`
2. Delete all text from "Item 2"
3. Observe the DOM

## Observed behavior

- Empty `<li></li>` or `<li><br></li>` elements remain
- List structure includes empty items
- Layout has unexpected spacing
- Empty items are visible

## Expected behavior

- Empty list items should be removed
- Or at least one empty item should remain for cursor
- List structure should be clean
- No unnecessary empty items

## Browser Comparison

- **Chrome/Edge**: May remove empty items or leave one
- **Firefox**: More likely to leave empty items
- **Safari**: Most likely to leave empty items (this case)

## Notes and possible direction for workarounds

- Clean up empty list items after deletion
- Remove empty items but preserve list structure
- Keep one empty item if needed for cursor
- Normalize list structure regularly

