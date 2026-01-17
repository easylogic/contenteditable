---
id: scenario-paste-whitespace
title: Trailing whitespace handling differs across browsers
description: "When pasting text into contenteditable elements, different browsers handle trailing whitespaces differently. Some browsers preserve trailing whitespaces, while others remove them automatically."
category: paste
tags:
  - paste
  - whitespace
  - trailing-space
status: draft
locale: en
---

When pasting text into `contenteditable` elements, different browsers handle trailing whitespaces differently. Some browsers preserve trailing whitespaces, while others remove them automatically.

## Observed Behavior

1. **Whitespace removal**: Some browsers automatically remove trailing whitespaces
2. **Space collapsing**: Multiple spaces may be collapsed to single spaces
3. **Inconsistent behavior**: Different browsers handle whitespace differently
4. **Data loss**: Important whitespace formatting is lost

## Browser Comparison

- **Firefox**: Trailing whitespaces are removed (this issue)
- **Chrome**: Trailing whitespaces are preserved
- **Safari**: Trailing whitespaces are preserved
- **Edge**: Trailing whitespaces are preserved

## Impact

- **Data loss**: Important whitespace formatting is lost
- **Code editing**: Trailing spaces in code blocks are removed
- **Formatting issues**: Text alignment and spacing are affected
- **Inconsistent behavior**: Different from other browsers

## Workarounds

### CSS white-space property

Set `white-space: -moz-pre-space` in Firefox to preserve trailing whitespaces:

```css
[contenteditable="true"] {
  white-space: -moz-pre-space;
}
```

### Paste event handling

Intercept paste events and manually preserve whitespaces:

```javascript
editor.addEventListener('paste', (e) => {
  e.preventDefault();
  
  const clipboardData = e.clipboardData || window.clipboardData;
  const pastedText = clipboardData.getData('text/plain');
  
  // Preserve trailing whitespaces
  const selection = window.getSelection();
  if (selection.rangeCount > 0) {
    const range = selection.getRangeAt(0);
    range.deleteContents();
    
    const textNode = document.createTextNode(pastedText);
    range.insertNode(textNode);
    
    range.setStartAfter(textNode);
    range.collapse(true);
    
    selection.removeAllRanges();
    selection.addRange(range);
  }
});
```

### Normalize whitespace

Use `white-space: pre-wrap` or `pre` to preserve all whitespace:

```css
[contenteditable="true"] {
  white-space: pre-wrap;
}
```

## References

- [Stack Overflow: contenteditable removes trailing whitespaces on Firefox](https://stackoverflow.com/questions/69296163/contenteditable-removes-trailing-whitespaces-on-firefox-but-not-on-chrome) - Firefox whitespace removal
- [Stack Overflow: Firefox wrongly trims trailing white space](https://stackoverflow.com/questions/62117638/firefox-wrongly-trims-trailing-white-space-when-editing) - Trimming behavior
- [Firefox Bug 1221043: Trailing spaces removed when entering text](https://bugzilla.mozilla.org/show_bug.cgi?id=1221043) - Fixed in Firefox 45+
- [Firefox Bug 1297069: Trailing whitespace removed when typing after paste](https://bugzilla.mozilla.org/show_bug.cgi?id=1297069) - Fixed in Firefox 135-136
