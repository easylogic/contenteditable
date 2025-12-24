---
id: scenario-nested-formatting
title: Nested formatting elements create complex DOM structures
description: "Applying multiple formatting operations (bold, italic, underline, etc.) creates nested HTML elements that can become complex and hard to manage. Browsers handle nested formatting differently, and the resulting DOM structure can be inconsistent."
category: formatting
tags:
  - formatting
  - nested
  - bold
  - italic
  - structure
status: draft
---

Applying multiple formatting operations (bold, italic, underline, etc.) creates nested HTML elements that can become complex and hard to manage. Browsers handle nested formatting differently, and the resulting DOM structure can be inconsistent.

## Observed Behavior

### Scenario 1: Applying bold then italic
- **Chrome/Edge**: May create `<b><i>text</i></b>` or `<i><b>text</b></i>`
- **Firefox**: Similar nested structure, order may differ
- **Safari**: Nesting order most inconsistent

### Scenario 2: Removing nested formatting
- **Chrome/Edge**: May leave empty elements or partial nesting
- **Firefox**: Similar issues
- **Safari**: Formatting removal most likely to break structure

### Scenario 3: Overlapping formatting
- **Chrome/Edge**: May create complex nested structures
- **Firefox**: Similar behavior
- **Safari**: Most complex nesting

### Scenario 4: Formatting normalization
- **Chrome/Edge**: No automatic normalization
- **Firefox**: Similar lack of normalization
- **Safari**: Normalization behavior varies

## Impact

- Complex and bloated DOM
- Difficulty managing formatting state
- Inconsistent formatting structure
- Need for normalization logic

## Browser Comparison

- **Chrome/Edge**: Generally creates more predictable nesting
- **Firefox**: Similar nesting behavior
- **Safari**: Most inconsistent nesting

## Workaround

Normalize formatting structure:

```javascript
function normalizeFormatting(element) {
  // Normalize nested formatting to consistent structure
  const formattingTags = ['b', 'strong', 'i', 'em', 'u', 's', 'strike'];
  
  formattingTags.forEach(tag => {
    const elements = element.querySelectorAll(tag);
    elements.forEach(el => {
      // If element only contains whitespace, remove it
      if (!el.textContent.trim()) {
        const parent = el.parentNode;
        while (el.firstChild) {
          parent.insertBefore(el.firstChild, el);
        }
        el.remove();
        return;
      }
      
      // If parent has same tag, merge
      if (el.parentElement && el.parentElement.tagName.toLowerCase() === tag) {
        const parent = el.parentElement;
        while (el.firstChild) {
          parent.insertBefore(el.firstChild, el);
        }
        el.remove();
      }
    });
  });
  
  // Ensure consistent tag usage (b vs strong, i vs em)
  element.querySelectorAll('strong').forEach(strong => {
    const b = document.createElement('b');
    while (strong.firstChild) {
      b.appendChild(strong.firstChild);
    }
    strong.parentNode.replaceChild(b, strong);
  });
  
  element.querySelectorAll('em').forEach(em => {
    const i = document.createElement('i');
    while (em.firstChild) {
      i.appendChild(em.firstChild);
    }
    em.parentNode.replaceChild(i, em);
  });
}

element.addEventListener('input', () => {
  requestAnimationFrame(() => {
    normalizeFormatting(element);
  });
});
```

