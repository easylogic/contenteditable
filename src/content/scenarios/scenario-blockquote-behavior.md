---
id: scenario-blockquote-behavior
title: Blockquote editing behavior varies across browsers
description: "Editing text within blockquote elements in contenteditable behaves inconsistently across browsers. Pressing Enter, applying formatting, or pasting content may break the blockquote structure, create nested blockquotes, or behave unexpectedly."
category: formatting
tags:
  - blockquote
  - quote
  - indentation
  - structure
status: draft
---

Editing text within blockquote elements in contenteditable behaves inconsistently across browsers. Pressing Enter, applying formatting, or pasting content may break the blockquote structure, create nested blockquotes, or behave unexpectedly.

## Observed Behavior

### Scenario 1: Pressing Enter in a blockquote
- **Chrome/Edge**: Creates a new paragraph within the blockquote
- **Firefox**: May create new paragraph or break blockquote structure
- **Safari**: Behavior varies, may create nested blockquotes

### Scenario 2: Applying formatting in blockquote
- **Chrome/Edge**: Formatting is applied, but may break structure
- **Firefox**: May break blockquote structure when formatting
- **Safari**: Most likely to break structure

### Scenario 3: Pasting content into blockquote
- **Chrome/Edge**: May preserve blockquote or break it
- **Firefox**: More likely to break blockquote structure
- **Safari**: May create unexpected nested structures

### Scenario 4: Exiting blockquote
- **Chrome/Edge**: May require multiple Enter presses or manual exit
- **Firefox**: Similar behavior
- **Safari**: Exiting behavior inconsistent

## Impact

- Difficulty maintaining blockquote structure
- Unexpected nested blockquotes
- Structure breaks during editing
- Poor user experience when working with quotes

## Browser Comparison

- **Chrome/Edge**: Generally better blockquote handling
- **Firefox**: More likely to break structure
- **Safari**: Most inconsistent behavior

## Workaround

Implement custom blockquote handling:

```javascript
element.addEventListener('beforeinput', (e) => {
  if (e.inputType === 'insertParagraph') {
    const selection = window.getSelection();
    if (selection.rangeCount === 0) return;
    
    const range = selection.getRangeAt(0);
    const blockquote = range.startContainer.closest('blockquote');
    
    if (blockquote) {
      e.preventDefault();
      
      // Create new paragraph within blockquote
      const p = document.createElement('p');
      const br = document.createElement('br');
      p.appendChild(br);
      
      range.deleteContents();
      range.insertNode(p);
      range.setStartBefore(br);
      range.collapse(true);
      
      selection.removeAllRanges();
      selection.addRange(range);
    }
  }
});

// Prevent breaking blockquote structure when pasting
element.addEventListener('paste', (e) => {
  const selection = window.getSelection();
  if (selection.rangeCount === 0) return;
  
  const range = selection.getRangeAt(0);
  const blockquote = range.startContainer.closest('blockquote');
  
  if (blockquote) {
    e.preventDefault();
    const html = e.clipboardData.getData('text/html');
    const text = e.clipboardData.getData('text/plain');
    
    // Strip blockquote tags from pasted content to avoid nesting
    const temp = document.createElement('div');
    temp.innerHTML = html;
    const blockquotes = temp.querySelectorAll('blockquote');
    blockquotes.forEach(bq => {
      const parent = bq.parentNode;
      while (bq.firstChild) {
        parent.insertBefore(bq.firstChild, bq);
      }
      parent.removeChild(bq);
    });
    
    range.deleteContents();
    range.insertNode(document.createRange().createContextualFragment(temp.innerHTML));
  }
});
```

