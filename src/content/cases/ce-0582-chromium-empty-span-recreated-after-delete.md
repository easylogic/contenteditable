---
id: ce-0582
scenarioId: scenario-inline-element-recreation-after-delete
locale: en
os: Windows
osVersion: "11"
device: Desktop
deviceVersion: Any
browser: Chrome
browserVersion: "124.0"
keyboard: US QWERTY
caseTitle: Chromium recreates empty span after delete when user types
description: "In Chrome, deleting an empty inline element (e.g. span) inside contenteditable and then typing a character causes the browser to recreate the deleted inline wrapper around the new character."
tags: ["chromium", "inline", "span", "delete", "dom", "formatting"]
status: draft
domSteps:
  - label: "Step 1: Empty span in content"
    html: '<div contenteditable="true">hello <span></span> world</div>'
    description: "Contenteditable contains an empty span between two text nodes."
  - label: "Step 2: User deletes empty span (Backspace)"
    html: '<div contenteditable="true">hello  world</div>'
    description: "User places caret after space before world, Backspace removes the empty span; DOM may show collapsed space."
  - label: "Step 3: User types character (bug)"
    html: '<div contenteditable="true">hello <span>x</span> world</div>'
    description: "After typing 'x', Chromium recreates a span and wraps the new character, so DOM no longer matches a simple 'hello x world' text run."
  - label: "✅ Expected"
    html: '<div contenteditable="true">hello x world</div>'
    description: "Expected: No new inline wrapper; typed character is a plain text node."
---

## Phenomenon

In Chromium, when the user deletes an empty inline element (e.g. `<span>`, `<b>`, `<i>`) inside a `contenteditable` and then types a character, the editing engine recreates the deleted inline element and wraps the newly typed character. This comes from legacy execCommand/editing spec behavior ("recording and restoring overrides"). The `input` event fires after the DOM has already been modified by the browser, so the editor sees a DOM that no longer matches the state it had before the delete (e.g. no span). No `beforeinput` with `inputType` clearly describes "recreate deleted inline"; the visible effect is a new wrapper around the typed character.

## Reproduction Steps

1. Create a `contenteditable` div containing: `hello <span></span> world` (empty span between two text runs).
2. Place the caret immediately after the space that follows "hello" (i.e. before the empty span).
3. Press Backspace once so the empty span is removed (or place caret after the span and press Delete).
4. Type a single character (e.g. "x").
5. Inspect the DOM: a `<span>x</span>` (or similar) appears instead of a plain text node "x".

## Observed Behavior

- **Event sequence**: `keydown` (Backspace) → default delete removes empty span → `input`. Then `keydown` ("x") → default insert → `beforeinput` (e.g. `insertText`) → `input`. After `input`, the DOM contains a new inline wrapper around the typed character.
- **Consistency**: Adding any character or space inside the span before deleting it (so the span is not "empty") often avoids recreation. Using `display: block` (or other non-inline) on the span can also change or avoid the behavior.
- **Other engines**: Safari and Firefox may not recreate the span in the same way; behavior is Chromium-specific in practice.

## Expected Behavior

Per predictable editing semantics, deleting an inline element and then typing should result in the typed character being inserted as a normal text node (or merged into an adjacent text node). The browser should not re-invent a previously deleted inline wrapper. The Input Events spec does not define "recreate deleted inline" as a standard action.

## Impact

- **State corruption**: React/Vue/Svelte treat the DOM as derived from their state; unexpected insertion of a `<span>` breaks reconciliation and can cause duplicate or wrong content.
- **Undo/redo**: Custom history that records "delete span" then "insert text" will not match the final DOM (which has a new span).
- **Serialization**: HTML export may contain extra formatting (e.g. `<span>x</span>`) that the user did not intend.

## Browser Comparison

- **Chrome (Blink)**: Recreates empty inline on type; confirmed in 124.x.
- **Safari (WebKit)**: May not recreate in the same scenario; structure-dependent.
- **Firefox (Gecko)**: Typically does not recreate the deleted empty inline in the same way.

## Solutions

1. **Normalize on input**: In the `input` handler, walk the editable root and remove or merge redundant inline elements (e.g. `span:empty`, or unwrap single-text-node spans that the editor did not create).
2. **Avoid empty inlines**: When building content, avoid leaving empty `<span>`/`<b>`/`<i>` nodes; use a zero-width space (`\u200B`) or ensure the node has content so the engine does not treat it as "empty" for this path.
3. **beforeinput + preventDefault**: For `insertText`/`insertCompositionText`, you can preventDefault and apply your own DOM update so the browser does not run its insert (and thus does not recreate the inline). This requires correct `getTargetRanges()` usage and caret restoration.

## References

- [W3C editing #468: Contenteditable re-creating deleted children](https://github.com/w3c/editing/issues/468)
- [Stack Overflow: Chrome empty span in contenteditable](https://stackoverflow.com/questions/68914093/chrome-trying-to-delete-empty-span-in-contenteditable-results-in-added-node)
- [Chromium / execCommand-related behavior](https://w3c.github.io/editing/docs/execCommand/)
