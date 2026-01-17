---
id: ce-0141-undo-redo-multiple-ops
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
    description: "Initial text"
  - label: "After Multiple Operations"
    html: 'Hello <strong>World</strong> Test'
    description: "Multiple operations performed (text input, formatting applied, additional input)"
  - label: "After Single Undo (Bug)"
    html: 'Hello'
    description: "Single Ctrl+Z cancels multiple operations at once"
  - label: "✅ Expected"
    html: 'Hello <strong>World</strong> '
    description: "Expected: Single Ctrl+Z cancels only one operation (only last 'Test' cancelled)"
---

## Phenomenon

When pressing Ctrl+Z to undo in Chrome, multiple operations may be undone at once instead of one operation at a time. This makes it difficult to undo to a specific point.

## Reproduction example

1. Type several characters
2. Apply formatting
3. Type more characters
4. Press Ctrl+Z multiple times

## Observed behavior

- Single Ctrl+Z may undo multiple operations
- Undo granularity is inconsistent
- Cannot undo to specific point easily
- Some operations are grouped together

## Expected behavior

- Each Ctrl+Z should undo one operation
- Undo granularity should be consistent
- Users should be able to undo precisely
- Operations should be undoable individually

## Browser Comparison

- **Chrome/Edge**: May undo multiple ops (this case)
- **Firefox**: Similar grouping behavior
- **Safari**: Undo granularity most inconsistent

## Notes and possible direction for workarounds

- Implement custom undo/redo with fine granularity
- Save state after each operation
- Group operations explicitly if needed
- Provide control over undo granularity

