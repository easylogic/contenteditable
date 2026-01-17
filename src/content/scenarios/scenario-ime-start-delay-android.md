---
id: scenario-ime-start-delay-android
title: Selecting all text and typing doesn't start IME until second letter (Android)
description: On Android virtual keyboards, after selecting all text in a contenteditable element (Ctrl+A), typing a letter to start IME composition does not trigger IME until the second letter is typed. The first letter is inserted as plain text, and only from the second letter does IME composition begin.
category: ime
tags:
  - ime
  - composition
  - android
  - mobile
  - selection
status: draft
locale: en
---

When using an Android virtual keyboard with IME (Input Method Editor) for languages like Korean, Japanese, or Chinese, after selecting all text in a contenteditable element, typing a letter does not immediately start IME composition. The first letter is inserted as plain text, and IME composition only starts from the second letter.

## Problem Description

This issue occurs specifically when:
1. User has typed some text in a contenteditable element
2. User presses Ctrl+A (or equivalent) to select all text
3. User types a letter (e.g., "가" for Korean, "あ" for Japanese)
4. On Android virtual keyboard with IME

### Expected Behavior
- IME composition should start immediately when first letter is typed
- The entire selection should be replaced with IME composition

### Actual Behavior (Android Bug)
- **First letter**: Inserted as plain text (not part of IME composition)
- **Selection remains**: The "Select All" selection stays visible
- **IME starts delayed**: IME composition (candidate window) only appears after typing second letter
- Result: First letter appears as plain text, then IME composition replaces from second letter

## Affected Browsers

- **Chrome for Android** - Issue confirmed
- **Samsung Internet Browser** - Likely affected (Chromium-based)
- **Firefox for Android** - May be affected

## Affected Languages

- All IME languages (Korean, Japanese, Chinese, Thai, Vietnamese, etc.)
- Particularly affects languages that use virtual keyboard with composition candidates

## Root Cause

Android's IME implementation appears to have a race condition or incorrect state management when:
1. There's an existing selection (Ctrl+A)
2. User starts typing (first letter)
3. IME framework doesn't properly clear the selection or recognize it should be replaced by composition

## Workarounds

1. **Clear selection before typing**:
   ```javascript
   editor.addEventListener('keydown', (e) => {
     const selection = window.getSelection();
     if (selection.rangeCount > 0 && !selection.isCollapsed) {
       selection.removeAllRanges();
     }
   });
   ```

2. **Detect and handle first letter separately**:
   ```javascript
   let imeStarted = false;

   editor.addEventListener('keydown', (e) => {
     if (!imeStarted && e.key.length === 1) {
       // First character typed, IME may not start
       // Check next event to see if composition starts
     }
   });

   editor.addEventListener('compositionstart', () => {
     imeStarted = true;
     // IME has started, handle normally
   });
   ```

3. **Use beforeinput event**:
   ```javascript
   editor.addEventListener('beforeinput', (e) => {
     if (e.inputType === 'insertText' && isAndroid && wasSelectAll) {
       // Plain text inserted instead of composition
       // May need to delete and let IME start fresh
     }
   });
   ```

4. **User education**: Add UI hint to clear selection before starting new IME input:
   - Show message: "Type a letter to start IME"
   - Or automatically clear selection when user starts typing

## References

- [Quill Issue #4748: IME start delay after select all](https://github.com/slab/quill/issues/4748) - GitHub issue report
- [Android Developer: InputConnection API](https://developer.android.com/reference/android/view/inputmethod/InputConnection) - IME composition API documentation
- [Stack Overflow: EditText select all and type first letter not displayed](https://stackoverflow.com/questions/47173464/edittext-text-select-all-and-then-type-first-letter-will-not-displayed) - Related Android EditText issue
- [Stack Overflow: When first letter isn't accepted by InputFilter](https://stackoverflow.com/questions/59619717/when-the-first-letter-isnt-accepted-by-an-input-filter-no-entry-will-be-accept) - InputFilter issues
