---
id: ce-0569
scenarioId: scenario-firefox-drag-drop-issues
locale: en
os: Linux
osVersion: "Ubuntu 24.04"
device: Desktop
deviceVersion: Any
browser: Firefox
browserVersion: "132.0"
keyboard: US QWERTY
caseTitle: "Drag and drop of text fails to move content"
description: "In recent Firefox versions (2024/2025), selecting text and dragging it within a contenteditable area fails to perform the 'move' operation, unlike in Chromium-based browsers."
tags: ["drag-drop", "firefox", "ux", "reliability"]
status: confirmed
domSteps:
  - label: "Step 1: Text Selection"
    html: '<div contenteditable="true">[Selected Text] and other content.</div>'
    description: "User selects a portion of text to move."
  - label: "Step 2: Dragging"
    html: '<div contenteditable="true">Selected Text and [Drop Target] other content.</div>'
    description: "User drags the selection to a new position. Firefox shows the drag ghost but rarely triggers the internal move."
  - label: "Step 3: Bug Result"
    html: '<div contenteditable="true">Selected Text and [Drop Target] other content.</div>'
    description: "Upon dropping, nothing happens. The DOM remains identical to the state before the drag began."
  - label: "✅ Expected"
    html: '<div contenteditable="true"> and [Selected Text] other content.</div>'
    description: "Expected: The text is removed from the source and inserted at the destination."
---

## Phenomenon
A regression or long-standing divergence in Firefox (reported active in Lexical Playground, Nov 2025) prevents the default "drag-to-move" behavior within `contenteditable`. While Chromium and WebKit allow users to reposition text blocks intuitively via drag-and-drop, Firefox often fails to dispatch the necessary `drop` events or internal DOM updates required to teleport the text.

## Reproduction Steps
1. Open a `contenteditable` editor in Firefox (v130+).
2. Type two sentences.
3. Select the first sentence with the mouse.
4. Click and hold the selection, then drag it to the end of the second sentence.
5. Release the mouse button.

## Observed Behavior
1. **`dragstart`**: Fires correctly.
2. **Ghost Image**: Appears and follows the mouse.
3. **`drop`**: Either does not fire at the target, or fires but the browser's default action (moving the text) is not executed.
4. **Result**: The selection remains at the source, and nothing is moved. No `beforeinput` with `inputType: "deleteByDrag"` or `"insertFromDrop"` is triggered.

## Expected Behavior
The browser should automatically handle the deletion of the source fragment and the insertion at the destination, triggering `beforeinput` events for both operations.

## Impact
- **Severed UX**: Users who rely on mouse-based editing (common in elderly users or specific workflows) find the editor "broken."
- **Framework Incompatibility**: Modern frameworks (Lexical, Slate) expect the browser to manage the basic move operation or provide a valid `DataTransfer` object during the drop.

## Browser Comparison
- **Firefox 130-132**: Reported failure in move operations.
- **Chrome / Edge**: Works natively and smoothly.
- **Safari**: Works correctly on macOS.

## References & Solutions
### Mitigation: Manual Drag-Drop Handler
If the browser fails to move the text, you must implement a complete drag-and-drop manager using the `DataTransfer` API.

```javascript
element.addEventListener('dragstart', (e) => {
    e.dataTransfer.setData('text/plain', window.getSelection().toString());
    e.dataTransfer.effectAllowed = 'move';
});

element.addEventListener('drop', (e) => {
    e.preventDefault();
    const data = e.dataTransfer.getData('text/plain');
    const range = document.caretRangeFromPoint(e.clientX, e.clientY);
    
    // Manually delete source and insert at range
    // NOTE: This usually requires a complex transaction logic in frameworks
    dispatchMoveTransaction(sourceRange, range, data);
});
```

- [Lexical Issue #8014: Drag and drop of text is broken in Firefox](https://github.com/facebook/lexical/issues/8014)
- [Mozilla Bugzilla #1898711 (Related)](https://bugzilla.mozilla.org/show_bug.cgi?id=1898711)
