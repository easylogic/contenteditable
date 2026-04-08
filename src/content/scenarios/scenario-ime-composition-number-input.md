---
id: scenario-ime-composition-number-input
title: Number keys for IME candidate selection (Japanese and Chinese)
description: "Many IMEs let users pick candidates with number keys 1–9. In contenteditable, those keys may be consumed by the IME, intercepted by the page for shortcuts, or mis-handled by Safari—causing wrong selection or cancelled composition."
category: ime
tags:
  - ime
  - japanese
  - chinese
  - candidate
  - keyboard
  - safari
  - chrome
status: draft
locale: en
---

Many IMEs let users pick candidates with **number keys 1–9**. In `contenteditable`, those keys may be consumed by the IME, intercepted by the page for shortcuts, or mis-handled by **Safari**—causing wrong selection or cancelled composition.

## Problem Overview

Editor shortcuts (lists, headings) often bind `Mod+1` etc.; plain digit keys during IME must reach the IME first.

## Observed Behavior

- Japanese: number selects kanji candidate in Chrome; Safari may differ.
- Chinese: Pinyin candidate selection with digits on Safari vs Chrome.

## Impact

Wrong character committed; composition cancelled if the editor handles `keydown` too aggressively.

## Related Cases

- [ce-0191](ce-0191-japanese-ime-number-candidate-selection-chrome)
- [ce-0192](ce-0192-chinese-ime-number-candidate-selection-safari)

## References

- [UI Events](https://www.w3.org/TR/uievents/)
