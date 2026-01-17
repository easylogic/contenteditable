---
id: ce-0553-webkit-focus-bug-en-ko
scenarioId: scenario-webkit-focus-bug
locale: ko
os: macOS
osVersion: "11+"
device: Desktop
deviceVersion: Any
browser: Safari
browserVersion: "14+"
keyboard: Any
caseTitle: Focus does not transfer correctly from contenteditable to non-editable elements
description: "A known bug in WebKit browsers prevents focus from transferring correctly from contenteditable elements to non-editable elements. The contenteditable element continues to accept input even after blur."
tags:
  - webkit
  - safari
  - focus
  - blur
  - focus-transfer
  - bug
status: draft
initialHtml: |
  <div contenteditable="true" style="padding: 20px; border: 1px solid #ccc; min-height: 100px;">
    Type here, then click the button below
  </div>
  <button id="transfer-focus">Click to transfer focus</button>
  <input type="text" id="target-input" placeholder="Focus should move here">
domSteps:
  - label: "Initial state"
    html: '<div contenteditable="true">Type here...</div><button>Transfer focus</button><input>'
    description: "Contenteditable has focus, user types"
  - label: "After clicking button (Bug)"
    html: '<div contenteditable="true">Type here...</div><button>Transfer focus</button><input>'
    description: "Focus does not transfer, contenteditable still accepts input"
  - label: "Expected"
    html: '<div contenteditable="true">Type here...</div><button>Transfer focus</button><input>'
    description: "Focus should move to input field, contenteditable should stop accepting input"
---

## Phenomenon

A known bug in WebKit-based browsers (Safari, Chrome) prevents focus from transferring correctly from `contenteditable` elements to non-editable elements. When attempting to programmatically move focus from a `contenteditable` element to another element, the focus may not transfer properly, causing the `contenteditable` element to continue accepting input.

## Reproduction Steps

1. Open Safari browser on macOS.
2. Create a `contenteditable` element and another element (e.g., input field, button).
3. Focus the `contenteditable` element and type some text.
4. Programmatically attempt to transfer focus to the other element (e.g., by clicking a button that calls `targetElement.focus()`).
5. Try typing after the focus transfer.
6. Observe where the input goes.

## Observed Behavior

1. **Focus Transfer Failure**: Focus does not properly transfer from the `contenteditable` element.
2. **Continued Input**: The `contenteditable` element continues to accept input even after attempting to blur it.
3. **Input Interception**: User input goes to the `contenteditable` element instead of the intended target.
4. **Blur Not Effective**: Calling `blur()` on the `contenteditable` element does not reliably remove focus.

## Expected Behavior

- Focus should transfer correctly from `contenteditable` to other elements.
- The `contenteditable` element should stop accepting input after losing focus.
- User input should go to the newly focused element.

## Impact

- **Focus Management Failure**: Cannot reliably transfer focus away from contenteditable elements.
- **Input Interception**: User input continues to go to contenteditable even after blur.
- **UI Confusion**: Users may type in wrong locations.
- **Accessibility Issues**: Screen readers and keyboard navigation may malfunction.

## Browser Comparison

- **Safari (WebKit)**: This issue occurs.
- **Chrome (Blink/WebKit-based)**: May have similar issues.
- **Firefox (Gecko)**: Not affected.
- **Edge (Chromium)**: May have similar issues.

## Notes and Possible Workarounds

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
function forceBlurContentEditable(editor, targetElement) {
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

## References

- [GitHub Gist: WebKit contenteditable focus bug workaround](https://gist.github.com/shimondoodkin/1081133)
- Known WebKit bug affecting focus transfer from contenteditable elements
