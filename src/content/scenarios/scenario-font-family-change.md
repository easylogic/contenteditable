---
id: scenario-font-family-change
title: Font family changes behave inconsistently
description: "Changing font family in contenteditable elements behaves inconsistently across browsers. The font-family CSS property may be applied inline, as a style attribute, or may not be applied at all. The behavior also varies when editing text after applying a font."
category: formatting
tags:
  - font
  - typography
  - css
  - formatting
status: draft
locale: en
---

Changing font family in contenteditable elements behaves inconsistently across browsers. The font-family CSS property may be applied inline, as a style attribute, or may not be applied at all. The behavior also varies when editing text after applying a font.

## Observed Behavior

### Scenario 1: Applying font to selected text
- **Chrome/Edge**: Applies font-family as inline style, may persist when typing
- **Firefox**: Similar behavior but may not persist
- **Safari**: May apply font differently or not persist

### Scenario 2: Typing after applying font
- **Chrome/Edge**: New text may inherit font or use default
- **Firefox**: Font may not persist for new text
- **Safari**: Behavior inconsistent

### Scenario 3: Removing font formatting
- **Chrome/Edge**: May leave empty style attributes
- **Firefox**: Similar behavior
- **Safari**: May handle differently

### Scenario 4: Font inheritance
- **Chrome/Edge**: Font may be inherited from parent elements
- **Firefox**: Similar inheritance behavior
- **Safari**: Inheritance may work differently

## Impact

- Inconsistent font application
- Font formatting may not persist
- Empty style attributes left in DOM
- Difficulty maintaining consistent typography

## Browser Comparison

- **Chrome/Edge**: Generally better font handling
- **Firefox**: Font persistence may be less reliable
- **Safari**: Most inconsistent behavior

## Workaround

Implement custom font handling:

```javascript
element.addEventListener('beforeinput', (e) => {
  if (e.inputType === 'formatFontName') {
    e.preventDefault();
    const selection = window.getSelection();
    if (selection.rangeCount === 0) return;
    
    const range = selection.getRangeAt(0);
    const fontName = e.data || prompt('Enter font name:');
    
    if (fontName) {
      // Apply font to selection
      if (range.collapsed) {
        // Set font for future typing
        document.execCommand('fontName', false, fontName);
      } else {
        // Apply font to selected text
        const span = document.createElement('span');
        span.style.fontFamily = fontName;
        try {
          range.surroundContents(span);
        } catch (e) {
          // If surroundContents fails, extract and wrap
          const contents = range.extractContents();
          span.appendChild(contents);
          range.insertNode(span);
        }
      }
    }
  }
});
```

## References

- [MDN: Document.execCommand](https://developer.mozilla.org/en-US/docs/Web/API/Document/execCommand) - execCommand API documentation
- [Stack Overflow: Change font family to custom font using execCommand](https://stackoverflow.com/questions/42331001/can-you-change-the-font-family-of-contenteditable-text-to-a-custom-font-using-ex) - Custom font handling
- [Stack Overflow: Change font size for contenteditable div](https://stackoverflow.com/questions/22116956/change-the-font-size-for-a-contenteditable-div) - FontName vs CSS
- [Programming Books: execCommand and contenteditable](https://www.programming-books.io/essential/javascript/execcommand-and-contenteditable-5257f91227764826a1b1b77f465d8efa) - styleWithCSS usage
- [AngularFix: execCommand doesn't work](https://www.angularfix.com/2022/11/execcommand-doesn-text.html) - Style interference issues
