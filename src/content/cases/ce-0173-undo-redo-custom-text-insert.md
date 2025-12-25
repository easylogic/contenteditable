---
id: ce-0173
scenarioId: scenario-undo-redo-stack
locale: en
os: Windows
osVersion: "11"
device: Desktop or Laptop
deviceVersion: Any
browser: Chrome
browserVersion: "120.0"
keyboard: US
caseTitle: Custom text insertion cannot be undone
description: "When using preventDefault() and implementing custom text insertion in Chrome, those operations cannot be undone using Ctrl+Z. The undo stack does not include custom text insertions."
tags:
  - undo
  - redo
  - text
  - insertion
  - chrome
status: draft
domSteps:
  - label: "Before"
    html: 'Hello World'
    description: "기본 텍스트"
  - label: "After Custom Insert"
    html: 'Hello World New'
    description: "preventDefault()로 커스텀 텍스트 삽입"
  - label: "After Undo (Bug)"
    html: 'Hello World New'
    description: "Ctrl+Z로 Undo 불가, 커스텀 작업이 undo 스택에 없음"
  - label: "✅ Expected"
    html: 'Hello World'
    description: "정상: Undo로 커스텀 텍스트 삽입 취소 가능"
---

### Phenomenon

When using `preventDefault()` and implementing custom text insertion in Chrome, those operations cannot be undone using Ctrl+Z. The undo stack does not include custom text insertions.

### Reproduction example

1. Implement custom text insertion with `preventDefault()`
2. Insert some text
3. Press Ctrl+Z to undo

### Observed behavior

- Text insertion is not undone
- Browser's undo stack does not include the operation
- User cannot undo custom text insertions
- Undo/redo functionality is broken for custom features

### Expected behavior

- Custom text insertion should be undoable
- Undo stack should include all operations
- Ctrl+Z should work for custom insertions
- Redo should also work

### Browser Comparison

- **All browsers**: Custom operations not in undo stack
- This is expected when using `preventDefault()`
- Custom undo/redo implementation needed

### Notes and possible direction for workarounds

- Implement custom undo/redo stack
- Save state before each text insertion
- Restore state on undo
- Handle Ctrl+Z and Ctrl+Y manually

