---
id: tip-001-caret-preservation-react
title: Preserving caret position in React contenteditable
description: "How to solve caret position jumping issues when using contenteditable in React due to re-renders"
category: framework
tags:
  - react
  - caret
  - rerender
  - framework
  - hooks
difficulty: intermediate
relatedScenarios:
  - scenario-react-caret-jumps-on-rerender
  - scenario-framework-state-sync
relatedCases:
  - ce-0316-react-caret-jumps-on-rerender
  - ce-0560-framework-state-sync-vue
locale: en
---

## Problem

When using `contentEditable` elements in React, the caret (cursor) position jumps to the beginning of the element whenever the component re-renders.

## Solution

### 1. Use Uncontrolled Component Pattern

Manage the DOM directly using refs and minimize state updates.

```jsx
import React, { useRef } from 'react';

function ContentEditable() {
  const contentRef = useRef(null);
  
  const handleInput = (e) => {
    // Update state only on blur
    const content = e.currentTarget.textContent;
    // Update state only when needed
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

### 2. Save and Restore Caret Position

Save the caret position before updates and restore it after.

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
      onInput={(e) => {
        saveCaretPosition();
        onChange(e.currentTarget.textContent);
      }}
      suppressContentEditableWarning
    />
  );
}
```

### 3. Use use-editable Library

Use a library that automatically handles caret management.

```jsx
import { useEditable } from '@use-editable/core';

function ContentEditable({ value, onChange }) {
  const { editableRef } = useEditable({
    value,
    onChange,
  });
  
  return (
    <div
      ref={editableRef}
      contentEditable
      suppressContentEditableWarning
    />
  );
}
```

## Notes

- This issue is more prevalent in Safari and Firefox, so test in these browsers
- Debounce or throttle state updates to reduce re-render frequency
- Use React.memo to prevent unnecessary re-renders

## Related Resources

- [Scenario: React re-render caret jump](/scenarios/scenario-react-caret-jumps-on-rerender)
- [Case: ce-0316](/cases/ce-0316-react-caret-jumps-on-rerender)
