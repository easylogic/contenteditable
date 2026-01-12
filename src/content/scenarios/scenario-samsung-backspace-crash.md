---
id: scenario-samsung-backspace-crash
title: Backspace with Samsung Keyboard causes editor crash
description: On Android with Samsung Keyboard, holding the backspace key to delete text causes the contenteditable editor to crash completely. JavaScript execution stops and page becomes unresponsive.
category: mobile
tags:
  - backspace
  - crash
  - android
  - samsung
  - samsung-keyboard
status: draft
locale: en
---

On Android with Samsung Keyboard, holding the backspace key to delete text causes the contenteditable editor to crash completely.

## Problem Description

This issue occurs specifically when:
1. User is on Android device
2. User is using Samsung Keyboard (system default or Samsung input app)
3. User has typed text in a contenteditable editor
4. User holds the backspace key to delete multiple characters

### Expected Behavior
- Characters should be deleted one by one as backspace is held
- Editor should continue functioning normally
- No crash should occur

### Actual Behavior (Samsung Keyboard Bug)
- **Editor crashes**: Contenteditable editor completely crashes
- **JavaScript execution stops**: All script execution halts
- **Page unresponsive**: Browser becomes unresponsive
- **Requires page reload**: User must reload the page to continue

## Affected Browsers

- **Chrome for Android** (with Samsung Keyboard) - Issue confirmed
- **Samsung Internet Browser** - Likely affected (Chromium-based)
- **Firefox for Android** - May not be affected
- **Other keyboards** - Gboard, SwiftKey, etc. do NOT exhibit this crash

## Affected Devices

- **Samsung Galaxy** devices (S9, S10, Note series, etc.)
- **Other Android devices** with Samsung Keyboard installed

## Root Cause

Samsung Keyboard's backspace handling appears to have a race condition or memory corruption when:
1. Multiple backspace events are fired rapidly (holding key)
2. The editor's DOM manipulation doesn't keep up
3. Internal state becomes inconsistent
4. JavaScript engine crashes due to invalid state

## Workarounds

1. **Rate-limit backspace events**:
   ```javascript
   let lastBackspaceTime = 0;
   const BACKSPACE_DELAY = 50; // 50ms between events
   
   editor.addEventListener('keydown', (e) => {
     if (e.key === 'Backspace') {
       const now = Date.now();
       if (now - lastBackspaceTime < BACKSPACE_DELAY) {
         e.preventDefault();
         console.warn('Backspace rate limited');
         return;
       }
       lastBackspaceTime = now;
     }
   });
   ```

2. **Use try-catch around DOM operations**:
   ```javascript
   editor.addEventListener('input', (e) => {
     try {
       // Handle input
     } catch (error) {
       console.error('Input error:', error);
       // Recover gracefully
     }
   });
   ```

3. **Debouce backspace handling**:
   ```javascript
   let backspaceTimeout = null;
   
   editor.addEventListener('keydown', (e) => {
     if (e.key === 'Backspace') {
       clearTimeout(backspaceTimeout);
       backspaceTimeout = setTimeout(() => {
         // Handle backspace with delay
         performBackspace();
       }, 10); // 10ms debounce
     }
   });
   ```

4. **Provide user education**:
   - Add UI hint that Samsung Keyboard may cause issues
   - Recommend using alternative keyboards (Gboard, SwiftKey)
   - Warn about holding backspace key

5. **Use MutationObserver for DOM changes**:
   ```javascript
   const observer = new MutationObserver((mutations) => {
     try {
       // Validate DOM changes
     } catch (error) {
       console.error('Mutation error:', error);
     }
   });
   
   observer.observe(editor, {
     childList: true,
     subtree: true,
     characterData: true
   });
   ```

## Reference

- GitHub Issue: https://github.com/facebookarchive/draft-js/issues/2815
