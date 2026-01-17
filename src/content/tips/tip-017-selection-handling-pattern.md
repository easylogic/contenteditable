---
id: tip-017-selection-handling-pattern
title: Save and restore selection ranges
description: "How to reliably save and restore selection ranges in contenteditable, especially after DOM manipulations"
category: common-patterns
tags:
  - selection
  - range
  - save
  - restore
  - cursor
  - pattern
difficulty: intermediate
relatedScenarios: []
relatedCases: []
locale: en
---

## When to Use This Tip

Use this pattern when you need to:
- Save selection before DOM manipulation
- Restore selection after DOM changes
- Maintain cursor position during React/Vue re-renders
- Handle selection across framework state updates
- Preserve user's selection when modifying content programmatically

## Problem

When you manipulate the DOM in contenteditable, the browser loses track of the selection. This happens when:
- React/Vue re-renders replace DOM nodes
- Programmatic DOM changes occur
- Text nodes are split or merged
- Elements are wrapped or unwrapped
- Content is replaced

## Solution

### 1. Basic Selection Save/Restore

Simple pattern for saving and restoring selection:

```javascript
class SelectionManager {
  constructor(editor) {
    this.editor = editor;
    this.savedRange = null;
  }
  
  saveSelection() {
    const selection = window.getSelection();
    if (selection.rangeCount === 0) {
      this.savedRange = null;
      return;
    }
    
    const range = selection.getRangeAt(0);
    this.savedRange = {
      startContainer: range.startContainer,
      startOffset: range.startOffset,
      endContainer: range.endContainer,
      endOffset: range.endOffset,
      commonAncestorContainer: range.commonAncestorContainer,
    };
  }
  
  restoreSelection() {
    if (!this.savedRange) return;
    
    const selection = window.getSelection();
    const range = document.createRange();
    
    try {
      // Check if nodes are still in DOM
      if (!this.savedRange.startContainer.isConnected ||
          !this.savedRange.endContainer.isConnected) {
        // Nodes were removed, try to find equivalent position
        this.restoreSelectionFallback();
        return;
      }
      
      range.setStart(
        this.savedRange.startContainer,
        this.savedRange.startOffset
      );
      range.setEnd(
        this.savedRange.endContainer,
        this.savedRange.endOffset
      );
      
      selection.removeAllRanges();
      selection.addRange(range);
    } catch (e) {
      console.error('Failed to restore selection:', e);
      this.restoreSelectionFallback();
    }
  }
  
  restoreSelectionFallback() {
    // Fallback: set cursor at end of editor
    const selection = window.getSelection();
    const range = document.createRange();
    range.selectNodeContents(this.editor);
    range.collapse(false);
    selection.removeAllRanges();
    selection.addRange(range);
  }
  
  clearSelection() {
    this.savedRange = null;
  }
}

// Usage
const editor = document.querySelector('div[contenteditable]');
const selectionManager = new SelectionManager(editor);

// Before DOM manipulation
selectionManager.saveSelection();

// ... perform DOM changes ...

// After DOM manipulation
selectionManager.restoreSelection();
```

### 2. Character Offset Based Selection

Save selection as character offsets (more resilient to DOM changes):

```javascript
class CharacterOffsetSelection {
  constructor(editor) {
    this.editor = editor;
  }
  
  saveSelection() {
    const selection = window.getSelection();
    if (selection.rangeCount === 0) return null;
    
    const range = selection.getRangeAt(0);
    
    // Calculate start offset
    const startRange = range.cloneRange();
    startRange.selectNodeContents(this.editor);
    startRange.setEnd(range.startContainer, range.startOffset);
    const startOffset = startRange.toString().length;
    
    // Calculate end offset
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
  
  restoreSelection(savedSelection) {
    if (!savedSelection) return;
    
    const selection = window.getSelection();
    const range = document.createRange();
    
    // Find start position
    const startPos = this.findPosition(savedSelection.start);
    if (startPos) {
      range.setStart(startPos.node, startPos.offset);
    } else {
      return; // Can't restore
    }
    
    // Find end position
    if (savedSelection.collapsed) {
      range.collapse(true);
    } else {
      const endPos = this.findPosition(savedSelection.end);
      if (endPos) {
        range.setEnd(endPos.node, endPos.offset);
      } else {
        range.collapse(true);
      }
    }
    
    selection.removeAllRanges();
    selection.addRange(range);
  }
  
  findPosition(offset) {
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
        return {
          node,
          offset: offset - currentOffset,
        };
      }
      
      currentOffset += nodeLength;
    }
    
    // If offset is beyond content, return last position
    const lastNode = this.getLastTextNode(this.editor);
    if (lastNode) {
      return {
        node: lastNode,
        offset: lastNode.textContent.length,
      };
    }
    
    return null;
  }
  
  getLastTextNode(element) {
    const walker = document.createTreeWalker(
      element,
      NodeFilter.SHOW_TEXT,
      null
    );
    
    let lastNode = null;
    let node;
    while (node = walker.nextNode()) {
      lastNode = node;
    }
    
    return lastNode;
  }
}

// Usage
const editor = document.querySelector('div[contenteditable]');
const selectionManager = new CharacterOffsetSelection(editor);

// Save before DOM changes
const saved = selectionManager.saveSelection();

// ... modify DOM ...

// Restore after changes
selectionManager.restoreSelection(saved);
```

### 3. React Integration Pattern

Save/restore selection in React to prevent caret jumps:

```jsx
import React, { useRef, useEffect, useCallback } from 'react';

function ContentEditable({ value, onChange }) {
  const editorRef = useRef(null);
  const selectionRef = useRef(null);
  
  const saveSelection = useCallback(() => {
    const selection = window.getSelection();
    if (selection.rangeCount === 0) return;
    
    const range = selection.getRangeAt(0);
    const editor = editorRef.current;
    
    // Calculate character offsets
    const startRange = range.cloneRange();
    startRange.selectNodeContents(editor);
    startRange.setEnd(range.startContainer, range.startOffset);
    const startOffset = startRange.toString().length;
    
    const endRange = range.cloneRange();
    endRange.selectNodeContents(editor);
    endRange.setEnd(range.endContainer, range.endOffset);
    const endOffset = endRange.toString().length;
    
    selectionRef.current = {
      start: startOffset,
      end: endOffset,
      collapsed: range.collapsed,
    };
  }, []);
  
  const restoreSelection = useCallback(() => {
    if (!selectionRef.current || !editorRef.current) return;
    
    const selection = window.getSelection();
    const range = document.createRange();
    const editor = editorRef.current;
    
    // Find start position
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
      
      if (currentOffset + nodeLength >= selectionRef.current.start) {
        startNode = node;
        startOffset = selectionRef.current.start - currentOffset;
        break;
      }
      
      currentOffset += nodeLength;
    }
    
    if (!startNode) return;
    
    range.setStart(startNode, startOffset);
    
    if (selectionRef.current.collapsed) {
      range.collapse(true);
    } else {
      // Find end position
      let endNode = null;
      let endOffset = 0;
      currentOffset = 0;
      walker = document.createTreeWalker(
        editor,
        NodeFilter.SHOW_TEXT,
        null
      );
      
      while (node = walker.nextNode()) {
        const nodeLength = node.textContent.length;
        
        if (currentOffset + nodeLength >= selectionRef.current.end) {
          endNode = node;
          endOffset = selectionRef.current.end - currentOffset;
          break;
        }
        
        currentOffset += nodeLength;
      }
      
      if (endNode) {
        range.setEnd(endNode, endOffset);
      } else {
        range.collapse(true);
      }
    }
    
    selection.removeAllRanges();
    selection.addRange(range);
  }, []);
  
  useEffect(() => {
    const editor = editorRef.current;
    if (!editor) return;
    
    // Save selection on input
    editor.addEventListener('input', saveSelection);
    editor.addEventListener('keyup', saveSelection);
    editor.addEventListener('mouseup', saveSelection);
    
    return () => {
      editor.removeEventListener('input', saveSelection);
      editor.removeEventListener('keyup', saveSelection);
      editor.removeEventListener('mouseup', saveSelection);
    };
  }, [saveSelection]);
  
  useEffect(() => {
    // Restore selection after value changes
    if (editorRef.current && selectionRef.current) {
      // Use setTimeout to ensure DOM is updated
      setTimeout(() => {
        restoreSelection();
      }, 0);
    }
  }, [value, restoreSelection]);
  
  const handleInput = (e) => {
    saveSelection();
    onChange(e.currentTarget.textContent);
  };
  
  return (
    <div
      ref={editorRef}
      contentEditable
      onInput={handleInput}
      suppressContentEditableWarning
      dangerouslySetInnerHTML={{ __html: value }}
    />
  );
}
```

### 4. Comprehensive Selection Manager

A complete solution with multiple save/restore strategies:

```javascript
class ComprehensiveSelectionManager {
  constructor(editor) {
    this.editor = editor;
    this.savedSelection = null;
    this.strategy = 'character-offset'; // 'node-offset' | 'character-offset' | 'marker'
  }
  
  saveSelection(strategy = this.strategy) {
    const selection = window.getSelection();
    if (selection.rangeCount === 0) {
      this.savedSelection = null;
      return;
    }
    
    const range = selection.getRangeAt(0);
    
    switch (strategy) {
      case 'node-offset':
        this.savedSelection = this.saveNodeOffset(range);
        break;
      case 'character-offset':
        this.savedSelection = this.saveCharacterOffset(range);
        break;
      case 'marker':
        this.savedSelection = this.saveWithMarkers(range);
        break;
      default:
        this.savedSelection = this.saveCharacterOffset(range);
    }
    
    this.savedSelection.strategy = strategy;
  }
  
  saveNodeOffset(range) {
    return {
      strategy: 'node-offset',
      startContainer: range.startContainer,
      startOffset: range.startOffset,
      endContainer: range.endContainer,
      endOffset: range.endOffset,
    };
  }
  
  saveCharacterOffset(range) {
    const startRange = range.cloneRange();
    startRange.selectNodeContents(this.editor);
    startRange.setEnd(range.startContainer, range.startOffset);
    const startOffset = startRange.toString().length;
    
    const endRange = range.cloneRange();
    endRange.selectNodeContents(this.editor);
    endRange.setEnd(range.endContainer, range.endOffset);
    const endOffset = endRange.toString().length;
    
    return {
      strategy: 'character-offset',
      start: startOffset,
      end: endOffset,
      collapsed: range.collapsed,
    };
  }
  
  saveWithMarkers(range) {
    // Insert invisible markers at selection boundaries
    const startMarker = document.createTextNode('\uFEFF');
    const endMarker = document.createTextNode('\uFEFF');
    
    try {
      range.insertNode(startMarker);
      range.collapse(false);
      range.insertNode(endMarker);
    } catch (e) {
      return this.saveCharacterOffset(range);
    }
    
    return {
      strategy: 'marker',
      startMarker,
      endMarker,
    };
  }
  
  restoreSelection() {
    if (!this.savedSelection) return;
    
    const strategy = this.savedSelection.strategy || this.strategy;
    
    switch (strategy) {
      case 'node-offset':
        this.restoreNodeOffset(this.savedSelection);
        break;
      case 'character-offset':
        this.restoreCharacterOffset(this.savedSelection);
        break;
      case 'marker':
        this.restoreWithMarkers(this.savedSelection);
        break;
    }
  }
  
  restoreNodeOffset(saved) {
    const selection = window.getSelection();
    const range = document.createRange();
    
    try {
      if (!saved.startContainer.isConnected ||
          !saved.endContainer.isConnected) {
        throw new Error('Nodes disconnected');
      }
      
      range.setStart(saved.startContainer, saved.startOffset);
      range.setEnd(saved.endContainer, saved.endOffset);
      
      selection.removeAllRanges();
      selection.addRange(range);
    } catch (e) {
      // Fallback to character offset
      const charOffset = this.saveCharacterOffset(range);
      this.restoreCharacterOffset(charOffset);
    }
  }
  
  restoreCharacterOffset(saved) {
    const selection = window.getSelection();
    const range = document.createRange();
    
    const startPos = this.findCharacterPosition(saved.start);
    if (!startPos) return;
    
    range.setStart(startPos.node, startPos.offset);
    
    if (saved.collapsed) {
      range.collapse(true);
    } else {
      const endPos = this.findCharacterPosition(saved.end);
      if (endPos) {
        range.setEnd(endPos.node, endPos.offset);
      } else {
        range.collapse(true);
      }
    }
    
    selection.removeAllRanges();
    selection.addRange(range);
  }
  
  restoreWithMarkers(saved) {
    const selection = window.getSelection();
    const range = document.createRange();
    
    if (!saved.startMarker.isConnected || !saved.endMarker.isConnected) {
      // Markers removed, fallback
      return;
    }
    
    range.setStartBefore(saved.startMarker);
    range.setEndAfter(saved.endMarker);
    
    // Remove markers
    saved.startMarker.remove();
    saved.endMarker.remove();
    
    selection.removeAllRanges();
    selection.addRange(range);
  }
  
  findCharacterPosition(offset) {
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
        return {
          node,
          offset: Math.min(offset - currentOffset, nodeLength),
        };
      }
      
      currentOffset += nodeLength;
    }
    
    // Beyond content, return last position
    const lastNode = this.getLastTextNode();
    if (lastNode) {
      return {
        node: lastNode,
        offset: lastNode.textContent.length,
      };
    }
    
    return null;
  }
  
  getLastTextNode() {
    const walker = document.createTreeWalker(
      this.editor,
      NodeFilter.SHOW_TEXT,
      null
    );
    
    let lastNode = null;
    let node;
    while (node = walker.nextNode()) {
      lastNode = node;
    }
    
    return lastNode;
  }
  
  clearSelection() {
    this.savedSelection = null;
  }
  
  getCurrentSelection() {
    const selection = window.getSelection();
    if (selection.rangeCount === 0) return null;
    
    return selection.getRangeAt(0);
  }
  
  isSelectionCollapsed() {
    const range = this.getCurrentSelection();
    return range ? range.collapsed : true;
  }
  
  getSelectedText() {
    const selection = window.getSelection();
    return selection.toString();
  }
}

// Usage
const editor = document.querySelector('div[contenteditable]');
const manager = new ComprehensiveSelectionManager(editor);

// Save before DOM manipulation
manager.saveSelection('character-offset');

// ... modify DOM ...

// Restore after changes
manager.restoreSelection();
```

## Notes

- Character offset strategy is more resilient to DOM changes than node offset
- Always check if nodes are still connected before restoring node-based selections
- Use `setTimeout` or `requestAnimationFrame` when restoring after async DOM updates
- Marker strategy is fast but markers may be removed by some operations
- Test with IME composition - selection behavior differs during composition
- For React/Vue, save on every input event and restore after state updates
- Consider debouncing selection saves for performance with frequent updates

## Browser Compatibility

- **Chrome/Edge**: All strategies work well
- **Firefox**: Good support, but test character offset calculation
- **Safari**: Works well, but be careful with IME composition

## Related Resources

- [Tip: Preserving caret in React](/tips/tip-001-caret-preservation-react)
- [Tip: Insert Text Pattern](/tips/tip-016-insert-text-pattern)
