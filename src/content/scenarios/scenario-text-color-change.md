---
id: scenario-text-color-change
title: Text color changes behave inconsistently
description: "Changing text color in contenteditable elements behaves inconsistently across browsers. Colors may be applied as inline styles, as font tags, or may not persist when typing. The color format (hex, rgb, named colors) handling also varies."
category: formatting
tags:
  - color
  - text
  - css
  - formatting
status: draft
locale: en
---

Changing text color in contenteditable elements behaves inconsistently across browsers. Colors may be applied as inline styles, as font tags, or may not persist when typing. The color format (hex, rgb, named colors) handling also varies.

## Observed Behavior

### Scenario 1: Applying color to selected text
- **Chrome/Edge**: Applies color as inline style, may use hex or rgb
- **Firefox**: Similar behavior but format may differ
- **Safari**: May apply color differently

### Scenario 2: Typing after applying color
- **Chrome/Edge**: New text may inherit color or use default
- **Firefox**: Color may not persist for new text
- **Safari**: Behavior inconsistent

### Scenario 3: Color format conversion
- **Chrome/Edge**: May convert between hex, rgb, and named colors
- **Firefox**: May preserve or convert formats
- **Safari**: Format handling varies

### Scenario 4: Removing color
- **Chrome/Edge**: May leave empty style attributes
- **Firefox**: Similar behavior
- **Safari**: May handle removal differently

## Impact

- Inconsistent color application
- Color formatting may not persist
- Format conversion issues
- Empty style attributes in DOM

## Browser Comparison

- **Chrome/Edge**: Generally better color handling
- **Firefox**: Color persistence may be less reliable
- **Safari**: Most inconsistent behavior

## Workaround

Implement custom color handling:

```javascript
element.addEventListener('beforeinput', (e) => {
  if (e.inputType === 'formatForeColor') {
    e.preventDefault();
    const selection = window.getSelection();
    if (selection.rangeCount === 0) return;
    
    const range = selection.getRangeAt(0);
    const color = e.data || prompt('Enter color (e.g., #ff0000, red, rgb(255,0,0)):');
    
    if (color) {
      if (range.collapsed) {
        // Set color for future typing
        const span = document.createElement('span');
        span.style.color = color;
        range.insertNode(span);
        range.setStart(span, 0);
        range.collapse(true);
      } else {
        // Apply color to selected text
        const span = document.createElement('span');
        span.style.color = color;
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

