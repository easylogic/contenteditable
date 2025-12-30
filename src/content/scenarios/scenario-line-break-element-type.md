---
id: scenario-line-break-element-type
title: Line break element type varies across browsers
description: "When creating line breaks in contenteditable elements, browsers use different HTML elements: <br>, <p>, or <div>. This inconsistency makes it difficult to predict and normalize the DOM structure, especially when working with rich text editors."
category: formatting
tags:
  - line-break
  - br
  - paragraph
  - div
  - dom-structure
status: draft
locale: en
---

When creating line breaks in contenteditable elements, browsers use different HTML elements: `<br>`, `<p>`, or `<div>`. This inconsistency makes it difficult to predict and normalize the DOM structure, especially when working with rich text editors.

## Observed Behavior

### Scenario 1: Pressing Enter creates
- **Chrome/Edge**: `<div>` elements by default
- **Firefox**: `<p>` elements by default
- **Safari**: May create `<div>`, `<p>`, or `<br>` depending on context

### Scenario 2: Empty line creation
- **Chrome/Edge**: Creates empty `<div><br></div>` structure
- **Firefox**: Creates empty `<p><br></p>` or just `<p></p>`
- **Safari**: May create different structures

### Scenario 3: Normalization
- **Chrome/Edge**: Requires normalization to convert `<div>` to `<p>`
- **Firefox**: May need normalization to ensure consistent structure
- **Safari**: Requires most normalization work

### Scenario 4: CSS styling impact
- **Chrome/Edge**: `<div>` elements may have different default margins than `<p>`
- **Firefox**: `<p>` elements have default margins
- **Safari**: Styling varies based on element type

## Impact

- Inconsistent DOM structure across browsers
- Need for normalization logic
- CSS styling differences
- Difficulty maintaining consistent appearance

## Browser Comparison

- **Chrome/Edge**: Uses `<div>` by default
- **Firefox**: Uses `<p>` by default
- **Safari**: Most inconsistent

## Workaround

Normalize DOM structure:

```javascript
function normalizeLineBreaks(element) {
  // Convert all <div> elements used for line breaks to <p>
  const divs = element.querySelectorAll('div');
  divs.forEach(div => {
    // Check if div is used as a paragraph (not a container)
    const hasBlockChildren = Array.from(div.children).some(
      child => ['DIV', 'P', 'UL', 'OL', 'BLOCKQUOTE'].includes(child.tagName)
    );
    
    if (!hasBlockChildren) {
      const p = document.createElement('p');
      while (div.firstChild) {
        p.appendChild(div.firstChild);
      }
      div.parentNode.replaceChild(p, div);
    }
  });
  
  // Ensure empty paragraphs have <br> for proper display
  const paragraphs = element.querySelectorAll('p');
  paragraphs.forEach(p => {
    if (!p.textContent.trim() && !p.querySelector('br')) {
      p.appendChild(document.createElement('br'));
    }
  });
}

// Normalize after input
element.addEventListener('input', () => {
  normalizeLineBreaks(element);
});
```

