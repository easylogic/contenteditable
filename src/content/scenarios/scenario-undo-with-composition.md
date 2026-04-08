---
id: scenario-undo-with-composition
title: Undo and redo during IME composition
description: "Pressing Undo or Redo while IME composition is active can cancel composition, leave partial syllables, or corrupt the undo stack. Behavior differs by browser and by whether the editor uses native undo or a custom history layer."
category: ime
tags:
  - ime
  - undo
  - redo
  - composition
  - history
status: draft
locale: en
---

Pressing Undo or Redo while IME composition is active can cancel composition, leave partial syllables, or corrupt the undo stack. Behavior differs by browser and by whether the editor uses native undo or a custom history layer.

## Problem Overview

Composition is a transient state; undo systems expect discrete transactions. Mixing the two produces undefined interactions in the HTML editing spec space.

## Observed Behavior

- Undo removes the composing text or the whole composition session unpredictably.
- Redo restores text that no longer matches IME state.

## Impact

Lost input, confused users, and hard-to-reproduce bugs in Korean/Japanese/Chinese workflows.

## Browser Comparison

Chromium, WebKit, and Gecko differ; mobile keyboards add variance.

## Solutions

- While `isComposing`, optionally block undo/redo shortcuts or queue them until `compositionend`.
- Document-model editors should record undo steps only at composition boundaries when possible.

## Related Cases

- [ce-0007](ce-0007-undo-breaks-composition)
- [ce-0208](ce-0208-korean-ime-undo-composition-chrome)
- [ce-0209](ce-0209-japanese-ime-undo-composition-safari)

## References

- [Input Events](https://www.w3.org/TR/input-events/)
