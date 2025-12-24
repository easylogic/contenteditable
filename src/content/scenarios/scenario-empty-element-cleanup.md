---
id: scenario-empty-element-cleanup
title: Empty elements accumulate in DOM during editing
description: "During editing operations, empty elements (empty paragraphs, divs, spans with no content) accumulate in the DOM. These elements can cause layout issues, make the HTML bloated, and create unexpected behavior. Browsers handle empty element cleanup inconsistently."
category: formatting
tags:
  - empty
  - cleanup
  - dom
  - structure
status: draft
---

During editing operations, empty elements (empty paragraphs, divs, spans with no content) accumulate in the DOM. These elements can cause layout issues, make the HTML bloated, and create unexpected behavior. Browsers handle empty element cleanup inconsistently.

## Observed Behavior

### Scenario 1: Empty paragraphs after deletion
- **Chrome/Edge**: May leave empty `<p>` or `<div>` elements
- **Firefox**: Similar behavior
- **Safari**: May create different empty structures

### Scenario 2: Empty spans after formatting removal
- **Chrome/Edge**: Empty `<span>` elements with style attributes may remain
- **Firefox**: Similar issues
- **Safari**: Empty span handling varies

### Scenario 3: Nested empty elements
- **Chrome/Edge**: May create nested empty structures
- **Firefox**: Similar behavior
- **Safari**: Nested empty elements most common

### Scenario 4: Empty list items
- **Chrome/Edge**: Empty `<li>` elements may remain
- **Firefox**: Similar behavior
- **Safari**: Empty list handling inconsistent

## Impact

- Bloated HTML
- Layout issues from empty elements
- Unexpected spacing and behavior
- Need for cleanup logic

## Browser Comparison

- **Chrome/Edge**: Generally better at cleanup but still leaves empty elements
- **Firefox**: More likely to leave empty elements
- **Safari**: Most likely to accumulate empty elements

## Workaround

Implement cleanup logic:

```javascript
function cleanupEmptyElements(element) {
  // Remove empty spans (except those with meaningful attributes)
  const spans = element.querySelectorAll('span');
  spans.forEach(span => {
    const hasContent = span.textContent.trim() || span.querySelector('img, br');
    const hasOnlyWhitespace = span.textContent.trim() === '' && !span.querySelector('img, br');
    
    if (hasOnlyWhitespace && !span.hasAttribute('data-keep')) {
      // Move children to parent
      const parent = span.parentNode;
      while (span.firstChild) {
        parent.insertBefore(span.firstChild, span);
      }
      span.remove();
    }
  });
  
  // Remove empty paragraphs and divs (but keep at least one)
  const blocks = element.querySelectorAll('p, div');
  let hasContentBlock = false;
  
  blocks.forEach(block => {
    const hasContent = block.textContent.trim() || block.querySelector('img, br, ul, ol');
    if (hasContent) {
      hasContentBlock = true;
    }
  });
  
  blocks.forEach(block => {
    const hasContent = block.textContent.trim() || block.querySelector('img, br, ul, ol');
    if (!hasContent && hasContentBlock) {
      // Remove empty block, but keep structure if it's the only one
      const parent = block.parentNode;
      while (block.firstChild) {
        parent.insertBefore(block.firstChild, block);
      }
      block.remove();
    } else if (!hasContent && !hasContentBlock) {
      // Keep at least one empty block with <br>
      if (!block.querySelector('br')) {
        block.appendChild(document.createElement('br'));
      }
    }
  });
  
  // Remove empty list items
  const listItems = element.querySelectorAll('li');
  listItems.forEach(li => {
    if (!li.textContent.trim() && li.children.length === 0) {
      const list = li.parentElement;
      li.remove();
      
      // Remove list if empty
      if (list.children.length === 0) {
        list.remove();
      }
    }
  });
}

// Cleanup on input
element.addEventListener('input', () => {
  requestAnimationFrame(() => {
    cleanupEmptyElements(element);
  });
});
```

