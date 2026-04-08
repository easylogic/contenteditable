---
id: scenario-ime-composition-escape-key
title: Escape key during IME composition
description: "Escape typically cancels IME composition or closes the candidate window. In Edge, Firefox, and other engines, timing and whether partial text remains in the DOM differ—Arabic and Korean IME cases show cross-browser variance."
category: ime
tags:
  - ime
  - escape
  - composition
  - korean
  - arabic
  - edge
  - firefox
status: draft
locale: en
---

**Escape** typically **cancels** IME composition or closes the candidate window. In Edge, Firefox, and other engines, **timing** and whether **partial text** remains in the DOM differ—Arabic and Korean IME cases show cross-browser variance.

## Problem Overview

Editors that use Escape for command palettes or modal close must not steal the key during active composition.

## Observed Behavior

- Korean IME on Edge: Escape cancels with specific side effects (see cases).
- Arabic IME on Firefox: Escape cancels composition.

## Impact

Partial syllables left behind or removed inconsistently; conflicts with app-level Escape handlers.

## Solutions

- If `isComposing`, let Escape propagate to the IME first, or mirror platform behavior explicitly after testing.

## Related Cases

- [ce-0190](ce-0190-korean-ime-escape-cancels-edge)
- [ce-0203](ce-0203-arabic-ime-escape-cancels-firefox)

## References

- [UI Events](https://www.w3.org/TR/uievents/)
