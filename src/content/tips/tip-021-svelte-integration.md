---
id: tip-021-svelte-integration
title: Integrating contenteditable with Svelte
description: "How to properly integrate contenteditable elements with Svelte, handle reactive state, and prevent caret position issues"
category: framework
tags:
  - svelte
  - framework
  - state-sync
  - caret
  - contenteditable
  - reactivity
difficulty: intermediate
relatedScenarios:
  - scenario-framework-state-sync
relatedCases: []
locale: en
---

## When to Use This Tip

Use this pattern when you need to:
- Integrate contenteditable with Svelte
- Handle reactive state binding
- Prevent caret position jumps on reactive updates
- Work with Svelte's reactivity system
- Implement two-way binding with contenteditable

## Problem

Svelte's reactivity can cause issues with contenteditable:
- Caret position jumps on reactive updates
- Reactive statements trigger DOM updates that reset cursor
- State synchronization between DOM and Svelte state
- Binding content directly can cause issues

## Solution

### 1. Basic Svelte Component with contenteditable

Simple integration with manual state management:

```svelte
<script>
  let content = '';
  let editableElement;
  
  function handleInput(event) {
    content = event.currentTarget.innerHTML;
  }
  
  function handleBlur(event) {
    content = event.currentTarget.innerHTML;
  }
</script>

<div
  bind:this={editableElement}
  contenteditable="true"
  on:input={handleInput}
  on:blur={handleBlur}
  innerHTML={content}
></div>
```

### 2. Caret Position Preservation

Save and restore caret position to prevent jumps:

```svelte
<script>
  let content = '';
  let editableElement;
  let savedSelection = null;
  let isUpdating = false;
  
  function saveCaretPosition() {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return;
    
    const range = selection.getRangeAt(0);
    
    // Calculate character offsets
    const startRange = range.cloneRange();
    startRange.selectNodeContents(editableElement);
    startRange.setEnd(range.startContainer, range.startOffset);
    const startOffset = startRange.toString().length;
    
    const endRange = range.cloneRange();
    endRange.selectNodeContents(editableElement);
    endRange.setEnd(range.endContainer, range.endOffset);
    const endOffset = endRange.toString().length;
    
    savedSelection = {
      start: startOffset,
      end: endOffset,
      collapsed: range.collapsed,
    };
  }
  
  function restoreCaretPosition() {
    if (!savedSelection || !editableElement) return;
    
    const selection = window.getSelection();
    const range = document.createRange();
    
    // Find start position
    let currentOffset = 0;
    const walker = document.createTreeWalker(
      editableElement,
      NodeFilter.SHOW_TEXT,
      null
    );
    
    let startNode = null;
    let startOffset = 0;
    let node;
    
    while (node = walker.nextNode()) {
      const nodeLength = node.textContent.length;
      
      if (currentOffset + nodeLength >= savedSelection.start) {
        startNode = node;
        startOffset = savedSelection.start - currentOffset;
        break;
      }
      
      currentOffset += nodeLength;
    }
    
    if (!startNode) return;
    
    range.setStart(startNode, startOffset);
    
    if (savedSelection.collapsed) {
      range.collapse(true);
    } else {
      // Find end position
      currentOffset = 0;
      const walker = document.createTreeWalker(
        editableElement,
        NodeFilter.SHOW_TEXT,
        null
      );
      
      while (node = walker.nextNode()) {
        const nodeLength = node.textContent.length;
        
        if (currentOffset + nodeLength >= savedSelection.end) {
          const endNode = node;
          const endOffset = savedSelection.end - currentOffset;
          range.setEnd(endNode, endOffset);
          break;
        }
        
        currentOffset += nodeLength;
      }
    }
    
    selection.removeAllRanges();
    selection.addRange(range);
  }
  
  function handleInput(event) {
    if (isUpdating) return;
    
    saveCaretPosition();
    content = event.currentTarget.innerHTML;
  }
  
  function handleKeyUp() {
    saveCaretPosition();
  }
  
  function handleMouseUp() {
    saveCaretPosition();
  }
  
  // Reactive statement to update DOM when content changes
  $: if (editableElement && !isUpdating && editableElement.innerHTML !== content) {
    isUpdating = true;
    saveCaretPosition();
    editableElement.innerHTML = content;
    
    // Restore caret after DOM update
    setTimeout(() => {
      restoreCaretPosition();
      isUpdating = false;
    }, 0);
  }
</script>

<div
  bind:this={editableElement}
  contenteditable="true"
  on:input={handleInput}
  on:keyup={handleKeyUp}
  on:mouseup={handleMouseUp}
></div>
```

### 3. Two-Way Binding with Store

Use Svelte store for state management:

```svelte
<script>
  import { writable } from 'svelte/store';
  
  let editableElement;
  let savedSelection = null;
  let isUpdating = false;
  
  // Create store for content
  export let contentStore = writable('');
  
  let content = '';
  
  // Subscribe to store
  contentStore.subscribe(value => {
    content = value;
  });
  
  function saveCaretPosition() {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return;
    
    const range = selection.getRangeAt(0);
    
    const startRange = range.cloneRange();
    startRange.selectNodeContents(editableElement);
    startRange.setEnd(range.startContainer, range.startOffset);
    const startOffset = startRange.toString().length;
    
    const endRange = range.cloneRange();
    endRange.selectNodeContents(editableElement);
    endRange.setEnd(range.endContainer, range.endOffset);
    const endOffset = endRange.toString().length;
    
    savedSelection = {
      start: startOffset,
      end: endOffset,
      collapsed: range.collapsed,
    };
  }
  
  function restoreCaretPosition() {
    if (!savedSelection || !editableElement) return;
    
    const selection = window.getSelection();
    const range = document.createRange();
    
    let currentOffset = 0;
    const walker = document.createTreeWalker(
      editableElement,
      NodeFilter.SHOW_TEXT,
      null
    );
    
    let startNode = null;
    let startOffset = 0;
    let node;
    
    while (node = walker.nextNode()) {
      const nodeLength = node.textContent.length;
      
      if (currentOffset + nodeLength >= savedSelection.start) {
        startNode = node;
        startOffset = savedSelection.start - currentOffset;
        break;
      }
      
      currentOffset += nodeLength;
    }
    
    if (!startNode) return;
    
    range.setStart(startNode, startOffset);
    
    if (savedSelection.collapsed) {
      range.collapse(true);
    } else {
      currentOffset = 0;
      const walker = document.createTreeWalker(
        editableElement,
        NodeFilter.SHOW_TEXT,
        null
      );
      
      while (node = walker.nextNode()) {
        const nodeLength = node.textContent.length;
        
        if (currentOffset + nodeLength >= savedSelection.end) {
          const endNode = node;
          const endOffset = savedSelection.end - currentOffset;
          range.setEnd(endNode, endOffset);
          break;
        }
        
        currentOffset += nodeLength;
      }
    }
    
    selection.removeAllRanges();
    selection.addRange(range);
  }
  
  function handleInput(event) {
    if (isUpdating) return;
    
    saveCaretPosition();
    const newContent = event.currentTarget.innerHTML;
    contentStore.set(newContent);
  }
  
  // Update DOM when store changes
  $: if (editableElement && !isUpdating && editableElement.innerHTML !== content) {
    isUpdating = true;
    saveCaretPosition();
    editableElement.innerHTML = content;
    
    requestAnimationFrame(() => {
      restoreCaretPosition();
      isUpdating = false;
    });
  }
</script>

<div
  bind:this={editableElement}
  contenteditable="true"
  on:input={handleInput}
  on:keyup={saveCaretPosition}
  on:mouseup={saveCaretPosition}
></div>
```

### 4. Component with Props and Events

Reusable component with proper event handling:

```svelte
<script>
  export let value = '';
  export let disabled = false;
  
  let editableElement;
  let savedSelection = null;
  let isUpdating = false;
  
  function saveCaretPosition() {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return;
    
    const range = selection.getRangeAt(0);
    
    const startRange = range.cloneRange();
    startRange.selectNodeContents(editableElement);
    startRange.setEnd(range.startContainer, range.startOffset);
    const startOffset = startRange.toString().length;
    
    const endRange = range.cloneRange();
    endRange.selectNodeContents(editableElement);
    endRange.setEnd(range.endContainer, range.endOffset);
    const endOffset = endRange.toString().length;
    
    savedSelection = {
      start: startOffset,
      end: endOffset,
      collapsed: range.collapsed,
    };
  }
  
  function restoreCaretPosition() {
    if (!savedSelection || !editableElement) return;
    
    const selection = window.getSelection();
    const range = document.createRange();
    
    let currentOffset = 0;
    const walker = document.createTreeWalker(
      editableElement,
      NodeFilter.SHOW_TEXT,
      null
    );
    
    let startNode = null;
    let startOffset = 0;
    let node;
    
    while (node = walker.nextNode()) {
      const nodeLength = node.textContent.length;
      
      if (currentOffset + nodeLength >= savedSelection.start) {
        startNode = node;
        startOffset = savedSelection.start - currentOffset;
        break;
      }
      
      currentOffset += nodeLength;
    }
    
    if (!startNode) return;
    
    range.setStart(startNode, startOffset);
    
    if (savedSelection.collapsed) {
      range.collapse(true);
    } else {
      currentOffset = 0;
      const walker = document.createTreeWalker(
        editableElement,
        NodeFilter.SHOW_TEXT,
        null
      );
      
      while (node = walker.nextNode()) {
        const nodeLength = node.textContent.length;
        
        if (currentOffset + nodeLength >= savedSelection.end) {
          const endNode = node;
          const endOffset = savedSelection.end - currentOffset;
          range.setEnd(endNode, endOffset);
          break;
        }
        
        currentOffset += nodeLength;
      }
    }
    
    selection.removeAllRanges();
    selection.addRange(range);
  }
  
  function handleInput(event) {
    if (isUpdating || disabled) return;
    
    saveCaretPosition();
    const newValue = event.currentTarget.innerHTML;
    
    if (newValue !== value) {
      value = newValue;
      // Dispatch custom event for two-way binding
      const inputEvent = new CustomEvent('input', {
        detail: newValue,
        bubbles: true,
      });
      editableElement.dispatchEvent(inputEvent);
    }
  }
  
  function handleBlur() {
    // Dispatch blur event
    const blurEvent = new CustomEvent('blur', {
      bubbles: true,
    });
    editableElement.dispatchEvent(blurEvent);
  }
  
  // Update DOM when value prop changes
  $: if (editableElement && !isUpdating && editableElement.innerHTML !== value) {
    isUpdating = true;
    saveCaretPosition();
    editableElement.innerHTML = value;
    
    requestAnimationFrame(() => {
      restoreCaretPosition();
      isUpdating = false;
    });
  }
</script>

<div
  bind:this={editableElement}
  contenteditable={!disabled}
  class:disabled
  on:input={handleInput}
  on:blur={handleBlur}
  on:keyup={saveCaretPosition}
  on:mouseup={saveCaretPosition}
  role="textbox"
  aria-multiline="true"
></div>

<style>
  .disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
</style>

<!-- Usage -->
<!-- <ContentEditable bind:value={content} disabled={false} /> -->
```

### 5. Advanced Component with Actions

Use Svelte actions for better encapsulation:

```svelte
<script>
  export let value = '';
  export let disabled = false;
  
  let editableElement;
  let savedSelection = null;
  let isUpdating = false;
  
  function contenteditableAction(node) {
    editableElement = node;
    
    function saveCaretPosition() {
      const selection = window.getSelection();
      if (!selection || selection.rangeCount === 0) return;
      
      const range = selection.getRangeAt(0);
      
      const startRange = range.cloneRange();
      startRange.selectNodeContents(node);
      startRange.setEnd(range.startContainer, range.startOffset);
      const startOffset = startRange.toString().length;
      
      const endRange = range.cloneRange();
      endRange.selectNodeContents(node);
      endRange.setEnd(range.endContainer, range.endOffset);
      const endOffset = endRange.toString().length;
      
      savedSelection = {
        start: startOffset,
        end: endOffset,
        collapsed: range.collapsed,
      };
    }
    
    function restoreCaretPosition() {
      if (!savedSelection) return;
      
      const selection = window.getSelection();
      const range = document.createRange();
      
      let currentOffset = 0;
      const walker = document.createTreeWalker(
        node,
        NodeFilter.SHOW_TEXT,
        null
      );
      
      let startNode = null;
      let startOffset = 0;
      let node;
      
      while (node = walker.nextNode()) {
        const nodeLength = node.textContent.length;
        
        if (currentOffset + nodeLength >= savedSelection.start) {
          startNode = node;
          startOffset = savedSelection.start - currentOffset;
          break;
        }
        
        currentOffset += nodeLength;
      }
      
      if (!startNode) return;
      
      range.setStart(startNode, startOffset);
      
      if (savedSelection.collapsed) {
        range.collapse(true);
      } else {
        currentOffset = 0;
        const walker = document.createTreeWalker(
          node,
          NodeFilter.SHOW_TEXT,
          null
        );
        
        while (node = walker.nextNode()) {
          const nodeLength = node.textContent.length;
          
          if (currentOffset + nodeLength >= savedSelection.end) {
            const endNode = node;
            const endOffset = savedSelection.end - currentOffset;
            range.setEnd(endNode, endOffset);
            break;
          }
          
          currentOffset += nodeLength;
        }
      }
      
      selection.removeAllRanges();
      selection.addRange(range);
    }
    
    function handleInput(event) {
      if (isUpdating || disabled) return;
      
      saveCaretPosition();
      const newValue = event.currentTarget.innerHTML;
      
      if (newValue !== value) {
        value = newValue;
        node.dispatchEvent(new CustomEvent('input', {
          detail: newValue,
          bubbles: true,
        }));
      }
    }
    
    node.addEventListener('input', handleInput);
    node.addEventListener('keyup', saveCaretPosition);
    node.addEventListener('mouseup', saveCaretPosition);
    
    // Update DOM when value changes
    const unsubscribe = () => {
      if (node && !isUpdating && node.innerHTML !== value) {
        isUpdating = true;
        saveCaretPosition();
        node.innerHTML = value;
        
        requestAnimationFrame(() => {
          restoreCaretPosition();
          isUpdating = false;
        });
      }
    };
    
    // Watch for value changes
    $: if (node) {
      unsubscribe();
    }
    
    return {
      destroy() {
        node.removeEventListener('input', handleInput);
        node.removeEventListener('keyup', saveCaretPosition);
        node.removeEventListener('mouseup', saveCaretPosition);
      },
    };
  }
</script>

<div
  use:contenteditableAction
  contenteditable={!disabled}
  class:disabled
  role="textbox"
  aria-multiline="true"
></div>

<style>
  .disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
</style>
```

### 6. Complete Svelte Integration with Debouncing

Full solution with debouncing and proper state management:

```svelte
<script>
  import { debounce } from './utils';
  
  export let value = '';
  export let disabled = false;
  export let debounceMs = 100;
  
  let editableElement;
  let savedSelection = null;
  let isUpdating = false;
  let localValue = value;
  
  // Debounced update function
  const debouncedUpdate = debounce((newValue) => {
    if (newValue !== value) {
      value = newValue;
      editableElement?.dispatchEvent(new CustomEvent('input', {
        detail: newValue,
        bubbles: true,
      }));
    }
  }, debounceMs);
  
  function saveCaretPosition() {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return;
    
    const range = selection.getRangeAt(0);
    
    const startRange = range.cloneRange();
    startRange.selectNodeContents(editableElement);
    startRange.setEnd(range.startContainer, range.startOffset);
    const startOffset = startRange.toString().length;
    
    const endRange = range.cloneRange();
    endRange.selectNodeContents(editableElement);
    endRange.setEnd(range.endContainer, range.endOffset);
    const endOffset = endRange.toString().length;
    
    savedSelection = {
      start: startOffset,
      end: endOffset,
      collapsed: range.collapsed,
    };
  }
  
  function restoreCaretPosition() {
    if (!savedSelection || !editableElement) return;
    
    const selection = window.getSelection();
    const range = document.createRange();
    
    let currentOffset = 0;
    const walker = document.createTreeWalker(
      editableElement,
      NodeFilter.SHOW_TEXT,
      null
    );
    
    let startNode = null;
    let startOffset = 0;
    let node;
    
    while (node = walker.nextNode()) {
      const nodeLength = node.textContent.length;
      
      if (currentOffset + nodeLength >= savedSelection.start) {
        startNode = node;
        startOffset = savedSelection.start - currentOffset;
        break;
      }
      
      currentOffset += nodeLength;
    }
    
    if (!startNode) return;
    
    range.setStart(startNode, startOffset);
    
    if (savedSelection.collapsed) {
      range.collapse(true);
    } else {
      currentOffset = 0;
      const walker = document.createTreeWalker(
        editableElement,
        NodeFilter.SHOW_TEXT,
        null
      );
      
      while (node = walker.nextNode()) {
        const nodeLength = node.textContent.length;
        
        if (currentOffset + nodeLength >= savedSelection.end) {
          const endNode = node;
          const endOffset = savedSelection.end - currentOffset;
          range.setEnd(endNode, endOffset);
          break;
        }
        
        currentOffset += nodeLength;
      }
    }
    
    selection.removeAllRanges();
    selection.addRange(range);
  }
  
  function handleInput(event) {
    if (isUpdating || disabled) return;
    
    saveCaretPosition();
    localValue = event.currentTarget.innerHTML;
    debouncedUpdate(localValue);
  }
  
  function handleBlur() {
    // Final update on blur
    if (editableElement && editableElement.innerHTML !== value) {
      value = editableElement.innerHTML;
      editableElement.dispatchEvent(new CustomEvent('input', {
        detail: value,
        bubbles: true,
      }));
    }
    
    editableElement?.dispatchEvent(new CustomEvent('blur', {
      bubbles: true,
    }));
  }
  
  // Update DOM when value prop changes
  $: if (editableElement && !isUpdating && editableElement.innerHTML !== value) {
    isUpdating = true;
    saveCaretPosition();
    editableElement.innerHTML = value;
    localValue = value;
    
    requestAnimationFrame(() => {
      restoreCaretPosition();
      isUpdating = false;
    });
  }
</script>

<div
  bind:this={editableElement}
  contenteditable={!disabled}
  class:disabled
  on:input={handleInput}
  on:blur={handleBlur}
  on:keyup={saveCaretPosition}
  on:mouseup={saveCaretPosition}
  role="textbox"
  aria-multiline="true"
  aria-disabled={disabled}
></div>

<style>
  .disabled {
    opacity: 0.6;
    cursor: not-allowed;
    user-select: none;
  }
  
  [contenteditable="true"] {
    outline: none;
  }
  
  [contenteditable="true"]:focus {
    outline: 2px solid var(--accent-primary, #0066cc);
    outline-offset: 2px;
  }
</style>

<!-- utils.js -->
<!--
export function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}
-->
```

## Notes

- Use reactive statements (`$:`) carefully to avoid infinite loops
- Always save caret position before DOM updates
- Use `requestAnimationFrame` or `setTimeout` to restore caret after DOM changes
- Debounce input events to reduce reactive updates
- Use `bind:this` to get element reference
- Avoid binding `innerHTML` directly - use reactive statements instead
- Test with Svelte's reactivity in different scenarios
- Consider using stores for complex state management

## Browser Compatibility

- **Chrome/Edge**: Works well with Svelte
- **Firefox**: Good support, but test caret restoration
- **Safari**: Works, but be careful with reactive updates

## Related Resources

- [Scenario: Framework state synchronization](/scenarios/scenario-framework-state-sync)
- [Tip: Selection Handling Pattern](/tips/tip-017-selection-handling-pattern)
- [Tip: React Integration](/tips/tip-001-caret-preservation-react)
- [Tip: Vue Integration](/tips/tip-004-vue-state-sync)
