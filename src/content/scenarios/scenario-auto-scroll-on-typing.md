---
id: scenario-auto-scroll-on-typing
title: Auto-scroll behavior during typing varies across browsers
description: "When typing near the edges of a contenteditable element, browsers automatically scroll to keep the cursor visible. However, the scroll behavior, timing, and smoothness varies across browsers, which can cause jarring user experiences."
category: performance
tags:
  - scroll
  - cursor
  - viewport
  - typing
status: draft
locale: en
---

When typing near the edges of a contenteditable element, browsers automatically scroll to keep the cursor visible. However, the scroll behavior, timing, and smoothness varies across browsers, which can cause jarring user experiences.

## Observed Behavior

### Scenario 1: Typing at bottom edge
- **Chrome/Edge**: Scrolls smoothly to keep cursor visible
- **Firefox**: May scroll more abruptly
- **Safari**: Scroll behavior may be different

### Scenario 2: Typing at top edge
- **Chrome/Edge**: Scrolls up to show cursor
- **Firefox**: Similar behavior but timing may differ
- **Safari**: Scroll timing and smoothness varies

### Scenario 3: Rapid typing
- **Chrome/Edge**: May scroll multiple times or lag
- **Firefox**: Similar scroll lag issues
- **Safari**: Scroll performance may differ

### Scenario 4: Scroll position restoration
- **Chrome/Edge**: May restore scroll position after operations
- **Firefox**: Similar behavior
- **Safari**: Scroll restoration may be inconsistent

## Impact

- Jarring scroll experience
- Performance issues during rapid typing
- Cursor may go out of view
- Inconsistent user experience

## Browser Comparison

- **Chrome/Edge**: Generally smoother scrolling
- **Firefox**: May scroll more abruptly
- **Safari**: Scroll behavior most inconsistent

## Workaround

Implement custom scroll management:

```javascript
function scrollIntoViewIfNeeded(element, range) {
  const rect = range.getBoundingClientRect();
  const containerRect = element.getBoundingClientRect();
  
  const scrollMargin = 50; // pixels
  
  // Check if cursor is near top edge
  if (rect.top < containerRect.top + scrollMargin) {
    element.scrollTop -= (containerRect.top + scrollMargin - rect.top);
  }
  
  // Check if cursor is near bottom edge
  if (rect.bottom > containerRect.bottom - scrollMargin) {
    element.scrollTop += (rect.bottom - containerRect.bottom + scrollMargin);
  }
  
  // Check if cursor is near left edge
  if (rect.left < containerRect.left + scrollMargin) {
    element.scrollLeft -= (containerRect.left + scrollMargin - rect.left);
  }
  
  // Check if cursor is near right edge
  if (rect.right > containerRect.right - scrollMargin) {
    element.scrollLeft += (rect.right - containerRect.right + scrollMargin);
  }
}

element.addEventListener('input', () => {
  const selection = window.getSelection();
  if (selection.rangeCount > 0) {
    const range = selection.getRangeAt(0);
    // Use requestAnimationFrame for smooth scrolling
    requestAnimationFrame(() => {
      scrollIntoViewIfNeeded(element, range);
    });
  }
});
```

## References

- [GitHub Gist: Get caret position](https://gist.github.com/nothingismagick/642861242050c1d5f3f1cfa7bcd2b3fd) - Caret position calculation
- [Stack Overflow: Keep caret position when innerHTML changes](https://stackoverflow.com/questions/69956977/html-contenteditable-keep-caret-position-when-inner-html-changes) - Selection preservation
- [TipTap Issue #2629: iOS Safari caret visibility](https://github.com/ueberdosis/tiptap/issues/2629) - Mobile scroll issues
- [Stack Overflow: Edit cursor not displayed on Chrome](https://stackoverflow.com/questions/25897883/edit-cursor-not-displayed-on-chrome-in-contenteditable) - Empty element caret issues
- [Stack Overflow: Cursor caret is not visible in contenteditable](https://stackoverflow.com/questions/13073679/cursor-caret-is-not-visible-in-contenteditable-div) - CSS caret visibility
