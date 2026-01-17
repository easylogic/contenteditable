---
id: scenario-background-color-change
title: Background color changes behave inconsistently
description: "Changing background color (highlighting) in contenteditable elements behaves inconsistently across browsers. Background colors may be applied as inline styles, may not persist when typing, or may interfere with text selection. The behavior differs from text color changes."
category: formatting
tags:
  - color
  - background
  - highlight
  - css
status: draft
locale: en
---

Changing background color (highlighting) in contenteditable elements behaves inconsistently across browsers. Background colors may be applied as inline styles, may not persist when typing, or may interfere with text selection. The behavior differs from text color changes.

## Observed Behavior

### Scenario 1: Applying background color to selected text
- **Chrome/Edge**: Applies background-color as inline style
- **Firefox**: Similar behavior but may not persist
- **Safari**: May apply background differently

### Scenario 2: Typing after applying background color
- **Chrome/Edge**: New text may inherit background or use default
- **Firefox**: Background may not persist for new text
- **Safari**: Behavior inconsistent

### Scenario 3: Background color and text selection
- **Chrome/Edge**: Background may interfere with selection visibility
- **Firefox**: Similar issues
- **Safari**: Selection behavior may differ

### Scenario 4: Removing background color
- **Chrome/Edge**: May leave empty style attributes
- **Firefox**: Similar behavior
- **Safari**: May handle removal differently

## Impact

- Inconsistent background color application
- Background formatting may not persist
- Selection visibility issues
- Empty style attributes in DOM

## Browser Comparison

- **Chrome/Edge**: Generally better background handling
- **Firefox**: Background persistence may be less reliable
- **Safari**: Most inconsistent behavior

## Workaround

Implement custom background color handling:

```javascript
element.addEventListener('beforeinput', (e) => {
  if (e.inputType === 'formatBackColor') {
    e.preventDefault();
    const selection = window.getSelection();
    if (selection.rangeCount === 0) return;
    
    const range = selection.getRangeAt(0);
    const color = e.data || prompt('Enter background color:');
    
    if (color) {
      if (range.collapsed) {
        // Set background for future typing
        const span = document.createElement('span');
        span.style.backgroundColor = color;
        range.insertNode(span);
        range.setStart(span, 0);
        range.collapse(true);
      } else {
        // Apply background to selected text
        const span = document.createElement('span');
        span.style.backgroundColor = color;
        try {
          range.surroundContents(span);
        } catch (e) {
          const contents = range.extractContents();
          span.appendChild(contents);
          range.insertNode(span);
        }
      }
      
      selection.removeAllRanges();
      selection.addRange(range);
    }
  }
});
```

## References

- [MDN: Document.execCommand](https://developer.mozilla.org/en-US/docs/Web/API/Document/execCommand) - execCommand API documentation
- [MDN: execCommand reference](https://devdoc.net/web/developer.mozilla.org/en-US/docs/Web/API/Document/execCommand.html) - backColor and hiliteColor
- [Stack Overflow: execCommand backColor CSS variable](https://stackoverflow.com/questions/53383478/why-document-execcommandbackcolor-does-not-work-with-css-variable-while-fo) - CSS variable limitations
