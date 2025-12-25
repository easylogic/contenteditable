---
id: ce-0014
scenarioId: scenario-nested-contenteditable
locale: en
os: Any
osVersion: "Ubuntu 22.04"
device: Desktop or Laptop
deviceVersion: Any
browser: Chrome
browserVersion: "120.0"
keyboard: US
caseTitle: Nested contenteditable elements cause focus and selection issues
description: "When a contenteditable element contains another contenteditable element, focus behavior becomes unpredictable. Clicking on the nested element may not properly focus it, and selection ranges may span across both elements unexpectedly."
tags:
  - nested
  - focus
  - selection
status: draft
domSteps:
  - label: "Before"
    html: '<div contenteditable="true">Outer <div contenteditable="true">Inner</div></div>'
    description: "중첩된 contenteditable 요소"
  - label: "After Click Inner (Bug)"
    html: '<div contenteditable="true">Outer <div contenteditable="true">Inner</div></div>'
    description: "내부 요소 클릭 시 포커스가 외부 요소에 남음, 선택 범위가 두 요소에 걸침"
  - label: "✅ Expected"
    html: '<div contenteditable="true">Outer <div contenteditable="true">Inner</div></div>'
    description: "정상: 내부 요소 클릭 시 내부 요소에 포커스, 선택이 내부 요소에만 제한됨"
---

### Phenomenon

When a contenteditable element contains another contenteditable element, focus behavior becomes unpredictable. Clicking on the nested element may not properly focus it, and selection ranges may span across both elements incorrectly.

### Reproduction example

1. Create a contenteditable div.
2. Inside it, create another contenteditable div.
3. Click on the inner contenteditable element.
4. Try to select text within the inner element.
5. Observe focus and selection behavior.

### Observed behavior

- Focus may remain on the outer contenteditable instead of moving to the inner one.
- Selection ranges may include content from both the outer and inner elements.
- The caret position may be incorrect when clicking within the nested element.

### Expected behavior

- Clicking on a nested contenteditable should focus that element.
- Selection should be contained within the focused contenteditable element.
- The caret should appear at the click position within the nested element.

