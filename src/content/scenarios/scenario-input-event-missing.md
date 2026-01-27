---
id: scenario-input-event-missing
title: "Input events fail to fire in specific conditions"
description: "Analysis of scenarios where browsers fail to dispatch the 'input' event despite DOM mutations occurring."
category: "input"
tags: ["events", "input", "reliability", "dom-sync"]
status: "confirmed"
locale: "en"
---

## Problem Overview
The `input` event (as defined in Input Events Level 2) is the fundamental signal for modern web applications to detect localized content changes. Frameworks like Slate, Lexical, and React depend on this event to reconcile their internal Virtual Model (Source of Truth) with the browser's mutable DOM. When this event is missing, the framework remains unaware of the DOM change, leading to "ghost text", data loss, or history corruption.

## Observed Behavior
This failure typically occurs due to browser regressions or complex edge cases involving caret positioning.

### Scenario 1: Block Boundary Inputs (Chrome 121)
When typing at `offset 0` of a text node or block, the browser successfully performs the `beforeinput` logic but skips the final `input` dispatch.

```javascript
/* Observer Logic */
element.addEventListener('beforeinput', (e) => {
  console.log('1. beforeinput triggered');
});
element.addEventListener('input', (e) => {
  console.log('2. input triggered'); // Fails to appear in Chrome 121 at offset 0
});
```

### Scenario 2: Programmatic Mutations
While manual typing usually triggers events, some browser extensions or OS-level tools (like Dictation or Translation services) modify the DOM using internal methods that bypass the standard input event loop.

## Impact
- **State Divergence**: The internal data model thinks the document says "world" while the DOM shows "Hworld".
- **Broken Undo/Redo**: The framework's history manager doesn't record the change, making it impossible to undo.
- **Side-Effect Stalling**: Automatic saves, character counts, and real-time collaboration updates are never triggered.

## Browser Comparison
- **Blink (Chrome/Edge)**: Stable overall, but prone to high-profile regressions in specific versions (e.g., v121).
- **WebKit (Safari)**: Generally dispatches events correctly but may have timing issues with `compositionend`.
- **Gecko (Firefox)**: Known for strict compliance but can sometimes dispatch excessive events in nested structures.

## Solutions
### 1. The "Safety Timer" Hack
If your framework detects a `beforeinput` but no `input` follows within a short window, trigger a manual "dirty check".

```javascript
let pendingInput = null;

element.addEventListener('beforeinput', () => {
  if (pendingInput) clearTimeout(pendingInput);
  pendingInput = setTimeout(() => {
    console.warn('Recovering from missing input event...');
    editor.reconcileEntireDOM();
  }, 100);
});

element.addEventListener('input', () => {
  if (pendingInput) {
    clearTimeout(pendingInput);
    pendingInput = null;
  }
});
```

### 2. MutationObserver Fallback
A `MutationObserver` is the most reliable way to catch changes that the Input API misses, though it is more performance-intensive.

## Best Practices
- **Never rely solely on `input`**: For mission-critical editors, use `MutationObserver` as a backup.
- **Track beforeinput**: Always use `beforeinput` to capture the intent and target ranges, as they are unavailable in the `input` event.

## Related Cases
- [ce-0565: onInput event missing when typing at offset 0](file:///Users/user/github/barocss/contenteditable/src/content/cases/ce-0565-chrome-121-oninput-offset-0.md)

## References
- [W3C Input Events Level 2](https://www.w3.org/TR/input-events-2/)
- [MDN: InputEvent](https://developer.mozilla.org/en-US/docs/Web/API/InputEvent)
