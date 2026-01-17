---
id: ce-0319-android-contenteditable-false-dismisses-selection-ko
scenarioId: scenario-android-contenteditable-false-dismisses-selection
locale: ko
os: Android
osVersion: Any
device: Mobile
deviceVersion: Any
browser: Chrome for Android
browserVersion: Latest
keyboard: US
caseTitle: Cursor dismisses and keyboard closes when encountering contenteditable false on Android
description: "On Android Chrome, when cursor encounters a contenteditable='false' node, the selection may dismiss and the keyboard may close, disrupting the editing process."
tags:
  - android
  - contenteditable-false
  - selection
  - keyboard
  - mobile
status: draft
---

## Phenomenon

On Android Chrome, when the cursor encounters a `contenteditable="false"` node within a contenteditable region, the selection may dismiss and the on-screen keyboard may close unexpectedly. This disrupts the editing process and makes it difficult to edit content that contains non-editable elements.

## Reproduction example

1. Create a contenteditable div with mixed editable and non-editable content.
2. Add a child element with `contenteditable="false"`.
3. On Android Chrome, try to navigate cursor near the non-editable element.
4. Observe that selection dismisses and keyboard closes.

## Observed behavior

- **Selection dismisses**: Text selection is lost when cursor encounters non-editable node.
- **Keyboard closes**: On-screen keyboard closes unexpectedly.
- **Editing disrupted**: User cannot continue editing smoothly.
- **Android-specific**: This issue is specific to Android Chrome.
- **Backspace issues**: Pressing backspace near non-editable nodes may remove adjacent content instead of the node.

## Expected behavior

- Selection should be maintained when cursor moves near non-editable elements.
- Keyboard should remain open during editing.
- Cursor should navigate smoothly around non-editable elements.
- Editing should continue without interruption.

## Analysis

Android Chrome's contenteditable implementation handles non-editable nodes differently from desktop browsers. The browser may interpret encountering a non-editable boundary as a signal to dismiss editing mode.

## Workarounds

- Insert zero-width space after non-editable nodes to maintain cursor position.
- Add hidden, selectable elements adjacent to non-editable nodes.
- Implement custom event handlers for keyboard inputs to prevent dismissal.
- Use alternative approaches to create non-editable regions (CSS, event prevention) instead of `contenteditable="false"`.
- Test and adjust behavior specifically for Android Chrome.
