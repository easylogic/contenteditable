---
id: scenario-mac-accent-menu-composition
title: Mac accent menu composition events are inconsistent
description: On macOS, using the accent menu (e.g., holding vowel key to select accented character, or using option+key combinations) does NOT consistently trigger standard IME composition events (`compositionstart`, `compositionupdate`, `compositionend`). This makes it difficult to distinguish accent menu input from IME input or regular keyboard input.
category: ime
tags:
  - composition
  - ime
  - macos
  - accent-menu
  - keyboard
status: draft
locale: en
---

On macOS, when using the built-in accent menu to insert accented characters or special symbols, the standard IME composition events do not fire consistently. This affects Japanese, Chinese, and other language IME detection.

## Problem Description

This issue occurs specifically when:
1. User is on macOS
2. User uses accent menu (hold vowel + accent menu, or option+key combinations)
3. Or user switches IME languages during typing

### Expected Behavior
- Standard composition events should fire: `compositionstart` → `compositionupdate` → `compositionend`
- Should be distinguishable from regular keyboard input
- Consistent behavior regardless of accent menu or full IME

### Actual Behavior (macOS Bug)
- **Inconsistent events**: Sometimes `compositionstart` fires, sometimes it doesn't
- **Missing compositionupdate**: When `compositionstart` fires, `compositionupdate` may not fire at all
- **Missing compositionend**: Sometimes `compositionend` doesn't fire, or fires at unexpected times
- **Hard to distinguish**: Difficult to tell if user is using accent menu or full IME without workarounds

## Affected Browsers

- **Safari** (macOS) - Issue confirmed
- **Chrome** (macOS) - Issue confirmed
- **Firefox** (macOS) - May have similar issues

## Root Cause

macOS treats accent menu input differently from full IME composition:
1. Accent menu is handled at system level (NSResponder)
2. Event propagation to browser layer is inconsistent
3. IME event spec assumes full IME composition, not partial accent selection

## Workarounds

1. **Check inputType instead of relying on composition events**:
   ```javascript
   editor.addEventListener('beforeinput', (e) => {
     // Use inputType to detect what's happening
     if (e.inputType === 'insertCompositionText') {
       // Definitely IME composition
     } else if (e.inputType === 'insertText') {
       // Could be accent menu or regular typing
       // Check length and other indicators
     }
   });
   ```

2. **Track keydown/keyup state as fallback**:
   ```javascript
   let keydownCount = 0;
   let keyupCount = 0;

   editor.addEventListener('keydown', () => {
     keydownCount++;
   });

   editor.addEventListener('keyup', () => {
     keyupCount++;
     // If we have keydown+keyup without composition events, likely accent menu
   });
   ```

3. **Use setTimeout to check for delayed compositionend**:
   ```javascript
   let compositionTimer = null;

   editor.addEventListener('compositionstart', () => {
     clearTimeout(compositionTimer);
   });

   editor.addEventListener('compositionend', () => {
     compositionTimer = setTimeout(() => {
       // Compose ended, do cleanup
     }, 100);
   });
   ```

4. **Detect macOS specifically**:
   ```javascript
   const isMac = navigator.platform.startsWith('Mac');
   const isAccelMenu = (e) => {
     // Check for option key, or vowel key hold
     return e.altKey || isVowelKey(e.key);
   };
   ```

## Reference

- Stack Overflow: https://stackoverflow.com/questions/76820259
