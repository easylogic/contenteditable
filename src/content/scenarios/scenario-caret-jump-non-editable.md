---
id: scenario-caret-jump-non-editable
title: Caret jumps to end when deleting character next to non-editable element
description: When deleting the last character before a non-editable "pill" or tag element (contenteditable="false") in a contenteditable div in Chrome, the caret (cursor) jumps to the end of the entire contenteditable div instead of staying adjacent to the remaining content.
category: selection
tags:
  - caret
  - cursor
  - non-editable
  - chrome
  - delete
status: draft
locale: en
---

When deleting characters adjacent to non-editable elements (e.g., tags, pills with `contenteditable="false"`) in a contenteditable div, the caret unexpectedly jumps to the end of the entire editor in Chrome.

## Problem Description

This issue occurs when:
1. A contenteditable div contains non-editable elements (e.g., `<span contenteditable="false">`)
2. User types text before the non-editable element
3. User deletes the last character before the non-editable element

### Expected Behavior
- Caret should remain adjacent to the non-editable element
- User should be able to continue typing immediately after deletion

### Actual Behavior (Chrome Bug)
- **Caret jumps to end**: Caret moves to the end of the entire contenteditable div
- **User must click**: User has to manually click back to correct position to continue typing
- **Poor UX**: Makes continuous typing impossible after deletion near non-editable elements

## Affected Browsers

- **Chrome** (all versions) - Issue confirmed
- **Firefox** - Does NOT exhibit this behavior (works correctly)
- **Safari** - May have similar issues but less consistent

## Root Cause

Chrome's caret positioning algorithm appears to incorrectly calculate where the caret should go when:
1. A non-editable element (`contenteditable="false"`) is in the DOM
2. Text before the non-editable element is deleted
3. Chrome recalculates caret position and mistakenly places it at the end instead of adjacent to the remaining non-editable element

## Workarounds

1. **Set display: inline-block on contenteditable**:
   ```css
   .contenteditable {
     display: inline-block;
   }
   ```

2. **Add zero-width space after non-editable elements**:
   ```javascript
   // Insert ZWSP after non-editable element
   const zwsp = document.createTextNode('\u200B');
   nonEditableElement.parentNode.insertBefore(zwsp, nonEditableElement.nextSibling);
   ```

3. **Use empty span as placeholder**:
   ```javascript
   // Add empty span after non-editable element
   const placeholder = document.createElement('span');
   placeholder.innerHTML = '&nbsp;';
   nonEditableElement.parentNode.insertBefore(placeholder, nonEditableElement.nextSibling);
   ```

4. **Wrap editable content in separate div**:
   ```html
   <div contenteditable="false">
     <div contenteditable="true">editable content</div>
   </div>
   ```

5. **Programmatically restore caret position after deletion**:
   ```javascript
   editor.addEventListener('input', (e) => {
     const selection = window.getSelection();
     // Check if caret jumped
     if (caretJumped) {
       // Restore position
       const range = document.createRange();
       range.setStartBefore(nonEditableElement);
       range.collapse(true);
       selection.removeAllRanges();
       selection.addRange(range);
     }
   });
   ```

## References

- [Stack Overflow: Why is my contenteditable caret jumping to the end in Chrome?](https://stackoverflow.com/questions/27786048/why-is-my-contenteditable-caret-jumping-to-the-end-in-chrome) - Detailed discussion
- [Stack Overflow: Cursor in wrong place in contenteditable](https://stackoverflow.com/questions/18985261/cursor-in-wrong-place-in-contenteditable) - Related issue
- [CKEditor Issue 11923: Caret is rendered at wrong location when editable region ends with a non-editable region](https://dev.ckeditor.com/ticket/11923) - Blink/Safari caret positioning bug
- [Chromium Issue 71598: Caret in wrong position after non-editable element at the end of contentEditable](https://stackoverflow.com/questions/27786048/why-is-my-contenteditable-caret-jumping-to-the-end-in-chrome) - Referenced in discussions
- [Chromium Issue 107366: Unable to delete the first and the last characters of a contenteditable div with display: table](https://groups.google.com/a/chromium.org/g/chromium-bugs/c/JYakmPtVCeM/m/TcnaPcXe2fYJ) - Related display:table issue
- [ProseMirror Discuss: Chrome caret cursor larger than the text with inlined items](https://discuss.prosemirror.net/t/chrome-caret-cursor-larger-than-the-text-with-inlined-items/5946) - Related widget/caret issues
