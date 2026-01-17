---
id: scenario-ime-korean-crash-firefox
title: Korean IME composition causes editor crash (Firefox)
description: On Firefox with Windows 10 and Korean IME, specific key combination during IME composition causes the editor to crash. The crash occurs when typing certain sequences with the Korean IME.
category: ime
tags:
  - composition
  - ime
  - korean
  - firefox
  - crash
  - windows
status: draft
locale: en
---

On Firefox with Windows 10 and Korean IME, specific key combination sequences during IME composition can cause the contenteditable editor to crash unexpectedly.

## Problem Description

This issue occurs specifically when:
1. User is on Windows 10
2. Using Firefox browser
3. Using Korean IME (e.g., Microsoft IME)
4. Typing specific key sequences during IME composition

### Crash Scenario
Based on the GitHub issue, the crash sequence is:
1. Enable Korean IME
2. Type ㅀ (press 'f', then 'g' on QWERTY keyboard)
3. Hit Enter to confirm composition
4. Press Ctrl+Shift+Home

### Expected Behavior
- Editor should handle the key sequence normally
- No crash should occur
- IME composition should complete or be interrupted gracefully

### Actual Behavior (Firefox Bug)
- **Editor crashes**: The contenteditable editor completely crashes
- JavaScript execution stops
- User must reload the page

## Affected Browsers

- **Firefox** (Windows 10, with Korean IME) - Issue confirmed
- **Chrome** - Does NOT exhibit this crash
- **Safari** - Does NOT exhibit this crash

## Affected Languages

- Korean IME (Microsoft IME on Windows)
- Similar issues may occur with other IMEs

## Root Cause

Firefox's IME handling appears to have a race condition or memory corruption when:
1. Processing specific key sequences (like Ctrl+Shift+Home) during active IME composition
2. The IME state management and editor DOM state get out of sync
3. Internal selection/range calculation crashes when conflicting operations occur

## Workarounds

1. **Prevent Ctrl+Shift+Home during composition**:
   ```javascript
   let isComposing = false;

   editor.addEventListener('compositionstart', () => {
     isComposing = true;
   });

   editor.addEventListener('keydown', (e) => {
     if (isComposing && e.ctrlKey && e.shiftKey && e.key === 'Home') {
       e.preventDefault();
       // Prevent problematic key combination during IME
     }
   });

   editor.addEventListener('compositionend', () => {
     isComposing = false;
   });
   ```

2. **Try-catch around critical operations**:
   ```javascript
   editor.addEventListener('input', (e) => {
     try {
       // Handle input event
     } catch (error) {
       console.error('Input error:', error);
       // Recover gracefully
     }
   });
   ```

3. **Use try-finally for cleanup**:
   ```javascript
   try {
     // IME operations
   } finally {
     // Always cleanup state
   }
   ```

## References

- [Draft.js Issue #2412: Korean IME crash](https://github.com/facebookarchive/draft-js/issues/2412) - Original GitHub issue
- [Stack Overflow: Draft.js not registering IME input](https://stackoverflow.com/questions/65595829/draft-js-not-registering-ime-input) - Related IME issues
- [Firefox Bugzilla #1633399: Draft.js editor crash](https://bugzilla.mozilla.org/show_bug.cgi?id=1633399) - Firefox crash reports
- [Firefox Bugzilla #1739489: macOS Emoji crash](https://bugzilla.mozilla.org/show_bug.cgi?id=1739489) - Related emoji crash
- [Lightrun: Netlify CMS Hangul crash](https://lightrun.com/answers/netlify-netlify-cms-editor-crashes-when-write-in-hangul) - Similar crash reports
