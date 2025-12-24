---
id: scenario-font-size-change
title: Font size changes behave inconsistently
description: "Changing font size in contenteditable elements behaves inconsistently across browsers. Font sizes may be applied as inline styles, as font tags, or may not persist when typing new text. The unit (px, em, rem) handling also varies."
category: formatting
tags:
  - font
  - size
  - typography
  - css
status: draft
---

Changing font size in contenteditable elements behaves inconsistently across browsers. Font sizes may be applied as inline styles, as font tags, or may not persist when typing new text. The unit (px, em, rem) handling also varies.

## Observed Behavior

### Scenario 1: Applying font size to selected text
- **Chrome/Edge**: Applies font-size as inline style, may use px units
- **Firefox**: Similar behavior but unit handling may differ
- **Safari**: May apply size differently or use different units

### Scenario 2: Typing after applying font size
- **Chrome/Edge**: New text may inherit size or use default
- **Firefox**: Size may not persist for new text
- **Safari**: Behavior inconsistent

### Scenario 3: Relative vs absolute units
- **Chrome/Edge**: May convert relative units (em, rem) to absolute (px)
- **Firefox**: May preserve or convert units
- **Safari**: Unit handling varies

### Scenario 4: Removing font size
- **Chrome/Edge**: May leave empty style attributes
- **Firefox**: Similar behavior
- **Safari**: May handle removal differently

## Impact

- Inconsistent font size application
- Size formatting may not persist
- Unit conversion issues
- Empty style attributes in DOM

## Browser Comparison

- **Chrome/Edge**: Generally better size handling
- **Firefox**: Size persistence may be less reliable
- **Safari**: Most inconsistent behavior

## Workaround

Implement custom font size handling:

```javascript
element.addEventListener('beforeinput', (e) => {
  if (e.inputType === 'formatFontSize') {
    e.preventDefault();
    const selection = window.getSelection();
    if (selection.rangeCount === 0) return;
    
    const range = selection.getRangeAt(0);
    const fontSize = e.data || prompt('Enter font size (e.g., 16px, 1.2em):');
    
    if (fontSize) {
      if (range.collapsed) {
        // Set size for future typing
        const span = document.createElement('span');
        span.style.fontSize = fontSize;
        range.insertNode(span);
        range.setStart(span, 0);
        range.collapse(true);
      } else {
        // Apply size to selected text
        const span = document.createElement('span');
        span.style.fontSize = fontSize;
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

