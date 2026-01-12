---
id: scenario-ime-composition-focus-change
title: IME composition breaks when moving focus to another element
description: When using an IME (Input Method Editor) for Korean, Japanese, or Chinese, moving focus to another textbox during composition causes unexpected behavior. Partially composed characters may persist in the original field or be incorrectly finalized.
category: ime
tags:
  - composition
  - ime
  - focus
  - blur
status: draft
locale: en
---

When composing text with an IME in a `contenteditable` element, moving focus to another textbox during the composition process causes unexpected behavior.

## Problem Description

When a user is composing text using an IME for languages like Korean, Japanese, or Chinese, and the focus is programmatically or manually moved to another editable element (via `blur()` or `focus()`), the following issues occur:

1. **Partial characters persist**: Composing characters that were not yet finalized remain in the original field
2. **Incorrect finalization**: Characters are committed incorrectly or incompletely
3. **Composition continues in wrong context**: The composition process may continue in the newly focused element

## Language-Specific Manifestations

### Korean IME
- When composing "나" (ㅎ + ㄴ), moving focus causes "ㅎ" to persist or "나" to be partially committed
- Sometimes the jamo (consonant/vowel) characters remain instead of the composed syllable

### Japanese IME
- Partial romaji or incomplete kanji conversion may be committed to the original field
- Composition may continue in the new field with incorrect buffer state

### Chinese IME
- Partial Pinyin or incomplete character conversion may be committed
- Composing Pinyin buffer may appear alongside the final Chinese characters

## Root Cause

The IME composition lifecycle is tied to a specific editable element's focus state. When focus is forced to change before the composition naturally completes (via `compositionend`), the IME does not properly clean up its state from the original element.

## Workarounds

1. **Listen to compositionend before changing focus**:
   ```javascript
   let isComposing = false;

   editor.addEventListener('compositionstart', () => {
     isComposing = true;
   });

   editor.addEventListener('compositionend', () => {
     isComposing = false;
     // Now safe to change focus
     nextInput.focus();
   });
   ```

2. **Use setTimeout to allow composition cleanup**:
   ```javascript
   if (isComposing) {
     setTimeout(() => {
       nextInput.focus();
     }, 100);
   }
   ```

3. **Prevent focus change during composition**:
   - Temporarily disable focus-changing controls (like "next field" buttons) during composition
   - Show visual feedback that focus change is not available during IME input

## Observations

- **All browsers**: This issue affects Chrome, Firefox, Safari, and Edge
- **Affected languages**: All CJK languages (Korean, Japanese, Chinese) that use IME composition
- **Not a pure bug**: The behavior is partially expected as IME implementations vary across platforms

## Reference

- Stack Overflow: https://stackoverflow.com/questions/65569739
