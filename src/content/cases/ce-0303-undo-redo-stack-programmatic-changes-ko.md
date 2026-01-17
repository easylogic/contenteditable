---
id: ce-0303-undo-redo-stack-programmatic-changes-ko
scenarioId: scenario-undo-redo-stack-programmatic-changes
locale: ko
os: Any
osVersion: Any
device: Desktop or Laptop
deviceVersion: Any
browser: Chrome
browserVersion: Latest
keyboard: US
caseTitle: Undo/redo stack does not include programmatic DOM changes
description: "When DOM is modified programmatically (via JavaScript), these changes may not be included in the browser's native undo/redo stack, making undo/redo unreliable."
tags:
  - undo
  - redo
  - programmatic
  - dom-manipulation
status: draft
---

## Phenomenon

Browsers maintain their own undo/redo stacks for user-initiated actions within contenteditable elements. However, when you modify the DOM programmatically (such as inserting elements or altering content via JavaScript), these changes may not integrate seamlessly into the browser's native undo/redo stack. This can lead to unexpected behavior where users are unable to undo or redo actions as anticipated.

## Reproduction example

1. Create a contenteditable div with some text.
2. User types some text (this creates an undo entry).
3. Programmatically insert an image or format text via JavaScript.
4. User presses Ctrl+Z (undo).
5. Observe whether the programmatic change is undone or only user typing is undone.

## Observed behavior

- **Programmatic changes**: DOM modifications via JavaScript are not added to undo stack.
- **User actions**: Typing, deleting, formatting via keyboard/mouse are added to undo stack.
- **Undo behavior**: Pressing Ctrl+Z may skip programmatic changes and only undo user actions.
- **Redo behavior**: Programmatic changes cannot be redone using Ctrl+Y.
- **Stack clearing**: Some programmatic operations may clear the undo stack entirely.
- **Inconsistent**: Behavior varies between browsers and types of programmatic changes.

## Expected behavior

- All changes (both user-initiated and programmatic) should be reversible via undo/redo.
- Undo stack should include programmatic DOM modifications.
- Redo should restore programmatic changes that were undone.
- Undo/redo should work consistently regardless of how content was modified.

## Analysis

Browsers only track user-initiated changes for the undo stack. Programmatic changes are not automatically tracked because the browser cannot distinguish between intentional editor operations and other DOM manipulations.

## Workarounds

- Implement custom undo/redo stack using MutationObserver to track all changes.
- Use libraries like ProseMirror, Slate, or Lexical that provide custom undo/redo management.
- Manually manage undo/redo by storing state snapshots before programmatic changes.
- Use `document.execCommand` for operations that should be undoable (deprecated but still works).
- Implement command pattern to track all operations for undo/redo.
