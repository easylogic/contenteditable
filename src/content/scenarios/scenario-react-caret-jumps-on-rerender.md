---
id: scenario-react-caret-jumps-on-rerender
title: Caret position jumps to beginning on React re-render
description: "When using contentEditable elements in React, the caret (cursor) position jumps to the beginning of the element whenever the component re-renders. This occurs because React's reconciliation process replaces DOM nodes, causing the browser to lose track of the caret position. This issue is more prevalent in Safari and Firefox."
category: other
tags:
  - react
  - framework
  - caret
  - rerender
  - safari
  - firefox
status: draft
locale: en
---

When using `contentEditable` elements in React, the caret (cursor) position jumps to the beginning of the element whenever the component re-renders. This occurs because React's reconciliation process replaces DOM nodes, causing the browser to lose track of the caret position.

## Observed Behavior

- **Caret jumps to start**: Caret position reverts to the beginning of the element on every re-render
- **Safari/Firefox**: More prevalent in Safari and Firefox due to their DOM update handling
- **DOM replacement**: React replaces DOM nodes during re-render, losing caret position
- **State updates**: Any state change that triggers re-render causes the issue
- **User experience**: Severely disrupts typing flow and editing experience

## Root Cause

React's reconciliation algorithm may replace DOM nodes when state changes, causing the browser to lose track of the caret position. Safari and Firefox handle DOM updates differently from Chrome, making them more susceptible to this issue.

## Browser Comparison

- **Safari**: Most affected - caret jumps frequently on re-render
- **Firefox**: Also affected - similar behavior to Safari
- **Chrome**: Less affected but still occurs in some cases
- **Edge**: Similar to Chrome

## Impact

- **Poor user experience**: Users cannot type continuously without interruption
- **Data loss risk**: Users may lose their typing position and context
- **Framework limitation**: Makes React integration with contenteditable challenging
- **Development overhead**: Requires additional code to preserve caret position

## Workarounds

### 1. Use Uncontrolled Components with Refs

Avoid controlled components and use refs to manage content:

```jsx
import React, { useRef } from 'react';

function ContentEditable() {
  const contentRef = useRef(null);
  
  const handleInput = (e) => {
    // Handle input without triggering re-render
    const content = e.currentTarget.textContent;
    // Update state only when needed (e.g., on blur)
  };
  
  return (
    <div
      contentEditable
      ref={contentRef}
      onInput={handleInput}
      suppressContentEditableWarning
    />
  );
}
```

### 2. Preserve and Restore Caret Position

Save caret position before updates and restore after:

```jsx
import React, { useRef, useEffect } from 'react';

function ContentEditable({ value, onChange }) {
  const editableRef = useRef(null);
  const caretPositionRef = useRef(null);
  
  const saveCaretPosition = () => {
    const selection = window.getSelection();
    if (selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      caretPositionRef.current = {
        startContainer: range.startContainer,
        startOffset: range.startOffset,
        endContainer: range.endContainer,
        endOffset: range.endOffset
      };
    }
  };
  
  const restoreCaretPosition = () => {
    if (!caretPositionRef.current) return;
    const selection = window.getSelection();
    const range = document.createRange();
    range.setStart(
      caretPositionRef.current.startContainer,
      caretPositionRef.current.startOffset
    );
    range.setEnd(
      caretPositionRef.current.endContainer,
      caretPositionRef.current.endOffset
    );
    selection.removeAllRanges();
    selection.addRange(range);
  };
  
  useEffect(() => {
    if (editableRef.current && value !== editableRef.current.textContent) {
      saveCaretPosition();
      editableRef.current.textContent = value;
      restoreCaretPosition();
    }
  }, [value]);
  
  return (
    <div
      contentEditable
      ref={editableRef}
      onInput={(e) => onChange(e.currentTarget.textContent)}
      suppressContentEditableWarning
    />
  );
}
```

### 3. Use Specialized Libraries

Libraries that handle caret management automatically:

- **use-editable**: React hook for contenteditable with caret preservation
- **react-contenteditable**: Wrapper component that handles caret position
- **slate-react**: Rich text editor framework built for React

### 4. Minimize Re-renders

Use React.memo, useMemo, and useCallback to prevent unnecessary re-renders:

```jsx
const ContentEditable = React.memo(({ value, onChange }) => {
  // Component implementation
}, (prevProps, nextProps) => {
  // Only re-render if value actually changed
  return prevProps.value === nextProps.value;
});
```

## References

- [Stack Overflow: Caret position reverts to start on re-render](https://stackoverflow.com/questions/40537746/caret-position-reverts-to-start-of-contenteditable-span-on-re-render-in-react-in) - Common issue and solutions
- [dtang.dev: Using contentEditable in React](https://dtang.dev/using-content-editable-in-react/) - Best practices and patterns
- [GitHub: FormidableLabs use-editable](https://github.com/FormidableLabs/use-editable) - React hook for contenteditable
- [Stack Overflow: React contentEditable controlled component](https://stackoverflow.com/questions/22677931/react-flow-contenteditable-change-events) - Controlled vs uncontrolled patterns
- [React Issue: contentEditable caret position](https://github.com/facebook/react/issues/955) - React GitHub issue discussion
- [Medium: React contentEditable best practices](https://medium.com/@david.gilbertson/react-contenteditable-the-good-the-bad-and-the-ugly-8c8a0b0c0c4) - Comprehensive guide
