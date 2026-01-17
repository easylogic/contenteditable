---
id: tip-012-disable-auto-hyperlink-detection
title: Disabling automatic hyperlink detection in contenteditable
description: "How to prevent browsers from automatically converting URLs, emails, and phone numbers into clickable links in contenteditable elements"
category: browser-feature
tags:
  - hyperlink
  - auto-link
  - url-detection
  - email-detection
  - internet-explorer
  - data-detectors
  - mobile
difficulty: beginner
relatedScenarios:
  - scenario-browser-hyperlink-detection
relatedCases: []
locale: en
---

## Problem

Browsers, especially Internet Explorer and legacy Edge, automatically detect URLs, email addresses, and phone numbers in `contenteditable` elements and convert them into clickable links. This auto-linking behavior can interfere with editing, cause cursor positioning issues, create unwanted markup, and disrupt undo/redo functionality. Mobile Safari also uses data detectors for phone numbers and dates.

## Solution

### 1. Disable AutoUrlDetect (IE/Legacy Edge)

Use `execCommand` to disable automatic URL detection in Internet Explorer and legacy Edge:

```javascript
// Disable auto-linking on page load
if (document.execCommand) {
  document.execCommand("AutoUrlDetect", false, false);
}

// Or disable for specific element
const editor = document.querySelector('div[contenteditable]');
editor.addEventListener('focus', () => {
  if (document.execCommand) {
    document.execCommand("AutoUrlDetect", false, false);
  }
});
```

### 2. Use contenteditable="plaintext-only"

Disable all rich-text behaviors including auto-linking by using `plaintext-only` mode:

```html
<div contenteditable="plaintext-only">
  Plain text only, no auto-linking
</div>
```

**Note**: Firefox support for `plaintext-only` is limited. This works best in Chrome, Safari, and Edge.

### 3. Monitor and Remove Auto-Created Links

Use MutationObserver to detect and remove automatically created links:

```javascript
const editor = document.querySelector('div[contenteditable]');

const observer = new MutationObserver((mutations) => {
  mutations.forEach((mutation) => {
    mutation.addedNodes.forEach((node) => {
      if (node.nodeType === Node.ELEMENT_NODE) {
        // Check if node itself is a link
        if (node.tagName === 'A' && node.href) {
          const text = node.textContent;
          if (this.isAutoLink(text, node.href)) {
            this.unwrapLink(node);
          }
        }
        
        // Check for links inside the node
        const links = node.querySelectorAll?.('a');
        if (links) {
          links.forEach(link => {
            const text = link.textContent;
            if (this.isAutoLink(text, link.href)) {
              this.unwrapLink(link);
            }
          });
        }
      }
    });
  });
});

observer.observe(editor, {
  childList: true,
  subtree: true
});

function isAutoLink(text, href) {
  // Check if link matches common auto-link patterns
  const urlPattern = /^https?:\/\/.+/;
  const emailPattern = /^[\w.-]+@[\w.-]+$/;
  const phonePattern = /^[\d\s\-+()]+$/;
  
  return (urlPattern.test(text) || emailPattern.test(text) || phonePattern.test(text)) &&
         text === href.replace(/^mailto:/, '').replace(/^tel:/, '');
}

function unwrapLink(link) {
  const parent = link.parentNode;
  const text = document.createTextNode(link.textContent);
  parent.replaceChild(text, link);
}
```

### 4. Disable iOS Data Detectors (Mobile Safari)

For mobile Safari, disable data detectors using meta tags and attributes:

```html
<head>
  <meta name="format-detection" content="telephone=no, email=no, address=no">
</head>

<div contenteditable="true" x-apple-data-detectors="false">
  Content without auto-linking
</div>
```

Or via JavaScript:

```javascript
const editor = document.querySelector('div[contenteditable]');
editor.setAttribute('x-apple-data-detectors', 'false');

// Also set meta tag if not already present
if (!document.querySelector('meta[name="format-detection"]')) {
  const meta = document.createElement('meta');
  meta.name = 'format-detection';
  meta.content = 'telephone=no, email=no, address=no';
  document.head.appendChild(meta);
}
```

### 5. Post-Process Before Saving

Clean up auto-created links before saving or submitting content:

```javascript
function removeAutoLinks(element) {
  const links = element.querySelectorAll('a');
  links.forEach(link => {
    const text = link.textContent;
    const href = link.href;
    
    // Check if this looks like an auto-created link
    if (isAutoLink(text, href)) {
      const textNode = document.createTextNode(text);
      link.parentNode.replaceChild(textNode, link);
    }
  });
}

function isAutoLink(text, href) {
  // URL pattern
  if (text.match(/^https?:\/\/.+/)) {
    return text === href || text === href.replace(/\/$/, '');
  }
  
  // Email pattern
  if (text.match(/^[\w.-]+@[\w.-]+$/)) {
    return href === `mailto:${text}`;
  }
  
  // Phone pattern
  if (text.match(/^[\d\s\-+()]+$/)) {
    return href === `tel:${text.replace(/\s/g, '')}`;
  }
  
  return false;
}

// Before saving/submitting
removeAutoLinks(editableElement);
```

### 6. Disable Link Interaction While Editing

Use CSS to disable link interaction while still allowing editing:

```css
[contenteditable="true"] a {
  pointer-events: none;
  text-decoration: none;
  color: inherit;
  cursor: text;
}

[contenteditable="true"] a:hover {
  text-decoration: none;
}
```

This prevents links from being clickable while editing, but they remain in the DOM.

### 7. Comprehensive Auto-Link Prevention

A complete solution that handles all cases:

```javascript
class AutoLinkPreventer {
  constructor(editor) {
    this.editor = editor;
    this.init();
  }
  
  init() {
    // Disable AutoUrlDetect for IE/Legacy Edge
    if (document.execCommand) {
      document.execCommand("AutoUrlDetect", false, false);
    }
    
    // Disable iOS data detectors
    this.disableIOSDataDetectors();
    
    // Monitor for auto-created links
    this.observeAutoLinks();
    
    // Prevent link creation on input
    this.editor.addEventListener('input', this.handleInput.bind(this));
  }
  
  disableIOSDataDetectors() {
    this.editor.setAttribute('x-apple-data-detectors', 'false');
    
    if (!document.querySelector('meta[name="format-detection"]')) {
      const meta = document.createElement('meta');
      meta.name = 'format-detection';
      meta.content = 'telephone=no, email=no, address=no';
      document.head.appendChild(meta);
    }
  }
  
  observeAutoLinks() {
    this.observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === Node.ELEMENT_NODE) {
            if (node.tagName === 'A') {
              this.checkAndRemoveLink(node);
            }
            
            const links = node.querySelectorAll?.('a');
            if (links) {
              links.forEach(link => this.checkAndRemoveLink(link));
            }
          }
        });
      });
    });
    
    this.observer.observe(this.editor, {
      childList: true,
      subtree: true
    });
  }
  
  checkAndRemoveLink(link) {
    const text = link.textContent.trim();
    const href = link.getAttribute('href');
    
    if (this.isAutoLink(text, href)) {
      this.unwrapLink(link);
    }
  }
  
  isAutoLink(text, href) {
    if (!href) return false;
    
    // URL pattern
    if (/^https?:\/\/.+/.test(text)) {
      return text === href || text === href.replace(/\/$/, '');
    }
    
    // Email pattern
    if (/^[\w.-]+@[\w.-]+$/.test(text)) {
      return href === `mailto:${text}`;
    }
    
    // Phone pattern
    if (/^[\d\s\-+()]+$/.test(text)) {
      const normalizedPhone = text.replace(/\s/g, '');
      return href === `tel:${normalizedPhone}`;
    }
    
    return false;
  }
  
  unwrapLink(link) {
    const parent = link.parentNode;
    const text = document.createTextNode(link.textContent);
    parent.replaceChild(text, link);
  }
  
  handleInput(e) {
    // Clean up any links that might have been created
    setTimeout(() => {
      const links = this.editor.querySelectorAll('a');
      links.forEach(link => {
        if (this.isAutoLink(link.textContent.trim(), link.href)) {
          this.unwrapLink(link);
        }
      });
    }, 0);
  }
  
  dispose() {
    if (this.observer) {
      this.observer.disconnect();
    }
    this.editor.removeEventListener('input', this.handleInput);
  }
}

// Usage
const editor = document.querySelector('div[contenteditable]');
const preventer = new AutoLinkPreventer(editor);
```

## Notes

- Internet Explorer and legacy Edge are the most aggressive with auto-linking
- Modern browsers (Chrome, Firefox, Safari) generally don't auto-link by default, but some editors or extensions might
- Mobile Safari uses data detectors that can be disabled with meta tags
- The `plaintext-only` mode is the simplest solution but limits rich-text editing capabilities
- MutationObserver approach has a small performance overhead but provides the most control
- Be careful not to remove intentionally created links - only remove auto-detected ones
- Test with various URL formats, email addresses, and phone number formats
- Consider user expectations - some users might expect auto-linking behavior

## Related Resources

- [Scenario: Browser hyperlink detection](/scenarios/scenario-browser-hyperlink-detection)
