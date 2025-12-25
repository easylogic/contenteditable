---
id: ce-0129
scenarioId: scenario-undo-redo-stack
locale: en
os: Windows
osVersion: "11"
device: Desktop or Laptop
deviceVersion: Any
browser: Chrome
browserVersion: "120.0"
keyboard: US
caseTitle: Undo stack is cleared unexpectedly on focus changes
description: "When the contenteditable element loses and regains focus, the undo stack may be cleared unexpectedly. Users cannot undo operations that were performed before the focus change."
tags:
  - undo
  - redo
  - focus
  - chrome
status: draft
domSteps:
  - label: "Before Blur"
    html: 'Hello World Test'
    description: "여러 편집 작업 완료"
  - label: "After Blur and Focus"
    html: 'Hello World Test'
    description: "포커스 변경 후, undo 스택이 초기화됨"
  - label: "After Undo (Bug)"
    html: 'Hello World Test'
    description: "Undo 불가, 이전 작업을 취소할 수 없음"
  - label: "✅ Expected"
    html: 'Hello World'
    description: "정상: Undo로 이전 작업 취소 가능"
---

### Phenomenon

When the contenteditable element loses and regains focus, the undo stack may be cleared unexpectedly. Users cannot undo operations that were performed before the focus change.

### Reproduction example

1. Make several edits in contenteditable
2. Click outside to blur the element
3. Click back to focus the element
4. Press Ctrl+Z to undo

### Observed behavior

- Undo stack is cleared
- Previous operations cannot be undone
- Undo history is lost
- User loses ability to undo

### Expected behavior

- Undo stack should be preserved across focus changes
- Or behavior should be predictable
- Users should be able to undo previous operations
- History should be maintained

### Browser Comparison

- **Chrome/Edge**: Stack may be cleared (this case)
- **Firefox**: Similar stack clearing behavior
- **Safari**: Stack clearing most unpredictable

### Notes and possible direction for workarounds

- Implement custom undo/redo that persists across focus
- Save undo stack in memory
- Restore stack when element regains focus
- Document undo stack behavior for users

