---
id: scenario-webkit-focus-bug
title: WebKit contenteditable Focus Bug
description: "A known bug in WebKit browsers prevents focus from transferring correctly from contenteditable elements to non-editable elements. A workaround involves using a hidden input field to manage focus transitions."
tags:
  - webkit
  - safari
  - chrome
  - focus
  - blur
  - focus-transfer
  - bug
category: focus
status: draft
locale: en
---

## Overview

A known bug in WebKit-based browsers (Safari, Chrome) prevents focus from transferring correctly from `contenteditable` elements to non-editable elements. When attempting to programmatically move focus from a `contenteditable` element to another element, the focus may not transfer properly, causing the `contenteditable` element to continue accepting input.

## Impact

- **Focus Management Failure**: Cannot reliably transfer focus away from contenteditable elements
- **Input Interception**: User input continues to go to contenteditable even after blur
- **UI Confusion**: Users may type in wrong locations
- **Accessibility Issues**: Screen readers and keyboard navigation may malfunction

## Technical Details

The issue occurs when:
1. A `contenteditable` element has focus
2. Code attempts to transfer focus to another element (e.g., a button, input field, or non-editable div)
3. WebKit does not properly release focus from the contenteditable element
4. The contenteditable element continues to accept input even though it should have lost focus

## Browser Comparison

- **Safari (WebKit)**: This issue occurs
- **Chrome (Blink/WebKit-based)**: May have similar issues
- **Firefox (Gecko)**: Not affected
- **Edge (Chromium)**: May have similar issues

## Workarounds

### Hidden Input Field Workaround

```javascript
// Create a hidden input field for focus management
const hiddenInput = document.createElement('input');
hiddenInput.type = 'text';
hiddenInput.style.position = 'absolute';
hiddenInput.style.left = '-9999px';
hiddenInput.style.opacity = '0';
hiddenInput.style.pointerEvents = 'none';
document.body.appendChild(hiddenInput);

function transferFocusFromContentEditable(targetElement) {
  const editor = document.querySelector('[contenteditable]');
  
  // First, blur the contenteditable
  editor.blur();
  
  // Use hidden input as intermediate step
  hiddenInput.focus();
  
  // Then transfer to target
  setTimeout(() => {
    targetElement.focus();
  }, 0);
}
```

### Force Blur with Selection Clear

```javascript
function forceBlurContentEditable(editor) {
  // Clear selection
  const selection = window.getSelection();
  selection.removeAllRanges();
  
  // Blur the element
  editor.blur();
  
  // Force focus on body to ensure contenteditable loses focus
  document.body.focus();
  
  // Then focus target element
  setTimeout(() => {
    targetElement.focus();
  }, 10);
}
```

## Related Cases

- Case IDs will be added as cases are created for specific environment combinations

## References

- [GitHub Gist: WebKit contenteditable focus bug workaround](https://gist.github.com/shimondoodkin/1081133)
- [WebKit Bug 224570: Selection removed when focus changes](https://bugs.webkit.org/show_bug.cgi?id=224570) - Selection ranges are cleared when focus leaves contenteditable
- [Stack Overflow: Force contenteditable div to stop accepting input after blur](https://stackoverflow.com/questions/12353247/force-contenteditable-div-to-stop-accepting-input-after-it-loses-focus-under-web)
- [WebKit Bug 239486: contenteditable with pointer-events: none incorrectly receives focus](https://lists.webkit.org/pipermail/webkit-unassigned/2022-June/1039573.html)
