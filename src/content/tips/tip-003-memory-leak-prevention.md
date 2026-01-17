---
id: tip-003-memory-leak-prevention
title: Preventing memory leaks in contenteditable
description: "How to prevent memory leaks when using event listeners and MutationObserver with contenteditable"
category: performance
tags:
  - memory-leak
  - event-listener
  - mutation-observer
  - cleanup
  - performance
difficulty: intermediate
relatedScenarios:
  - scenario-memory-leak-prevention
relatedCases:
  - ce-0225-memory-leak-large-docs
locale: en
---

## Problem

Memory leaks can occur when using contenteditable with event listeners and MutationObserver if they aren't properly cleaned up.

## Solution

### 1. Remove Event Listeners

Always remove listeners when elements are removed.

```javascript
class EditableComponent {
  constructor(element) {
    this.element = element;
    this.handleInput = this.handleInput.bind(this);
    this.handleFocus = this.handleFocus.bind(this);
    
    this.element.addEventListener('input', this.handleInput);
    this.element.addEventListener('focus', this.handleFocus);
  }
  
  handleInput(e) {
    // Handle input
  }
  
  handleFocus(e) {
    // Handle focus
  }
  
  dispose() {
    // Remove listeners
    this.element.removeEventListener('input', this.handleInput);
    this.element.removeEventListener('focus', this.handleFocus);
    this.element = null;
  }
}
```

### 2. Disconnect MutationObserver

Always disconnect observers when done.

```javascript
class EditableComponent {
  constructor(element) {
    this.element = element;
    this.observer = new MutationObserver((mutations) => {
      // Handle mutations
    });
    
    this.observer.observe(this.element, {
      childList: true,
      subtree: true
    });
  }
  
  dispose() {
    if (this.observer) {
      this.observer.disconnect();
      this.observer = null;
    }
    this.element = null;
  }
}
```

### 3. Use Named Functions

Avoid anonymous functions for persistent listeners.

```javascript
// Bad - cannot remove
element.addEventListener('input', () => {
  // Handle
});

// Good - can remove
function handleInput(e) {
  // Handle
}
element.addEventListener('input', handleInput);
element.removeEventListener('input', handleInput);
```

### 4. Use once: true for One-Time Listeners

Automatically removes listener after trigger.

```javascript
element.addEventListener('click', handleClick, { once: true });
```

### 5. Monitor Parent Removal

Use MutationObserver to detect when contenteditable is removed.

```javascript
const parentObserver = new MutationObserver((mutations) => {
  mutations.forEach((mutation) => {
    mutation.removedNodes.forEach((node) => {
      if (node === editableElement || node.contains(editableElement)) {
        // Cleanup
        component.dispose();
      }
    });
  });
});

parentObserver.observe(document.body, {
  childList: true,
  subtree: true
});
```

## Best Practices

- Always match `addEventListener` with `removeEventListener`
- Call `disconnect()` on all MutationObservers when done
- Use framework lifecycle methods (componentWillUnmount, ngOnDestroy, etc.)
- Profile memory with DevTools Memory profiler to detect leaks

## Related Resources

- [Scenario: Memory leak prevention](/scenarios/scenario-memory-leak-prevention)
- [Case: ce-0225](/cases/ce-0225-memory-leak-large-docs)
