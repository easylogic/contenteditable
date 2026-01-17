---
id: ce-0302-firefox-trailing-whitespace-paste-en-ko
scenarioId: scenario-paste-whitespace
locale: ko
os: Windows
osVersion: "10-11"
device: Desktop or Laptop
deviceVersion: Any
browser: Firefox
browserVersion: "120+"
keyboard: US QWERTY
caseTitle: Trailing whitespaces are removed when pasting text in Firefox
description: "In Firefox, when text is pasted into a contenteditable element, trailing whitespaces may be removed automatically. This behavior differs from Chrome, where trailing whitespaces are preserved."
tags:
  - paste
  - whitespace
  - firefox
  - trailing-space
status: draft
initialHtml: |
  <div contenteditable="true" style="padding: 20px; border: 1px solid #ccc; min-height: 100px;">
    <p>Paste text with trailing spaces here</p>
  </div>
domSteps:
  - label: "Before paste"
    html: '<div contenteditable="true"><p>Paste text here</p></div>'
    description: "Empty contenteditable area"
  - label: "After paste (Bug)"
    html: '<div contenteditable="true"><p>Paste text hereHello World</p></div>'
    description: "Trailing spaces removed: 'Hello World  ' becomes 'Hello World'"
  - label: "✅ Expected"
    html: '<div contenteditable="true"><p>Paste text hereHello World  </p></div>'
    description: "Expected: Trailing spaces should be preserved"
---

## Phenomenon

In Firefox, when text is pasted into a `contenteditable` element, trailing whitespaces may be removed automatically. This behavior differs from Chrome, where trailing whitespaces are preserved.

## Reproduction example

1. Open Firefox browser on Windows.
2. Copy text with trailing spaces (e.g., "Hello World  " with two trailing spaces).
3. Focus a `contenteditable` element.
4. Paste the text (Ctrl+V).
5. Observe that trailing spaces are removed.

## Observed behavior

- Trailing whitespaces are automatically removed when pasting
- Multiple spaces are collapsed to single spaces in some cases
- This only occurs in Firefox
- Chrome preserves trailing whitespaces

## Expected behavior

- Trailing whitespaces should be preserved when pasting
- Multiple spaces should be preserved
- Behavior should be consistent with other browsers

## Impact

- **Data loss**: Important whitespace formatting is lost
- **Code editing**: Trailing spaces in code blocks are removed
- **Formatting issues**: Text alignment and spacing are affected

## Browser Comparison

- **Firefox**: Trailing whitespaces are removed (this issue)
- **Chrome**: Trailing whitespaces are preserved
- **Safari**: Trailing whitespaces are preserved
- **Edge**: Trailing whitespaces are preserved

## Notes and possible direction for workarounds

- **CSS white-space property**: Set `white-space: -moz-pre-space` in Firefox to preserve trailing whitespaces
- **Paste event handling**: Intercept paste events and manually preserve whitespaces
- **Normalize whitespace**: Use `white-space: pre-wrap` or `pre` to preserve all whitespace

## Code example

```javascript
const editor = document.querySelector('div[contenteditable]');

// CSS workaround
editor.style.whiteSpace = '-moz-pre-space';

// JavaScript workaround: Intercept paste
editor.addEventListener('paste', (e) => {
  e.preventDefault();
  
  const clipboardData = e.clipboardData || window.clipboardData;
  const pastedText = clipboardData.getData('text/plain');
  
  // Preserve trailing whitespaces
  const selection = window.getSelection();
  if (selection.rangeCount > 0) {
    const range = selection.getRangeAt(0);
    range.deleteContents();
    
    // Create text node with preserved whitespace
    const textNode = document.createTextNode(pastedText);
    range.insertNode(textNode);
    
    // Move cursor to end
    range.setStartAfter(textNode);
    range.collapse(true);
    
    selection.removeAllRanges();
    selection.addRange(range);
  }
});
```
