---
id: scenario-link-insertion
title: Link insertion and editing behavior varies across browsers
description: "When inserting or editing links in contenteditable elements, the behavior varies significantly across browsers. Creating links, editing link text, and removing links can result in unexpected DOM structures or lost formatting."
category: formatting
tags:
  - link
  - anchor
  - href
  - formatting
status: draft
locale: en
---

When inserting or editing links in contenteditable elements, the behavior varies significantly across browsers. Creating links, editing link text, and removing links can result in unexpected DOM structures or lost formatting.

## Observed Behavior

### Scenario 1: Creating a link from selected text
- **Chrome/Edge**: Creates `<a>` element around selected text, preserves formatting
- **Firefox**: May create nested links or lose formatting
- **Safari**: May create unexpected DOM structures

### Scenario 2: Editing text within a link
- **Chrome/Edge**: Text editing works, but link may be lost if all text is deleted
- **Firefox**: May break the link structure when editing
- **Safari**: May create nested elements or lose the link

### Scenario 3: Removing a link (keeping text)
- **Chrome/Edge**: May require manual DOM manipulation
- **Firefox**: Behavior varies, may leave empty anchor tags
- **Safari**: May create unexpected structures

### Scenario 4: Pasting a link
- **Chrome/Edge**: May create a link or paste as plain text
- **Firefox**: Behavior inconsistent
- **Safari**: May create nested links or lose link structure

## Impact

- Inconsistent link creation and editing experience
- Risk of creating malformed HTML (nested links)
- Loss of link structure when editing
- Difficulty implementing consistent link behavior

## Browser Comparison

- **Chrome/Edge**: Generally better link handling, but still has edge cases
- **Firefox**: More likely to create nested links or lose structure
- **Safari**: Most inconsistent behavior

## Workaround

Implement custom link handling:

```javascript
element.addEventListener('beforeinput', (e) => {
  if (e.inputType === 'formatCreateLink') {
    e.preventDefault();
    const selection = window.getSelection();
    if (selection.rangeCount === 0) return;
    
    const range = selection.getRangeAt(0);
    const url = prompt('Enter URL:');
    
    if (url) {
      // Create link while avoiding nested links
      createLinkSafely(range, url);
    }
  }
});

function createLinkSafely(range, url) {
  // Check if selection is already in a link
  const existingLink = range.commonAncestorContainer.closest('a');
  if (existingLink) {
    // Remove existing link first
    const parent = existingLink.parentNode;
    while (existingLink.firstChild) {
      parent.insertBefore(existingLink.firstChild, existingLink);
    }
    parent.removeChild(existingLink);
  }
  
  // Create new link
  const link = document.createElement('a');
  link.href = url;
  link.textContent = range.toString();
  
  range.deleteContents();
  range.insertNode(link);
}
```

