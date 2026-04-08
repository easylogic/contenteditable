---
id: scenario-ime-rtl-and-character-joining
title: RTL scripts and character joining during IME composition (Arabic, Hebrew)
description: "Arabic and Hebrew use right-to-left direction and contextual letter forms. During composition, joining rules, bidi isolation, and Safari vs Firefox may disagree—caret position and composed text can diverge from visual order."
category: ime
tags:
  - ime
  - rtl
  - arabic
  - hebrew
  - bidi
  - safari
  - firefox
status: draft
locale: en
---

**Arabic** and **Hebrew** use **right-to-left** direction and contextual **letter forms**. During composition, **joining** rules, **bidi** isolation, and **Safari vs Firefox** may disagree—caret position and composed text can diverge from visual order.

## Problem Overview

`dir="rtl"` and mixed-direction spans inside `contenteditable` interact with IME pipelines that were often tested primarily on LTR Latin/CJK.

## Observed Behavior

- Arabic on Safari: character joining during composition (see cases).
- Hebrew on Firefox: RTL composition quirks.

## Impact

Misplaced caret, wrong glyph order, or selection that does not match user expectations.

## Related Cases

- [ce-0179](ce-0179-arabic-ime-character-joining-safari)
- [ce-0207](ce-0207-hebrew-ime-rtl-composition-firefox)

## References

- [W3C: Structural markup and RTL](https://www.w3.org/International/questions/qa-html-dir)
- [scenario-rtl-text-direction-inconsistent](scenario-rtl-text-direction-inconsistent)
