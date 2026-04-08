---
id: scenario-ime-composition-focus-blur
title: Blur and focus during IME composition (CJK and Japanese Safari)
description: "Moving focus away from the editor while composing text (Chinese, Japanese, Korean) can cancel composition, commit partial text, or leave the IME candidate window out of sync. Safari often shows distinct behavior for Japanese; Chrome behavior for Chinese/Korean is covered in related cases."
category: ime
tags:
  - ime
  - composition
  - focus
  - blur
  - chinese
  - japanese
  - korean
  - safari
  - chrome
status: draft
locale: en
---

Moving **focus away** from the editor while composing text (Chinese, Japanese, Korean) can **cancel** composition, **commit** partial text, or leave the IME candidate window **out of sync**. Safari often shows distinct behavior for **Japanese**; Chrome behavior for Chinese/Korean is covered in related cases.

## Problem Overview

This overlaps partially with [scenario-ime-composition-focus-change](scenario-ime-composition-focus-change) but emphasizes **language-specific** blur handling (Japanese on Safari vs Korean/Chinese on Chrome) rather than only cross-browser Chrome/Firefox/Safari for one language.

## Observed Behavior

- Japanese IME on Safari: composition may end abruptly on blur.
- Chinese IME on Chrome: partial Pinyin may remain or flush.

## Impact

Orphan composing ranges, inconsistent undo points, and mismatch between visible candidate UI and DOM text.

## Related Cases

- [ce-0187](ce-0187-korean-ime-focus-blur-chrome-ko)
- [ce-0188](ce-0188-japanese-ime-focus-blur-safari)
- [ce-0201](ce-0201-chinese-ime-focus-blur-chrome)

## References

- [UI Events](https://www.w3.org/TR/uievents/)
