---
id: scenario-browser-auto-formatting
title: Browser auto-formatting interferes with contenteditable editing
description: "Browsers may automatically format text in contenteditable elements, such as converting URLs to links, capitalizing text, formatting numbers, or applying other transformations. This auto-formatting can interfere with editing, cause cursor positioning issues, and create unwanted markup or style changes."
category: formatting
tags:
  - auto-formatting
  - browser-feature
  - capitalization
  - number-formatting
  - text-transformation
status: draft
locale: en
---

Browsers may automatically format text in `contenteditable` elements, such as converting URLs to links, capitalizing text, formatting numbers, or applying other transformations. This auto-formatting can interfere with editing, cause cursor positioning issues, and create unwanted markup or style changes.

## Observed Behavior

- **Automatic capitalization**: Text is automatically capitalized (first letter, sentences)
- **Number formatting**: Numbers are formatted with commas, currency symbols, etc.
- **URL/email linking**: URLs and emails are converted to links (covered in separate scenario)
- **Text transformation**: Text case is changed automatically
- **Style injection**: Inline styles are added for formatting

## Browser Comparison

- **Chrome**: Auto-capitalization on mobile, some formatting features
- **Safari**: Auto-capitalization, smart quotes, date formatting
- **Firefox**: Less aggressive auto-formatting
- **Edge**: Similar to Chrome
- **Mobile browsers**: More aggressive auto-formatting on mobile devices

## Impact

- **Unwanted formatting**: Text is formatted when it shouldn't be
- **Editing disruption**: Auto-formatting interrupts typing flow
- **Data corruption**: Formatting changes content in unexpected ways
- **User frustration**: Users must constantly undo or fix formatting

## Workarounds

### 1. Disable Auto-Capitalization

Use CSS and attributes:

```html
<div 
  contenteditable="true"
  autocapitalize="none"
  autocorrect="off"
  autocomplete="off"
  spellcheck="false"
>
  Content without auto-capitalization
</div>
```

```css
[contenteditable="true"] {
  text-transform: none;
  font-variant: normal;
}
```

### 2. Intercept and Prevent Formatting

Monitor input events:

```javascript
editableElement.addEventListener('beforeinput', (e) => {
  // Prevent automatic formatting
  if (e.inputType === 'formatBold' || 
      e.inputType === 'formatItalic' ||
      e.inputType === 'formatSetBlockTextDirection') {
    e.preventDefault();
  }
});
```

### 3. Sanitize After Input

Remove unwanted formatting:

```javascript
function sanitizeFormatting(element) {
  // Remove auto-capitalization
  const text = element.textContent;
  element.textContent = text;
  
  // Remove unwanted inline styles
  element.querySelectorAll('[style]').forEach(el => {
    const style = el.getAttribute('style');
    if (style.includes('text-transform') || 
        style.includes('font-variant')) {
      el.removeAttribute('style');
    }
  });
}

editableElement.addEventListener('input', () => {
  setTimeout(() => sanitizeFormatting(editableElement), 0);
});
```

### 4. Use contenteditable="plaintext-only"

Disables most formatting:

```html
<div contenteditable="plaintext-only">
  Plain text, no auto-formatting
</div>
```

### 5. CSS Override

Override browser defaults:

```css
[contenteditable="true"] {
  text-transform: none !important;
  font-variant: normal !important;
  font-feature-settings: normal !important;
}

[contenteditable="true"] * {
  text-transform: inherit;
}
```

## References

- [MDN: autocapitalize attribute](https://developer.mozilla.org/docs/Web/HTML/Reference/Global_attributes/autocapitalize) - Disable auto-capitalization
- [MDN: autocorrect attribute](https://developer.mozilla.org/docs/Web/HTML/Reference/Global_attributes/autocorrect) - Disable auto-correction
- [Stack Overflow: Disable auto-capitalization in contenteditable](https://stackoverflow.com/questions/2984799/disable-auto-capitalization-in-contenteditable-div) - Mobile browser issues
