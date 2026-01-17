---
id: ce-0174-empty-div-after-list-removal
scenarioId: scenario-empty-element-cleanup
locale: en
os: Windows
osVersion: "11"
device: Desktop or Laptop
deviceVersion: Any
browser: Chrome
browserVersion: "120.0"
keyboard: US
caseTitle: Empty div elements remain after removing list
description: "When removing a list (converting list items to paragraphs) in Chrome, empty wrapper div elements may remain in the DOM. These empty divs cause layout issues and bloat the HTML."
tags:
  - empty
  - list
  - div
  - cleanup
  - chrome
status: draft
domSteps:
  - label: "Before"
    html: '<ul><li>Item 1</li></ul>'
    description: "List structure"
  - label: "After List Removal (Bug)"
    html: '<div></div><p>Item 1</p>'
    description: "After list removal, empty &lt;div&gt; element remains"
  - label: "✅ Expected"
    html: '<p>Item 1</p>'
    description: "Expected: Empty div removed, clean DOM"
---

## Phenomenon

When removing a list (converting list items to paragraphs) in Chrome, empty wrapper div elements may remain in the DOM. These empty divs cause layout issues and bloat the HTML.

## Reproduction example

1. Create a list: `<ul><li>Item 1</li></ul>`
2. Remove the list (convert to paragraph)
3. Observe the DOM structure

## Observed behavior

- Empty `<div></div>` elements may remain
- Or divs with only whitespace remain
- DOM becomes bloated
- Layout has unexpected spacing

## Expected behavior

- Empty div elements should be removed
- DOM should be clean
- No unnecessary elements should remain
- Structure should be normalized

## Browser Comparison

- **Chrome/Edge**: May leave empty divs (this case)
- **Firefox**: More likely to leave empty elements
- **Safari**: Most likely to accumulate empty elements

## Notes and possible direction for workarounds

- Clean up empty div elements after list removal
- Remove wrapper elements if empty
- Normalize DOM structure regularly
- Remove unnecessary containers

