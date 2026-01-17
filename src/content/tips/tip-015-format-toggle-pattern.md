---
id: tip-015-format-toggle-pattern
title: Toggle formatting on selected text
description: "How to implement format toggling (bold, italic, etc.) that works reliably across all browsers with proper selection handling"
category: common-patterns
tags:
  - formatting
  - bold
  - italic
  - selection
  - toggle
  - pattern
difficulty: intermediate
relatedScenarios: []
relatedCases: []
locale: en
---

## When to Use This Tip

Use this pattern when you need to:
- Toggle formatting (bold, italic, underline, etc.) on selected text
- Handle both collapsed (cursor only) and non-collapsed (text selected) selections
- Ensure consistent behavior across all browsers
- Implement a rich text editor toolbar

## Problem

Toggling formatting on selected text in contenteditable requires handling multiple edge cases:
- Collapsed selection (cursor only) vs non-collapsed (text selected)
- Text that's already formatted vs unformatted
- Browser differences in formatting behavior
- Selection restoration after DOM manipulation

## Solution

### 1. Basic Format Toggle Pattern

Handle both collapsed and non-collapsed selections:

```javascript
class FormatToggle {
  constructor(editor, formatType) {
    this.editor = editor;
    this.formatType = formatType; // 'bold', 'italic', 'underline', etc.
    this.init();
  }
  
  init() {
    this.editor.addEventListener('beforeinput', (e) => {
      if (e.inputType === `format${this.capitalize(this.formatType)}`) {
        e.preventDefault();
        this.toggleFormat();
      }
    });
  }
  
  toggleFormat() {
    const selection = window.getSelection();
    if (selection.rangeCount === 0) return;
    
    const range = selection.getRangeAt(0);
    
    if (range.collapsed) {
      // Collapsed selection: toggle state for next character
      this.toggleFormatState();
    } else {
      // Non-collapsed: apply/remove formatting
      const isFormatted = this.isFormatted(range);
      
      if (isFormatted) {
        this.removeFormatting(range);
      } else {
        this.applyFormatting(range);
      }
      
      // Restore selection
      this.restoreSelection(range);
    }
  }
  
  isFormatted(range) {
    // Check if selection is already formatted
    const container = range.commonAncestorContainer;
    const element = container.nodeType === Node.TEXT_NODE 
      ? container.parentElement 
      : container;
    
    // Check for format tag (e.g., <strong>, <em>, <u>)
    const formatTag = this.getFormatTag();
    return element.closest(formatTag) !== null;
  }
  
  applyFormatting(range) {
    // Wrap selection in format tag
    const formatTag = this.getFormatTag();
    const wrapper = document.createElement(formatTag);
    
    try {
      range.surroundContents(wrapper);
    } catch (e) {
      // If surroundContents fails, manually wrap
      const contents = range.extractContents();
      wrapper.appendChild(contents);
      range.insertNode(wrapper);
    }
  }
  
  removeFormatting(range) {
    // Find all format tags in range and unwrap them
    const formatTag = this.getFormatTag();
    const contents = range.cloneContents();
    const formatElements = contents.querySelectorAll(formatTag);
    
    // Unwrap format elements
    formatElements.forEach((el) => {
      const parent = el.parentNode;
      while (el.firstChild) {
        parent.insertBefore(el.firstChild, el);
      }
      parent.removeChild(el);
    });
    
    // Also check if range is inside a format element
    let container = range.commonAncestorContainer;
    if (container.nodeType === Node.TEXT_NODE) {
      container = container.parentElement;
    }
    
    const formatElement = container.closest(formatTag);
    if (formatElement) {
      this.unwrapElement(formatElement);
    }
  }
  
  unwrapElement(element) {
    const parent = element.parentNode;
    while (element.firstChild) {
      parent.insertBefore(element.firstChild, element);
    }
    parent.removeChild(element);
  }
  
  getFormatTag() {
    const tagMap = {
      bold: 'strong',
      italic: 'em',
      underline: 'u',
      strikethrough: 's',
    };
    return tagMap[this.formatType] || 'span';
  }
  
  toggleFormatState() {
    // Store formatting intent for next character
    // Implementation depends on your editor architecture
    this.editor.dataset.formatIntent = this.formatType;
  }
  
  restoreSelection(range) {
    const selection = window.getSelection();
    selection.removeAllRanges();
    selection.addRange(range);
  }
  
  capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }
}

// Usage
const editor = document.querySelector('div[contenteditable]');
const boldToggle = new FormatToggle(editor, 'bold');
const italicToggle = new FormatToggle(editor, 'italic');
```

### 2. Using execCommand (Deprecated but Simple)

For quick implementations, you can use `execCommand` (deprecated but widely supported):

```javascript
function toggleFormatExecCommand(command) {
  const selection = window.getSelection();
  if (selection.rangeCount === 0) return;
  
  // Check if already formatted
  const isFormatted = document.queryCommandState(command);
  
  if (isFormatted) {
    document.execCommand(command, false, null);
  } else {
    document.execCommand(command, false, null);
  }
  
  // Restore selection
  const range = selection.getRangeAt(0);
  selection.removeAllRanges();
  selection.addRange(range);
}

// Usage
editor.addEventListener('click', (e) => {
  if (e.target.classList.contains('bold-button')) {
    toggleFormatExecCommand('bold');
  }
});
```

### 3. Modern Input Events Approach

Use `beforeinput` event for better control:

```javascript
class ModernFormatToggle {
  constructor(editor) {
    this.editor = editor;
    this.init();
  }
  
  init() {
    this.editor.addEventListener('beforeinput', (e) => {
      if (e.inputType.startsWith('format')) {
        e.preventDefault();
        this.handleFormat(e.inputType);
      }
    });
  }
  
  handleFormat(inputType) {
    const formatType = inputType.replace('format', '').toLowerCase();
    const selection = window.getSelection();
    if (selection.rangeCount === 0) return;
    
    const range = selection.getRangeAt(0);
    
    if (range.collapsed) {
      // Store format intent
      this.setFormatIntent(formatType);
    } else {
      // Toggle format on selection
      this.toggleFormatOnRange(range, formatType);
    }
  }
  
  toggleFormatOnRange(range, formatType) {
    const isFormatted = this.checkFormat(range, formatType);
    
    if (isFormatted) {
      this.removeFormat(range, formatType);
    } else {
      this.applyFormat(range, formatType);
    }
    
    // Restore selection
    this.restoreSelection(range);
  }
  
  checkFormat(range, formatType) {
    const tagMap = {
      bold: ['strong', 'b'],
      italic: ['em', 'i'],
      underline: ['u'],
    };
    
    const tags = tagMap[formatType] || [];
    const container = range.commonAncestorContainer;
    const element = container.nodeType === Node.TEXT_NODE 
      ? container.parentElement 
      : container;
    
    return tags.some(tag => element.closest(tag) !== null);
  }
  
  applyFormat(range, formatType) {
    const tagMap = {
      bold: 'strong',
      italic: 'em',
      underline: 'u',
    };
    
    const tag = tagMap[formatType] || 'span';
    const wrapper = document.createElement(tag);
    
    try {
      range.surroundContents(wrapper);
    } catch (e) {
      // Fallback for complex selections
      const contents = range.extractContents();
      wrapper.appendChild(contents);
      range.insertNode(wrapper);
    }
  }
  
  removeFormat(range, formatType) {
    const tagMap = {
      bold: ['strong', 'b'],
      italic: ['em', 'i'],
      underline: ['u'],
    };
    
    const tags = tagMap[formatType] || [];
    
    // Unwrap all format tags in range
    const contents = range.cloneContents();
    tags.forEach(tag => {
      const elements = contents.querySelectorAll(tag);
      elements.forEach(el => {
        const parent = el.parentNode;
        while (el.firstChild) {
          parent.insertBefore(el.firstChild, el);
        }
        parent.removeChild(el);
      });
    });
    
    // Also unwrap if range is inside format element
    let container = range.commonAncestorContainer;
    if (container.nodeType === Node.TEXT_NODE) {
      container = container.parentElement;
    }
    
    tags.forEach(tag => {
      const formatElement = container.closest(tag);
      if (formatElement) {
        this.unwrapElement(formatElement);
      }
    });
  }
  
  unwrapElement(element) {
    const parent = element.parentNode;
    while (element.firstChild) {
      parent.insertBefore(element.firstChild, element);
    }
    parent.removeChild(element);
  }
  
  setFormatIntent(formatType) {
    this.editor.dataset.formatIntent = formatType;
  }
  
  restoreSelection(range) {
    const selection = window.getSelection();
    selection.removeAllRanges();
    selection.addRange(range);
  }
}

// Usage
const editor = document.querySelector('div[contenteditable]');
const formatToggle = new ModernFormatToggle(editor);
```

### 4. Complete Toolbar Implementation

A complete example with toolbar buttons:

```javascript
class RichTextEditor {
  constructor(editorElement) {
    this.editor = editorElement;
    this.formatToggle = new ModernFormatToggle(this.editor);
    this.setupToolbar();
  }
  
  setupToolbar() {
    const toolbar = document.querySelector('.editor-toolbar');
    if (!toolbar) return;
    
    toolbar.addEventListener('click', (e) => {
      const button = e.target.closest('[data-format]');
      if (!button) return;
      
      e.preventDefault();
      const formatType = button.dataset.format;
      this.toggleFormat(formatType);
      this.updateToolbarState();
    });
  }
  
  toggleFormat(formatType) {
    const selection = window.getSelection();
    if (selection.rangeCount === 0) return;
    
    const range = selection.getRangeAt(0);
    
    if (range.collapsed) {
      // For collapsed selection, just store intent
      this.editor.dataset.formatIntent = formatType;
    } else {
      // Toggle format on selection
      this.formatToggle.toggleFormatOnRange(range, formatType);
    }
  }
  
  updateToolbarState() {
    const selection = window.getSelection();
    if (selection.rangeCount === 0) return;
    
    const range = selection.getRangeAt(0);
    const toolbar = document.querySelector('.editor-toolbar');
    
    toolbar.querySelectorAll('[data-format]').forEach(button => {
      const formatType = button.dataset.format;
      const isActive = this.formatToggle.checkFormat(range, formatType);
      button.classList.toggle('active', isActive);
    });
  }
}

// HTML
// <div class="editor-toolbar">
//   <button data-format="bold">Bold</button>
//   <button data-format="italic">Italic</button>
//   <button data-format="underline">Underline</button>
// </div>
// <div contenteditable="true" class="editor"></div>

// Usage
const editor = document.querySelector('.editor');
const richTextEditor = new RichTextEditor(editor);
```

## Notes

- Always check if selection is collapsed before applying formatting
- Use `beforeinput` event for better control and cross-browser compatibility
- `surroundContents()` may fail with complex selections - have a fallback
- Restore selection after DOM manipulation to maintain user's cursor position
- Consider using CSS classes instead of HTML tags for more control
- Test with IME composition - some browsers handle formatting differently during composition
- `execCommand` is deprecated but still widely used - consider migrating to Input Events API

## Browser Compatibility

- **Chrome/Edge**: Full support for `beforeinput` and format events
- **Firefox**: Good support, but some edge cases with `surroundContents`
- **Safari**: Limited `beforeinput` support - may need fallback to `execCommand`

## Related Resources

- [Practical Patterns: Format Toggle](/docs/practical-patterns#format-toggle-pattern)
