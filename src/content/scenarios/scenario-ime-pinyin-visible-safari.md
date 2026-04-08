---
id: scenario-ime-pinyin-visible-safari
title: Pinyin buffer visibility in Safari (Chinese IME)
description: "When typing Chinese Pinyin in Safari, the Latin buffer (underlined or styled) may render differently than in Chrome—overlap with table cells, clipping, or missing underline—so users cannot see what they are composing before picking hanzi."
category: ime
tags:
  - ime
  - chinese
  - pinyin
  - safari
  - ios
status: draft
locale: en
---

When typing **Chinese Pinyin** in **Safari**, the **Latin buffer** (underlined or styled) may render differently than in Chrome—**overlap** with table cells, **clipping**, or **missing underline**—so users cannot see what they are composing before picking hanzi.

## Problem Overview

This scenario focuses on **visual feedback** of the composition string, not only candidate window position (see [scenario-ime-table-cell-pinyin-safari](scenario-ime-table-cell-pinyin-safari)).

## Observed Behavior

- Desktop vs iOS Safari: Pinyin line visibility differs.
- Interaction with `contenteditable` styling (background, padding).

## Impact

Users commit wrong characters because they cannot read the buffer.

## Related Cases

- [ce-0234](ce-0234-chinese-ime-pinyin-table-safari-ko)
- [ce-0235](ce-0235-chinese-ime-pinyin-table-ios-safari-en)

## References

- WebKit bug tracker: search Pinyin + contenteditable
