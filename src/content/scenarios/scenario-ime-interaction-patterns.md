---
id: scenario-ime-interaction-patterns
title: "IME Interaction Patterns: Keys, Events, and Edge Cases"
description: "Technical analysis of how IMEs handle Enter, Backspace, Escape, and programmatic actions during active composition."
category: "interaction"
tags: ["ime", "composition", "keys", "events", "behavior"]
status: "confirmed"
locale: "en"
---

## Overview
Unlike standard keyboard input, IME (Input Method Editor) sessions intercept and buffer keystrokes. This document outlines the patterns for handling functional keys and programmatic actions while a composition is active.

## Key Handling Patterns

### 1. The 'Enter' Dilemma
- **Blink/WebKit**: 'Enter' usually commits the composition and simultaneously triggers a `beforeinput` with `inputType: "insertParagraph"`. This often results in a "Double Break" if not handled correctly.
- **Gecko**: 'Enter' often only commits, requiring a second press to insert a newline.

### 2. Backspace & Syllable Granularity
In languages like Korean (Hangul), a single Backspace may delete a vowel/consonant (de-composition) rather than the entire character.
- **Bug**: Some browsers fail to signal `beforeinput` during de-composition, making it impossible for frameworks to track character-level changes.

### 3. KeyCode 229 (The 'Composing' Signal)
During composition, almost all physical keys report `keyCode: 229`. 
- **Pattern**: Never rely on `keydown` for logic during composition. Use `beforeinput` or `compositionupdate`.

## Handling Programmatic Actions

### Undo/Redo during Composition
Attempting to trigger `document.execCommand('undo')` while `isComposing` is true results in **Immediate Buffer Corruption** in Safari. The browser loses track of the shadow-text and may leave "ghost" characters in the DOM.

### Focus & Blur Transitions
- **The 'Focus Loss' Trap**: Blurring an element during composition usually forces a "Commit." However, some Android IMEs simply cancel the session, losing the user's progress.

## Solution: Interaction Guardians
Implement a state-locked event interceptor.

```javascript
element.addEventListener('keydown', (e) => {
  if (e.target.isComposing) {
    if (e.key === 'Enter' || e.key === 'Backspace') {
       // Logic to prevent double-processing
    }
  }
});
```

## Related Cases
- [ce-0577: Android first word duplication](file:///Users/user/github/barocss/contenteditable/src/content/cases/ce-0577-android-first-word-duplication.md)
- [ce-0181: Japanese IME Enter breaks in Chrome](file:///Users/user/github/barocss/contenteditable/src/content/cases/ce-0181-japanese-ime-enter-breaks-chrome.md)
---
id: scenario-ime-interaction-patterns
title: "IME Interaction Patterns: Keys, Events, and Edge Cases"
description: "Technical analysis of how IMEs handle Enter, Backspace, Escape, and programmatic actions during active composition."
category: "interaction"
tags: ["ime", "composition", "keys", "events", "behavior"]
status: "confirmed"
locale: "en"
---

## Overview
Unlike standard keyboard input, IME (Input Method Editor) sessions intercept and buffer keystrokes. This document outlines the patterns for handling functional keys and programmatic actions while a composition is active.

## Key Handling Patterns

### 1. The 'Enter' Dilemma
- **Blink/WebKit**: 'Enter' usually commits the composition and simultaneously triggers a `beforeinput` with `inputType: "insertParagraph"`. This often results in a "Double Break" if not handled correctly.
- **Gecko**: 'Enter' often only commits, requiring a second press to insert a newline.

### 2. Backspace & Syllable Granularity
In languages like Korean (Hangul), a single Backspace may delete a vowel/consonant (de-composition) rather than the entire character.
- **Bug**: Some browsers fail to signal `beforeinput` during de-composition, making it impossible for frameworks to track character-level changes.

### 3. KeyCode 229 (The 'Composing' Signal)
During composition, almost all physical keys report `keyCode: 229`. 
- **Pattern**: Never rely on `keydown` for logic during composition. Use `beforeinput` or `compositionupdate`.

## Handling Programmatic Actions

### Undo/Redo during Composition
Attempting to trigger `document.execCommand('undo')` while `isComposing` is true results in **Immediate Buffer Corruption** in Safari. The browser loses track of the shadow-text and may leave "ghost" characters in the DOM.

### Focus & Blur Transitions
- **The 'Focus Loss' Trap**: Blurring an element during composition usually forces a "Commit." However, some Android IMEs simply cancel the session, losing the user's progress.

## Solution: Interaction Guardians
Implement a state-locked event interceptor.

```javascript
element.addEventListener('keydown', (e) => {
  if (e.target.isComposing) {
    if (e.key === 'Enter' || e.key === 'Backspace') {
       // Logic to prevent double-processing
    }
  }
});
```

## Related Cases
- [ce-0577: Android first word duplication](file:///Users/user/github/barocss/contenteditable/src/content/cases/ce-0577-android-first-word-duplication.md)
- [ce-0181: Japanese IME Enter breaks in Chrome](file:///Users/user/github/barocss/contenteditable/src/content/cases/ce-0181-japanese-ime-enter-breaks-chrome.md)
