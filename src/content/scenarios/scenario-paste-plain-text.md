---
id: scenario-paste-plain-text
title: Plain text paste and plaintext-only contenteditable
description: "Rich paste into contenteditable pulls in unwanted HTML; users expect paste-as-plain-text or plaintext-only modes. Browsers differ on clipboard APIs, execCommand, and how NBSP and whitespace survive—breaking layout when editors assume 'plain' means U+0020 only."
category: clipboard
tags:
  - paste
  - plain-text
  - clipboard
  - contenteditable
  - nbsp
status: draft
locale: en
---

Rich paste into `contenteditable` pulls in **unwanted HTML**; users expect **paste-as-plain-text** or **`plaintext-only`** modes. Browsers differ on clipboard APIs, `execCommand`, and how **NBSP** and whitespace survive—breaking layout when editors assume “plain” means U+0020 only.

## Problem Overview

`contenteditable="plaintext-only"` (where supported) reduces rich paste but has compatibility limits; manual stripping via `clipboardData.getData('text/plain')` must still normalize spaces.

## Observed Behavior

- Safari / Word: styled HTML on paste unless intercepted.
- `plaintext-only` + NBSP: line layout can break (see related cases).

## Impact

Unexpected bold/color in “simple” fields; subtle layout bugs from non-breaking spaces.

## Related Cases

- [ce-0019](ce-0019-paste-plain-text-only)
- [ce-0572](ce-0572-plaintext-only-nbsp-layout-broken)

## References

- MDN: [ClipboardEvent](https://developer.mozilla.org/en-US/docs/Web/API/ClipboardEvent)
- [scenario-paste-formatting-loss](scenario-paste-formatting-loss)
