---
id: scenario-ime-composition-duplicate-events
title: Duplicate beforeinput or input events during IME composition
description: "Some browsers and keyboards emit duplicate composition-related input or beforeinput events—especially iOS Safari dictation paths and certain Android keyboards—so naive handlers that insert text on every input may double characters or corrupt state."
category: ime
tags:
  - ime
  - composition
  - beforeinput
  - input
  - ios
  - safari
  - android
status: draft
locale: en
---

Some browsers and keyboards emit **duplicate** composition-related `input` or `beforeinput` events—especially **iOS Safari** dictation paths and certain **Android** keyboards—so naive handlers that insert text on every `input` may **double characters** or corrupt state.

## Problem Overview

Frameworks often assume one `input` per user intent. IME and voice pipelines can replay or split events.

## Observed Behavior

- iOS Safari: extra `input` after dictation or composition end.
- Android: first-word duplication with prediction enabled.

## Impact

Duplicate text, broken undo, model–DOM drift in React-controlled editors.

## Solutions

- Deduplicate using a hash of `(inputType, data, selection position)` in a short window, or ignore `input` while a transaction is in flight.
- Prefer `beforeinput` cancellation paths when you fully control insertion.

## Related Cases

- [ce-0096](ce-0096-ime-composition-duplicate-events-ios-safari)
- [ce-0577](ce-0577-android-first-word-duplication)

## References

- [scenario-ios-safari-contenteditable-do-not-force-rerender-or-change-selection-during-input](scenario-ios-safari-contenteditable-do-not-force-rerender-or-change-selection-during-input) — related iOS sync issues
