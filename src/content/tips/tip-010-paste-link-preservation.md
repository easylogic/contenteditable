---
id: tip-010-paste-link-preservation
title: Preserving link structure when pasting
description: "How to preserve link titles and HTML structure when pasting links into contenteditable elements, especially in Safari"
category: paste
tags:
  - paste
  - link
  - clipboard
  - safari
  - url
  - html
difficulty: intermediate
relatedScenarios:
  - scenario-paste-link-behavior
relatedCases:
  - ce-0301-safari-paste-link-url-only-en
locale: en
---

## Problem

When pasting links into `contenteditable` elements, Safari only pastes the URL as plain text, losing the link's title and HTML structure. Other browsers (Chrome, Firefox, Edge) correctly preserve both the link title and URL. This inconsistency causes loss of context and requires users to manually recreate links with titles.

## Solution

### 1. Intercept Paste Event and Reconstruct Links

Use the paste event to read clipboard data and manually create link elements:

```javascript
const editor = document.querySelector('div[contenteditable]');

editor.addEventListener('paste', async (e) => {
  e.preventDefault();
  
  const clipboardData = e.clipboardData || window.clipboardData;
  const pastedText = clipboardData.getData('text/plain');
  
  // Check if pasted text is a URL
  const urlPattern = /^https?:\/\/.+/;
  if (urlPattern.test(pastedText.trim())) {
    // Try to get link title from clipboard
    let linkTitle = pastedText;
    
    try {
      const htmlData = clipboardData.getData('text/html');
      if (htmlData) {
        const parser = new DOMParser();
        const doc = parser.parseFromString(htmlData, 'text/html');
        const link = doc.querySelector('a');
        if (link) {
          linkTitle = link.textContent || link.href;
        }
      }
    } catch (err) {
      // Fallback to URL if HTML parsing fails
    }
    
    // Create and insert link element
    const selection = window.getSelection();
    if (selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      range.deleteContents();
      
      const link = document.createElement('a');
      link.href = pastedText.trim();
      link.textContent = linkTitle;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      
      range.insertNode(link);
      range.collapse(false);
      
      selection.removeAllRanges();
      selection.addRange(range);
    }
  } else {
    // Not a URL, paste as normal text
    const selection = window.getSelection();
    if (selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      range.deleteContents();
      const textNode = document.createTextNode(pastedText);
      range.insertNode(textNode);
      range.collapse(false);
      selection.removeAllRanges();
      selection.addRange(range);
    }
  }
});
```

### 2. Use Clipboard API for Better Control

Use the modern Clipboard API when available for more reliable link data extraction:

```javascript
const editor = document.querySelector('div[contenteditable]');

editor.addEventListener('paste', async (e) => {
  e.preventDefault();
  
  let pastedText = '';
  let linkTitle = '';
  
  try {
    // Try modern Clipboard API first
    if (navigator.clipboard && navigator.clipboard.readText) {
      pastedText = await navigator.clipboard.readText();
    } else {
      // Fallback to paste event data
      const clipboardData = e.clipboardData || window.clipboardData;
      pastedText = clipboardData.getData('text/plain');
    }
  } catch (err) {
    // Fallback to paste event data
    const clipboardData = e.clipboardData || window.clipboardData;
    pastedText = clipboardData.getData('text/plain');
  }
  
  // Check if pasted text is a URL
  const urlPattern = /^https?:\/\/.+/;
  if (urlPattern.test(pastedText.trim())) {
    // Try to extract link title from HTML clipboard data
    try {
      const clipboardData = e.clipboardData || window.clipboardData;
      const htmlData = clipboardData.getData('text/html');
      
      if (htmlData) {
        const parser = new DOMParser();
        const doc = parser.parseFromString(htmlData, 'text/html');
        const link = doc.querySelector('a');
        if (link) {
          linkTitle = link.textContent || link.title || link.href;
        }
      }
    } catch (err) {
      // HTML parsing failed
    }
    
    // Use URL as title if no title found
    if (!linkTitle) {
      linkTitle = pastedText.trim();
    }
    
    // Insert link
    insertLinkAtCursor(pastedText.trim(), linkTitle);
  } else {
    // Not a URL, paste as normal text
    insertTextAtCursor(pastedText);
  }
});

function insertLinkAtCursor(url, title) {
  const selection = window.getSelection();
  if (selection.rangeCount === 0) return;
  
  const range = selection.getRangeAt(0);
  range.deleteContents();
  
  const link = document.createElement('a');
  link.href = url;
  link.textContent = title;
  link.target = '_blank';
  link.rel = 'noopener noreferrer';
  
  range.insertNode(link);
  range.collapse(false);
  
  selection.removeAllRanges();
  selection.addRange(range);
}

function insertTextAtCursor(text) {
  const selection = window.getSelection();
  if (selection.rangeCount === 0) return;
  
  const range = selection.getRangeAt(0);
  range.deleteContents();
  const textNode = document.createTextNode(text);
  range.insertNode(textNode);
  range.collapse(false);
  
  selection.removeAllRanges();
  selection.addRange(range);
}
```

### 3. Detect and Convert Plain URL Pastes

As a fallback, detect when a plain URL is pasted and automatically convert it to a link:

```javascript
const editor = document.querySelector('div[contenteditable]');

editor.addEventListener('paste', (e) => {
  const clipboardData = e.clipboardData || window.clipboardData;
  const pastedText = clipboardData.getData('text/plain');
  
  // Check if pasted text is a URL
  if (isUrl(pastedText.trim())) {
    e.preventDefault();
    
    const selection = window.getSelection();
    if (selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      range.deleteContents();
      
      const link = document.createElement('a');
      link.href = pastedText.trim();
      link.textContent = pastedText.trim();
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      
      range.insertNode(link);
      range.collapse(false);
      
      selection.removeAllRanges();
      selection.addRange(range);
    }
  }
  // If not a URL, let default paste behavior proceed
});

function isUrl(text) {
  const urlPattern = /^https?:\/\/[^\s]+$/;
  return urlPattern.test(text.trim());
}
```

### 4. Comprehensive Link Paste Handler

A complete solution that handles various edge cases:

```javascript
class LinkPasteHandler {
  constructor(element) {
    this.element = element;
    this.init();
  }
  
  init() {
    this.element.addEventListener('paste', this.handlePaste.bind(this));
  }
  
  async handlePaste(e) {
    const clipboardData = e.clipboardData || window.clipboardData;
    const pastedText = clipboardData.getData('text/plain');
    
    // Check if pasted text is a URL
    if (!this.isUrl(pastedText)) {
      return; // Let default paste behavior proceed
    }
    
    e.preventDefault();
    
    // Try to get link title from HTML clipboard data
    let linkTitle = pastedText.trim();
    try {
      const htmlData = clipboardData.getData('text/html');
      if (htmlData) {
        const title = this.extractLinkTitle(htmlData);
        if (title) {
          linkTitle = title;
        }
      }
    } catch (err) {
      // HTML parsing failed, use URL as title
    }
    
    // Insert link at cursor position
    this.insertLink(pastedText.trim(), linkTitle);
  }
  
  isUrl(text) {
    const urlPattern = /^https?:\/\/[^\s]+$/;
    return urlPattern.test(text.trim());
  }
  
  extractLinkTitle(html) {
    try {
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, 'text/html');
      const link = doc.querySelector('a');
      if (link) {
        return link.textContent || link.title || link.href;
      }
    } catch (err) {
      // Parsing failed
    }
    return null;
  }
  
  insertLink(url, title) {
    const selection = window.getSelection();
    if (selection.rangeCount === 0) return;
    
    const range = selection.getRangeAt(0);
    range.deleteContents();
    
    const link = document.createElement('a');
    link.href = url;
    link.textContent = title;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    
    range.insertNode(link);
    
    // Move cursor after the link
    range.setStartAfter(link);
    range.collapse(true);
    
    selection.removeAllRanges();
    selection.addRange(range);
  }
  
  dispose() {
    this.element.removeEventListener('paste', this.handlePaste);
  }
}

// Usage
const editor = document.querySelector('div[contenteditable]');
const handler = new LinkPasteHandler(editor);
```

## Notes

- Safari is the primary browser affected by this issue, but the solution works across all browsers
- The Clipboard API requires HTTPS or localhost for security reasons
- Always use `e.preventDefault()` when handling paste events manually to prevent default behavior
- Consider preserving other link attributes like `title`, `rel`, or custom data attributes if needed
- Test with links copied from different sources (right-click menu, selected text, etc.)
- The HTML clipboard data format may vary between browsers, so parsing should be robust
- For better UX, you might want to show a loading indicator while processing clipboard data

## Related Resources

- [Scenario: Link pasting behavior](/scenarios/scenario-paste-link-behavior)
- [Case: ce-0301](/cases/ce-0301-safari-paste-link-url-only-en)
