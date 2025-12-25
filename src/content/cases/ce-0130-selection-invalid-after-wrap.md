---
id: ce-0130
scenarioId: scenario-selection-restoration
locale: en
os: Windows
osVersion: "11"
device: Desktop or Laptop
deviceVersion: Any
browser: Firefox
browserVersion: "120.0"
keyboard: US
caseTitle: Selection becomes invalid after wrapping content in elements
description: "When programmatically wrapping selected content in a new element (e.g., applying bold by wrapping in <b>), the selection range becomes invalid in Firefox. The cursor position is lost."
tags:
  - selection
  - range
  - wrapping
  - firefox
status: draft
domSteps:
  - label: "Before"
    html: 'Hello <span style="background: #bfdbfe;">World</span> Test'
    description: "텍스트 선택됨 (World가 하이라이트)"
  - label: "After Wrap (Bug)"
    html: 'Hello <b>World</b> Test'
    description: "&lt;b&gt;로 감싸기 후 선택 범위가 무효화됨, 커서 위치 손실"
  - label: "✅ Expected"
    html: 'Hello <b>World</b>| Test'
    description: "정상: 선택 범위 유지, 커서가 올바른 위치에 유지됨"
---

### Phenomenon

When programmatically wrapping selected content in a new element (e.g., applying bold by wrapping in `<b>`), the selection range becomes invalid in Firefox. The cursor position is lost.

### Reproduction example

1. Select some text
2. Programmatically wrap it in a `<b>` element
3. Check selection state

### Observed behavior

- Selection range becomes invalid
- Cursor position is lost
- Cannot continue editing at correct position
- Selection cannot be restored

### Expected behavior

- Selection should remain valid after wrapping
- Cursor should be positioned correctly
- User should be able to continue editing
- Selection should be restored properly

### Browser Comparison

- **Chrome/Edge**: Selection generally remains valid
- **Firefox**: Selection becomes invalid (this case)
- **Safari**: Selection restoration most unreliable

### Notes and possible direction for workarounds

- Save selection before wrapping
- Restore selection after wrapping
- Use Range API to maintain valid selection
- Handle invalid selection gracefully

