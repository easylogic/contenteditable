---
id: tip-016-insert-text-pattern
title: Insert text at cursor position
description: "How to reliably insert text at the current cursor position in contenteditable, handling both collapsed and non-collapsed selections"
category: common-patterns
tags:
  - insert-text
  - selection
  - cursor
  - text-insertion
  - pattern
difficulty: intermediate
relatedScenarios: []
relatedCases: []
locale: en
---

## When to Use This Tip

Use this pattern when you need to:
- Insert text programmatically at the cursor position
- Replace selected text with new text
- Insert text in response to user actions (buttons, shortcuts, etc.)
- Handle both collapsed (cursor only) and non-collapsed (text selected) selections
- Ensure consistent behavior across all browsers

## Problem

Inserting text at the cursor position in contenteditable requires:
- Handling collapsed vs non-collapsed selections
- Replacing selected text if any
- Maintaining cursor position after insertion
- Cross-browser compatibility
- Proper event handling to avoid conflicts

## Solution

### 1. Basic Text Insertion Pattern

Simple and reliable text insertion:

```javascript
function insertTextAtCursor(text) {
  const selection = window.getSelection();
  if (selection.rangeCount === 0) return;
  
  const range = selection.getRangeAt(0);
  
  // Delete selected content if any
  if (!range.collapsed) {
    range.deleteContents();
  }
  
  // Insert text node
  const textNode = document.createTextNode(text);
  range.insertNode(textNode);
  
  // Move cursor after inserted text
  range.setStartAfter(textNode);
  range.collapse(true);
  
  // Update selection
  selection.removeAllRanges();
  selection.addRange(range);
}

// Usage
const editor = document.querySelector('div[contenteditable]');
editor.addEventListener('click', () => {
  insertTextAtCursor('Hello, World!');
});
```

### 2. Using beforeinput Event

Intercept and handle text insertion with `beforeinput`:

```javascript
class TextInserter {
  constructor(editor) {
    this.editor = editor;
    this.init();
  }
  
  init() {
    this.editor.addEventListener('beforeinput', (e) => {
      if (e.inputType === 'insertText' && e.data) {
        // Optionally prevent default and handle manually
        // e.preventDefault();
        // this.insertText(e.data);
      }
    });
  }
  
  insertText(text) {
    const selection = window.getSelection();
    if (selection.rangeCount === 0) return;
    
    const range = selection.getRangeAt(0);
    
    // Delete selected content
    if (!range.collapsed) {
      range.deleteContents();
    }
    
    // Insert text
    const textNode = document.createTextNode(text);
    range.insertNode(textNode);
    
    // Move cursor after text
    range.setStartAfter(textNode);
    range.collapse(true);
    
    selection.removeAllRanges();
    selection.addRange(range);
  }
  
  insertTextAtPosition(text, position) {
    // Insert at specific position (character offset)
    const selection = window.getSelection();
    if (selection.rangeCount === 0) return;
    
    const range = selection.getRangeAt(0);
    const textContent = this.editor.textContent;
    
    // Create range at position
    const newRange = document.createRange();
    newRange.setStart(this.editor, 0);
    newRange.setEnd(this.editor, 0);
    
    // Find position in DOM
    let offset = 0;
    const walker = document.createTreeWalker(
      this.editor,
      NodeFilter.SHOW_TEXT,
      null
    );
    
    let node;
    while (node = walker.nextNode()) {
      const nodeLength = node.textContent.length;
      if (offset + nodeLength >= position) {
        newRange.setStart(node, position - offset);
        newRange.setEnd(node, position - offset);
        break;
      }
      offset += nodeLength;
    }
    
    // Insert text
    const textNode = document.createTextNode(text);
    newRange.insertNode(textNode);
    
    // Move cursor
    newRange.setStartAfter(textNode);
    newRange.collapse(true);
    
    selection.removeAllRanges();
    selection.addRange(newRange);
  }
}

// Usage
const editor = document.querySelector('div[contenteditable]');
const inserter = new TextInserter(editor);

// Insert text on button click
document.querySelector('.insert-button').addEventListener('click', () => {
  inserter.insertText('Inserted text');
});
```

### 3. Replace Selection with Text

Replace selected text with new text:

```javascript
function replaceSelectionWithText(text) {
  const selection = window.getSelection();
  if (selection.rangeCount === 0) return;
  
  const range = selection.getRangeAt(0);
  
  // Delete selected content
  if (!range.collapsed) {
    range.deleteContents();
  }
  
  // Insert new text
  const textNode = document.createTextNode(text);
  range.insertNode(textNode);
  
  // Select the inserted text (optional)
  // range.selectNodeContents(textNode);
  
  // Or move cursor after text
  range.setStartAfter(textNode);
  range.collapse(true);
  
  selection.removeAllRanges();
  selection.addRange(range);
}

// Usage
const editor = document.querySelector('div[contenteditable]');
editor.addEventListener('mouseup', () => {
  const selection = window.getSelection();
  if (selection.toString().trim()) {
    // Text is selected, replace it
    replaceSelectionWithText('Replacement text');
  }
});
```

### 4. Insert Text with Formatting

Insert text with formatting (bold, italic, etc.):

```javascript
function insertFormattedText(text, formatTag = null) {
  const selection = window.getSelection();
  if (selection.rangeCount === 0) return;
  
  const range = selection.getRangeAt(0);
  
  // Delete selected content
  if (!range.collapsed) {
    range.deleteContents();
  }
  
  // Create text node
  const textNode = document.createTextNode(text);
  
  // Wrap in format tag if specified
  if (formatTag) {
    const wrapper = document.createElement(formatTag);
    wrapper.appendChild(textNode);
    range.insertNode(wrapper);
    
    // Move cursor after wrapper
    range.setStartAfter(wrapper);
  } else {
    range.insertNode(textNode);
    range.setStartAfter(textNode);
  }
  
  range.collapse(true);
  
  selection.removeAllRanges();
  selection.addRange(range);
}

// Usage
insertFormattedText('Bold text', 'strong');
insertFormattedText('Italic text', 'em');
insertFormattedText('Plain text'); // No formatting
```

### 5. Insert Text at Specific Position

Insert text at a specific character position:

```javascript
class PositionalTextInserter {
  constructor(editor) {
    this.editor = editor;
  }
  
  getCharacterOffset() {
    const selection = window.getSelection();
    if (selection.rangeCount === 0) return 0;
    
    const range = selection.getRangeAt(0);
    const preRange = range.cloneRange();
    preRange.selectNodeContents(this.editor);
    preRange.setEnd(range.startContainer, range.startOffset);
    
    return preRange.toString().length;
  }
  
  setCharacterOffset(offset) {
    const selection = window.getSelection();
    const range = document.createRange();
    
    let currentOffset = 0;
    const walker = document.createTreeWalker(
      this.editor,
      NodeFilter.SHOW_TEXT,
      null
    );
    
    let node;
    while (node = walker.nextNode()) {
      const nodeLength = node.textContent.length;
      
      if (currentOffset + nodeLength >= offset) {
        const nodeOffset = offset - currentOffset;
        range.setStart(node, nodeOffset);
        range.setEnd(node, nodeOffset);
        break;
      }
      
      currentOffset += nodeLength;
    }
    
    selection.removeAllRanges();
    selection.addRange(range);
  }
  
  insertTextAtOffset(text, offset) {
    this.setCharacterOffset(offset);
    this.insertText(text);
  }
  
  insertText(text) {
    const selection = window.getSelection();
    if (selection.rangeCount === 0) return;
    
    const range = selection.getRangeAt(0);
    
    if (!range.collapsed) {
      range.deleteContents();
    }
    
    const textNode = document.createTextNode(text);
    range.insertNode(textNode);
    
    range.setStartAfter(textNode);
    range.collapse(true);
    
    selection.removeAllRanges();
    selection.addRange(range);
  }
}

// Usage
const editor = document.querySelector('div[contenteditable]');
const inserter = new PositionalTextInserter(editor);

// Insert at current cursor position
inserter.insertText('Hello');

// Insert at specific character offset
inserter.insertTextAtOffset('World', 5);
```

### 6. Complete Text Insertion Manager

A comprehensive solution with multiple insertion methods:

```javascript
class TextInsertionManager {
  constructor(editor) {
    this.editor = editor;
    this.init();
  }
  
  init() {
    // Handle keyboard shortcuts
    this.editor.addEventListener('keydown', (e) => {
      // Ctrl+Shift+T to insert timestamp
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'T') {
        e.preventDefault();
        this.insertText(new Date().toLocaleString());
      }
    });
  }
  
  insertText(text, options = {}) {
    const {
      replaceSelection = true,
      moveCursorAfter = true,
      selectInserted = false,
    } = options;
    
    const selection = window.getSelection();
    if (selection.rangeCount === 0) return;
    
    const range = selection.getRangeAt(0);
    
    // Delete selected content if replacing
    if (replaceSelection && !range.collapsed) {
      range.deleteContents();
    }
    
    // Insert text
    const textNode = document.createTextNode(text);
    range.insertNode(textNode);
    
    // Handle cursor/selection
    if (selectInserted) {
      range.selectNodeContents(textNode);
    } else if (moveCursorAfter) {
      range.setStartAfter(textNode);
      range.collapse(true);
    }
    
    selection.removeAllRanges();
    selection.addRange(range);
    
    // Trigger input event for framework compatibility
    this.editor.dispatchEvent(new Event('input', { bubbles: true }));
  }
  
  insertFormattedText(text, formatTag, attributes = {}) {
    const selection = window.getSelection();
    if (selection.rangeCount === 0) return;
    
    const range = selection.getRangeAt(0);
    
    if (!range.collapsed) {
      range.deleteContents();
    }
    
    // Create formatted element
    const element = document.createElement(formatTag);
    Object.entries(attributes).forEach(([key, value]) => {
      element.setAttribute(key, value);
    });
    element.textContent = text;
    
    range.insertNode(element);
    
    // Move cursor after element
    range.setStartAfter(element);
    range.collapse(true);
    
    selection.removeAllRanges();
    selection.addRange(range);
    
    this.editor.dispatchEvent(new Event('input', { bubbles: true }));
  }
  
  insertHTML(html) {
    const selection = window.getSelection();
    if (selection.rangeCount === 0) return;
    
    const range = selection.getRangeAt(0);
    
    if (!range.collapsed) {
      range.deleteContents();
    }
    
    // Create temporary container
    const temp = document.createElement('div');
    temp.innerHTML = html;
    
    // Insert all nodes
    const fragment = document.createDocumentFragment();
    while (temp.firstChild) {
      fragment.appendChild(temp.firstChild);
    }
    
    range.insertNode(fragment);
    
    // Move cursor after inserted content
    range.setStartAfter(fragment.lastChild || fragment);
    range.collapse(true);
    
    selection.removeAllRanges();
    selection.addRange(range);
    
    this.editor.dispatchEvent(new Event('input', { bubbles: true }));
  }
  
  insertAtPosition(text, position) {
    // Save current selection
    const selection = window.getSelection();
    const savedRange = selection.rangeCount > 0 
      ? selection.getRangeAt(0).cloneRange() 
      : null;
    
    // Set position
    this.setCursorPosition(position);
    
    // Insert text
    this.insertText(text);
    
    // Restore selection if needed
    if (savedRange) {
      selection.removeAllRanges();
      selection.addRange(savedRange);
    }
  }
  
  setCursorPosition(position) {
    const selection = window.getSelection();
    const range = document.createRange();
    
    let offset = 0;
    const walker = document.createTreeWalker(
      this.editor,
      NodeFilter.SHOW_TEXT,
      null
    );
    
    let node;
    while (node = walker.nextNode()) {
      const nodeLength = node.textContent.length;
      
      if (offset + nodeLength >= position) {
        const nodeOffset = position - offset;
        range.setStart(node, Math.min(nodeOffset, nodeLength));
        range.setEnd(node, Math.min(nodeOffset, nodeLength));
        break;
      }
      
      offset += nodeLength;
    }
    
    // If position is beyond content, set at end
    if (!node) {
      range.selectNodeContents(this.editor);
      range.collapse(false);
    }
    
    selection.removeAllRanges();
    selection.addRange(range);
  }
}

// Usage
const editor = document.querySelector('div[contenteditable]');
const manager = new TextInsertionManager(editor);

// Insert plain text
manager.insertText('Hello, World!');

// Insert formatted text
manager.insertFormattedText('Bold text', 'strong');
manager.insertFormattedText('Link', 'a', { href: 'https://example.com' });

// Insert HTML
manager.insertHTML('<strong>Bold</strong> and <em>italic</em>');

// Insert with options
manager.insertText('Selected text', { selectInserted: true });
```

## Notes

- Always check if selection exists before inserting text
- Delete selected content before inserting to replace selection
- Move cursor after inserted text to maintain editing flow
- Use `document.createTextNode()` for plain text to avoid XSS
- For HTML insertion, sanitize content to prevent security issues
- Trigger `input` event after insertion for framework compatibility
- Test with IME composition - some browsers handle insertion differently during composition
- Consider using `execCommand('insertText')` as fallback for older browsers (deprecated but widely supported)

## Browser Compatibility

- **Chrome/Edge**: Full support for all methods
- **Firefox**: Good support, but `insertNode` behavior may differ slightly
- **Safari**: Works well, but test with IME composition

## Related Resources

- [Practical Patterns: Insert Text](/docs/practical-patterns#insert-text-pattern)
- [Tip: Format Toggle Pattern](/tips/tip-015-format-toggle-pattern)
