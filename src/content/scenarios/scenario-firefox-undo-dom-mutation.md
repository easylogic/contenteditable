---
id: scenario-firefox-undo-dom-mutation
title: Firefox undo stack corrupted when DOM mutates during editing
description: "In Firefox, programmatic DOM changes during typing (auto-formatting, spellcheck fixes, framework reconciliation) can desynchronize the internal undo stack. Undo/redo may jump to wrong snapshots or truncate history."
category: input
tags:
  - firefox
  - undo
  - redo
  - dom
  - history
status: draft
locale: en
---

In Firefox, programmatic DOM changes during typing (auto-formatting, spellcheck fixes, framework reconciliation) can desynchronize the internal undo stack. Undo/redo may jump to wrong snapshots or truncate history.

## Problem Overview

Gecko’s `contenteditable` undo model ties to editing sessions and DOM mutations. When JavaScript or the browser inserts nodes between keystrokes, the undo ring may record boundaries that do not match user intent.

## Observed Behavior

- Undo removes more or less text than the last visible edit.
- Redo becomes a no-op after certain mutations.
- Corruption worsens when combining IME composition with programmatic wraps.

## Impact

Data loss perception, broken editor sync layers, and difficult-to-reproduce bug reports.

## Browser Comparison

Chromium and WebKit have different undo granularity; this scenario is specifically about Firefox’s stack interaction with mid-input DOM changes.

## Solutions

- Defer non-essential DOM mutations until `compositionend` or idle time.
- Batch structural changes; avoid wrapping runs on every keystroke.
- When you must mutate, consider replacing the undo stack with a custom document history (ProseMirror-style) for Firefox.

## Best Practices

- Reproduce with Firefox ESR and current release; behavior evolves.

## Related Cases

- [ce-0224](ce-0224-firefox-undo-corruption)

## References

- MDN: [Document.execCommand](https://developer.mozilla.org/en-US/docs/Web/API/Document/execCommand) (legacy, but relevant to undo stacks)
- Firefox bug tracker: search for contenteditable undo + mutation
