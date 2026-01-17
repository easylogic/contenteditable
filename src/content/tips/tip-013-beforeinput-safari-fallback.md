---
id: tip-013-beforeinput-safari-fallback
title: Handling beforeinput event compatibility with Safari
description: "How to implement input interception that works across all browsers including Safari, which doesn't support the beforeinput event"
category: browser-feature
tags:
  - beforeinput
  - events
  - safari
  - compatibility
  - input-handling
  - polyfill
difficulty: intermediate
relatedScenarios:
  - scenario-beforeinput-support
relatedCases:
  - ce-0043-beforeinput-not-supported
locale: en
---

## Problem

The `beforeinput` event is crucial for intercepting and modifying input before it's committed to the DOM, but Safari doesn't support it. This makes it difficult to implement custom input handling that works consistently across all browsers. Without `beforeinput`, you can't prevent or modify input before it appears in the DOM, which is essential for features like input validation, formatting, or custom behavior.

## Solution

### 1. Use input Event as Fallback

For Safari, use the `input` event and undo the change if needed:

```javascript
const editor = document.querySelector('div[contenteditable]');
let isHandlingInput = false;

// Use beforeinput for supported browsers
editor.addEventListener('beforeinput', (e) => {
  if (isHandlingInput) return;
  
  // Handle input modification
  if (e.inputType === 'insertText') {
    const text = e.data;
    // Modify or prevent input
    if (shouldPreventInput(text)) {
      e.preventDefault();
      return;
    }
    
    // Modify input
    if (shouldModifyInput(text)) {
      e.preventDefault();
      insertTextAtCursor(transformText(text));
    }
  }
});

// Fallback for Safari
editor.addEventListener('input', (e) => {
  if (isHandlingInput) return;
  
  // Check if beforeinput is supported
  if (typeof InputEvent.prototype.getTargetRanges === 'function') {
    // beforeinput is supported, skip
    return;
  }
  
  // Safari fallback: undo and redo with modifications
  isHandlingInput = true;
  
  const selection = window.getSelection();
  if (selection.rangeCount === 0) {
    isHandlingInput = false;
    return;
  }
  
  const range = selection.getRangeAt(0);
  const insertedText = getLastInsertedText(editor);
  
  if (insertedText && shouldModifyInput(insertedText)) {
    // Undo the change
    document.execCommand('undo', false);
    
    // Insert modified text
    insertTextAtCursor(transformText(insertedText));
  }
  
  isHandlingInput = false;
});

function getLastInsertedText(element) {
  // This is a simplified approach - in practice, you'd track changes
  const selection = window.getSelection();
  if (selection.rangeCount === 0) return null;
  
  const range = selection.getRangeAt(0);
  const text = range.toString();
  return text;
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

### 2. Detect beforeinput Support

Create a utility to detect support and use appropriate handlers:

```javascript
function supportsBeforeInput() {
  // Check if beforeinput is supported
  const input = document.createElement('input');
  return 'onbeforeinput' in input || typeof InputEvent.prototype.getTargetRanges === 'function';
}

const editor = document.querySelector('div[contenteditable]');

if (supportsBeforeInput()) {
  // Use beforeinput for Chrome, Firefox, Edge
  editor.addEventListener('beforeinput', handleBeforeInput);
} else {
  // Use input + execCommand for Safari
  editor.addEventListener('input', handleInputSafari);
  editor.addEventListener('keydown', handleKeyDownSafari);
}

function handleBeforeInput(e) {
  // Standard beforeinput handling
  if (e.inputType === 'insertText') {
    const text = e.data;
    if (shouldPrevent(text)) {
      e.preventDefault();
    } else if (shouldModify(text)) {
      e.preventDefault();
      insertText(transform(text));
    }
  }
}

function handleInputSafari(e) {
  // Safari-specific handling using input event
  // More complex as we need to track what changed
}

function handleKeyDownSafari(e) {
  // Intercept before input happens
  if (e.key.length === 1) {
    const char = e.key;
    if (shouldPrevent(char)) {
      e.preventDefault();
      return;
    }
    
    if (shouldModify(char)) {
      e.preventDefault();
      insertText(transform(char));
    }
  }
}
```

### 3. Track Changes for Safari Fallback

For Safari, track DOM changes to implement beforeinput-like behavior:

```javascript
class InputHandler {
  constructor(editor) {
    this.editor = editor;
    this.lastContent = editor.innerHTML;
    this.supportsBeforeInput = this.checkSupport();
    this.init();
  }
  
  checkSupport() {
    return typeof InputEvent.prototype.getTargetRanges === 'function';
  }
  
  init() {
    if (this.supportsBeforeInput) {
      this.editor.addEventListener('beforeinput', this.handleBeforeInput.bind(this));
    } else {
      // Safari fallback
      this.editor.addEventListener('input', this.handleInputSafari.bind(this));
      this.editor.addEventListener('keydown', this.handleKeyDownSafari.bind(this));
    }
  }
  
  handleBeforeInput(e) {
    if (e.inputType === 'insertText') {
      const text = e.data;
      if (this.shouldModify(text)) {
        e.preventDefault();
        this.insertText(this.transform(text));
      }
    }
  }
  
  handleInputSafari(e) {
    // Compare current content with last known content
    const currentContent = this.editor.innerHTML;
    const diff = this.getDiff(this.lastContent, currentContent);
    
    if (diff.inserted) {
      const text = diff.inserted;
      if (this.shouldModify(text)) {
        // Undo the change
        document.execCommand('undo', false);
        
        // Insert modified version
        this.insertText(this.transform(text));
      }
    }
    
    this.lastContent = this.editor.innerHTML;
  }
  
  handleKeyDownSafari(e) {
    // Intercept printable characters
    if (e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey) {
      const char = e.key;
      
      if (this.shouldPrevent(char)) {
        e.preventDefault();
        return;
      }
      
      if (this.shouldModify(char)) {
        e.preventDefault();
        this.insertText(this.transform(char));
      }
    }
  }
  
  getDiff(oldContent, newContent) {
    // Simplified diff - in practice, use a proper diff algorithm
    // This is a basic implementation
    const oldText = this.getTextContent(oldContent);
    const newText = this.getTextContent(newContent);
    
    if (newText.length > oldText.length) {
      return {
        inserted: newText.slice(oldText.length)
      };
    }
    
    return {};
  }
  
  getTextContent(html) {
    const div = document.createElement('div');
    div.innerHTML = html;
    return div.textContent || div.innerText || '';
  }
  
  shouldModify(text) {
    // Your modification logic
    return false;
  }
  
  shouldPrevent(text) {
    // Your prevention logic
    return false;
  }
  
  transform(text) {
    // Your transformation logic
    return text;
  }
  
  insertText(text) {
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
}

// Usage
const editor = document.querySelector('div[contenteditable]');
const handler = new InputHandler(editor);
```

### 4. Use textInput Event (Deprecated but Available)

Safari supports the deprecated `textInput` event which fires before `input`:

```javascript
const editor = document.querySelector('div[contenteditable]');

// Use beforeinput for modern browsers
editor.addEventListener('beforeinput', (e) => {
  if (e.inputType === 'insertText') {
    const text = e.data;
    if (shouldModify(text)) {
      e.preventDefault();
      insertText(transform(text));
    }
  }
});

// Fallback to textInput for Safari (deprecated but works)
editor.addEventListener('textInput', (e) => {
  const text = e.data;
  if (shouldModify(text)) {
    e.preventDefault();
    insertText(transform(text));
  }
}, { passive: false });
```

**Note**: `textInput` is deprecated and may not work for all input types (IME composition, etc.).

### 5. Comprehensive Cross-Browser Input Handler

A complete solution that handles all browsers:

```javascript
class CrossBrowserInputHandler {
  constructor(editor) {
    this.editor = editor;
    this.supportsBeforeInput = this.detectBeforeInputSupport();
    this.lastState = this.captureState();
    this.init();
  }
  
  detectBeforeInputSupport() {
    // Check multiple ways to detect support
    const input = document.createElement('input');
    return 'onbeforeinput' in input || 
           typeof InputEvent.prototype.getTargetRanges === 'function' ||
           'getTargetRanges' in InputEvent.prototype;
  }
  
  init() {
    if (this.supportsBeforeInput) {
      this.editor.addEventListener('beforeinput', this.handleBeforeInput.bind(this));
    } else {
      // Safari fallback strategy
      this.editor.addEventListener('keydown', this.handleKeyDown.bind(this));
      this.editor.addEventListener('input', this.handleInput.bind(this));
      this.editor.addEventListener('textInput', this.handleTextInput.bind(this));
    }
  }
  
  handleBeforeInput(e) {
    // Standard beforeinput handling
    if (e.inputType === 'insertText') {
      this.processInput(e.data, (modified) => {
        if (modified !== e.data) {
          e.preventDefault();
          this.insertText(modified);
        }
      });
    } else if (e.inputType === 'insertCompositionText') {
      // Handle IME composition
      this.processInput(e.data, (modified) => {
        if (modified !== e.data) {
          e.preventDefault();
          this.insertText(modified);
        }
      });
    }
  }
  
  handleKeyDown(e) {
    // Safari: intercept before input
    if (e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey) {
      this.processInput(e.key, (modified) => {
        if (modified !== e.key) {
          e.preventDefault();
          this.insertText(modified);
        }
      });
    }
  }
  
  handleTextInput(e) {
    // Safari: textInput event (deprecated but available)
    this.processInput(e.data, (modified) => {
      if (modified !== e.data) {
        e.preventDefault();
        this.insertText(modified);
      }
    });
  }
  
  handleInput(e) {
    // Safari: fallback for cases where keydown/textInput didn't catch it
    // This is less ideal as input fires after DOM is updated
    const currentState = this.captureState();
    const diff = this.getStateDiff(this.lastState, currentState);
    
    if (diff.inserted) {
      this.processInput(diff.inserted, (modified) => {
        if (modified !== diff.inserted) {
          // Undo and redo with modification
          document.execCommand('undo', false);
          this.insertText(modified);
        }
      });
    }
    
    this.lastState = currentState;
  }
  
  processInput(text, callback) {
    // Your input processing logic
    const modified = this.transform(text);
    callback(modified);
  }
  
  transform(text) {
    // Example: uppercase transformation
    // Replace with your actual transformation logic
    return text.toUpperCase();
  }
  
  captureState() {
    const selection = window.getSelection();
    return {
      html: this.editor.innerHTML,
      text: this.editor.textContent,
      selection: selection.rangeCount > 0 ? {
        start: selection.getRangeAt(0).startOffset,
        end: selection.getRangeAt(0).endOffset
      } : null
    };
  }
  
  getStateDiff(oldState, newState) {
    if (newState.text.length > oldState.text.length) {
      return {
        inserted: newState.text.slice(oldState.text.length)
      };
    }
    return {};
  }
  
  insertText(text) {
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
  
  dispose() {
    this.editor.removeEventListener('beforeinput', this.handleBeforeInput);
    this.editor.removeEventListener('keydown', this.handleKeyDown);
    this.editor.removeEventListener('input', this.handleInput);
    this.editor.removeEventListener('textInput', this.handleTextInput);
  }
}

// Usage
const editor = document.querySelector('div[contenteditable]');
const handler = new CrossBrowserInputHandler(editor);
```

## Notes

- Safari doesn't support `beforeinput`, so you need fallback strategies
- The `textInput` event (deprecated) can be used in Safari but has limitations
- Using `input` event + `execCommand('undo')` is a workaround but can be unreliable
- `keydown` event can intercept characters but doesn't work for IME composition or paste
- IME composition handling is particularly challenging in Safari without `beforeinput`
- Consider using a library like ProseMirror or Slate that handles these cross-browser differences
- Test thoroughly with different input methods (keyboard, IME, paste, drag-drop)
- The `getTargetRanges()` method on InputEvent can be used to detect `beforeinput` support

## Related Resources

- [Scenario: beforeinput event support](/scenarios/scenario-beforeinput-support)
- [Case: ce-0043](/cases/ce-0043-beforeinput-not-supported)
