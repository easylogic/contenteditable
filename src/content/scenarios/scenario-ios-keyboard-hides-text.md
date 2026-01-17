---
id: scenario-ios-keyboard-hides-text
title: iPhone keyboard hides text when entering on contenteditable
description: On iPhone/iPad Safari, when entering text or pressing "return" multiple times in a contenteditable element, the software keyboard appears but hides the text being typed. The page doesn't auto-scroll to keep text visible. Works fine on Android and other browsers.
category: mobile
tags:
  - ios
  - safari
  - keyboard
  - mobile
  - auto-scroll
status: draft
locale: en
---

On iPhone/iPad Safari, when entering text or pressing "return" multiple times in a contenteditable element, the software keyboard appears but hides the text being typed. The page doesn't automatically scroll to keep the text insertion point visible.

## Problem Description

This issue occurs when:
1. User is on iPhone or iPad (iOS Safari)
2. User is typing in a contenteditable element
3. User presses "return" key multiple times to create multiple lines

### Expected Behavior
- Keyboard should appear
- Text insertion point should remain visible (not hidden by keyboard)
- Page should auto-scroll to keep insertion point in view
- User should see text being typed

### Actual Behavior (iOS Safari Bug)
- **Keyboard hides text**: Software keyboard appears but covers the insertion point
- **No auto-scroll**: Page doesn't scroll automatically to keep text visible
- **Text is invisible**: User is typing blindly without seeing what's being entered
- **Works on Android**: This issue does NOT occur on Android

## Affected Browsers

- **Safari** (iOS, iPhone/iPad) - Issue confirmed
- **Chrome for Android** - Does NOT exhibit this behavior
- **Firefox for Android** - Does NOT exhibit this behavior
- **Desktop browsers** - Does NOT exhibit this behavior

## Root Cause

iOS Safari's viewport and keyboard handling fails to:
1. Detect when keyboard becomes visible
2. Auto-scroll the page to keep insertion point visible
3. Calculate proper viewport height adjustment
4. Keep text insertion point above the keyboard

## Workarounds

1. **Manually scroll to cursor on input**:
   ```javascript
   editor.addEventListener('input', (e) => {
     setTimeout(() => {
       const selection = window.getSelection();
       if (selection.rangeCount > 0) {
         const range = selection.getRangeAt(0);
         const rect = range.getBoundingClientRect();
         
         // Scroll to keep caret visible
         window.scrollTo({
           top: rect.top + window.scrollY - 200, // 200px buffer
           behavior: 'smooth'
         });
       }
     }, 100);
   });
   ```

2. **Use resize observer on focus**:
   ```javascript
   editor.addEventListener('focus', () => {
     setTimeout(() => {
       const selection = window.getSelection();
       if (selection.rangeCount > 0) {
         const range = selection.getRangeAt(0);
         const rect = range.getBoundingClientRect();
         
         // Ensure caret is visible
         window.scrollTo({
           top: rect.top + window.scrollY - 200,
           behavior: 'smooth'
         });
       }
     }, 300);
   });
   ```

3. **Set CSS viewport height**:
   ```css
   /* May help with some iOS versions */
   html, body {
     height: 100vh;
     overflow: auto;
   }
   ```

4. **Provide visual feedback**: Show custom caret or typing indicator
   ```javascript
   // Create visual feedback since text might be hidden
   const caret = document.createElement('span');
   caret.className = 'ios-caret-indicator';
   caret.style.cssText = `
     position: absolute;
     width: 2px;
     height: 20px;
     background: rgba(0, 120, 255, 0.5);
     pointer-events: none;
   `;
   ```

## References

- [Stack Overflow: iOS Safari keyboard hides text](https://stackoverflow.com/questions/41087416) - Discussion and solutions
- [WebKit Bug 191204: Broken viewport mechanics when software keyboard is visible](https://bugs.webkit.org/show_bug.cgi?id=191204) - Related viewport issue
- [Bram.us: Prevent items from being hidden underneath virtual keyboard](https://www.bram.us/2021/09/13/prevent-items-from-being-hidden-underneath-the-virtual-keyboard-by-means-of-the-virtualkeyboard-api/) - Visual Viewport API guide
- [Stack Overflow: iOS Safari unwanted scroll when keyboard opens](https://stackoverflow.com/questions/56351216/ios-safari-unwanted-scroll-when-keyboard-is-opened-and-body-scroll-is-disabled) - Scroll behavior issues
- [Stack Overflow: Automatic scrolling in contenteditable](https://stackoverflow.com/questions/8523232/automatic-scrolling-when-contenteditable-designmode-in-a-uiwebview) - Auto-scroll solutions
