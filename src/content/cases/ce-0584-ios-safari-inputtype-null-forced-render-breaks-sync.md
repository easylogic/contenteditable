---
id: ce-0584-ios-safari-inputtype-null-forced-render-breaks-sync
scenarioId: scenario-ios-safari-contenteditable-do-not-force-rerender-or-change-selection-during-input
locale: en
os: iOS
osVersion: "17"
device: Phone
deviceVersion: iPhone 15
browser: Safari
browserVersion: "17"
keyboard: US QWERTY / Voice dictation
caseTitle: iOS Safari — forced re-render when inputType is undefined/null or during multi insertText breaks model–DOM sync
description: "On iOS Safari, input/beforeinput can fire with inputType undefined or null, or with insertText multiple times (voice). If the editor forces re-render or changes selection in response, the model and DOM desync and subsequent input appears broken."
tags: ["ios", "safari", "input", "inputType", "voice", "dictation", "re-render", "model-sync"]
status: draft
domSteps:
  - label: "Step 1: User enters text (keyboard or voice)"
    html: '<div contenteditable="true">Hello </div>'
    description: "First input event(s) fire; inputType may be 'insertText' or undefined/null."
  - label: "Step 2: Editor forces re-render or selection change"
    html: '<div contenteditable="true">Hello </div>'
    description: "Editor writes model to DOM or restores selection; DOM/selection overwritten or moved."
  - label: "Step 3: Next input applies at wrong place (bug)"
    html: '<div contenteditable="true">World Hello </div>'
    description: "Subsequent insertText (or next chunk) applies at wrong offset; model and DOM no longer match."
  - label: "✅ Expected"
    html: '<div contenteditable="true">Hello World </div>'
    description: "Editor only observes input and updates model; no re-render/selection change during stream; all text in correct order."
---

## Phenomenon

On iOS Safari, `input` and `beforeinput` events are not always accompanied by a valid `event.inputType`. In some code paths (including voice dictation and certain system text insertions), `inputType` is `undefined` or `null` while the browser still applies a change to the DOM. In addition, voice dictation sends multiple `insertText` events in sequence (e.g. word by word or in chunks). If the editor responds to any of these events by forcing a re-render (e.g. writing the current model back to the DOM, or React re-rendering from state) or by programmatically changing the selection, two things happen:

1. When inputType is undefined/null: The editor may treat "unknown input type" as a signal to "sync from model" or "restore selection". That overwrites or repositions what the browser just did. The next input event then applies to the wrong place, and from that point on the model and DOM are permanently out of sync. The user sees characters in the wrong order, duplicated, or "all broken".
2. When insertText fires multiple times: After the first insertText, the editor re-renders or moves the selection. The second and later insertText events apply to the (now wrong) selection or to a DOM that was just replaced by the model. The final text is wrong and the model can no longer be reconciled with the DOM.

No composition events fire during iOS dictation, so the editor cannot rely on composition boundaries to "batch" input. The only safe approach is to not force re-render and not change selection during the input stream; only observe and update the model.

## Reproduction Steps

1. Use iOS Safari on an iPhone or iPad with a contenteditable-based editor that re-renders from model state on each `input` (e.g. controlled React component), or that restores selection after each input.
2. Either:
   - Type several characters quickly, or
   - Use voice dictation to insert a phrase (e.g. "Hello world").
3. If the editor force-updates the DOM or selection in the middle of the input stream (e.g. on an event where `event.inputType` is undefined/null, or after the first insertText of a dictation phrase), observe that:
   - Subsequent characters or chunks appear in the wrong place.
   - The displayed text and the editor’s internal model diverge.
   - Further typing or dictation continues to go to the wrong position; the editor appears "broken" until focus is lost or the page is reloaded.

## Observed Behavior

- **Event sequence**: `beforeinput` / `input` with `inputType: 'insertText'` (or undefined/null) and `data` containing part of the text. Browser updates DOM. If the editor then runs "sync from model" or "restore selection", the DOM or selection is overwritten. Next `beforeinput` / `input` fires with more text; it applies at the old or wrong offset. Result: duplicated text, reversed order, or caret in wrong place and all following input broken.
- **inputType undefined/null**: Observed on iOS Safari when using voice dictation and in some other input paths. The spec allows inputType to be empty; MDN notes it may return null or undefined. Using "no inputType → force sync" causes the first overwrite and permanent desync.
- **Multiple insertText**: Voice dictation often sends several insertText events (e.g. one per word or per segment). Re-rendering or selection change after the first one makes the rest apply incorrectly.

## Expected Behavior

The editor should only read from the DOM (or from the event) in the input handler and update its model. It should not write the model back to the DOM and should not change the Selection during the same input "burst". When inputType is undefined or null, the editor must not interpret that as "unknown, so overwrite DOM from model". After input has settled (e.g. debounce or blur), the editor may optionally reconcile DOM from model if needed.

## Impact

- **Permanent model–DOM desync**: Once a forced re-render or selection change happens in the wrong moment, the editor cannot reliably sync model and DOM for the rest of the session; characters appear broken or in wrong order.
- **Voice input unreliable**: Voice dictation is the main case where multiple insertText and sometimes undefined inputType occur; editors that re-render or tweak selection on every input make dictation unusable on iOS Safari.
- **Controlled components**: React and similar frameworks that sync DOM from state on every input are high risk on iOS unless they avoid re-rendering the contenteditable during the input stream (e.g. observer-only + debounced or blur sync).

## Browser Comparison

- **iOS Safari**: inputType can be undefined/null; multiple insertText for voice; forced re-render or selection change during input leads to desync and broken subsequent input.
- **macOS Safari / Chrome / Firefox**: inputType is usually set; re-render on every input may cause caret jump but often does not cause the same permanent desync as on iOS Safari.

## Solutions

1. **Observer-only**: In `input`/`beforeinput`, only update the model from the DOM or event; do not write model to DOM and do not change selection in the same tick or during a rapid sequence of events.
2. **Never force sync when inputType is falsy**: If `event.inputType` is undefined or null, do not run "sync from model to DOM" or "restore selection"; only read and update model.
3. **Debounce or blur for model→DOM**: If the editor must reflect model in DOM, do it after input has settled (debounce, blur, or explicit flush), not inside the input handler.
4. **Uncontrolled or hybrid**: Keep contenteditable as source of truth during editing; sync to framework state only on blur or debounced tick so that re-renders do not run during the critical input stream.

## References

- [WebKit Bug 261764: iOS/iPadOS dictation doesn't trigger composition events](https://bugs.webkit.org/show_bug.cgi?id=261764)
- [MDN: InputEvent.inputType](https://developer.mozilla.org/en-US/docs/Web/API/InputEvent/inputType)
- [Stack Overflow: Caret position reverts on re-render in Safari](https://stackoverflow.com/questions/40537746/caret-position-reverts-to-start-of-contenteditable-span-on-re-render-in-react-in)
- [Scenario: iOS Safari contenteditable do not force re-render or change selection during input](scenario-ios-safari-contenteditable-do-not-force-rerender-or-change-selection-during-input)
