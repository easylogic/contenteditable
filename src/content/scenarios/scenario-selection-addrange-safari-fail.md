---
id: scenario-selection-addrange-safari-fail
title: selection.addRange not working correctly in Safari
description: When setting cursor position using `selection.addRange()` in a contenteditable element, it works correctly in Chrome and Firefox but fails in Safari. The selection "pops out" of intended marker element and moves to the next sibling's text node instead of staying within the marker.
category: selection
tags:
  - selection
  - safari
  - webkit
  - cursor
  - addRange
status: draft
locale: en
---

When using `window.getSelection().addRange()` to set cursor position in a contenteditable element, Safari exhibits incorrect behavior that breaks the intended selection placement.

## Problem Description

This issue occurs when:
1. A contenteditable element contains nested elements (e.g., `<span>` markers)
2. Application tries to set cursor position programmatically using `selection.addRange()`
3. Specifically when trying to position cursor within or near a specific element

### Expected Behavior
- Cursor (caret) should be positioned at the intended location within the specified element
- Selection should remain within the intended container
- Behavior should match Chrome and Firefox

### Actual Behavior (Safari Bug)
- **Selection pops out**: Instead of staying within the intended element, selection jumps to the next sibling's text node
- **Wrong container**: Selection ends up in a different element than intended
- **Inconsistent**: Behavior differs from Chrome and Firefox

## Affected Browsers

- **Safari** (all versions) - Issue confirmed, WebKit bug
- **Chrome** - Works correctly
- **Firefox** - Works correctly

## Root Cause

Safari's WebKit selection API has a known issue with nested elements and `addRange()`:
1. When a range is created pointing to a location within a nested element
2. Safari may incorrectly calculate the selection boundary
3. Instead of respecting the intended container, Safari moves selection to an adjacent text node

This is particularly problematic when:
- Working with markers or placeholders (e.g., `<span>` tags with specific IDs)
- Trying to set cursor after programmatic DOM changes
- Using `selection.addRange()` instead of `selection.collapse()`

## Workarounds

1. **Use selection.collapse() with node and offset**:
   ```javascript
   const range = document.createRange();
   range.setStart(textNode, offset);
   range.collapse(true); // true = collapse to end
   const selection = window.getSelection();
   selection.removeAllRanges();
   selection.addRange(range);
   ```

2. **Use setTimeout with selection manipulation**:
   ```javascript
   setTimeout(() => {
     const range = document.createRange();
     range.setStart(element, 0);
     range.collapse(true);
     const selection = window.getSelection();
     selection.removeAllRanges();
     selection.addRange(range);
   }, 10);
   ```

3. **Force focus on the element first**:
   ```javascript
   targetElement.focus();
   setTimeout(() => {
     // Now try setting selection
     const range = document.createRange();
     range.setStart(targetElement, 0);
     const selection = window.getSelection();
     selection.removeAllRanges();
     selection.addRange(range);
   }, 0);
   ```

4. **Avoid nested elements**:
   - Simplify DOM structure to avoid deep nesting
   - Use data attributes or class-based markers instead of separate span elements

## Reference

- Stack Overflow: https://stackoverflow.com/questions/39906099
