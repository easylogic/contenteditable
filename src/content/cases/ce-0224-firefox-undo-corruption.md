---
id: ce-0224
scenarioId: scenario-firefox-undo-dom-mutation
locale: en
os: Windows
osVersion: "10/11"
device: Desktop
deviceVersion: Any
browser: Firefox
browserVersion: "115.0+"
keyboard: US QWERTY
caseTitle: Firefox undo/redo stack corrupted by DOM mutations during input
description: "In Firefox, when DOM mutations occur during user input (e.g., auto-formatting, spell checking, or programmatic changes), the undo/redo stack becomes corrupted. Subsequent undo operations may revert to wrong states, redo operations may fail, or the entire undo history may be lost."
tags:
  - firefox
  - undo
  - redo
  - dom-mutation
  - history-corruption
  - input-events
  - programmatic-changes
  - windows
status: draft
domSteps:
  - label: "Before input"
    html: '<p>The quick brown fox jumps over the lazy dog.</p>'
    description: "Initial content"
  - label: "User typing + DOM mutation"
    html: '<p>The quick brown fox jumps over the <strong>lazy</strong> dog.</p>'
    description: "User types 'dog' and auto-format applies bold"
  - label: "Expected undo"
    html: '<p>The quick brown fox jumps over the lazy dog.</p>'
    description: "Undo should revert only user typing"
  - label: "Actual undo"
    html: '<p>The quick brown fox jumps over the</p>'
    description: "Undo reverts to wrong state, losing content"
---

## Phenomenon

In Firefox, when DOM mutations occur during user input (such as auto-formatting, spell checking corrections, or programmatic changes), the undo/redo stack becomes corrupted. Subsequent undo operations may revert to incorrect states, redo operations may fail entirely, or the entire undo history may be lost.

## Reproduction example

1. Open Firefox and create a `contenteditable` element.
2. Set up auto-formatting that triggers during input.
3. Type text that triggers DOM mutation (e.g., auto-bold certain words).
4. Continue typing to build undo history.
5. Press Ctrl+Z to undo.
6. Observe incorrect state restoration.
7. Try Ctrl+Y to redo.
8. Observe failed redo or incorrect restoration.

## Observed behavior

### Undo/redo corruption patterns:

1. **Wrong state restoration**: Undo reverts to incorrect DOM state
2. **Lost content**: Parts of content disappear during undo
3. **Redo failure**: Ctrl+Y doesn't work after corrupted undo
4. **History loss**: Entire undo history becomes unavailable
5. **Partial undo**: Only parts of recent changes are undone

### Specific scenarios that trigger corruption:

**Auto-formatting during typing:**
```javascript
editor.addEventListener('input', (e) => {
  // Auto-bold certain words
  if (e.data === 'important') {
    const selection = window.getSelection();
    const range = selection.getRangeAt(0);
    const text = range.commonAncestorContainer.textContent;
    
    // Replace with bold version
    const bold = document.createElement('strong');
    bold.textContent = 'important';
    
    range.deleteContents();
    range.insertNode(bold);
  }
});
```

**Spell checking corrections:**
```javascript
editor.addEventListener('input', (e) => {
  // Auto-correct misspelled words
  setTimeout(() => {
    const text = editor.textContent;
    const corrected = text.replace(/recieve/g, 'receive');
    if (text !== corrected) {
      editor.textContent = corrected;
    }
  }, 100);
});
```

**Programmatic DOM changes:**
```javascript
editor.addEventListener('input', (e) => {
  // Add line numbers
  if (e.inputType === 'insertParagraph') {
    const lines = editor.innerHTML.split('\n');
    editor.innerHTML = lines.map((line, i) => 
      `<span class="line-number">${i + 1}</span>${line}`
    ).join('\n');
  }
});
```

### Event sequence showing corruption:

```javascript
// Firefox corrupted undo sequence
[
  { type: 'input', data: 'The quick ', undoable: true },
  { type: 'input', data: 'brown ', undoable: true },
  { type: 'mutation', change: 'auto-bold', undoable: false }, // Problem!
  { type: 'input', data: 'fox ', undoable: true },
  { type: 'undo', result: 'The quick ' }, // Wrong state!
  { type: 'redo', result: null } // Failed!
]
```

## Expected behavior

- Undo should revert only user-input changes, not programmatic mutations
- Redo should properly restore undone states
- DOM mutations should not corrupt undo history
- Programmatic changes should be handled separately from user input
- Undo/redo should work reliably regardless of DOM changes

## Impact

- **Data loss**: User content may disappear during undo
- **Workflow disruption**: Users can't rely on undo/redo functionality
- **Unexpected behavior**: Undo produces surprising results
- **Trust issues**: Users lose confidence in the editor
- **Development complexity**: Requires complex workarounds for Firefox

## Browser Comparison

- **Firefox**: Pronounced undo corruption with DOM mutations
- **Chrome**: Handles DOM mutations correctly, separates programmatic changes
- **Edge**: Same as Chrome, proper undo/redo handling
- **Safari**: Generally correct behavior, rare issues with complex mutations
- **All browsers except Firefox**: Maintain separate undo stacks for user vs programmatic changes

## Workarounds

### 1. Custom undo/redo system

```javascript
class FirefoxUndoManager {
  constructor(editor) {
    this.editor = editor;
    this.isFirefox = /Firefox/.test(navigator.userAgent);
    
    if (this.isFirefox) {
      this.setupCustomUndo();
    }
  }
  
  setupCustomUndo() {
    this.undoStack = [];
    this.redoStack = [];
    this.currentMutation = null;
    
    // Disable native undo/redo
    this.editor.addEventListener('keydown', this.handleKeydown.bind(this));
    
    // Track user input separately from mutations
    this.editor.addEventListener('input', this.handleInput.bind(this));
    this.setupMutationObserver();
    
    // Handle undo/redo programmatically
    this.setupUndoRedo();
  }
  
  handleKeydown(e) {
    if (e.ctrlKey || e.metaKey) {
      if (e.key === 'z' && !e.shiftKey) {
        e.preventDefault();
        this.undo();
      } else if ((e.key === 'y') || (e.key === 'z' && e.shiftKey)) {
        e.preventDefault();
        this.redo();
      }
    }
  }
  
  handleInput(e) {
    // Only track user-initiated input, not programmatic changes
    if (this.isProgrammaticChange(e)) {
      return;
    }
    
    // Save state before change
    const beforeState = this.captureState();
    
    // Save to undo stack
    setTimeout(() => {
      const afterState = this.captureState();
      
      this.undoStack.push({
        before: beforeState,
        after: afterState,
        type: 'user-input',
        timestamp: Date.now()
      });
      
      // Clear redo stack on new input
      this.redoStack = [];
      
      // Limit stack size
      if (this.undoStack.length > 100) {
        this.undoStack.shift();
      }
    }, 0);
  }
  
  setupMutationObserver() {
    this.observer = new MutationObserver((mutations) => {
      // Track programmatic changes separately
      mutations.forEach(mutation => {
        this.currentMutation = {
          type: mutation.type,
          target: mutation.target,
          data: mutation,
          timestamp: Date.now()
        };
      });
    });
    
    this.observer.observe(this.editor, {
      childList: true,
      characterData: true,
      subtree: true,
      attributes: true
    });
  }
  
  isProgrammaticChange(e) {
    // Heuristic to detect programmatic vs user input
    return (
      this.currentMutation && 
      Date.now() - this.currentMutation.timestamp < 50
    );
  }
  
  setupUndoRedo() {
    // Override execCommand for undo/redo
    const originalExecCommand = document.execCommand;
    
    document.execCommand = (command, showUI, value) => {
      if (command === 'undo') {
        this.undo();
        return true;
      } else if (command === 'redo') {
        this.redo();
        return true;
      }
      
      return originalExecCommand.call(document, command, showUI, value);
    };
  }
  
  undo() {
    if (this.undoStack.length === 0) return;
    
    const lastChange = this.undoStack.pop();
    
    // Save current state to redo stack
    const currentState = this.captureState();
    this.redoStack.push({
      before: currentState,
      after: lastChange.before,
      type: 'undo',
      timestamp: Date.now()
    });
    
    // Restore previous state
    this.restoreState(lastChange.before);
    
    // Clear current mutation marker
    this.currentMutation = null;
  }
  
  redo() {
    if (this.redoStack.length === 0) return;
    
    const lastUndo = this.redoStack.pop();
    
    // Save current state to undo stack
    const currentState = this.captureState();
    this.undoStack.push({
      before: currentState,
      after: lastUndo.after,
      type: 'redo',
      timestamp: Date.now()
    });
    
    // Restore forward state
    this.restoreState(lastUndo.after);
  }
  
  captureState() {
    return {
      html: this.editor.innerHTML,
      selection: this.saveSelection(),
      scrollPosition: {
        x: this.editor.scrollLeft,
        y: this.editor.scrollTop
      }
    };
  }
  
  restoreState(state) {
    // Temporarily disconnect observer
    this.observer.disconnect();
    
    try {
      // Restore HTML
      this.editor.innerHTML = state.html;
      
      // Restore selection
      this.restoreSelection(state.selection);
      
      // Restore scroll position
      this.editor.scrollLeft = state.scrollPosition.x;
      this.editor.scrollTop = state.scrollPosition.y;
      
    } finally {
      // Reconnect observer
      this.observer.observe(this.editor, {
        childList: true,
        characterData: true,
        subtree: true,
        attributes: true
      });
    }
  }
  
  saveSelection() {
    const selection = window.getSelection();
    if (selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      return {
        startContainer: this.serializeNode(range.startContainer),
        startOffset: range.startOffset,
        endContainer: this.serializeNode(range.endContainer),
        endOffset: range.endOffset
      };
    }
    return null;
  }
  
  restoreSelection(selection) {
    if (!selection) return;
    
    try {
      const startNode = this.deserializeNode(selection.startContainer);
      const endNode = this.deserializeNode(selection.endContainer);
      
      if (startNode && endNode) {
        const range = document.createRange();
        range.setStart(startNode, selection.startOffset);
        range.setEnd(endNode, selection.endOffset);
        
        const sel = window.getSelection();
        sel.removeAllRanges();
        sel.addRange(range);
      }
    } catch (e) {
      console.warn('Could not restore selection:', e);
    }
  }
  
  serializeNode(node) {
    // Create a unique identifier for the node
    if (node.nodeType === Node.TEXT_NODE) {
      return {
        type: 'text',
        parent: this.serializeNode(node.parentElement),
        index: Array.from(node.parentElement.childNodes).indexOf(node)
      };
    }
    
    return {
      type: 'element',
      tagName: node.tagName,
      className: node.className,
      id: node.id
    };
  }
  
  deserializeNode(nodeData) {
    if (nodeData.type === 'element') {
      const elements = this.editor.querySelectorAll(nodeData.tagName);
      return Array.from(elements).find(el => 
        el.className === nodeData.className && 
        el.id === nodeData.id
      );
    } else if (nodeData.type === 'text') {
      const parent = this.deserializeNode(nodeData.parent);
      if (parent && parent.childNodes[nodeData.index]) {
        return parent.childNodes[nodeData.index];
      }
    }
    
    return null;
  }
}
```

### 2. Mutation buffering

```javascript
class MutationBuffer {
  constructor(editor) {
    this.editor = editor;
    this.isFirefox = /Firefox/.test(navigator.userAgent);
    
    if (this.isFirefox) {
      this.setupBuffering();
    }
  }
  
  setupBuffering() {
    this.pendingMutations = [];
    this.bufferTimeout = null;
    
    this.setupMutationObserver();
    this.setupInputHandling();
  }
  
  setupMutationObserver() {
    this.observer = new MutationObserver((mutations) => {
      // Buffer mutations instead of applying immediately
      this.pendingMutations.push(...mutations);
      
      // Apply buffered mutations after input settles
      clearTimeout(this.bufferTimeout);
      this.bufferTimeout = setTimeout(() => {
        this.applyBufferedMutations();
      }, 150);
    });
    
    this.observer.observe(this.editor, {
      childList: true,
      characterData: true,
      subtree: true
    });
  }
  
  setupInputHandling() {
    this.editor.addEventListener('beforeinput', (e) => {
      // Clear buffer before user input
      this.applyBufferedMutations();
    });
  }
  
  applyBufferedMutations() {
    if (this.pendingMutations.length === 0) return;
    
    // Disconnect observer temporarily
    this.observer.disconnect();
    
    // Apply mutations manually without affecting undo stack
    const mutations = this.pendingMutations.splice(0);
    
    mutations.forEach(mutation => {
      this.applyMutation(mutation);
    });
    
    // Reconnect observer
    this.observer.observe(this.editor, {
      childList: true,
      characterData: true,
      subtree: true
    });
  }
  
  applyMutation(mutation) {
    // Apply mutation in a way that doesn't affect undo
    switch (mutation.type) {
      case 'childList':
        this.applyChildListMutation(mutation);
        break;
      case 'characterData':
        this.applyCharacterDataMutation(mutation);
        break;
    }
  }
  
  applyChildListMutation(mutation) {
    const parent = mutation.target;
    
    mutation.removedNodes.forEach(node => {
      if (parent.contains(node)) {
        parent.removeChild(node);
      }
    });
    
    mutation.addedNodes.forEach(node => {
      if (mutation.nextSibling) {
        parent.insertBefore(node, mutation.nextSibling);
      } else {
        parent.appendChild(node);
      }
    });
  }
  
  applyCharacterDataMutation(mutation) {
    mutation.target.textContent = mutation.newValue;
  }
}
```

### 3. Firefox-specific detection and handling

```javascript
class FirefoxUndoFix {
  static isFirefoxUndoCorrupted(editor) {
    // Test if Firefox undo is corrupted
    const originalContent = editor.innerHTML;
    
    // Type some text
    editor.focus();
    document.execCommand('insertText', false, 'test');
    
    // Try undo
    document.execCommand('undo');
    
    const afterUndo = editor.innerHTML;
    
    // Restore original content
    editor.innerHTML = originalContent;
    
    // Check if undo worked correctly
    return afterUndo !== originalContent;
  }
  
  static applyFix(editor) {
    if (!this.isFirefoxUndoCorrupted(editor)) {
      return; // Firefox undo is working correctly
    }
    
    // Apply custom undo manager
    new FirefoxUndoManager(editor);
    
    console.log('Applied Firefox undo corruption fix');
  }
}
```

## Testing recommendations

1. **Various DOM mutations**: Auto-formatting, spell checking, auto-correct
2. **Different input types**: Text typing, paste, deletion, formatting
3. **Complex content**: Nested elements, tables, lists
4. **Undo/redo sequences**: Multiple undos and redos
5. **Timing variations**: Rapid vs slow input with mutations
6. **Firefox versions**: 110, 111, 112, 113, 114, 115, latest

## Notes

- This is a long-standing Firefox issue dating back several versions
- Related to Firefox's undo/redo implementation vs other browsers
- The problem is most pronounced with immediate DOM mutations
- Firefox developers are aware but fixing requires architectural changes
- Workarounds add significant complexity but provide reliable functionality
- Issue affects any editor with auto-formatting or programmatic changes