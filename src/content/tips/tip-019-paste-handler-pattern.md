---
id: tip-019-paste-handler-pattern
title: Handle paste events with sanitization
description: "How to intercept and handle paste events in contenteditable, sanitize HTML content, and control what gets pasted"
category: common-patterns
tags:
  - paste
  - clipboard
  - sanitization
  - html
  - security
  - pattern
difficulty: intermediate
relatedScenarios: []
relatedCases: []
locale: en
---

## When to Use This Tip

Use this pattern when you need to:
- Intercept paste operations
- Sanitize pasted HTML content
- Strip unwanted formatting or styles
- Convert pasted content to plain text
- Control what HTML elements are allowed
- Handle paste from different sources (Word, Google Docs, etc.)

## Problem

Paste operations in contenteditable can:
- Include unwanted HTML from external sources
- Bring in inline styles that break your design
- Include scripts or unsafe content
- Preserve formatting you don't want
- Create inconsistent DOM structures

## Solution

### 1. Basic Paste Handler

Simple paste interception and sanitization:

```javascript
class PasteHandler {
  constructor(editor, options = {}) {
    this.editor = editor;
    this.options = {
      allowedTags: options.allowedTags || ['p', 'br', 'strong', 'em', 'u', 'a', 'ul', 'ol', 'li'],
      allowedAttributes: options.allowedAttributes || ['href', 'title'],
      stripStyles: options.stripStyles !== false,
      convertToPlainText: options.convertToPlainText || false,
      ...options,
    };
    this.init();
  }
  
  init() {
    this.editor.addEventListener('paste', (e) => {
      e.preventDefault();
      this.handlePaste(e);
    });
  }
  
  handlePaste(e) {
    const clipboardData = e.clipboardData || window.clipboardData;
    if (!clipboardData) return;
    
    const html = clipboardData.getData('text/html');
    const text = clipboardData.getData('text/plain');
    
    const selection = window.getSelection();
    if (selection.rangeCount === 0) return;
    
    const range = selection.getRangeAt(0);
    
    // Delete selected content
    if (!range.collapsed) {
      range.deleteContents();
    }
    
    // Process content
    let content;
    if (this.options.convertToPlainText) {
      content = this.createTextNode(text || html);
    } else if (html) {
      content = this.sanitizeHTML(html);
    } else if (text) {
      content = this.createTextNode(text);
    } else {
      return;
    }
    
    // Insert content
    if (content.nodeType === Node.DOCUMENT_FRAGMENT_NODE) {
      range.insertNode(content);
      // Move cursor after inserted content
      range.setStartAfter(content.lastChild || content);
    } else {
      range.insertNode(content);
      range.setStartAfter(content);
    }
    
    range.collapse(true);
    
    selection.removeAllRanges();
    selection.addRange(range);
    
    // Trigger input event
    this.editor.dispatchEvent(new Event('input', { bubbles: true }));
  }
  
  sanitizeHTML(html) {
    // Create temporary container
    const temp = document.createElement('div');
    temp.innerHTML = html;
    
    // Sanitize
    this.sanitizeElement(temp);
    
    // Extract sanitized content
    const fragment = document.createDocumentFragment();
    while (temp.firstChild) {
      fragment.appendChild(temp.firstChild);
    }
    
    return fragment;
  }
  
  sanitizeElement(element) {
    // Remove disallowed attributes
    Array.from(element.attributes || []).forEach(attr => {
      if (!this.options.allowedAttributes.includes(attr.name)) {
        element.removeAttribute(attr.name);
      }
    });
    
    // Remove styles if needed
    if (this.options.stripStyles) {
      element.removeAttribute('style');
      element.removeAttribute('class');
    }
    
    // Process child nodes
    const children = Array.from(element.childNodes);
    children.forEach(child => {
      if (child.nodeType === Node.ELEMENT_NODE) {
        const tagName = child.tagName.toLowerCase();
        
        // Remove disallowed tags
        if (!this.options.allowedTags.includes(tagName)) {
          // Unwrap: move children to parent
          const parent = child.parentNode;
          while (child.firstChild) {
            parent.insertBefore(child.firstChild, child);
          }
          parent.removeChild(child);
        } else {
          // Recursively sanitize allowed tags
          this.sanitizeElement(child);
        }
      } else if (child.nodeType === Node.TEXT_NODE) {
        // Keep text nodes
      } else {
        // Remove other node types
        child.remove();
      }
    });
  }
  
  createTextNode(text) {
    // Convert HTML entities and newlines
    const div = document.createElement('div');
    div.textContent = text;
    const processedText = div.innerHTML
      .replace(/\n/g, '<br>')
      .replace(/&nbsp;/g, ' ');
    
    const temp = document.createElement('div');
    temp.innerHTML = processedText;
    
    const fragment = document.createDocumentFragment();
    while (temp.firstChild) {
      fragment.appendChild(temp.firstChild);
    }
    
    return fragment;
  }
}

// Usage
const editor = document.querySelector('div[contenteditable]');
const pasteHandler = new PasteHandler(editor, {
  allowedTags: ['p', 'br', 'strong', 'em', 'a'],
  stripStyles: true,
});
```

### 2. Advanced Paste Handler with DOMPurify

Use DOMPurify library for robust sanitization:

```javascript
import DOMPurify from 'dompurify';

class SecurePasteHandler {
  constructor(editor, options = {}) {
    this.editor = editor;
    this.options = {
      allowedTags: options.allowedTags || ['p', 'br', 'strong', 'em', 'u', 'a', 'ul', 'ol', 'li'],
      allowedAttributes: options.allowedAttributes || { a: ['href', 'title'] },
      ...options,
    };
    this.init();
  }
  
  init() {
    this.editor.addEventListener('paste', (e) => {
      e.preventDefault();
      this.handlePaste(e);
    });
  }
  
  handlePaste(e) {
    const clipboardData = e.clipboardData || window.clipboardData;
    if (!clipboardData) return;
    
    const html = clipboardData.getData('text/html');
    const text = clipboardData.getData('text/plain');
    
    const selection = window.getSelection();
    if (selection.rangeCount === 0) return;
    
    const range = selection.getRangeAt(0);
    
    if (!range.collapsed) {
      range.deleteContents();
    }
    
    let content;
    if (html) {
      content = this.sanitizeWithDOMPurify(html);
    } else if (text) {
      content = this.createTextContent(text);
    } else {
      return;
    }
    
    this.insertContent(range, content);
    
    // Trigger input event
    this.editor.dispatchEvent(new Event('input', { bubbles: true }));
  }
  
  sanitizeWithDOMPurify(html) {
    const config = {
      ALLOWED_TAGS: this.options.allowedTags,
      ALLOWED_ATTR: this.options.allowedAttributes,
      ALLOW_DATA_ATTR: false,
    };
    
    const sanitized = DOMPurify.sanitize(html, config);
    
    // Convert to fragment
    const temp = document.createElement('div');
    temp.innerHTML = sanitized;
    
    const fragment = document.createDocumentFragment();
    while (temp.firstChild) {
      fragment.appendChild(temp.firstChild);
    }
    
    return fragment;
  }
  
  createTextContent(text) {
    // Convert newlines to <br>
    const lines = text.split('\n');
    const fragment = document.createDocumentFragment();
    
    lines.forEach((line, index) => {
      if (line.trim()) {
        const textNode = document.createTextNode(line);
        fragment.appendChild(textNode);
      }
      
      if (index < lines.length - 1) {
        fragment.appendChild(document.createElement('br'));
      }
    });
    
    return fragment;
  }
  
  insertContent(range, content) {
    if (content.nodeType === Node.DOCUMENT_FRAGMENT_NODE) {
      range.insertNode(content);
      if (content.lastChild) {
        range.setStartAfter(content.lastChild);
      }
    } else {
      range.insertNode(content);
      range.setStartAfter(content);
    }
    
    range.collapse(true);
    
    const selection = window.getSelection();
    selection.removeAllRanges();
    selection.addRange(range);
  }
}

// Usage
const editor = document.querySelector('div[contenteditable]');
const pasteHandler = new SecurePasteHandler(editor);
```

### 3. Paste Handler with Format Conversion

Convert pasted content to match your editor's format:

```javascript
class FormatConvertingPasteHandler {
  constructor(editor) {
    this.editor = editor;
    this.init();
  }
  
  init() {
    this.editor.addEventListener('paste', (e) => {
      e.preventDefault();
      this.handlePaste(e);
    });
  }
  
  handlePaste(e) {
    const clipboardData = e.clipboardData || window.clipboardData;
    if (!clipboardData) return;
    
    const html = clipboardData.getData('text/html');
    const text = clipboardData.getData('text/plain');
    
    const selection = window.getSelection();
    if (selection.rangeCount === 0) return;
    
    const range = selection.getRangeAt(0);
    
    if (!range.collapsed) {
      range.deleteContents();
    }
    
    let content;
    if (html) {
      content = this.convertHTML(html);
    } else if (text) {
      content = this.convertText(text);
    } else {
      return;
    }
    
    this.insertContent(range, content);
    
    this.editor.dispatchEvent(new Event('input', { bubbles: true }));
  }
  
  convertHTML(html) {
    const temp = document.createElement('div');
    temp.innerHTML = html;
    
    // Convert common formatting
    this.convertElement(temp);
    
    const fragment = document.createDocumentFragment();
    while (temp.firstChild) {
      fragment.appendChild(temp.firstChild);
    }
    
    return fragment;
  }
  
  convertElement(element) {
    // Convert <b> to <strong>
    element.querySelectorAll('b').forEach(b => {
      const strong = document.createElement('strong');
      strong.innerHTML = b.innerHTML;
      b.parentNode.replaceChild(strong, b);
    });
    
    // Convert <i> to <em>
    element.querySelectorAll('i').forEach(i => {
      const em = document.createElement('em');
      em.innerHTML = i.innerHTML;
      i.parentNode.replaceChild(em, i);
    });
    
    // Remove inline styles
    element.querySelectorAll('[style]').forEach(el => {
      el.removeAttribute('style');
    });
    
    // Remove classes
    element.querySelectorAll('[class]').forEach(el => {
      el.removeAttribute('class');
    });
    
    // Convert <div> to <p> for paragraphs
    element.querySelectorAll('div').forEach(div => {
      if (!div.querySelector('p, ul, ol, h1, h2, h3, h4, h5, h6')) {
        const p = document.createElement('p');
        p.innerHTML = div.innerHTML;
        div.parentNode.replaceChild(p, div);
      }
    });
    
    // Process children recursively
    Array.from(element.children).forEach(child => {
      this.convertElement(child);
    });
  }
  
  convertText(text) {
    // Convert newlines to <br> or <p>
    const lines = text.split('\n');
    const fragment = document.createDocumentFragment();
    
    lines.forEach((line, index) => {
      if (line.trim()) {
        const p = document.createElement('p');
        p.textContent = line.trim();
        fragment.appendChild(p);
      } else if (index < lines.length - 1) {
        // Empty line - add <br>
        fragment.appendChild(document.createElement('br'));
      }
    });
    
    return fragment;
  }
  
  insertContent(range, content) {
    if (content.nodeType === Node.DOCUMENT_FRAGMENT_NODE) {
      range.insertNode(content);
      if (content.lastChild) {
        range.setStartAfter(content.lastChild);
      }
    } else {
      range.insertNode(content);
      range.setStartAfter(content);
    }
    
    range.collapse(true);
    
    const selection = window.getSelection();
    selection.removeAllRanges();
    selection.addRange(range);
  }
}

// Usage
const editor = document.querySelector('div[contenteditable]');
const pasteHandler = new FormatConvertingPasteHandler(editor);
```

### 4. Complete Paste Handler with Options

Comprehensive solution with multiple options:

```javascript
class CompletePasteHandler {
  constructor(editor, options = {}) {
    this.editor = editor;
    this.options = {
      // Sanitization
      allowedTags: options.allowedTags || ['p', 'br', 'strong', 'em', 'u', 'a', 'ul', 'ol', 'li', 'h1', 'h2', 'h3'],
      allowedAttributes: options.allowedAttributes || ['href', 'title'],
      stripStyles: options.stripStyles !== false,
      stripClasses: options.stripClasses !== false,
      
      // Conversion
      convertToPlainText: options.convertToPlainText || false,
      convertBoldToStrong: options.convertBoldToStrong !== false,
      convertItalicToEm: options.convertItalicToEm !== false,
      convertDivToP: options.convertDivToP !== false,
      
      // Behavior
      preserveLineBreaks: options.preserveLineBreaks !== false,
      mergeAdjacentText: options.mergeAdjacentText !== false,
      
      // Callbacks
      onPaste: options.onPaste || null,
      onSanitize: options.onSanitize || null,
      
      ...options,
    };
    this.init();
  }
  
  init() {
    this.editor.addEventListener('paste', (e) => {
      e.preventDefault();
      this.handlePaste(e);
    });
  }
  
  handlePaste(e) {
    const clipboardData = e.clipboardData || window.clipboardData;
    if (!clipboardData) return;
    
    const html = clipboardData.getData('text/html');
    const text = clipboardData.getData('text/plain');
    const files = Array.from(clipboardData.files || []);
    
    const selection = window.getSelection();
    if (selection.rangeCount === 0) return;
    
    const range = selection.getRangeAt(0);
    
    if (!range.collapsed) {
      range.deleteContents();
    }
    
    // Handle files (images, etc.)
    if (files.length > 0) {
      this.handleFiles(range, files);
      return;
    }
    
    // Process text/HTML
    let content;
    if (this.options.convertToPlainText) {
      content = this.createPlainText(text || html);
    } else if (html) {
      content = this.processHTML(html);
    } else if (text) {
      content = this.processText(text);
    } else {
      return;
    }
    
    // Callback
    if (this.options.onPaste) {
      content = this.options.onPaste(content, { html, text, files }) || content;
    }
    
    this.insertContent(range, content);
    
    this.editor.dispatchEvent(new Event('input', { bubbles: true }));
  }
  
  processHTML(html) {
    const temp = document.createElement('div');
    temp.innerHTML = html;
    
    // Convert formatting
    if (this.options.convertBoldToStrong) {
      temp.querySelectorAll('b').forEach(b => {
        const strong = document.createElement('strong');
        strong.innerHTML = b.innerHTML;
        b.parentNode.replaceChild(strong, b);
      });
    }
    
    if (this.options.convertItalicToEm) {
      temp.querySelectorAll('i').forEach(i => {
        const em = document.createElement('em');
        em.innerHTML = i.innerHTML;
        i.parentNode.replaceChild(em, i);
      });
    }
    
    if (this.options.convertDivToP) {
      temp.querySelectorAll('div').forEach(div => {
        if (!div.querySelector('p, ul, ol, h1, h2, h3, h4, h5, h6, table')) {
          const p = document.createElement('p');
          p.innerHTML = div.innerHTML;
          div.parentNode.replaceChild(p, div);
        }
      });
    }
    
    // Sanitize
    this.sanitizeElement(temp);
    
    // Merge adjacent text nodes
    if (this.options.mergeAdjacentText) {
      this.mergeTextNodes(temp);
    }
    
    const fragment = document.createDocumentFragment();
    while (temp.firstChild) {
      fragment.appendChild(temp.firstChild);
    }
    
    return fragment;
  }
  
  processText(text) {
    if (this.options.preserveLineBreaks) {
      const lines = text.split('\n');
      const fragment = document.createDocumentFragment();
      
      lines.forEach((line, index) => {
        if (line.trim()) {
          const p = document.createElement('p');
          p.textContent = line.trim();
          fragment.appendChild(p);
        } else if (index < lines.length - 1) {
          fragment.appendChild(document.createElement('br'));
        }
      });
      
      return fragment;
    } else {
      const textNode = document.createTextNode(text);
      return textNode;
    }
  }
  
  createPlainText(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return document.createTextNode(div.textContent);
  }
  
  sanitizeElement(element) {
    // Remove disallowed attributes
    Array.from(element.attributes || []).forEach(attr => {
      if (!this.options.allowedAttributes.includes(attr.name)) {
        element.removeAttribute(attr.name);
      }
    });
    
    if (this.options.stripStyles) {
      element.removeAttribute('style');
    }
    
    if (this.options.stripClasses) {
      element.removeAttribute('class');
    }
    
    // Process children
    const children = Array.from(element.childNodes);
    children.forEach(child => {
      if (child.nodeType === Node.ELEMENT_NODE) {
        const tagName = child.tagName.toLowerCase();
        
        if (!this.options.allowedTags.includes(tagName)) {
          // Unwrap disallowed tags
          const parent = child.parentNode;
          while (child.firstChild) {
            parent.insertBefore(child.firstChild, child);
          }
          parent.removeChild(child);
        } else {
          this.sanitizeElement(child);
        }
      } else if (child.nodeType === Node.TEXT_NODE) {
        // Keep text nodes
      } else {
        child.remove();
      }
    });
  }
  
  mergeTextNodes(element) {
    const walker = document.createTreeWalker(
      element,
      NodeFilter.SHOW_TEXT,
      null
    );
    
    let prevNode = null;
    let node;
    
    while (node = walker.nextNode()) {
      if (prevNode && prevNode.parentNode === node.parentNode) {
        prevNode.textContent += node.textContent;
        node.remove();
      } else {
        prevNode = node;
      }
    }
  }
  
  handleFiles(range, files) {
    files.forEach(file => {
      if (file.type.startsWith('image/')) {
        this.handleImageFile(range, file);
      }
    });
  }
  
  handleImageFile(range, file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = document.createElement('img');
      img.src = e.target.result;
      img.style.maxWidth = '100%';
      
      range.insertNode(img);
      range.setStartAfter(img);
      range.collapse(true);
      
      const selection = window.getSelection();
      selection.removeAllRanges();
      selection.addRange(range);
      
      this.editor.dispatchEvent(new Event('input', { bubbles: true }));
    };
    reader.readAsDataURL(file);
  }
  
  insertContent(range, content) {
    if (content.nodeType === Node.DOCUMENT_FRAGMENT_NODE) {
      range.insertNode(content);
      if (content.lastChild) {
        range.setStartAfter(content.lastChild);
      }
    } else if (content.nodeType === Node.TEXT_NODE) {
      range.insertNode(content);
      range.setStartAfter(content);
    } else {
      range.insertNode(content);
      range.setStartAfter(content);
    }
    
    range.collapse(true);
    
    const selection = window.getSelection();
    selection.removeAllRanges();
    selection.addRange(range);
  }
}

// Usage
const editor = document.querySelector('div[contenteditable]');
const pasteHandler = new CompletePasteHandler(editor, {
  allowedTags: ['p', 'br', 'strong', 'em', 'a'],
  stripStyles: true,
  convertBoldToStrong: true,
  onPaste: (content) => {
    console.log('Pasted content:', content);
    return content;
  },
});
```

## Notes

- Always prevent default paste behavior to have full control
- Sanitize HTML to prevent XSS attacks
- Use DOMPurify library for production-grade sanitization
- Consider converting formatting tags (b→strong, i→em) for consistency
- Handle both HTML and plain text from clipboard
- Preserve or convert line breaks based on your needs
- Test with content from Word, Google Docs, and other rich text sources
- Handle image files if your editor supports them
- Trigger `input` event after paste for framework compatibility

## Browser Compatibility

- **Chrome/Edge**: Full support for clipboard API
- **Firefox**: Good support, but test with different paste sources
- **Safari**: Works well, but some edge cases with rich content

## Related Resources

- [Practical Patterns: Paste Handler](/docs/practical-patterns#paste-handler-with-sanitization)
- [Tip: Paste Link Preservation](/tips/tip-010-paste-link-preservation)
