---
id: scenario-caret-invisible-relative
title: Text caret is invisible on position:relative elements
description: When editing content inside an element with `position:relative`, the text caret (cursor) is completely invisible. Text can be typed and appears in the editor, but there's no visual feedback of where the insertion point is located.
category: selection
tags:
  - caret
  - cursor
  - css
  - position-relative
  - webkit
  - safari
  - chrome
  - firefox
status: draft
locale: en
---

When editing content inside an element that has `position:relative` CSS property, the text caret (cursor) is invisible and provides no visual feedback of the insertion point.

## Problem Description

This issue occurs when:
1. A contenteditable element is nested inside or has `position:relative` styling
2. User focuses on the editable area
3. No text caret is visible

### Expected Behavior
- Text caret should be visible at the insertion point
- User should see blinking line or other caret indicator
- Typing should provide clear visual feedback

### Actual Behavior (WebKit Bug)
- **No visible caret**: Caret is completely invisible
- **Text appears**: Typed text appears in the editor
- **No visual feedback**: User cannot see where next character will be inserted
- **Editing is difficult**: User has to guess where typing will occur

## Affected Browsers

- **Safari** (15.1, 15.5, 17+) on macOS - Issue confirmed
- **Safari** (iOS) - Issue confirmed
- **Chrome** (on macOS) - Issue confirmed
- **Firefox** (95+) on macOS - Issue confirmed

## Root Cause

WebKit's text caret rendering fails when:
1. The element or its ancestor has `position:relative`
2. Contenteditable is nested inside such element
3. The caret calculation and rendering doesn't account for relative positioning

The `position:relative` property creates a new positioning context that breaks the caret rendering algorithm in WebKit-based browsers.

## Workarounds

1. **Remove position:relative**:
   ```css
   .editable-container {
     position: static; /* or remove position property */
   }
   ```

2. **Use position:static instead**:
   ```css
   .editable-container {
     position: static;
   }
   ```

3. **Move position:relative to ancestor element**:
   ```css
   /* Make wrapper relative, keep editable static */
   .wrapper {
     position: relative;
   }
   .editable {
     position: static;
   }
   ```

4. **Use caret-color property** (may help but not complete fix):
   ```css
   [contenteditable] {
     caret-color: black; /* May work in some browsers */
   }
   ```

5. **Provide custom caret element**:
   ```javascript
   // Create custom caret indicator
   const caret = document.createElement('span');
   caret.className = 'custom-caret';
   caret.style.cssText = `
     position: absolute;
     width: 2px;
     height: 20px;
     background: black;
     animation: blink 1s infinite;
   `;
   ```

## References

- [WebKit Bug 213501: Text caret is invisible on position relative elements](https://bugs.webkit.org/show_bug.cgi?id=213501) - Reported June 22, 2020, Status: NEW
- [Stack Overflow: Why is the caret invisible in a contenteditable with position:relative?](https://stackoverflow.com/questions/70565449/why-is-the-caret-invisible-in-a-contenteditable-with-positionrelative) - Discussion and workarounds
