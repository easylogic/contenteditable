---
id: ce-0174
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
    description: "리스트 구조"
  - label: "After List Removal (Bug)"
    html: '<div></div><p>Item 1</p>'
    description: "리스트 제거 후 빈 &lt;div&gt; 요소 남음"
  - label: "✅ Expected"
    html: '<p>Item 1</p>'
    description: "정상: 빈 div 제거, 깨끗한 DOM"
---

### Phenomenon

When removing a list (converting list items to paragraphs) in Chrome, empty wrapper div elements may remain in the DOM. These empty divs cause layout issues and bloat the HTML.

### Reproduction example

1. Create a list: `<ul><li>Item 1</li></ul>`
2. Remove the list (convert to paragraph)
3. Observe the DOM structure

### Observed behavior

- Empty `<div></div>` elements may remain
- Or divs with only whitespace remain
- DOM becomes bloated
- Layout has unexpected spacing

### Expected behavior

- Empty div elements should be removed
- DOM should be clean
- No unnecessary elements should remain
- Structure should be normalized

### Browser Comparison

- **Chrome/Edge**: May leave empty divs (this case)
- **Firefox**: More likely to leave empty elements
- **Safari**: Most likely to accumulate empty elements

### Notes and possible direction for workarounds

- Clean up empty div elements after list removal
- Remove wrapper elements if empty
- Normalize DOM structure regularly
- Remove unnecessary containers

