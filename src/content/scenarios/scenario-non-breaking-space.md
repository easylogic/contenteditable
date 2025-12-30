---
id: scenario-non-breaking-space
title: Non-breaking spaces behave differently from regular spaces
description: "Non-breaking spaces (`&nbsp;` or `\u00A0`) are used to preserve spacing in HTML, but they behave differently from regular spaces in contenteditable elements. They may be converted to regular spaces during editing, or may prevent line breaks in unexpected ways."
category: formatting
tags:
  - whitespace
  - nbsp
  - space
  - line-break
status: draft
locale: en
---

Non-breaking spaces (`&nbsp;` or `\u00A0`) are used to preserve spacing in HTML, but they behave differently from regular spaces in contenteditable elements. They may be converted to regular spaces during editing, or may prevent line breaks in unexpected ways.

## Observed Behavior

### Scenario 1: Typing after a non-breaking space
- **Chrome/Edge**: Non-breaking space may be converted to regular space
- **Firefox**: May preserve non-breaking space or convert it
- **Safari**: Behavior varies

### Scenario 2: Copying text with non-breaking spaces
- **Chrome/Edge**: Non-breaking spaces may be converted to regular spaces when copied
- **Firefox**: Similar behavior
- **Safari**: May preserve or convert

### Scenario 3: Pasting text with non-breaking spaces
- **Chrome/Edge**: May convert to regular spaces or preserve depending on source
- **Firefox**: Similar behavior
- **Safari**: Behavior inconsistent

### Scenario 4: Line breaks with non-breaking spaces
- **Chrome/Edge**: Non-breaking spaces prevent line breaks, which may be unexpected
- **Firefox**: Similar behavior
- **Safari**: May handle differently

## Impact

- Non-breaking spaces may be lost during editing
- Unexpected line break behavior
- Inconsistent behavior when copying/pasting
- Difficulty maintaining specific spacing requirements

## Browser Comparison

- **Chrome/Edge**: Generally converts non-breaking spaces to regular spaces during editing
- **Firefox**: Similar to Chrome
- **Safari**: More inconsistent behavior

## Workaround

Monitor and preserve non-breaking spaces:

```javascript
element.addEventListener('input', (e) => {
  // Check if non-breaking spaces were converted
  const walker = document.createTreeWalker(
    element,
    NodeFilter.SHOW_TEXT,
    null
  );
  
  let node;
  while (node = walker.nextNode()) {
    // Replace regular spaces that should be non-breaking
    // (This is a simplified example - actual logic would be more complex)
    if (node.textContent.includes('  ')) {
      // Handle multiple spaces
    }
  }
});

// Preserve non-breaking spaces when pasting
element.addEventListener('paste', (e) => {
  e.preventDefault();
  const text = e.clipboardData.getData('text/plain');
  const html = e.clipboardData.getData('text/html');
  
  // Convert multiple spaces to non-breaking spaces if needed
  const processedText = text.replace(/  +/g, (match) => {
    return '\u00A0'.repeat(match.length);
  });
  
  const selection = window.getSelection();
  if (selection.rangeCount > 0) {
    const range = selection.getRangeAt(0);
    range.deleteContents();
    range.insertNode(document.createTextNode(processedText));
  }
});
```

