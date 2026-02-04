---
id: scenario-ios-safari-contenteditable-do-not-force-rerender-or-change-selection-during-input
title: iOS Safari contenteditable — do not force re-render or change selection during input
description: "On iOS Safari, input and beforeinput can fire with inputType 'insertText' multiple times (e.g. voice dictation) or with inputType undefined/null. Forcing re-render or changing selection during this flow desyncs the editor model from the DOM and can permanently break subsequent input."
category: ime
tags:
  - ios
  - safari
  - input
  - beforeinput
  - inputType
  - voice
  - dictation
  - re-render
  - model-sync
  - selection
status: draft
locale: en
---

## Problem Overview

On iOS Safari, when the user types or uses voice dictation in a `contenteditable` element, the editor must **observe** input and update its internal model only. It must **not** force a re-render (e.g. writing back DOM from the model) or programmatically change the selection in the middle of the input stream. Reasons:

1. **Multiple insertText events**: Voice dictation sends `beforeinput` / `input` with `inputType: 'insertText'` multiple times (e.g. word by word or in chunks). If the editor re-renders or moves the selection after the first event, the following events apply to the wrong place and the model and DOM go out of sync.
2. **inputType can be undefined or null**: On iOS, `event.inputType` is not guaranteed. When it is `undefined` or `null`, the browser is still applying a change. If the editor treats "unknown inputType" as a signal to force-sync or re-render from the model, it overwrites or misaligns the DOM. After that, all subsequent input appears "broken": the model can no longer be kept in sync with the DOM.

The safe pattern is: **observe input, update the model from the DOM (or from the event), and do not write DOM or selection back during the input flow.**

## Observed Behavior

- **insertText multiple times**: Voice input produces a sequence of `insertText` events. After the first one, the DOM already contains part of the dictated text; the next event carries more text. If the editor re-renders (e.g. React setState → DOM replace) or restores selection after the first event, the second and later events apply to stale or wrong positions and the final text is wrong or duplicated.
- **inputType undefined/null**: In some iOS Safari paths, `input` or `beforeinput` fires with `event.inputType === undefined` or `null`. The DOM is still updated by the browser. If the editor does something like "if (!inputType) force sync from model to DOM" or "if (!inputType) restore selection", it overwrites the browser’s change or moves the caret. From that point on, the model and DOM diverge and further typing/dictation appears broken.
- **Selection change**: Programmatically calling `selection.removeAllRanges()` / `addRange()` or otherwise changing the selection during the input stream (e.g. after each `input`) has the same effect as re-rendering: the next event applies at the wrong place and sync is lost.

## Impact

- **Permanent desync**: Once the editor forces re-render or selection change on an event where inputType is null/undefined or in the middle of a multi-event insertText stream, the model and DOM no longer match. Later input accumulates in the wrong place or overwrites content; the user sees "all characters broken" or text in wrong order.
- **Voice dictation unusable**: Voice input is the main trigger for multiple insertText events; re-rendering or selection tweaks during dictation make voice input unreliable on iOS.
- **Controlled components**: React and other "controlled" patterns that sync DOM from state on every input are especially dangerous: they effectively force re-render on every keystroke or every input event, which breaks on iOS Safari under the above conditions.

## Browser Comparison

- **iOS Safari**: inputType can be undefined/null; voice dictation fires multiple insertText events; re-render or selection change during input leads to desync and broken subsequent input.
- **macOS Safari / Chrome / Firefox**: inputType is usually set; dictation may fire composition or different event patterns; re-rendering on every input still risks caret jump but may not cause the same degree of permanent model/DOM desync as on iOS.

## Solutions

1. **Observer-only during input**: In `input` / `beforeinput` handlers, only read from the DOM (or from the event) and update the editor model. Do not write the model back to the DOM and do not change the Selection during the same tick (or until the input "burst" is over).
2. **Never force sync when inputType is missing**: If `event.inputType` is `undefined` or `null`, do not treat it as "unknown, so overwrite DOM from model". Treat it as "browser applied a change; only read and update model". Avoid any path that does force-sync or re-render when inputType is falsy.
3. **Debounce or batch model→DOM writes**: If the editor must eventually reflect model state in the DOM, do it after input has settled (e.g. debounce, or on blur), not synchronously inside the input handler. On iOS, avoid re-rendering in the middle of a rapid sequence of input events (e.g. dictation).
4. **Uncontrolled or hybrid**: Consider keeping the contenteditable DOM as the source of truth during editing and only syncing to the framework state on blur or on a debounced tick, so that re-renders do not run during the critical input stream.

Example: avoid forced re-render when inputType is missing:

```javascript
editable.addEventListener('input', (e) => {
  // Only read and update model; do not write back to DOM here
  const newContent = editable.innerHTML; // or get from e / getTargetRanges
  updateModel(newContent);

  // Do NOT do this when inputType is undefined/null (or during insertText stream):
  // setState(newContent);  // → React re-renders → DOM replaced → desync on iOS
  // selection.removeAllRanges(); selection.addRange(myRange);  // → next input at wrong place
});
```

## Best Practices

- On iOS Safari, assume `inputType` can be undefined or null; never use "missing inputType" as a reason to force DOM or selection update from the model.
- Assume multiple `insertText` events in a row (e.g. voice); do not re-render or change selection between them.
- Prefer observer-only pattern: input handler updates model from DOM/event only; DOM/selection are not written back until after input has settled (blur, debounce, or explicit "flush").

## Related Cases

- [ce-0584-ios-safari-inputtype-null-forced-render-breaks-sync](ce-0584-ios-safari-inputtype-null-forced-render-breaks-sync) – iOS Safari: inputType undefined/null or multiple insertText; forced re-render breaks model–DOM sync
- [ce-0293](ce-0293-ios-dictation-duplicate-events-safari) – iOS dictation duplicate events (related event sequence)

## References

- [WebKit Bug 261764: iOS/iPadOS dictation doesn't trigger composition events](https://bugs.webkit.org/show_bug.cgi?id=261764)
- [MDN: InputEvent.inputType](https://developer.mozilla.org/en-US/docs/Web/API/InputEvent/inputType) – "If inputType returns null or undefined..."
- [Stack Overflow: Caret position reverts on re-render in React in Safari](https://stackoverflow.com/questions/40537746/caret-position-reverts-to-start-of-contenteditable-span-on-re-render-in-react-in)
- [Scenario: iOS dictation duplicate events](scenario-ios-dictation-duplicate-events) – dictation event re-firing; re-render during dictation worsens the issue
