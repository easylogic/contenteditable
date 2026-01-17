---
id: scenario-caret-jump-chrome-mobile
title: Typing certain characters makes cursor jump on Chrome Mobile
description: On Chrome Mobile for Android, typing certain punctuation characters (commas, colons, semicolons, quotes, etc.) in the middle of a word causes the cursor to jump to the end of the word instead of staying at the insertion point.
category: selection
tags:
  - caret
  - cursor
  - chrome
  - mobile
  - android
  - punctuation
status: draft
locale: en
---

On Chrome Mobile for Android, typing certain punctuation characters in the middle of a word causes the cursor to unexpectedly jump to the end of the word instead of staying at the insertion point.

## Problem Description

This issue occurs when:
1. User is on Chrome Mobile for Android
2. User has typed a word (e.g., "California")
3. User inserts specific punctuation characters in the middle of the word

### Characters that trigger the jump
`, : ; ! ? " ' & +() {} [] \ | =` and similar punctuation

### Expected Behavior
- Cursor should stay at the insertion point (where the punctuation was typed)
- User should be able to continue typing from that position

### Actual Behavior (Chrome Mobile Bug)
- **Cursor jumps to end**: Cursor moves to the end of the entire word
- **Must manually reposition**: User has to tap to correct position to continue typing
- **Makes editing impossible**: Continuous editing with these characters becomes very difficult

## Affected Browsers

- **Chrome for Android** - Issue confirmed
- **Desktop Chrome** - Does NOT exhibit this behavior
- **Firefox Mobile** - Does NOT exhibit this behavior
- **Safari (iOS)** - Does NOT exhibit this behavior

## Root Cause

Chrome Mobile's caret positioning algorithm appears to have a bug when:
1. Processing specific punctuation characters
2. Calculating insertion point in middle of existing text
3. The calculation fails and places cursor at end of word instead of insertion point

## Workarounds

1. **Use setTimeout before continuing typing**:
   ```javascript
   editor.addEventListener('input', (e) => {
     const selection = window.getSelection();
     const range = selection.getRangeAt(0);
     
     // Store insertion position
     const insertionPoint = {
       node: range.startContainer,
       offset: range.startOffset
     };
     
     setTimeout(() => {
       // Try to restore position
       const newRange = document.createRange();
       newRange.setStart(insertionPoint.node, insertionPoint.offset);
       newRange.collapse(true);
       selection.removeAllRanges();
       selection.addRange(newRange);
     }, 0);
   });
   ```

2. **Use beforeinput event to detect jump**:
   ```javascript
   let lastCaretPosition = null;

   editor.addEventListener('beforeinput', (e) => {
     const selection = window.getSelection();
     if (selection.rangeCount > 0) {
       lastCaretPosition = {
         node: selection.getRangeAt(0).startContainer,
         offset: selection.getRangeAt(0).startOffset
       };
     }
   });

   editor.addEventListener('input', (e) => {
     const selection = window.getSelection();
     if (selection.rangeCount > 0 && lastCaretPosition) {
       const currentOffset = selection.getRangeAt(0).startOffset;
       const distance = Math.abs(currentOffset - lastCaretPosition.offset);
       
       // If cursor jumped significantly
       if (distance > 2) {
         console.warn('Cursor jump detected');
         // Restore position
         const range = document.createRange();
         range.setStart(lastCaretPosition.node, lastCaretPosition.offset);
         range.collapse(true);
         selection.removeAllRanges();
         selection.addRange(range);
       }
     }
   });
   ```

3. **User education**: Add UI hint that these characters may cause issues on mobile Chrome

4. **Use desktop browser**: Recommend users use desktop browsers for editing when possible

## References

- [ProseMirror Issue #1141: Caret jump on Chrome Mobile](https://github.com/ProseMirror/prosemirror/issues/1141) - GitHub issue report
- [Stack Overflow: Fix cursor jumping in inline contenteditable on Android Chrome](https://stackoverflow.com/questions/68187400/how-to-fix-cursor-jumping-in-inline-contenteditable-on-android-chrome) - Inline element caret issues
- [Stack Overflow: Why is contenteditable caret jumping to the end in Chrome](https://stackoverflow.com/questions/27786048/why-is-my-contenteditable-caret-jumping-to-the-end-in-chrome) - Related caret jump issues
- [Stack Overflow: Cursor in wrong place in contenteditable](https://stackoverflow.com/questions/18985261/cursor-in-wrong-place-in-contenteditable) - Caret positioning problems
- [ProseMirror Discuss: Samsung keyboard causes spam of new lines](https://discuss.prosemirror.net/t/samsung-keyboard-within-android-webview-causes-a-spam-of-new-lines/5246) - Keyboard-specific issues
