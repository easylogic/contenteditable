---
id: scenario-voice-input-contenteditable
title: Voice and speech-driven input in contenteditable lacks a stable editing contract
description: "OS voice typing, Web Speech API, and assistive voice tools insert or mutate contenteditable without the same event sequence as keyboard or IME. Caret position, selection, and composition events are inconsistent across platforms, which breaks editors that assume beforeinput/input/composition alignment."
category: accessibility
tags:
  - voice
  - speech
  - web-speech-api
  - dictation
  - accessibility
  - beforeinput
  - composition
  - selection
status: draft
locale: en
---

Voice-driven editing (browser Web Speech API, OS-level dictation, Dragon-style tools) interacts with `contenteditable` through paths that differ from physical keyboard and IME. Applications often see bulk `insertText`-style updates, missing `composition*` events, or asynchronous inserts that race with focus and selection changes. Unlike `input` elements, `contenteditable` has no dedicated “voice mode” flag in web APIs, so frameworks cannot reliably branch on the input source.

## Problem Overview

Editor code frequently assumes:

1. `beforeinput` → DOM change → `input` with a coherent `getTargetRanges()` / selection snapshot.
2. IME paths emit `compositionstart` / `compositionupdate` / `compositionend`.

Voice input regularly violates (1) and (2): transcripts may arrive in one chunk or in word splits, selection may be stale if the user moved focus while recognition was in flight, and some platforms never emit composition events for dictation. That creates duplicate handling, wrong insertion offsets, and divergent undo stacks—similar failure modes to mobile dictation but on desktop and in custom Speech API integrations.

## Observed Behavior

- **Web Speech API**: Final results are delivered asynchronously; if the developer inserts text in a `recognition.onresult` handler, the active range may no longer be inside the intended `contenteditable` (user clicked elsewhere).
- **OS dictation (desktop)**: May insert directly into the focused editable; event patterns differ from the same engine’s behavior on mobile WebKit.
- **No standard detection**: Web pages cannot read native “isDictation” state; heuristics (missing composition, large `data` in one `beforeinput`) are fragile and collide with some IMEs.

```javascript
editable.addEventListener('beforeinput', (e) => {
  // Voice / Speech paths may still use insertText or insertCompositionText
  // but composition events may be absent (platform-dependent).
  console.log(e.inputType, e.data, e.getTargetRanges?.()?.length);
});
```

## Impact

- **State sync**: React/Vue/Svelte models can double-apply or miss chunks when duplicate or batched events occur.
- **Caret and selection**: Inserts land in the wrong paragraph or outside the intended wrapper.
- **Accessibility**: Users who rely on voice control need predictable focus; blur races break that predictability.
- **Undo/redo**: Browser and custom history disagree when insertion is split or replayed.

## Browser Comparison

- **iOS Safari**: Dictation quirks are covered under [scenario-ios-dictation-duplicate-events](scenario-ios-dictation-duplicate-events); composition often absent on iOS.
- **Chrome (desktop)**: Web Speech API is available; integration quality depends entirely on app code and timing.
- **Firefox**: Speech recognition support and OS hooks differ; test before shipping voice features.
- **Safari (macOS)**: OS dictation may still emit composition events, unlike many iOS paths.

## Solutions

1. **Serialize inserts**: Queue transcript segments and apply them inside a single `requestAnimationFrame` or microtask batch while verifying `document.activeElement` and a saved `Range` still belong to your editor root.
2. **Snapshot range on mic start**: When starting recognition, clone `getSelection().getRangeAt(0)` if it is inside the editor; on result, re-validate against `editor.contains(range.startContainer)` before mutating.
3. **Idempotent reconciliation**: After voice-driven updates, diff DOM vs model instead of trusting event counts.
4. **Do not depend on composition for voice**: Treat “large synchronous insert without composition” as a distinct path only if you accept false positives with some IMEs.

## Best Practices

- Treat voice and dictation as **high-latency, selection-sensitive** inputs; never assume the selection at recognition start equals the selection at result delivery.
- Prefer **one editorial root** and explicit `data-editor-root` checks before mutating.
- Cross-test **iOS dictation**, **desktop OS dictation**, and **Web Speech API** separately; they are not interchangeable.

## Related Cases

- [ce-0585-chrome-web-speech-api-contenteditable-insertion](ce-0585-chrome-web-speech-api-contenteditable-insertion) – Async Web Speech API result delivery vs selection focus (Chrome desktop, draft)

## Related Scenarios

- [scenario-ios-dictation-duplicate-events](scenario-ios-dictation-duplicate-events) – iOS-specific duplicate `beforeinput` / `input` after dictation

## References

- [MDN: Web Speech API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API) – Recognition API overview
- [W3C Speech API](https://wicg.github.io/speech-api/) – Draft community specification
- [MDN: InputEvent](https://developer.mozilla.org/en-US/docs/Web/API/InputEvent) – `beforeinput` / `input` semantics
