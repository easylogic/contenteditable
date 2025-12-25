---
id: ce-0141
scenarioId: scenario-undo-redo-stack
locale: en
os: Windows
osVersion: "11"
device: Desktop or Laptop
deviceVersion: Any
browser: Chrome
browserVersion: "120.0"
keyboard: US
caseTitle: Undo may undo multiple operations at once
description: "When pressing Ctrl+Z to undo in Chrome, multiple operations may be undone at once instead of one operation at a time. This makes it difficult to undo to a specific point."
tags:
  - undo
  - redo
  - granularity
  - chrome
status: draft
domSteps:
  - label: "Before"
    html: 'Hello'
    description: "초기 텍스트"
  - label: "After Multiple Operations"
    html: 'Hello <strong>World</strong> Test'
    description: "여러 작업 수행 (텍스트 입력, 서식 적용, 추가 입력)"
  - label: "After Single Undo (Bug)"
    html: 'Hello'
    description: "Ctrl+Z 한 번으로 여러 작업이 한꺼번에 취소됨"
  - label: "✅ Expected"
    html: 'Hello <strong>World</strong> '
    description: "정상: Ctrl+Z 한 번에 하나의 작업만 취소 (마지막 'Test'만 취소)"
---

### Phenomenon

When pressing Ctrl+Z to undo in Chrome, multiple operations may be undone at once instead of one operation at a time. This makes it difficult to undo to a specific point.

### Reproduction example

1. Type several characters
2. Apply formatting
3. Type more characters
4. Press Ctrl+Z multiple times

### Observed behavior

- Single Ctrl+Z may undo multiple operations
- Undo granularity is inconsistent
- Cannot undo to specific point easily
- Some operations are grouped together

### Expected behavior

- Each Ctrl+Z should undo one operation
- Undo granularity should be consistent
- Users should be able to undo precisely
- Operations should be undoable individually

### Browser Comparison

- **Chrome/Edge**: May undo multiple ops (this case)
- **Firefox**: Similar grouping behavior
- **Safari**: Undo granularity most inconsistent

### Notes and possible direction for workarounds

- Implement custom undo/redo with fine granularity
- Save state after each operation
- Group operations explicitly if needed
- Provide control over undo granularity

