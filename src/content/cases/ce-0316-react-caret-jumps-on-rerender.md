---
id: ce-0316-react-caret-jumps-on-rerender
scenarioId: scenario-react-caret-jumps-on-rerender
locale: en
os: Any
osVersion: Any
device: Desktop or Laptop
deviceVersion: Any
browser: Safari
browserVersion: Latest
keyboard: US
caseTitle: Caret position jumps to beginning on React re-render
description: "In React, when contentEditable element re-renders, the caret position reverts to the start of the element. This is more prevalent in Safari and Firefox due to their handling of DOM updates."
tags:
  - react
  - caret
  - rerender
  - safari
  - firefox
status: draft
---

## Phenomenon

When using `contentEditable` elements in React, the caret (cursor) jumps to the beginning of the element upon re-rendering. This behavior is particularly noticeable in Safari and Firefox. The root cause is that React's re-rendering process replaces the DOM node, causing the browser to reset the caret position.

## Reproduction example

1. Create a React component with a contentEditable div controlled by state.
2. Type some text and place cursor in the middle.
3. Trigger a state update that causes re-render.
4. Observe that caret position jumps to the beginning.

## Observed behavior

- **Caret jumps**: Caret position reverts to start of element on re-render.
- **Safari/Firefox**: More prevalent in Safari and Firefox.
- **DOM replacement**: React replaces DOM nodes during re-render, losing caret position.
- **State updates**: Any state change that triggers re-render causes the issue.
- **User experience**: Disrupts typing flow and editing experience.

## Expected behavior

- Caret position should be preserved during re-renders.
- DOM updates should not reset cursor position.
- Editing experience should remain smooth during state updates.

## Analysis

React's reconciliation algorithm may replace DOM nodes when state changes, causing the browser to lose track of the caret position. Safari and Firefox handle DOM updates differently from Chrome, making them more susceptible to this issue.

## Workarounds

- Use uncontrolled components with refs:
  ```jsx
  const contentRef = useRef(null);
  return <div contentEditable ref={contentRef} onInput={handleInput} />;
  ```
- Preserve and restore caret position manually:
  ```jsx
  useEffect(() => {
    const el = contentRef.current;
    const range = document.createRange();
    const sel = window.getSelection();
    range.setStart(el.childNodes[0], savedPosition);
    range.collapse(true);
    sel.removeAllRanges();
    sel.addRange(range);
  }, [content]);
  ```
- Use libraries like `use-editable` hook that handle caret management.
- Avoid controlled contentEditable when possible, use uncontrolled approach.
