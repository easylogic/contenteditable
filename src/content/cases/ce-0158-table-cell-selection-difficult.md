---
id: ce-0158
scenarioId: scenario-table-editing
locale: en
os: Windows
osVersion: "11"
device: Desktop or Laptop
deviceVersion: Any
browser: Chrome
browserVersion: "120.0"
keyboard: US
caseTitle: Selecting table cell content is difficult
description: "When trying to select text within a table cell in Chrome, the selection may extend outside the cell or may not work properly. It's difficult to select and edit cell content precisely."
tags:
  - table
  - cell
  - selection
  - chrome
status: draft
domSteps:
  - label: "Before"
    html: '<table><tr><td>Cell 1</td><td>Cell 2</td></tr></table>'
    description: "테이블 구조, Cell 1 텍스트 선택 시도"
  - label: "After Selection (Bug)"
    html: '<table><tr><td>Cell 1</td><td>Cell 2</td></tr></table>'
    description: "선택이 인접 셀로 확장되거나 셀 경계를 무시함"
  - label: "✅ Expected"
    html: '<table><tr><td><span style="background: yellow;">Cell 1</span></td><td>Cell 2</td></tr></table>'
    description: "정상: 선택이 셀 내부에만 제한됨"
---

### Phenomenon

When trying to select text within a table cell in Chrome, the selection may extend outside the cell or may not work properly. It's difficult to select and edit cell content precisely.

### Reproduction example

1. Create a table with cells containing text
2. Try to select text within a cell
3. Observe selection behavior

### Observed behavior

- Selection may extend to adjacent cells
- Or selection may not work at all
- Cell boundaries are not respected
- Precise selection is difficult

### Expected behavior

- Selection should be contained within cell
- Cell boundaries should be respected
- Selection should work smoothly
- Editing should be precise

### Browser Comparison

- **Chrome/Edge**: Selection may extend outside cell (this case)
- **Firefox**: Similar selection issues
- **Safari**: Selection behavior most inconsistent

### Notes and possible direction for workarounds

- Constrain selection to cell boundaries
- Intercept selection events in table cells
- Prevent selection from extending outside cell
- Provide visual feedback for cell boundaries

