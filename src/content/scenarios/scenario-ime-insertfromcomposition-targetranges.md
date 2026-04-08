---
id: scenario-ime-insertfromcomposition-targetranges
title: insertFromComposition and getTargetRanges() for IME commits
description: "When composition ends, beforeinput may use inputType insertFromComposition or insertCompositionText. getTargetRanges() should describe the range to replace; on Safari (especially iOS) or with certain IMEs, ranges may be missing, wrong, or inconsistent with desktop Safari—breaking editors that rely on target ranges for transactions."
category: ime
tags:
  - ime
  - beforeinput
  - getTargetRanges
  - insertFromComposition
  - safari
  - ios
status: draft
locale: en
---

When composition ends, `beforeinput` may use `inputType` **`insertFromComposition`** or **`insertCompositionText`**. `getTargetRanges()` should describe the range to replace; on **Safari (especially iOS)** or with certain IMEs, ranges may be missing, wrong, or inconsistent with desktop Safari—breaking editors that rely on target ranges for transactions.

## Problem Overview

Input Events recommend `getTargetRanges()` for knowing what DOM will change. IME commit paths are the least uniform across engines.

## Observed Behavior

- Desktop Safari vs iOS Safari: Korean/Japanese may omit or mis-scope ranges compared to Chrome.
- `insertFromComposition` fires without overlapping `compositionend` in some stacks—ordering matters.

## Impact

Wrong character replacement, cursor jumps, or ProseMirror/Slate transactions applied to the wrong positions.

## Browser Comparison

WebKit mobile vs desktop; contrast with Chromium’s behavior for the same IME.

## Solutions

- Fall back to `getSelection().getRangeAt(0)` when `getTargetRanges()` is empty—validate range still in editor.
- Debounce structural updates until after `compositionend` if ranges are flaky.

## Related Cases

- [ce-0214](ce-0214-ime-insertfromcomposition-targetranges-desktop-safari-korean)
- [ce-0215](ce-0215-ime-insertfromcomposition-targetranges-ios-safari-japanese)
- [ce-0216](ce-0216-ime-insertfromcomposition-missing-ios-safari-korean)

## References

- [Input Events Level 2](https://www.w3.org/TR/input-events-2/)
- [scenario-gettargetranges-empty](scenario-gettargetranges-empty)
