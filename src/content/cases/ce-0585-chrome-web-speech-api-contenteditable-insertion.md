---
id: ce-0585-chrome-web-speech-api-contenteditable-insertion
scenarioId: scenario-voice-input-contenteditable
locale: en
os: Windows
osVersion: "10+"
device: Desktop
deviceVersion: Any
browser: Chrome
browserVersion: "120+"
keyboard: US QWERTY (microphone for speech)
caseTitle: Web Speech API final results can insert at the wrong range if selection moves during recognition
description: "When using the Speech Recognition API to append transcript text into a contenteditable, the handler typically runs asynchronously. If the user blurs the editor or moves the caret while speaking, naive range-based insertion writes into the wrong node or loses coherence with editor state."
tags:
  - chrome
  - web-speech-api
  - voice
  - selection
  - async
  - contenteditable
status: draft
domSteps:
  - label: "Step 1: Caret inside editor, recognition started"
    html: '<div id="editor" contenteditable="true"><p>Hello </p></div>'
    description: "User places caret after 'Hello ' and starts speech recognition that will fire onresult later."
  - label: "Step 2: User clicks outside before onresult runs"
    html: '<div id="editor" contenteditable="true"><p>Hello </p></div><button type="button">Outside</button>'
    description: "Focus moves to the button; getSelection() no longer has a meaningful range inside #editor."
  - label: "Step 3: Bug — handler still uses stale range"
    html: '<div id="editor" contenteditable="true"><p>Hello world</p></div><button type="button">Outside</button>'
    description: "If code inserts using a cloned range from step 1 without re-validation, Chromium may throw, insert into an invalid place, or (if fallback uses document.getSelection()) insert relative to the focused button context—behavior is app-dependent and inconsistent."
  - label: "✅ Expected"
    html: '<div id="editor" contenteditable="true"><p>Hello </p></div><button type="button">Outside</button>'
    description: "Expected: Detect that editor is not active; queue transcript or discard insert instead of corrupting DOM."
---

## Phenomenon

The [Web Speech API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API) delivers `SpeechRecognitionResult` events asynchronously. Editor integrations often snapshot `window.getSelection().getRangeAt(0)` when recognition starts and call `insertNode` / `insertText` when `result.isFinal` is true. Between those two moments the user may tab away, click a toolbar, or focus another field. The saved `Range` can become invalid, point at detached nodes, or no longer represent “where the user was dictating.” Chrome does not provide a built-in “bind this transcript to this contenteditable” primitive; all correctness is application responsibility. Additionally, `beforeinput` / `input` may not fire for programmatic DOM inserts done from JavaScript, so framework state can skip the usual pipeline entirely.

## Reproduction Steps

1. Create a `contenteditable` region and a focusable control outside it (e.g. a `<button>`).
2. Add a Speech Recognition script: on `start`, clone the current selection range if it is inside the editor.
3. Speak until a final result arrives (or simulate `onresult` with a timeout).
4. Before the final result fires, click the outside control so `document.activeElement` is no longer the editor.
5. In `onresult`, apply the transcript using the cloned range without checking `editor.contains(range.startContainer)` or `document.activeElement`.
6. Observe DOM errors in the console, insertion into unexpected locations, or silent failure depending on fallback logic.

## Observed Behavior

- **Stale range**: `Range` operations may throw `InvalidNodeTypeError` or no-op if boundary nodes were removed by a re-render.
- **Wrong active element**: Fallbacks that re-read `getSelection()` insert relative to wherever focus moved—not the original editor.
- **Missing input events**: Programmatic mutation does not mirror keyboard-driven `beforeinput`/`input`, so listeners that sync model on `input` never run.
- **No composition lifecycle**: Unlike IME, Speech API does not emit `composition*` events; editors that only sync on `compositionend` miss updates.

## Expected Behavior

If the editor is not focused and the selection is not confidently inside the same editorial root as when recognition began, the application should **not** apply the transcript to the old range. It should either cancel, queue until the user refocuses the editor, or prompt. Any intentional programmatic insert should go through the same state update path as keyboard input (custom events or explicit model patches).

## Impact

- **Corrupted documents**: Text appears in the wrong block or outside the intended wrapper.
- **Framework desync**: Virtual DOM assumes events that never fired.
- **Accessibility**: Voice users may lose data silently when focus shifts to a toolbar or dialog mid-utterance.

## Browser Comparison

- **Chrome / Edge**: Speech Recognition API available; async timing issue is integration-level but very common.
- **Safari / Firefox**: API availability and behavior differ; do not assume Chrome parity.
- **OS dictation**: May bypass your Speech API entirely and use native editing paths—different bug surface.

## Solutions

1. **Guard every insert**:

```javascript
function safeInsert(editor, range, text) {
  if (!editor.contains(range.startContainer)) return false;
  if (document.activeElement !== editor && !editor.contains(document.activeElement)) return false;
  range.deleteContents();
  range.insertNode(document.createTextNode(text));
  range.collapse(false);
  getSelection().removeAllRanges();
  getSelection().addRange(range);
  return true;
}
```

2. **Version the session**: Store an incrementing `sessionId` when starting recognition; if the editor’s `focus`/`blur` handlers change `sessionId`, ignore late results.

3. **Emit synthetic pipeline**: After programmatic insert, dispatch `InputEvent` or call your model updater directly so one code path owns truth.

## References

- [MDN: SpeechRecognition](https://developer.mozilla.org/en-US/docs/Web/API/SpeechRecognition)
- [Scenario: Voice and speech-driven input in contenteditable](scenario-voice-input-contenteditable)
