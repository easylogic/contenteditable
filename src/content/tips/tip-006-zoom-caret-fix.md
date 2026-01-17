---
id: tip-006-zoom-caret-fix
title: Fixing caret positioning with browser zoom
description: "How to solve inaccurate caret positioning issues when browser is zoomed or content is scaled via CSS transforms"
category: selection
tags:
  - zoom
  - caret
  - selection
  - positioning
  - transform
difficulty: intermediate
relatedScenarios:
  - scenario-browser-zoom
relatedCases:
  - ce-0563-browser-zoom-caret-positioning
locale: en
---

## Problem

When the browser is zoomed or content is scaled via CSS transforms, caret position and text selection in contenteditable elements become inaccurate.

## Solution

### 1. Use display: inline-block

Helps Chrome with caret placement.

```css
[contenteditable="true"] {
  display: inline-block;
}
```

### 2. Add Visible BR When Empty

Prevents Firefox caret invisibility.

```javascript
if (editableElement.innerHTML.trim() === '') {
  editableElement.innerHTML = '<br>';
}
```

### 3. Insert Zero-Width Spaces

Around `contenteditable="false"` elements.

```javascript
function insertZWS(element) {
  const zws = document.createTextNode('\u200B');
  element.parentNode.insertBefore(zws, element.nextSibling);
}
```

### 4. Avoid CSS transform: scale

Use font-size adjustments instead.

```css
/* Bad */
.editor {
  transform: scale(1.5);
}

/* Good */
.editor {
  font-size: 150%;
}
```

### 5. Use window.visualViewport API

For custom UI calculations.

```javascript
function getViewportAdjustedRect(element) {
  const rect = element.getBoundingClientRect();
  const viewport = window.visualViewport;
  return {
    top: rect.top - viewport.offsetTop,
    left: rect.left - viewport.offsetLeft,
    width: rect.width / viewport.scale,
    height: rect.height / viewport.scale
  };
}
```

### 6. Consistent Line-Height

Prevents dead-space clicking issues.

```css
[contenteditable="true"] {
  line-height: 1.5;
  font-size: 16px;
}
```

## Notes

- Firefox is most affected when using CSS transforms
- Chrome versions before v106 had issues with non-editable elements
- Mobile browsers may be more severely affected

## Related Resources

- [Scenario: Browser zoom](/scenarios/scenario-browser-zoom)
- [Case: ce-0563](/cases/ce-0563-browser-zoom-caret-positioning)
