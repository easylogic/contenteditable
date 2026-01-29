---
id: scenario-inline-element-recreation-after-delete
title: Deleted inline elements recreated when typing in contenteditable
description: After deleting an empty or inline element (e.g. span, b) inside contenteditable, typing causes the browser to recreate the deleted element, leading to unpredictable DOM and editor state.
category: formatting
tags:
  - delete
  - inline
  - span
  - dom
  - chromium
  - execCommand
status: draft
locale: en
---

## Problem Overview

In Chromium (and with varying behavior in other engines), when the user deletes an empty inline element such as `<span>` or `<b>` inside a `contenteditable` region and then types, the browser may automatically recreate that deleted inline element. This "smart" DOM modification contradicts the expectation that the editor controls the DOM; it causes state divergence in framework-based editors and complicates normalization logic.

## Observed Behavior

- **Trigger**: User deletes an empty inline element (e.g. Backspace/Delete removes a `<span>` or `<b>` with no text), then types a character.
- **Result**: The deleted inline wrapper reappears around the newly typed content or in an unexpected place.
- **Scope**: Confirmed in Chromium; behavior may differ in Safari and Firefox. Adding any text content to the span before deletion, or using non-inline display on the span, can avoid or change the behavior.

Example DOM before/after:

```html
<!-- Before: user deletes the empty <span> and types "x" -->
<div contenteditable="true">hello <span></span> world</div>

<!-- Chromium may produce -->
<div contenteditable="true">hello <span>x</span> world</div>
```

## Impact

- **State corruption**: React/Vue/Svelte reconciliation can desync when the DOM is modified by the browser without going through the framework.
- **Undo/redo**: Browser re-creation can conflict with custom history stacks.
- **Predictability**: Editors cannot assume that "delete then type" leaves the DOM in a deterministic shape.

## Browser Comparison

- **Chrome (Blink)**: Recreates deleted empty inline elements when typing; linked to execCommand/editing spec legacy behavior.
- **Safari (WebKit)**: May not always recreate; behavior can depend on structure.
- **Firefox (Gecko)**: Different behavior; less aggressive recreation in many cases.

## Solutions

1. **Normalize after input**: On `input` or `beforeinput`, walk the DOM and remove or merge redundant inline wrappers that the editor did not create.
2. **Avoid empty inline nodes**: When generating HTML, avoid leaving empty `<span>` or `<b>` etc.; use text nodes or placeholders (e.g. `\u200B`) so the node is not "empty" from the engine’s perspective.
3. **Intercept deletion**: Use `beforeinput` with `inputType` `deleteContentBackward`/`deleteContentForward` to apply your own DOM change and `preventDefault()` so the browser does not perform its default delete (and subsequent recreation) when feasible.

Example normalization (remove empty inlines):

```javascript
editor.addEventListener('input', () => {
  const emptyInlines = editor.querySelectorAll('span:empty, b:empty, i:empty');
  emptyInlines.forEach(el => {
    const parent = el.parentNode;
    while (el.firstChild) parent.insertBefore(el.firstChild, el);
    el.remove();
  });
});
```

## Best Practices

- Do not rely on the browser to leave the DOM unchanged after delete-then-type.
- Prefer a single source of truth (e.g. framework state) and normalize DOM on input to match.
- Track official fixes: W3C editing and Chromium may change this behavior in future.

## Related Cases

- [ce-0582](ce-0582-chromium-empty-span-recreated-after-delete) – Chromium empty span recreated after delete and type

## References

- [W3C editing #468: Contenteditable re-creating deleted children](https://github.com/w3c/editing/issues/468)
- [Stack Overflow: Chrome empty span in contenteditable results in added node](https://stackoverflow.com/questions/68914093/chrome-trying-to-delete-empty-span-in-contenteditable-results-in-added-node)
- [W3C execCommand (legacy)](https://w3c.github.io/editing/docs/execCommand/)
