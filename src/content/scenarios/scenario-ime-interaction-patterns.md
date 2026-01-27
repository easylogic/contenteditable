---
id: scenario-ime-interaction-patterns
title: "IME Interaction Patterns: Keys, Events, and Edge Cases"
description: "Technical analysis of how IMEs handle Enter, Backspace, Escape, and programmatic actions during active composition."
category: "interaction"
tags: ["ime", "composition", "keys", "events", "behavior", "autocorrect", "autocapitalize", "input-events"]
status: "confirmed"
locale: "en"
---

## Overview
Unlike standard keyboard input, IME (Input Method Editor) sessions intercept and buffer keystrokes. This document outlines the patterns for handling functional keys, input events, and programmatic actions while a composition is active.

## Key Handling Patterns

### 1. The 'Enter' Dilemma
- **Blink/WebKit**: 'Enter' usually commits the composition and simultaneously triggers a `beforeinput` with `inputType: "insertParagraph"`. This often results in a "Double Break" if not handled correctly.
- **Gecko**: 'Enter' often only commits, requiring a second press to insert a newline.

### 2. Backspace & Syllable Granularity
In languages like Korean (Hangul), a single Backspace may delete a vowel/consonant (de-composition) rather than the entire character.
- **Bug**: Some browsers fail to signal `beforeinput` during de-composition, making it impossible for frameworks to track character-level changes.

### 3. iOS/macOS Auto-Input Behaviors
Attributes like `autocorrect`, `autocapitalize`, and `autocomplete` interact with the IME buffer.
- **Autocorrect Conflict**: On iOS, the predictive bar can suddenly replace a composing word, triggering a `compositionend` with a different value than the last `compositionupdate`. [WebKit Bug 265856](https://lists.webkit.org/pipermail/webkit-unassigned/2023-December/1136334.html)
- **Autocapitalize**: Inconsistently supported on `contenteditable`. It can trigger an unexpected `textInput` event at the start of a sentence which might prematurely flush a CJK buffer. [WebKit Bug 148503](https://bugs.webkit.org/show_bug.cgi?id=148503)

## Input Event Anomalies

### Missing 'input' Events (Chrome 121 Regression)
When typing at `offset 0` of a text node or block, Chrome 121 may correctly fire `beforeinput` but fail to dispatch the final `input` event after the DOM is modified.
- **Mitigation**: Use a short safety timeout after `beforeinput` to check for missing `input` dispatches, or rely on `MutationObserver` as a fallback.

### Duplicate 'input' Events (Edge)
In legacy Edge (or specific Windows configurations), the `input` event may fire twice for a single physical keystroke, potentially causing duplicate UI updates or performance hits.

## Handling Programmatic Actions

### Undo/Redo during Composition
Attempting to trigger `document.execCommand('undo')` while `isComposing` is true results in **Immediate Buffer Corruption** in Safari. The browser loses track of the shadow-text.

### Emoji Insertion vs. Composition (2026 Update)
On Android Chrome 131+, switching to the Emoji keyboard mid-composition often cancels the session without committing the buffered character, leading to **Data Loss**. [Chromium Issue #381254331](https://issues.chromium.org/issues/381254331)

## Solution: Interaction Guardians
Implement a state-locked event interceptor.

```javascript
/* Safety Timer for Missing Inputs */
let inputTimer = null;
element.addEventListener('beforeinput', (e) => {
  if (inputTimer) clearTimeout(inputTimer);
  inputTimer = setTimeout(() => {
    // If 'input' didn't fire, manually sync model
  }, 50);
});
element.addEventListener('input', () => {
  clearTimeout(inputTimer);
});
```

## Related Cases
- [ce-0565: Chrome 121 missing input at offset 0](file:///Users/user/github/barocss/contenteditable/src/content/cases/ce-0565-chrome-121-oninput-offset-0.md)
- [ce-0581: Android emoji composition corruption](file:///Users/user/github/barocss/contenteditable/src/content/cases/ce-0581-android-emoji-composition-corruption.md)
- [ce-0071: contenteditable with autocorrect](file:///Users/user/github/barocss/contenteditable/src/content/cases/ce-0071-contenteditable-with-autocorrect.md)
- [ce-0042: input events duplicate](file:///Users/user/github/barocss/contenteditable/src/content/cases/ce-0042-input-events-duplicate.md)
