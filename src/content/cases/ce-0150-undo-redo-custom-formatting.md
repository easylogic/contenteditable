---
id: ce-0150
scenarioId: scenario-undo-redo-stack
locale: en
os: Windows
osVersion: "11"
device: Desktop or Laptop
deviceVersion: Any
browser: Chrome
browserVersion: "120.0"
keyboard: US
caseTitle: Custom formatting operations cannot be undone
description: "When using preventDefault() and implementing custom formatting operations (bold, italic, etc.), those operations cannot be undone using Ctrl+Z. The undo stack does not include custom operations."
tags:
  - undo
  - redo
  - formatting
  - custom
  - chrome
status: draft
domSteps:
  - label: "Before"
    html: 'Hello World'
    description: "기본 텍스트"
  - label: "After Custom Bold"
    html: 'Hello <strong>World</strong>'
    description: "preventDefault()로 커스텀 볼드 적용"
  - label: "After Undo (Bug)"
    html: 'Hello <strong>World</strong>'
    description: "Ctrl+Z로 Undo 불가, 커스텀 작업이 undo 스택에 없음"
  - label: "✅ Expected"
    html: 'Hello World'
    description: "정상: Undo로 커스텀 서식 취소 가능"
---

### Phenomenon

When using `preventDefault()` and implementing custom formatting operations (bold, italic, etc.), those operations cannot be undone using Ctrl+Z. The undo stack does not include custom operations.

### Reproduction example

1. Implement custom bold formatting with `preventDefault()`
2. Apply bold to selected text
3. Press Ctrl+Z to undo

### Observed behavior

- Bold formatting is not undone
- Browser's undo stack does not include the operation
- User cannot undo custom formatting
- Undo/redo functionality is broken for custom features

### Expected behavior

- Custom formatting should be undoable
- Undo stack should include all operations
- Ctrl+Z should work for custom formatting
- Redo should also work

### Browser Comparison

- **All browsers**: Custom operations not in undo stack
- This is expected when using `preventDefault()`
- Custom undo/redo implementation needed

### Notes and possible direction for workarounds

- Implement custom undo/redo stack
- Save state before each formatting operation
- Restore state on undo
- Handle Ctrl+Z and Ctrl+Y manually

