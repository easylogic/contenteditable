---
id: scenario-chrome-android-focus-blur-input
title: Input Events Fire on Focus/Blur in Chrome Android
description: "In Chrome on Android, input events may fire when a contenteditable element gains or loses focus, even without content changes. This behavior can lead to unintended side effects in applications relying on input events for content modification detection."
tags:
  - chrome
  - android
  - mobile
  - focus
  - blur
  - input-event
  - false-positive
category: mobile
status: draft
locale: en
---

## Overview

In Chrome on Android, `input` events may fire when a `contenteditable` element gains or loses focus, even without any actual content changes. This behavior can lead to unintended side effects in applications that rely on `input` events to detect content modifications.

## Impact

- **False Positive Events**: Input events fire without actual content changes
- **Unintended Side Effects**: Applications may trigger save operations, validation, or other actions unnecessarily
- **Performance Issues**: Unnecessary processing triggered by false input events
- **User Experience**: Applications may behave unexpectedly

## Technical Details

The issue occurs when:
1. A `contenteditable` element gains focus (user taps on it)
2. An `input` event fires even though no content was changed
3. Similarly, when the element loses focus, an `input` event may fire
4. Applications listening to `input` events may trigger unnecessary actions

## Browser Comparison

- **Chrome Android**: This issue occurs
- **Chrome Desktop**: Not affected
- **Firefox Android**: Not affected
- **Safari iOS**: Not affected

## Workarounds

### Filter False Input Events

```javascript
const editor = document.querySelector('[contenteditable]');
let lastContent = editor.innerHTML;
let isFocusing = false;
let isBlurring = false;

editor.addEventListener('focus', () => {
  isFocusing = true;
  lastContent = editor.innerHTML;
  
  // Reset flag after a short delay
  setTimeout(() => {
    isFocusing = false;
  }, 100);
});

editor.addEventListener('blur', () => {
  isBlurring = true;
  
  // Reset flag after a short delay
  setTimeout(() => {
    isBlurring = false;
  }, 100);
});

editor.addEventListener('input', (e) => {
  // Ignore input events during focus/blur
  if (isFocusing || isBlurring) {
    return;
  }
  
  // Check if content actually changed
  const currentContent = editor.innerHTML;
  if (currentContent === lastContent) {
    // Content didn't change, ignore this event
    return;
  }
  
  // Content actually changed, process the event
  lastContent = currentContent;
  handleContentChange(currentContent);
});
```

### Use MutationObserver Instead

```javascript
const editor = document.querySelector('[contenteditable]');
let isUserInput = false;

// Track user input
editor.addEventListener('beforeinput', () => {
  isUserInput = true;
});

editor.addEventListener('input', () => {
  isUserInput = false;
});

// Use MutationObserver to detect actual DOM changes
const observer = new MutationObserver((mutations) => {
  // Only process if it was user input
  if (isUserInput) {
    handleContentChange(editor.innerHTML);
  }
});

observer.observe(editor, {
  childList: true,
  subtree: true,
  characterData: true
});
```

### Debounce Input Events

```javascript
const editor = document.querySelector('[contenteditable]');
let inputTimeout;

editor.addEventListener('input', (e) => {
  // Clear previous timeout
  clearTimeout(inputTimeout);
  
  // Debounce input events
  inputTimeout = setTimeout(() => {
    const currentContent = editor.innerHTML;
    handleContentChange(currentContent);
  }, 150);
});
```

## Related Cases

- Case IDs will be added as cases are created for specific environment combinations

## References

- [Chromium Issue 376223: Input events fired on contenteditable focus/blur](https://groups.google.com/a/chromium.org/g/chromium-bugs/c/DRDiuLpYBis) - Input events trigger on focus/blur in Android Chrome
- [Chakra UI Issue 1986: Scroll on focus for modals/inputs on Android](https://github.com/chakra-ui/chakra-ui/issues/1986) - Related scroll behavior
- [Ionic Issue 18532: Input focus scrolling not working when KeyboardResize is disabled](https://github.com/ionic-team/ionic-framework/issues/18532)
- [WHATWG HTML Issue 8375: Need a way to prevent mobile browser scrolling when focusing an input](https://github.com/whatwg/html/issues/8375)
- [Stack Overflow: Text inputs strange behavior on Chrome for Android](https://stackoverflow.com/questions/56894028/text-inputs-strange-behavior-on-chrome-for-android)
