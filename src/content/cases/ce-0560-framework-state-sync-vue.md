---
id: ce-0560-framework-state-sync-vue
scenarioId: scenario-framework-state-sync
locale: en
os: Any
osVersion: Any
device: Desktop or Laptop
deviceVersion: Any
browser: Safari
browserVersion: Latest
keyboard: US
caseTitle: Vue contenteditable caret jumps on reactive state update
description: "In Vue, when using contenteditable with reactive state (v-model or data binding), the caret position jumps to the beginning whenever the component re-renders due to state changes. This is more prevalent in Safari and Firefox."
tags:
  - vue
  - framework
  - caret
  - rerender
  - safari
  - firefox
status: draft
---

## Phenomenon

When using `contenteditable` elements in Vue with reactive state binding, the caret (cursor) jumps to the beginning of the element whenever the component re-renders due to state changes. This behavior is particularly noticeable in Safari and Firefox.

## Reproduction example

1. Create a Vue component with a contenteditable div bound to reactive data.
2. Type some text and place cursor in the middle.
3. Trigger a reactive state update that causes re-render.
4. Observe that caret position jumps to the beginning.

## Observed behavior

- **Caret jumps**: Caret position reverts to start of element on re-render
- **Safari/Firefox**: More prevalent in Safari and Firefox
- **v-model doesn't work**: v-model is designed for form inputs, not contenteditable
- **Event timing**: change events don't fire reliably, requiring input events
- **Re-render frequency**: Every keystroke can trigger watchers and re-renders

## Expected behavior

- Caret position should be preserved during re-renders
- DOM updates should not reset cursor position
- Editing experience should remain smooth during state updates

## Analysis

Vue's reactivity system causes the component to re-render when data changes, which replaces DOM nodes and causes the browser to lose track of the caret position. Safari and Firefox handle DOM updates differently from Chrome, making them more susceptible to this issue.

## Workarounds

- Use refs and manual DOM updates instead of reactive binding
- Save and restore caret position before and after DOM updates
- Debounce or throttle state updates to reduce re-render frequency
- Use custom component that handles caret preservation automatically
