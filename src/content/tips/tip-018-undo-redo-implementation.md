---
id: tip-018-undo-redo-implementation
title: Implementing undo/redo functionality
description: "How to implement custom undo/redo stack for contenteditable that works reliably across all browsers"
category: common-patterns
tags:
  - undo
  - redo
  - history
  - stack
  - state-management
  - pattern
difficulty: advanced
relatedScenarios:
  - scenario-undo-redo-stack
relatedCases: []
locale: en
---

## When to Use This Tip

Use this pattern when you need to:
- Implement custom undo/redo functionality
- Track editor state changes
- Restore previous states with selection
- Handle undo/redo in frameworks (React, Vue, etc.)
- Override browser's default undo/redo behavior

## Problem

Browser's default undo/redo stack has limitations:
- Doesn't include programmatic DOM changes
- May be cleared unexpectedly
- Doesn't preserve selection position
- Inconsistent behavior across browsers
- Can't customize what gets tracked

## Solution

### 1. Basic Undo/Redo Stack

Simple implementation with HTML state:

```javascript
class UndoRedoStack {
  constructor(editor, maxSize = 50) {
    this.editor = editor;
    this.undoStack = [];
    this.redoStack = [];
    this.maxSize = maxSize;
    this.isUndoing = false;
    this.isRedoing = false;
    this.init();
  }
  
  init() {
    // Save initial state
    this.saveState();
    
    // Listen for changes
    this.editor.addEventListener('input', () => {
      if (!this.isUndoing && !this.isRedoing) {
        this.saveState();
      }
    });
    
    // Handle keyboard shortcuts
    this.editor.addEventListener('keydown', (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'z' && !e.shiftKey) {
        e.preventDefault();
        this.undo();
      } else if ((e.ctrlKey || e.metaKey) && (e.key === 'y' || (e.key === 'z' && e.shiftKey))) {
        e.preventDefault();
        this.redo();
      }
    });
  }
  
  saveState() {
    const state = {
      html: this.editor.innerHTML,
      selection: this.saveSelection(),
      timestamp: Date.now(),
    };
    
    this.undoStack.push(state);
    
    // Limit stack size
    if (this.undoStack.length > this.maxSize) {
      this.undoStack.shift();
    }
    
    // Clear redo stack on new action
    this.redoStack = [];
  }
  
  saveSelection() {
    const selection = window.getSelection();
    if (selection.rangeCount === 0) return null;
    
    const range = selection.getRangeAt(0);
    
    // Calculate character offsets
    const startRange = range.cloneRange();
    startRange.selectNodeContents(this.editor);
    startRange.setEnd(range.startContainer, range.startOffset);
    const startOffset = startRange.toString().length;
    
    const endRange = range.cloneRange();
    endRange.selectNodeContents(this.editor);
    endRange.setEnd(range.endContainer, range.endOffset);
    const endOffset = endRange.toString().length;
    
    return {
      start: startOffset,
      end: endOffset,
      collapsed: range.collapsed,
    };
  }
  
  restoreSelection(saved) {
    if (!saved) return;
    
    const selection = window.getSelection();
    const range = document.createRange();
    
    // Find start position
    let currentOffset = 0;
    const walker = document.createTreeWalker(
      this.editor,
      NodeFilter.SHOW_TEXT,
      null
    );
    
    let startNode = null;
    let startOffset = 0;
    let node;
    
    while (node = walker.nextNode()) {
      const nodeLength = node.textContent.length;
      
      if (currentOffset + nodeLength >= saved.start) {
        startNode = node;
        startOffset = saved.start - currentOffset;
        break;
      }
      
      currentOffset += nodeLength;
    }
    
    if (!startNode) return;
    
    range.setStart(startNode, startOffset);
    
    if (saved.collapsed) {
      range.collapse(true);
    } else {
      // Find end position
      currentOffset = 0;
      const walker = document.createTreeWalker(
        this.editor,
        NodeFilter.SHOW_TEXT,
        null
      );
      
      while (node = walker.nextNode()) {
        const nodeLength = node.textContent.length;
        
        if (currentOffset + nodeLength >= saved.end) {
          const endNode = node;
          const endOffset = saved.end - currentOffset;
          range.setEnd(endNode, endOffset);
          break;
        }
        
        currentOffset += nodeLength;
      }
    }
    
    selection.removeAllRanges();
    selection.addRange(range);
  }
  
  undo() {
    if (this.undoStack.length <= 1) return; // Keep at least initial state
    
    this.isUndoing = true;
    
    // Save current state to redo stack
    const currentState = {
      html: this.editor.innerHTML,
      selection: this.saveSelection(),
      timestamp: Date.now(),
    };
    this.redoStack.push(currentState);
    
    // Pop from undo stack
    this.undoStack.pop();
    const previousState = this.undoStack[this.undoStack.length - 1];
    
    // Restore state
    this.restoreState(previousState);
    
    this.isUndoing = false;
  }
  
  redo() {
    if (this.redoStack.length === 0) return;
    
    this.isRedoing = true;
    
    // Get state from redo stack
    const nextState = this.redoStack.pop();
    
    // Save current state to undo stack
    const currentState = {
      html: this.editor.innerHTML,
      selection: this.saveSelection(),
      timestamp: Date.now(),
    };
    this.undoStack.push(currentState);
    
    // Restore state
    this.restoreState(nextState);
    
    this.isRedoing = false;
  }
  
  restoreState(state) {
    this.editor.innerHTML = state.html;
    
    // Restore selection after DOM update
    setTimeout(() => {
      this.restoreSelection(state.selection);
    }, 0);
  }
  
  canUndo() {
    return this.undoStack.length > 1;
  }
  
  canRedo() {
    return this.redoStack.length > 0;
  }
  
  clear() {
    this.undoStack = [];
    this.redoStack = [];
    this.saveState();
  }
}

// Usage
const editor = document.querySelector('div[contenteditable]');
const undoRedo = new UndoRedoStack(editor);
```

### 2. Debounced Undo/Redo Stack

Save state with debouncing to avoid too many states:

```javascript
class DebouncedUndoRedoStack {
  constructor(editor, maxSize = 50, debounceMs = 300) {
    this.editor = editor;
    this.undoStack = [];
    this.redoStack = [];
    this.maxSize = maxSize;
    this.debounceMs = debounceMs;
    this.saveTimeout = null;
    this.isUndoing = false;
    this.isRedoing = false;
    this.init();
  }
  
  init() {
    this.saveState();
    
    this.editor.addEventListener('input', () => {
      if (!this.isUndoing && !this.isRedoing) {
        this.debouncedSave();
      }
    });
    
    this.editor.addEventListener('keydown', (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'z' && !e.shiftKey) {
        e.preventDefault();
        this.undo();
      } else if ((e.ctrlKey || e.metaKey) && (e.key === 'y' || (e.key === 'z' && e.shiftKey))) {
        e.preventDefault();
        this.redo();
      }
    });
  }
  
  debouncedSave() {
    if (this.saveTimeout) {
      clearTimeout(this.saveTimeout);
    }
    
    this.saveTimeout = setTimeout(() => {
      this.saveState();
    }, this.debounceMs);
  }
  
  saveState() {
    if (this.saveTimeout) {
      clearTimeout(this.saveTimeout);
      this.saveTimeout = null;
    }
    
    const state = {
      html: this.editor.innerHTML,
      selection: this.saveSelection(),
      timestamp: Date.now(),
    };
    
    // Don't save if identical to last state
    if (this.undoStack.length > 0) {
      const lastState = this.undoStack[this.undoStack.length - 1];
      if (lastState.html === state.html) {
        return; // No change
      }
    }
    
    this.undoStack.push(state);
    
    if (this.undoStack.length > this.maxSize) {
      this.undoStack.shift();
    }
    
    this.redoStack = [];
  }
  
  saveSelection() {
    const selection = window.getSelection();
    if (selection.rangeCount === 0) return null;
    
    const range = selection.getRangeAt(0);
    
    const startRange = range.cloneRange();
    startRange.selectNodeContents(this.editor);
    startRange.setEnd(range.startContainer, range.startOffset);
    const startOffset = startRange.toString().length;
    
    const endRange = range.cloneRange();
    endRange.selectNodeContents(this.editor);
    endRange.setEnd(range.endContainer, range.endOffset);
    const endOffset = endRange.toString().length;
    
    return {
      start: startOffset,
      end: endOffset,
      collapsed: range.collapsed,
    };
  }
  
  restoreSelection(saved) {
    if (!saved) return;
    
    const selection = window.getSelection();
    const range = document.createRange();
    
    let currentOffset = 0;
    const walker = document.createTreeWalker(
      this.editor,
      NodeFilter.SHOW_TEXT,
      null
    );
    
    let startNode = null;
    let startOffset = 0;
    let node;
    
    while (node = walker.nextNode()) {
      const nodeLength = node.textContent.length;
      
      if (currentOffset + nodeLength >= saved.start) {
        startNode = node;
        startOffset = saved.start - currentOffset;
        break;
      }
      
      currentOffset += nodeLength;
    }
    
    if (!startNode) return;
    
    range.setStart(startNode, startOffset);
    
    if (saved.collapsed) {
      range.collapse(true);
    } else {
      currentOffset = 0;
      const walker = document.createTreeWalker(
        this.editor,
        NodeFilter.SHOW_TEXT,
        null
      );
      
      while (node = walker.nextNode()) {
        const nodeLength = node.textContent.length;
        
        if (currentOffset + nodeLength >= saved.end) {
          const endNode = node;
          const endOffset = saved.end - currentOffset;
          range.setEnd(endNode, endOffset);
          break;
        }
        
        currentOffset += nodeLength;
      }
    }
    
    selection.removeAllRanges();
    selection.addRange(range);
  }
  
  undo() {
    if (this.undoStack.length <= 1) return;
    
    this.isUndoing = true;
    
    // Save current state
    const currentState = {
      html: this.editor.innerHTML,
      selection: this.saveSelection(),
      timestamp: Date.now(),
    };
    this.redoStack.push(currentState);
    
    // Get previous state
    this.undoStack.pop();
    const previousState = this.undoStack[this.undoStack.length - 1];
    
    this.restoreState(previousState);
    
    this.isUndoing = false;
  }
  
  redo() {
    if (this.redoStack.length === 0) return;
    
    this.isRedoing = true;
    
    const nextState = this.redoStack.pop();
    
    const currentState = {
      html: this.editor.innerHTML,
      selection: this.saveSelection(),
      timestamp: Date.now(),
    };
    this.undoStack.push(currentState);
    
    this.restoreState(nextState);
    
    this.isRedoing = false;
  }
  
  restoreState(state) {
    this.editor.innerHTML = state.html;
    
    setTimeout(() => {
      this.restoreSelection(state.selection);
    }, 0);
  }
  
  canUndo() {
    return this.undoStack.length > 1;
  }
  
  canRedo() {
    return this.redoStack.length > 0;
  }
}

// Usage
const editor = document.querySelector('div[contenteditable]');
const undoRedo = new DebouncedUndoRedoStack(editor, 50, 300);
```

### 3. Using beforeinput Event

Leverage `beforeinput` event for better control:

```javascript
class ModernUndoRedoStack {
  constructor(editor, maxSize = 50) {
    this.editor = editor;
    this.undoStack = [];
    this.redoStack = [];
    this.maxSize = maxSize;
    this.init();
  }
  
  init() {
    this.saveState();
    
    // Intercept undo/redo
    this.editor.addEventListener('beforeinput', (e) => {
      if (e.inputType === 'historyUndo') {
        e.preventDefault();
        this.undo();
      } else if (e.inputType === 'historyRedo') {
        e.preventDefault();
        this.redo();
      } else {
        // Save state before other input
        if (this.shouldSaveInput(e.inputType)) {
          this.saveState();
        }
      }
    });
    
    // Fallback for browsers without beforeinput
    this.editor.addEventListener('keydown', (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'z' && !e.shiftKey) {
        e.preventDefault();
        this.undo();
      } else if ((e.ctrlKey || e.metaKey) && (e.key === 'y' || (e.key === 'z' && e.shiftKey))) {
        e.preventDefault();
        this.redo();
      }
    });
  }
  
  shouldSaveInput(inputType) {
    // Save state for these input types
    const saveTypes = [
      'insertText',
      'insertParagraph',
      'deleteContent',
      'deleteContentBackward',
      'deleteContentForward',
      'formatBold',
      'formatItalic',
      'formatUnderline',
    ];
    
    return saveTypes.includes(inputType);
  }
  
  saveState() {
    const state = {
      html: this.editor.innerHTML,
      selection: this.saveSelection(),
      timestamp: Date.now(),
    };
    
    // Don't save duplicate states
    if (this.undoStack.length > 0) {
      const lastState = this.undoStack[this.undoStack.length - 1];
      if (lastState.html === state.html) {
        return;
      }
    }
    
    this.undoStack.push(state);
    
    if (this.undoStack.length > this.maxSize) {
      this.undoStack.shift();
    }
    
    this.redoStack = [];
  }
  
  saveSelection() {
    const selection = window.getSelection();
    if (selection.rangeCount === 0) return null;
    
    const range = selection.getRangeAt(0);
    
    const startRange = range.cloneRange();
    startRange.selectNodeContents(this.editor);
    startRange.setEnd(range.startContainer, range.startOffset);
    const startOffset = startRange.toString().length;
    
    const endRange = range.cloneRange();
    endRange.selectNodeContents(this.editor);
    endRange.setEnd(range.endContainer, range.endOffset);
    const endOffset = endRange.toString().length;
    
    return {
      start: startOffset,
      end: endOffset,
      collapsed: range.collapsed,
    };
  }
  
  restoreSelection(saved) {
    if (!saved) return;
    
    const selection = window.getSelection();
    const range = document.createRange();
    
    let currentOffset = 0;
    const walker = document.createTreeWalker(
      this.editor,
      NodeFilter.SHOW_TEXT,
      null
    );
    
    let startNode = null;
    let startOffset = 0;
    let node;
    
    while (node = walker.nextNode()) {
      const nodeLength = node.textContent.length;
      
      if (currentOffset + nodeLength >= saved.start) {
        startNode = node;
        startOffset = saved.start - currentOffset;
        break;
      }
      
      currentOffset += nodeLength;
    }
    
    if (!startNode) return;
    
    range.setStart(startNode, startOffset);
    
    if (saved.collapsed) {
      range.collapse(true);
    } else {
      currentOffset = 0;
      const walker = document.createTreeWalker(
        this.editor,
        NodeFilter.SHOW_TEXT,
        null
      );
      
      while (node = walker.nextNode()) {
        const nodeLength = node.textContent.length;
        
        if (currentOffset + nodeLength >= saved.end) {
          const endNode = node;
          const endOffset = saved.end - currentOffset;
          range.setEnd(endNode, endOffset);
          break;
        }
        
        currentOffset += nodeLength;
      }
    }
    
    selection.removeAllRanges();
    selection.addRange(range);
  }
  
  undo() {
    if (this.undoStack.length <= 1) return;
    
    const currentState = {
      html: this.editor.innerHTML,
      selection: this.saveSelection(),
      timestamp: Date.now(),
    };
    this.redoStack.push(currentState);
    
    this.undoStack.pop();
    const previousState = this.undoStack[this.undoStack.length - 1];
    
    this.restoreState(previousState);
  }
  
  redo() {
    if (this.redoStack.length === 0) return;
    
    const nextState = this.redoStack.pop();
    
    const currentState = {
      html: this.editor.innerHTML,
      selection: this.saveSelection(),
      timestamp: Date.now(),
    };
    this.undoStack.push(currentState);
    
    this.restoreState(nextState);
  }
  
  restoreState(state) {
    this.editor.innerHTML = state.html;
    
    requestAnimationFrame(() => {
      this.restoreSelection(state.selection);
    });
  }
  
  canUndo() {
    return this.undoStack.length > 1;
  }
  
  canRedo() {
    return this.redoStack.length > 0;
  }
}

// Usage
const editor = document.querySelector('div[contenteditable]');
const undoRedo = new ModernUndoRedoStack(editor);
```

### 4. React Integration

Undo/redo with React state:

```jsx
import React, { useRef, useState, useCallback } from 'react';

function ContentEditableWithUndo({ initialValue = '' }) {
  const editorRef = useRef(null);
  const [undoStack, setUndoStack] = useState([{ html: initialValue, selection: null }]);
  const [redoStack, setRedoStack] = useState([]);
  const [currentHtml, setCurrentHtml] = useState(initialValue);
  const selectionRef = useRef(null);
  
  const saveSelection = useCallback(() => {
    const selection = window.getSelection();
    if (selection.rangeCount === 0) return null;
    
    const range = selection.getRangeAt(0);
    const editor = editorRef.current;
    
    const startRange = range.cloneRange();
    startRange.selectNodeContents(editor);
    startRange.setEnd(range.startContainer, range.startOffset);
    const startOffset = startRange.toString().length;
    
    const endRange = range.cloneRange();
    endRange.selectNodeContents(editor);
    endRange.setEnd(range.endContainer, range.endOffset);
    const endOffset = endRange.toString().length;
    
    return {
      start: startOffset,
      end: endOffset,
      collapsed: range.collapsed,
    };
  }, []);
  
  const restoreSelection = useCallback((saved) => {
    if (!saved || !editorRef.current) return;
    
    const selection = window.getSelection();
    const range = document.createRange();
    const editor = editorRef.current;
    
    let currentOffset = 0;
    const walker = document.createTreeWalker(
      editor,
      NodeFilter.SHOW_TEXT,
      null
    );
    
    let startNode = null;
    let startOffset = 0;
    let node;
    
    while (node = walker.nextNode()) {
      const nodeLength = node.textContent.length;
      
      if (currentOffset + nodeLength >= saved.start) {
        startNode = node;
        startOffset = saved.start - currentOffset;
        break;
      }
      
      currentOffset += nodeLength;
    }
    
    if (!startNode) return;
    
    range.setStart(startNode, startOffset);
    
    if (saved.collapsed) {
      range.collapse(true);
    } else {
      currentOffset = 0;
      const walker = document.createTreeWalker(
        editor,
        NodeFilter.SHOW_TEXT,
        null
      );
      
      while (node = walker.nextNode()) {
        const nodeLength = node.textContent.length;
        
        if (currentOffset + nodeLength >= saved.end) {
          const endNode = node;
          const endOffset = saved.end - currentOffset;
          range.setEnd(endNode, endOffset);
          break;
        }
        
        currentOffset += nodeLength;
      }
    }
    
    selection.removeAllRanges();
    selection.addRange(range);
  }, []);
  
  const handleInput = useCallback((e) => {
    const html = e.currentTarget.innerHTML;
    const selection = saveSelection();
    
    setCurrentHtml(html);
    setUndoStack(prev => {
      const newStack = [...prev, { html, selection }];
      return newStack.slice(-50); // Limit to 50 states
    });
    setRedoStack([]);
  }, [saveSelection]);
  
  const handleUndo = useCallback((e) => {
    e.preventDefault();
    
    setUndoStack(prev => {
      if (prev.length <= 1) return prev;
      
      const currentState = {
        html: currentHtml,
        selection: saveSelection(),
      };
      
      setRedoStack(red => [currentState, ...red]);
      
      const newStack = prev.slice(0, -1);
      const previousState = newStack[newStack.length - 1];
      
      setCurrentHtml(previousState.html);
      
      setTimeout(() => {
        restoreSelection(previousState.selection);
      }, 0);
      
      return newStack;
    });
  }, [currentHtml, saveSelection, restoreSelection]);
  
  const handleRedo = useCallback((e) => {
    e.preventDefault();
    
    setRedoStack(prev => {
      if (prev.length === 0) return prev;
      
      const currentState = {
        html: currentHtml,
        selection: saveSelection(),
      };
      
      setUndoStack(undo => [...undo, currentState]);
      
      const nextState = prev[0];
      const newRedoStack = prev.slice(1);
      
      setCurrentHtml(nextState.html);
      
      setTimeout(() => {
        restoreSelection(nextState.selection);
      }, 0);
      
      return newRedoStack;
    });
  }, [currentHtml, saveSelection, restoreSelection]);
  
  return (
    <div>
      <div className="toolbar">
        <button 
          onClick={handleUndo}
          disabled={undoStack.length <= 1}
        >
          Undo
        </button>
        <button 
          onClick={handleRedo}
          disabled={redoStack.length === 0}
        >
          Redo
        </button>
      </div>
      <div
        ref={editorRef}
        contentEditable
        onInput={handleInput}
        onKeyDown={(e) => {
          if ((e.ctrlKey || e.metaKey) && e.key === 'z' && !e.shiftKey) {
            handleUndo(e);
          } else if ((e.ctrlKey || e.metaKey) && (e.key === 'y' || (e.key === 'z' && e.shiftKey))) {
            handleRedo(e);
          }
        }}
        suppressContentEditableWarning
        dangerouslySetInnerHTML={{ __html: currentHtml }}
      />
    </div>
  );
}
```

## Notes

- Save selection with each state to restore cursor position
- Use character offsets for selection to survive DOM changes
- Debounce state saves to avoid too many states
- Don't save duplicate states (check HTML equality)
- Clear redo stack when new action occurs
- Use `requestAnimationFrame` or `setTimeout` to restore selection after DOM update
- Limit stack size to prevent memory issues
- For React/Vue, integrate with framework state management
- Test with rapid typing and large documents

## Browser Compatibility

- **Chrome/Edge**: Full support for `beforeinput` with `historyUndo`/`historyRedo`
- **Firefox**: Good support, but test selection restoration
- **Safari**: Limited `beforeinput` support - use keyboard event fallback

## Related Resources

- [Scenario: Undo/redo stack](/scenarios/scenario-undo-redo-stack)
- [Tip: Selection Handling Pattern](/tips/tip-017-selection-handling-pattern)
