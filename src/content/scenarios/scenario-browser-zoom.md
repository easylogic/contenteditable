---
id: scenario-browser-zoom
title: Browser zoom causes caret and selection positioning issues
description: "When the browser is zoomed (or content is scaled via CSS transforms), caret position and text selection in contenteditable elements can become inaccurate. Clicking at a certain position places the caret elsewhere, and selection highlights may not match the visual selection."
category: selection
tags:
  - zoom
  - caret
  - selection
  - positioning
  - transform
  - scale
status: draft
locale: en
---

When the browser is zoomed (or content is scaled via CSS transforms), caret position and text selection in `contenteditable` elements can become inaccurate. Clicking at a certain position places the caret elsewhere, and selection highlights may not match the visual selection.

## Observed Behavior

- **Caret position mismatch**: Clicking at a position shows caret elsewhere
- **Selection inaccuracy**: Selection highlights wrong text
- **Caret disappearing**: In Firefox and IE when `transform: scale()` is used, caret becomes invisible
- **Caret jumps**: Caret misplaces when navigating around `contenteditable="false"` elements with zoom
- **Pixel rounding errors**: Sub-pixel rendering causes coordinate calculation issues

## Browser Comparison

- **Firefox**: Most affected, especially with CSS transforms
- **Chrome**: Issues with zoom and non-editable elements (fixed in v106+)
- **Safari**: Similar issues with transforms
- **Edge**: Similar to Chrome
- **IE**: Historical issues with zoom and caret positioning

## Impact

- **Poor user experience**: Users cannot accurately place cursor or select text
- **Accessibility issues**: Makes editing difficult for users who need zoom
- **Visual mismatch**: What users see doesn't match actual selection
- **Editing frustration**: Continuous editing becomes difficult

## Workarounds

### 1. Use display: inline-block

Helps Chrome with caret placement:

```css
[contenteditable="true"] {
  display: inline-block;
}
```

### 2. Add Visible BR When Empty

Prevents Firefox caret invisibility:

```javascript
if (editableElement.innerHTML.trim() === '') {
  editableElement.innerHTML = '<br>';
}
```

### 3. Insert Zero-Width Spaces

Around `contenteditable="false"` elements:

```javascript
function insertZWS(element) {
  const zws = document.createTextNode('\u200B');
  element.parentNode.insertBefore(zws, element.nextSibling);
}
```

### 4. Avoid CSS transform: scale

Use font-size or layout adjustments instead:

```css
/* Instead of: */
.editor {
  transform: scale(1.5);
}

/* Use: */
.editor {
  font-size: 150%;
}
```

### 5. Use window.visualViewport API

For custom UI calculations:

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

Prevents dead-space clicking issues:

```css
[contenteditable="true"] {
  line-height: 1.5;
  font-size: 16px;
}
```

## References

- [Stack Overflow: Caret disappears when scaled down in Firefox](https://stackoverflow.com/questions/16031918/why-does-the-contenteditables-caret-disappear-when-it-is-scaled-down-in-firefox) - Transform scale issues
- [ProseMirror Discuss: Wrong cursor position in Chromium < 106](https://discuss.prosemirror.net/t/wrong-cursor-position-in-chromium-version-less-than-106-x/4976) - Chrome zoom fixes
- [Stack Overflow: Caret positioning with large line-height](https://stackoverflow.com/questions/56837287/positioning-the-caret-in-a-contenteditable-with-large-line-height-in-chrome) - Line-height issues
- [WebKit Bug 19058: Caret drawing in transformed contentEditable](https://lists.webkit.org/pipermail/webkit-unassigned/2010-November/1082244.html) - WebKit transform bug
- [Stack Overflow: CSS zoom and getBoundingClientRect](https://stackoverflow.com/questions/44277435/css-zoom-property-not-working-with-boundingclientrectangle) - Coordinate calculation
