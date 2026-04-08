---
id: scenario-ime-composition-tab-key
title: Tab key during IME composition (focus vs indent vs IME)
description: "Tab moves focus by default. During IME composition, Tab may cancel composition, cycle candidates, or be captured by the editor for indentation—behavior differs for Chinese, Thai, and Safari vs Firefox."
category: ime
tags:
  - ime
  - tab
  - composition
  - chinese
  - thai
  - safari
  - firefox
status: draft
locale: en
---

**Tab** moves focus by default. During IME composition, Tab may **cancel** composition, **cycle** candidates, or be **captured** by the editor for indentation—behavior differs for Chinese, Thai, and **Safari vs Firefox**.

## Problem Overview

Rich editors often `preventDefault` on Tab for lists; during `isComposing`, that can cancel IME unexpectedly.

## Observed Behavior

- Chinese IME on Firefox: Tab cancels composition (see cases).
- Thai IME on Safari: Tab may cancel or move focus.

## Impact

Lost partial input; users blame the editor for “eating” Tab.

## Solutions

- While `isComposing`, avoid handling Tab for indentation unless you explicitly mirror platform IME conventions.

## Related Cases

- [ce-0189](ce-0189-chinese-ime-tab-cancels-firefox)
- [ce-0202](ce-0202-thai-ime-tab-cancels-safari)

## References

- [UI Events](https://www.w3.org/TR/uievents/)
