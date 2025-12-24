---
id: scenario-consecutive-spaces
title: Consecutive spaces are collapsed in contenteditable
description: "When typing multiple consecutive spaces in a contenteditable element, browsers collapse them into a single space by default (following HTML whitespace rules). This behavior differs from native text inputs and can be unexpected for users who need to preserve multiple spaces."
category: formatting
tags:
  - whitespace
  - space
  - html
  - formatting
status: draft
---

When typing multiple consecutive spaces in a contenteditable element, browsers collapse them into a single space by default (following HTML whitespace rules). This behavior differs from native text inputs and can be unexpected for users who need to preserve multiple spaces.

## Observed Behavior

### Scenario 1: Typing multiple spaces
- **Chrome/Edge**: Spaces are collapsed to a single space in the DOM
- **Firefox**: Spaces are collapsed to a single space
- **Safari**: Spaces are collapsed to a single space

### Scenario 2: Pasting text with multiple spaces
- **Chrome/Edge**: Multiple spaces may be preserved if pasted as HTML, collapsed if pasted as plain text
- **Firefox**: Behavior similar to Chrome
- **Safari**: May preserve or collapse depending on paste format

### Scenario 3: Using non-breaking spaces
- **Chrome/Edge**: `&nbsp;` entities preserve spacing but may be converted to regular spaces
- **Firefox**: Similar behavior
- **Safari**: May handle `&nbsp;` differently

## Impact

- Users cannot type multiple spaces directly
- Need to use workarounds (non-breaking spaces, CSS) to preserve spacing
- Inconsistent behavior compared to native text inputs
- Difficulty maintaining formatting that requires multiple spaces

## Browser Comparison

- **All browsers**: Collapse consecutive spaces by default (HTML standard behavior)
- **Workaround needed**: Use `white-space: pre-wrap` CSS or `&nbsp;` entities

## Workaround

Use CSS to preserve whitespace:

```css
[contenteditable="true"] {
  white-space: pre-wrap; /* Preserves spaces and line breaks */
}
```

Or handle space insertion manually:

```javascript
element.addEventListener('beforeinput', (e) => {
  if (e.inputType === 'insertText' && e.data === ' ') {
    const selection = window.getSelection();
    if (selection.rangeCount === 0) return;
    
    const range = selection.getRangeAt(0);
    const previousChar = range.startContainer.textContent?.[range.startOffset - 1];
    
    // If previous character is also a space, insert non-breaking space
    if (previousChar === ' ') {
      e.preventDefault();
      const nbsp = document.createTextNode('\u00A0'); // Non-breaking space
      range.insertNode(nbsp);
      range.setStartAfter(nbsp);
      range.collapse(true);
      selection.removeAllRanges();
      selection.addRange(range);
    }
  }
});
```

