---
id: scenario-memory-leak-prevention
title: Memory leaks from event listeners and MutationObserver in contenteditable
description: "When using contenteditable with event listeners and MutationObserver, memory leaks can occur if listeners aren't removed or observers aren't disconnected. Detached DOM elements with event listeners, closures keeping references, and overlapping observers can all cause memory leaks that degrade performance over time."
category: performance
tags:
  - memory-leak
  - event-listener
  - mutation-observer
  - performance
  - cleanup
status: draft
locale: en
---

When using `contenteditable` with event listeners and `MutationObserver`, memory leaks can occur if listeners aren't removed or observers aren't disconnected. Detached DOM elements with event listeners, closures keeping references, and overlapping observers can all cause memory leaks.

## Observed Behavior

- **Memory growth**: Memory usage increases over time without garbage collection
- **Performance degradation**: Application becomes slower as memory leaks accumulate
- **Event listener accumulation**: Listeners remain attached to removed elements
- **Observer accumulation**: MutationObservers continue watching after elements are removed
- **Closure references**: Closures keep DOM nodes alive after removal

## Root Causes

- **Detached DOM with listeners**: Elements removed from DOM but listeners still attached
- **Undisconnected observers**: MutationObserver not disconnected when done
- **Closure references**: Closures capture large objects or DOM nodes
- **Anonymous functions**: Cannot remove listeners attached with anonymous functions
- **Overlapping observers**: Multiple observers watching same nodes

## Impact

- **Performance issues**: Application becomes unresponsive over time
- **Memory exhaustion**: Can cause browser crashes on low-memory devices
- **User experience**: Degraded performance affects user experience
- **Development overhead**: Requires careful resource management

## Workarounds

### 1. Remove Event Listeners

Always remove listeners when elements are removed:

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

Always disconnect observers:

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

Avoid anonymous functions for persistent listeners:

```javascript
// Bad
element.addEventListener('input', () => {
  // Cannot remove this
});

// Good
function handleInput(e) {
  // Can remove with removeEventListener
}
element.addEventListener('input', handleInput);
element.removeEventListener('input', handleInput);
```

### 4. Use once: true for One-Time Listeners

Automatically removes listener after trigger:

```javascript
element.addEventListener('click', handleClick, { once: true });
```

### 5. Monitor Parent Removal

Use MutationObserver to detect when contenteditable is removed:

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

### 6. Nullify References

Set references to null after cleanup:

```javascript
dispose() {
  this.element.removeEventListener('input', this.handleInput);
  this.observer.disconnect();
  this.element = null;
  this.observer = null;
  this.handleInput = null;
}
```

## Best Practices

- **Match addEventListener with removeEventListener**: Always remove what you add
- **Disconnect all observers**: Call disconnect() when done
- **Use framework lifecycle**: Hook into componentWillUnmount, ngOnDestroy, etc.
- **Profile memory**: Use DevTools Memory profiler to detect leaks
- **Test cleanup**: Verify resources are freed when components are removed

## References

- [MDN: MutationObserver.disconnect](https://developer.mozilla.org/en-US/docs/Web/API/MutationObserver/disconnect) - Observer cleanup
- [Rishan Digital: Memory leaks from detached DOM](https://rishandigital.com/java-script/memory-leaks-from-detached-dom-elements/) - Detached element issues
- [Medium: Memory leaks in JavaScript](https://mdjamilkashemporosh.medium.com/memory-leaks-in-javascript-strategies-for-detecting-and-fixing-common-pitfalls-6521d0ceb123) - Common pitfalls
- [Kite Metric: Avoid event listener memory leaks](https://kitemetric.com/blogs/how-to-avoid-javascript-event-listener-memory-leaks) - Listener cleanup
- [Great Expectations: Cleaning up resources with MutationObserver](https://blog.greatrexpectations.com/2017/01/05/cleaning-up-resources-using-mutationobserver/) - Observer cleanup patterns
- [Stack Overflow: MutationObserver auto-disconnect](https://stackoverflow.com/questions/65539791/mutationobserver-automatically-disconnect-when-dereferenced) - Observer lifecycle
