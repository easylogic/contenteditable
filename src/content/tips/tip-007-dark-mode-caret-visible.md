---
id: tip-007-dark-mode-caret-visible
title: Making caret visible in dark mode
description: "How to solve invisible caret issues in contenteditable when browser dark mode is enabled"
category: browser-feature
tags:
  - dark-mode
  - caret
  - styling
  - color-scheme
  - visibility
difficulty: beginner
relatedScenarios:
  - scenario-browser-dark-mode
relatedCases:
  - ce-0564-browser-dark-mode-caret-invisible
locale: en
---

## Problem

When browser dark mode is enabled, the caret in contenteditable elements may become invisible or poorly visible.

## Solution

### 1. Use color-scheme Declaration

Declare support for both light and dark.

```css
:root {
  color-scheme: light dark;
}
```

### 2. Explicit Caret Styling

Set explicit caret color to ensure visibility.

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

Avoid `position: relative` on inline child spans.

```css
[contenteditable="true"] span {
  position: static;
  /* or */
  display: inline-block;
  z-index: 0;
}
```

### 4. Sanitize Inline Styles

Remove inline styles from pasted content.

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

Define dark mode colors.

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

## Notes

- Without `color-scheme` declaration, browsers may not recognize dark mode support
- Child element backgrounds may hide the caret
- Browser-injected inline styles may override dark mode CSS

## Related Resources

- [Scenario: Browser dark mode](/scenarios/scenario-browser-dark-mode)
- [Case: ce-0564](/cases/ce-0564-browser-dark-mode-caret-invisible)
