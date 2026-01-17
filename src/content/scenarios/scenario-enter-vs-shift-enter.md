---
id: scenario-enter-vs-shift-enter
title: Enter vs Shift+Enter behavior differs across browsers
description: "The behavior of Enter and Shift+Enter keys in contenteditable elements varies across browsers. Enter may create a new paragraph, line break, or div, while Shift+Enter may create a line break or behave differently. The resulting DOM structure also varies."
category: formatting
tags:
  - enter
  - line-break
  - paragraph
  - newline
status: draft
locale: en
---

The behavior of Enter and Shift+Enter keys in contenteditable elements varies across browsers. Enter may create a new paragraph, line break, or div, while Shift+Enter may create a line break or behave differently. The resulting DOM structure also varies.

## Observed Behavior

### Scenario 1: Pressing Enter
- **Chrome/Edge**: Creates a new `<div>` or `<p>` element
- **Firefox**: Creates a new `<p>` or `<br>` element
- **Safari**: May create `<div>`, `<p>`, or `<br>` depending on context

### Scenario 2: Pressing Shift+Enter
- **Chrome/Edge**: Creates a `<br>` line break
- **Firefox**: Creates a `<br>` line break
- **Safari**: May create `<br>` or behave like Enter

### Scenario 3: Enter in different contexts
- **Chrome/Edge**: Behavior may differ in lists, blockquotes, etc.
- **Firefox**: Similar context-dependent behavior
- **Safari**: More inconsistent across contexts

### Scenario 4: Empty paragraph/div creation
- **Chrome/Edge**: May create empty elements that need cleanup
- **Firefox**: Similar behavior
- **Safari**: May create different empty structures

## Impact

- Inconsistent line break behavior
- Unexpected DOM structure creation
- Need to normalize DOM after Enter key
- Difficulty implementing consistent editing behavior

## Browser Comparison

- **Chrome/Edge**: Generally creates `<div>` for Enter, `<br>` for Shift+Enter
- **Firefox**: More likely to create `<p>` for Enter
- **Safari**: Most inconsistent behavior

## Workaround

Normalize Enter key behavior:

```javascript
element.addEventListener('beforeinput', (e) => {
  if (e.inputType === 'insertParagraph') {
    e.preventDefault();
    
    const selection = window.getSelection();
    if (selection.rangeCount === 0) return;
    
    const range = selection.getRangeAt(0);
    const isShiftEnter = e.getModifierState?.('Shift');
    
    if (isShiftEnter) {
      // Insert line break
      const br = document.createElement('br');
      range.deleteContents();
      range.insertNode(br);
      range.setStartAfter(br);
      range.collapse(true);
    } else {
      // Insert new paragraph
      const p = document.createElement('p');
      const br = document.createElement('br');
      p.appendChild(br);
      
      range.deleteContents();
      range.insertNode(p);
      range.setStartBefore(br);
      range.collapse(true);
    }
    
    selection.removeAllRanges();
    selection.addRange(range);
  }
});
```

## References

- [MDN: Content Editable](https://www.devdoc.net/web/developer.mozilla.org/en-US/docs/HTML/Content_Editable.html) - Enter key behavior documentation
- [MDN: Editable content guide](https://udn.realityripple.com/docs/Web/Guide/HTML/Editable_content) - Firefox behavior changes
- [Stack Overflow: Prevent contenteditable adding div on Enter](https://stackoverflow.com/questions/18552336/prevent-contenteditable-adding-div-on-enter-chrome) - Enter key handling
- [Web Platform DX: contenteditable="plaintext-only"](https://web-platform-dx.github.io/web-features-explorer/features/contenteditable-plaintextonly/) - plaintext-only support
- [Can I Use: contenteditable plaintext-only](https://caniuse.com/mdn-html_global_attributes_contenteditable_plaintext-only) - Browser compatibility
- [Microsoft Support: IE11 BR tag loss](https://support.microsoft.com/en-au/topic/contenteditable-div-loses-br-tag-when-you-type-after-selected-line-of-text-in-internet-explorer-11-af31d62f-b806-433a-025f-842261f27500) - IE11 Enter key issues
- [Stack Overflow: Firefox creates 2 newlines instead of 1](https://stackoverflow.com/questions/52817606/contenteditable-in-firefox-creates-2-newlines-instead-of-1) - Empty div behavior
