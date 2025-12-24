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

