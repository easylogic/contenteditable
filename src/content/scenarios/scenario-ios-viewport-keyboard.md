---
id: scenario-ios-viewport-keyboard
title: Broken viewport mechanics when software keyboard is visible (iOS Safari)
description: On iOS Safari, when the software keyboard becomes visible, viewport calculations become unreliable. `position:fixed` elements break, `height` returns incorrect values, and absolute positioning with `top`/`bottom` fails. This severely affects editors with floating toolbars or positioned elements.
category: mobile
tags:
  - ios
  - safari
  - keyboard
  - viewport
  - position-fixed
status: draft
locale: en
---

On iOS Safari, when the software keyboard becomes visible, the viewport calculation and mechanics break down, causing CSS positioning and viewport dimension queries to return incorrect or unreliable values.

## Problem Description

This issue occurs when:
1. User is on iPhone or iPad (iOS Safari)
2. Software keyboard becomes visible (user taps on input)
3. Page uses `position:fixed` elements (e.g., floating toolbars)
4. Page relies on viewport dimensions for positioning

### Expected Behavior
- `position:fixed` elements should remain fixed relative to viewport
- `window.innerHeight`, `document.documentElement.clientHeight` should return visible viewport height
- `position:absolute` with `top`/`bottom` should work correctly
- Editors should remain usable while keyboard is visible

### Actual Behavior (iOS Safari Bug)
- **position:fixed breaks**: Fixed elements become positioned incorrectly or disappear
- **Wrong viewport height**: `window.innerHeight` returns wrong value (doesn't account for keyboard)
- **Unreliable absolute positioning**: `position:absolute; top: Ypx` doesn't position correctly
- **Floating UI issues**: Toolbars, dropdowns, or positioned elements break
- **Editor unusable**: User cannot interact with UI elements while keyboard is visible

## Affected Browsers

- **Safari** (iOS 16+, iPhone/iPad) - Issue confirmed
- **Chrome** (iOS) - May have similar but less consistent issues
- **Firefox** (iOS) - May be affected
- **Chrome** (Android) - Does NOT exhibit this behavior

## Root Cause

iOS Safari's viewport management has known issues when:
1. Software keyboard is visible
2. The viewport resizes but doesn't properly update viewport-related CSS values
3. Fixed positioning calculations don't account for keyboard area
4. Viewport dimension queries return pre-keyboard values

The Visual Viewport API and standard CSS positioning fail to work reliably when the keyboard is present.

## Affected Use Cases

- Rich text editors with floating toolbars
- Floating menus or dropdowns in contenteditable areas
- Editors using `position:fixed` for overlay elements
- Any UI that depends on accurate viewport dimensions

## Workarounds

1. **Use Visual Viewport API (limited support)**:
   ```javascript
   if (window.visualViewport) {
     const viewport = window.visualViewport;
     // May provide more accurate dimensions
     console.log('Viewport:', viewport);
   }
   ```

2. **Listen to keyboard visibility changes**:
   ```javascript
   // iOS specific: detect keyboard show/hide
   const initialHeight = window.innerHeight;
   
   window.addEventListener('resize', () => {
     const currentHeight = window.innerHeight;
     
     // If viewport shrinks significantly, keyboard likely visible
     if (currentHeight < initialHeight - 150) {
       console.log('Keyboard is visible');
       // Adjust UI positioning
       updateForKeyboardState(true);
     } else if (currentHeight >= initialHeight - 100) {
       console.log('Keyboard is hidden');
       updateForKeyboardState(false);
     }
   });
   ```

3. **Use position: absolute with viewport units**:
   ```css
   .fixed-element {
     position: absolute;
     bottom: 10vh; /* May work better than fixed */
     /* Or use bottom: env(keyboard-inset-bottom, 0px) */
   }
   ```

4. **Use iOS viewport meta tag** (limited help)**:
   ```html
   <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
   ```

5. **Provide user control for keyboard dismissal**:
   ```javascript
   const editor = document.querySelector('[contenteditable]');
   
   // Add "Done" button
   const doneButton = document.createElement('button');
   doneButton.textContent = 'Done';
   doneButton.onclick = () => {
     editor.blur(); // Hide keyboard
     setTimeout(() => {
       // Restore positioning after keyboard hides
       editor.focus();
     }, 300);
   };
   ```

6. **Use transform instead of position** (may help):
   ```css
   .fixed-element {
     position: fixed;
     transform: translate(0, 0); /* Sometimes works better */
   }
   ```

## References

- [WebKit Bug 191204: Broken viewport mechanics when software keyboard is visible](https://bugs.webkit.org/show_bug.cgi?id=191204) - Reported 2018, Status: NEW (unfixed)
- [WebKit Bug 292603: Safari on iOS adds bottom offset to viewport when keyboard is open](https://bugs.webkit.org/show_bug.cgi?id=292603) - Related viewport offset issue
- [CKEditor Issue 9698: iOS viewport keyboard issues](https://dev.ckeditor.com/ticket/9698) - Editor-specific workarounds
- [Apple Developer Forums: Fixed positioning issues in iOS 26](https://developer.apple.com/forums/thread/800154) - Recent reports of persistent issues
- [IIFX: Debugging iOS 26 fixed positioning post-keyboard](https://iifx.dev/en/articles/460201403/debugging-ios-26-how-to-correct-fixed-positioning-post-keyboard-interaction) - Workarounds and solutions
