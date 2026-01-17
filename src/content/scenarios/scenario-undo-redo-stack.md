---
id: scenario-undo-redo-stack
title: Undo/redo stack management is inconsistent
description: "The undo/redo stack in contenteditable elements behaves inconsistently across browsers. Programmatic DOM changes may or may not be added to the undo stack, and the stack may be cleared unexpectedly. Custom undo/redo implementation is often necessary."
category: other
tags:
  - undo
  - redo
  - history
  - stack
status: draft
locale: en
---

The undo/redo stack in contenteditable elements behaves inconsistently across browsers. Programmatic DOM changes may or may not be added to the undo stack, and the stack may be cleared unexpectedly. Custom undo/redo implementation is often necessary.

## Observed Behavior

### Scenario 1: Programmatic DOM changes
- **Chrome/Edge**: Changes may not be added to undo stack
- **Firefox**: Similar behavior
- **Safari**: Undo stack handling varies

### Scenario 2: preventDefault() operations
- **Chrome/Edge**: Custom operations may not be in undo stack
- **Firefox**: Similar issues
- **Safari**: Undo stack most inconsistent

### Scenario 3: Stack clearing
- **Chrome/Edge**: Stack may be cleared on focus changes
- **Firefox**: Similar behavior
- **Safari**: Stack clearing most unpredictable

### Scenario 4: Multiple undo operations
- **Chrome/Edge**: May undo multiple operations at once
- **Firefox**: Similar behavior
- **Safari**: Undo granularity varies

## Impact

- Loss of undo history
- Inability to undo custom operations
- Unexpected stack clearing
- Need for custom undo/redo implementation

## Browser Comparison

- **Chrome/Edge**: Generally better undo stack handling
- **Firefox**: More likely to lose undo history
- **Safari**: Most inconsistent undo behavior

## Workaround

Implement custom undo/redo:

```javascript
class UndoRedoManager {
  constructor(element) {
    this.element = element;
    this.undoStack = [];
    this.redoStack = [];
    this.maxStackSize = 50;
  }
  
  saveState() {
    const state = {
      html: this.element.innerHTML,
      selection: this.saveSelection()
    };
    
    this.undoStack.push(state);
    if (this.undoStack.length > this.maxStackSize) {
      this.undoStack.shift();
    }
    this.redoStack = []; // Clear redo stack on new action
  }
  
  undo() {
    if (this.undoStack.length === 0) return;
    
    const currentState = {
      html: this.element.innerHTML,
      selection: this.saveSelection()
    };
    this.redoStack.push(currentState);
    
    const previousState = this.undoStack.pop();
    this.restoreState(previousState);
  }
  
  redo() {
    if (this.redoStack.length === 0) return;
    
    const currentState = {
      html: this.element.innerHTML,
      selection: this.saveSelection()
    };
    this.undoStack.push(currentState);
    
    const nextState = this.redoStack.pop();
    this.restoreState(nextState);
  }
  
  restoreState(state) {
    this.element.innerHTML = state.html;
    this.restoreSelection(state.selection);
  }
  
  saveSelection() {
    const selection = window.getSelection();
    if (selection.rangeCount === 0) return null;
    const range = selection.getRangeAt(0);
    return {
      startContainer: range.startContainer,
      startOffset: range.startOffset,
      endContainer: range.endContainer,
      endOffset: range.endOffset
    };
  }
  
  restoreSelection(saved) {
    if (!saved) return;
    try {
      const range = document.createRange();
      range.setStart(saved.startContainer, saved.startOffset);
      range.setEnd(saved.endContainer, saved.endOffset);
      const selection = window.getSelection();
      selection.removeAllRanges();
      selection.addRange(range);
    } catch (e) {
      // Selection invalid, ignore
    }
  }
}

const undoRedo = new UndoRedoManager(element);

element.addEventListener('input', () => {
  undoRedo.saveState();
});

// Handle Ctrl+Z and Ctrl+Y
element.addEventListener('keydown', (e) => {
  if (e.ctrlKey || e.metaKey) {
    if (e.key === 'z' && !e.shiftKey) {
      e.preventDefault();
      undoRedo.undo();
    } else if ((e.key === 'y') || (e.key === 'z' && e.shiftKey)) {
      e.preventDefault();
      undoRedo.redo();
    }
  }
});
```

## References

- [W3C HTML5 Editing: Undo transaction history](https://www.w3.org/TR/2008/WD-html5-20080610/editing.html) - Undo stack specification
- [W3C UndoManager: DOM Transaction proposal](https://dvcs.w3.org/hg/undomanager/raw-file/tip/undomanager.html) - UndoManager API
- [Stack Overflow: iframe undo redo for execCommand insertHTML](https://stackoverflow.com/questions/51831623/iframe-undo-redo-for-execcommand-using-inserthtml-contenteditable) - execCommand undo issues
- [Stack Overflow: Custom texteditor work with undo redo shortcuts](https://stackoverflow.com/questions/66854679/how-to-make-a-custom-texteditor-work-with-the-undo-and-redo-shortcuts-after-modi) - Custom undo implementation
- [Addy Osmani: Mutation Observers](https://addyosmani.com/blog/mutation-observers/) - MutationObserver for undo tracking
