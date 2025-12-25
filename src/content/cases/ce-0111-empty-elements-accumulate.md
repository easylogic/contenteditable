---
id: ce-0111
scenarioId: scenario-empty-element-cleanup
locale: en
os: Windows
osVersion: "11"
device: Desktop or Laptop
deviceVersion: Any
browser: Chrome
browserVersion: "120.0"
keyboard: US
caseTitle: Empty paragraph and span elements accumulate during editing
description: "During editing operations, empty elements (empty paragraphs, divs, spans with no content) accumulate in the DOM. These elements cause layout issues and bloat the HTML."
tags:
  - empty
  - cleanup
  - dom
  - chrome
status: draft
domSteps:
  - label: "Before"
    html: '<p>Hello <span style="font-weight: bold;">World</span></p>'
    description: "포맷팅된 텍스트"
  - label: "After Formatting Removal (Bug)"
    html: '<p>Hello <span></span>World</p>'
    description: "포맷팅 제거 후 빈 span 태그가 남음"
  - label: "✅ Expected"
    html: '<p>Hello World</p>'
    description: "정상: 빈 요소가 자동으로 정리됨"
---

### Phenomenon

During editing operations, empty elements (empty paragraphs, divs, spans with no content) accumulate in the DOM. These elements cause layout issues and bloat the HTML.

### Reproduction example

1. Create content in contenteditable
2. Apply formatting and remove it
3. Delete text content
4. Observe the DOM structure

### Observed behavior

- Empty `<p>` or `<div>` elements remain
- Empty `<span>` elements with style attributes remain
- DOM becomes bloated with empty elements
- Layout may have unexpected spacing

### Expected behavior

- Empty elements should be cleaned up automatically
- Or cleanup should be easy to implement
- DOM should remain clean and minimal
- No unnecessary empty elements

### Browser Comparison

- **Chrome/Edge**: Leaves empty elements (this case)
- **Firefox**: More likely to leave empty elements
- **Safari**: Most likely to accumulate empty elements

### Notes and possible direction for workarounds

- Implement cleanup logic to remove empty elements
- Run cleanup after input events
- Preserve at least one empty block for cursor placement
- Remove empty spans, but keep structure if needed
- Normalize DOM structure regularly

