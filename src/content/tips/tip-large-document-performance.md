---
id: tip-large-document-performance
title: "Optimizing Performance for Large Documents"
category: "performance"
tags: ["performance", "virtualization", "optimization", "dom"]
status: "confirmed"
locale: "en"
---

## Summary
Handling documents with thousands of nodes in a `contenteditable` region can lead to severe lag. This tip covers memory and rendering optimizations for massive content.

## The Problem
Every keypress in a large `contenteditable` area triggers a "Recalculate Style" and "Layout" event in the browser. When the DOM depth or size is too large, the event loop blocks, causing "typing stutter" where characters appear several hundred milliseconds after the user types.

## Best Practices

### 1. Avoid Global Re-renders
Never re-render the entire document on every change. Use frameworks that support **Partial Rendering** (Lexical/ProseMirror), which only update the specific DOM node that was mutated.

### 2. UI Virtualization (Infinite Scroll)
For massive documents (100+ pages), implement **Virtual Selection**. Only render the sections currently in the viewport.
- **Challenge**: Selection/Search in virtualized editors is complex and usually requires a "Portal" system to maintain a fake invisible DOM for the browser's search/selection engines.

### 3. Throttle Model Synchronization
If your editor syncs with a database or collaborative server, throttle the "Model-to-JSON" serialization.
```javascript
// Don't do this on every 'input'
const debouncedSync = debounce((editorState) => {
  saveToDatabase(editorState.toJSON());
}, 1000);
```

### 4. Optimize Node Complexity
Flatten your DOM. Instead of `<div><div><p>...</p></div></div>`, use a flat list of `p` nodes whenever possible. Deeply nested structures exponentially increase calculation time during BiDi or Layout passes.

## Caveats
- **Find-in-Page**: Virtualized editors break the native `Cmd + F` search. You must implement a custom search UI.
- **Selection crossing blocks**: Virtualization can make it impossible for users to drag-select across non-rendered parts of the document.

## References
- [Lexical: Performance benchmarks](https://lexical.dev/docs/performance)
- [ProseMirror: Collaborative performance](https://prosemirror.net/docs/guide/#collab)
- [Chrome DevTools: Profiling Layout Shifts](https://developer.chrome.com/docs/devtools/evaluate-performance/reference/)
---
id: tip-large-document-performance
title: "Optimizing Performance for Large Documents"
category: "performance"
tags: ["performance", "virtualization", "optimization", "dom"]
status: "confirmed"
locale: "en"
---

## Summary
Handling documents with thousands of nodes in a `contenteditable` region can lead to severe lag. This tip covers memory and rendering optimizations for massive content.

## The Problem
Every keypress in a large `contenteditable` area triggers a "Recalculate Style" and "Layout" event in the browser. When the DOM depth or size is too large, the event loop blocks, causing "typing stutter" where characters appear several hundred milliseconds after the user types.

## Best Practices

### 1. Avoid Global Re-renders
Never re-render the entire document on every change. Use frameworks that support **Partial Rendering** (Lexical/ProseMirror), which only update the specific DOM node that was mutated.

### 2. UI Virtualization (Infinite Scroll)
For massive documents (100+ pages), implement **Virtual Selection**. Only render the sections currently in the viewport.
- **Challenge**: Selection/Search in virtualized editors is complex and usually requires a "Portal" system to maintain a fake invisible DOM for the browser's search/selection engines.

### 3. Throttle Model Synchronization
If your editor syncs with a database or collaborative server, throttle the "Model-to-JSON" serialization.
```javascript
// Don't do this on every 'input'
const debouncedSync = debounce((editorState) => {
  saveToDatabase(editorState.toJSON());
}, 1000);
```

### 4. Optimize Node Complexity
Flatten your DOM. Instead of `<div><div><p>...</p></div></div>`, use a flat list of `p` nodes whenever possible. Deeply nested structures exponentially increase calculation time during BiDi or Layout passes.

## Caveats
- **Find-in-Page**: Virtualized editors break the native `Cmd + F` search. You must implement a custom search UI.
- **Selection crossing blocks**: Virtualization can make it impossible for users to drag-select across non-rendered parts of the document.

## References
- [Lexical: Performance benchmarks](https://lexical.dev/docs/performance)
- [ProseMirror: Collaborative performance](https://prosemirror.net/docs/guide/#collab)
- [Chrome DevTools: Profiling Layout Shifts](https://developer.chrome.com/docs/devtools/evaluate-performance/reference/)
