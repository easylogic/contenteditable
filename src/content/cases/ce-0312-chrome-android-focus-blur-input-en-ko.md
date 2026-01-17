---
id: ce-0312-chrome-android-focus-blur-input-en-ko
scenarioId: scenario-chrome-android-focus-blur-input
locale: ko
os: Android
osVersion: "10+"
device: Mobile
deviceVersion: Any
browser: Chrome for Android
browserVersion: "90+"
keyboard: Any
caseTitle: Input events fire on focus/blur without content changes
description: "In Chrome on Android, input events may fire when a contenteditable element gains or loses focus, even without content changes. This can lead to unintended side effects."
tags:
  - chrome
  - android
  - mobile
  - focus
  - blur
  - input-event
  - false-positive
status: draft
initialHtml: |
  <div contenteditable="true" style="padding: 20px; border: 1px solid #ccc; min-height: 100px;">
    Tap to focus, then tap outside to blur
  </div>
  <div id="log" style="margin-top: 10px; padding: 10px; background: #f0f0f0;">
    Event log will appear here
  </div>
domSteps:
  - label: "Before focus"
    html: '<div contenteditable="true">Tap to focus</div>'
    description: "Element is not focused"
  - label: "After focus (Bug)"
    html: '<div contenteditable="true">Tap to focus</div>'
    description: "Input event fires even though no content changed"
  - label: "Expected"
    html: '<div contenteditable="true">Tap to focus</div>'
    description: "Input event should not fire on focus/blur without content changes"
---

## Phenomenon

In Chrome on Android, `input` events may fire when a `contenteditable` element gains or loses focus, even without any actual content changes. This behavior can lead to unintended side effects in applications that rely on `input` events to detect content modifications.

## Reproduction Steps

1. Open Chrome browser on an Android device.
2. Create a `contenteditable` element.
3. Add an event listener for `input` events that logs to console.
4. Tap on the `contenteditable` element to focus it.
5. Observe the console - an `input` event may fire even though no content was changed.
6. Tap outside the element to blur it.
7. Observe the console - an `input` event may fire again.

## Observed Behavior

1. **Input Event on Focus**: An `input` event fires when the element gains focus, even though no content was changed.
2. **Input Event on Blur**: An `input` event may fire when the element loses focus, even though no content was changed.
3. **False Positive Events**: These events are false positives - they indicate content changes that didn't actually occur.
4. **Android-Specific**: This issue is specific to Chrome on Android.

## Expected Behavior

- `input` events should only fire when content actually changes.
- Focus and blur events should not trigger `input` events.
- Applications should be able to rely on `input` events to detect actual content modifications.

## Impact

- **False Positive Events**: Input events fire without actual content changes.
- **Unintended Side Effects**: Applications may trigger save operations, validation, or other actions unnecessarily.
- **Performance Issues**: Unnecessary processing triggered by false input events.
- **User Experience**: Applications may behave unexpectedly.

## Browser Comparison

- **Chrome Android**: This issue occurs.
- **Chrome Desktop**: Not affected.
- **Firefox Android**: Not affected.
- **Safari iOS**: Not affected.

## Notes and Possible Workarounds

### Filter False Input Events

```javascript
const editor = document.querySelector('[contenteditable]');
let lastContent = editor.innerHTML;
let isFocusing = false;
let isBlurring = false;

editor.addEventListener('focus', () => {
  isFocusing = true;
  lastContent = editor.innerHTML;
  
  setTimeout(() => {
    isFocusing = false;
  }, 100);
});

editor.addEventListener('blur', () => {
  isBlurring = true;
  
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
    return;
  }
  
  lastContent = currentContent;
  handleContentChange(currentContent);
});
```

### Use MutationObserver Instead

```javascript
const editor = document.querySelector('[contenteditable]');
let isUserInput = false;

editor.addEventListener('beforeinput', () => {
  isUserInput = true;
});

editor.addEventListener('input', () => {
  isUserInput = false;
});

const observer = new MutationObserver((mutations) => {
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

## References

- [Chromium Bug: Input events on focus/blur](https://groups.google.com/a/chromium.org/g/chromium-bugs/c/DRDiuLpYBis)
- Chrome Android specific behavior with input events
