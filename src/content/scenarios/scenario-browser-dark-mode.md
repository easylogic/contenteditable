---
id: scenario-browser-dark-mode
title: Dark mode causes caret visibility and styling issues
description: "When browser dark mode is enabled, contenteditable elements may experience invisible or poorly visible caret, inline style injection conflicts, background color issues, and form control styling problems. These issues are caused by missing color-scheme declarations and conflicts between browser-injected styles and custom CSS."
category: other
tags:
  - dark-mode
  - caret
  - styling
  - color-scheme
  - css
status: draft
locale: en
---

When browser dark mode is enabled, `contenteditable` elements may experience invisible or poorly visible caret, inline style injection conflicts, background color issues, and form control styling problems.

## Observed Behavior

- **Invisible caret**: Caret uses `currentColor` or text color, making it invisible against dark backgrounds
- **Inline style injection**: Browser inserts inline styles during editing that override dark mode CSS
- **Background color conflicts**: Child elements with custom backgrounds interfere with caret rendering
- **Form control styling**: Input placeholders, scrollbars, borders don't switch properly to dark mode
- **Link color contrast**: Default link colors have poor contrast against dark backgrounds

## Browser Comparison

- **Safari**: HTML-only dark mode has link color contrast issues
- **Chrome/Edge**: Auto Dark Mode flag can invert colors globally, distorting content
- **Firefox**: Similar issues with forced dark mode
- **All browsers**: Missing `color-scheme` declaration causes problems

## Impact

- **Poor user experience**: Users cannot see where they're typing
- **Accessibility issues**: Low contrast fails accessibility guidelines
- **Visual inconsistency**: Styling conflicts create jarring appearance
- **Editing difficulty**: Makes editing in dark mode frustrating

## Workarounds

### 1. Use color-scheme Declaration

Declare support for both light and dark:

```css
:root {
  color-scheme: light dark;
}
```

### 2. Explicit Caret Styling

Ensure caret is visible:

```css
[contenteditable="true"] {
  caret-color: var(--caret-color, white);
}

@media (prefers-color-scheme: dark) {
  [contenteditable="true"] {
    caret-color: #ffffff;
  }
}
```

### 3. Handle Child Elements

Avoid `position: relative` on inline spans:

```css
[contenteditable="true"] span {
  position: static;
  /* or */
  display: inline-block;
  z-index: 0;
}
```

### 4. Override Inline Styles

Sanitize pasted content:

```javascript
function sanitizeContent(html) {
  const div = document.createElement('div');
  div.innerHTML = html;
  
  // Remove inline styles
  div.querySelectorAll('[style]').forEach(el => {
    el.removeAttribute('style');
  });
  
  return div.innerHTML;
}
```

### 5. Dark Mode Media Query

Define dark mode colors:

```css
@media (prefers-color-scheme: dark) {
  [contenteditable="true"] {
    background-color: #1a1a1a;
    color: #ffffff;
  }
  
  [contenteditable="true"]::placeholder {
    color: #888888;
  }
  
  [contenteditable="true"] a {
    color: #4a9eff;
  }
  
  [contenteditable="true"] a:visited {
    color: #9d4edd;
  }
}
```

### 6. Test with Forced Dark Mode

Simulate browser flags:

```css
/* Fallback for forced dark mode */
@media (prefers-color-scheme: dark) {
  [contenteditable="true"] {
    filter: none; /* Prevent color inversion */
  }
}
```

## References

- [Stack Overflow: Invisible caret with position relative](https://stackoverflow.com/questions/70565449/why-is-the-caret-invisible-in-a-contenteditable-with-positionrelative) - Caret visibility issues
- [Stack Overflow: Chrome and Safari replace CSS with inline styles](https://stackoverflow.com/questions/8332245/contenteditable-in-chrome-and-safari-replaces-css-classes-and-rules-with-inline) - Inline style injection
- [WebKit: Dark mode support](https://webkit.org/blog/8840/dark-mode-support-in-webkit/) - color-scheme documentation
- [MDN: caret-color](https://developer.mozilla.org/en-US/docs/Web/CSS/caret-color) - Caret color property
- [Temper Temper: Fixing Safari's HTML-only dark mode bug](https://www.tempertemper.net/blog/fixing-safaris-html-only-dark-mode-bug) - Link color fixes
- [JavaScript Room: Dark mode implementation guide](https://www.javascriptroom.com/css-mastery/a-guide-to-implementing-dark-mode-with-css/) - Comprehensive guide
