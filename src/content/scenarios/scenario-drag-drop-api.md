---
id: scenario-drag-drop-api
title: HTML Drag and Drop API with contenteditable
description: "Using the HTML drag-and-drop API inside or alongside contenteditable regions often diverges from behavior on plain elements: default actions, `contenteditable` hit-testing, and `beforeinput`/`drop` ordering differ by browser. Custom editors must reconcile native DnD with their own selection model."
category: input
tags:
  - drag-drop
  - contenteditable
  - beforeinput
  - chrome
  - firefox
status: draft
locale: en
---

Using the HTML drag-and-drop API inside or alongside contenteditable regions often diverges from behavior on plain elements: default actions, `contenteditable` hit-testing, and `beforeinput`/`drop` ordering differ by browser. Custom editors must reconcile native DnD with their own selection model.

## Problem Overview

The drag-and-drop model predates modern `beforeinput` and IME-aware editing. `contenteditable` introduces nested editable islands, shadow roots in some setups, and browser-specific default drag images for text.

## Observed Behavior

- Internal text drag does not fire events in the order your framework expects.
- `drop` default handling fights `preventDefault` when moving text within the same editable.
- Dragging from outside (files, HTML) interacts differently with paste pipelines.

## Impact

Broken drag-to-reorder, lost selection after drop, and duplicated or missing fragments.

## Browser Comparison

Chromium and Gecko differ on `dragstart` data transfer for selection text; WebKit has additional quirks on macOS with image drags.

## Solutions

- Use `dataTransfer.setData('text/plain', ...)` explicitly when building custom drags.
- On `drop`, sync selection from the drop caret before applying document mutations.
- Consider disabling native DnD for internal moves and emulating with transparent overlays only if you can match accessibility expectations.

## Best Practices

- Test drag from another app, same-page second editor, and internal paragraph reorder.

## Related Cases

- [ce-0083](ce-0083-contenteditable-with-drag-drop-api)

## References

- [HTML Living Standard: Drag and drop](https://html.spec.whatwg.org/multipage/dnd.html)
- MDN: [Drag operations](https://developer.mozilla.org/en-US/docs/Web/API/HTML_Drag_and_Drop_API)
