---
id: scenario-ime-backspace-granularity
title: Backspace removes entire composed unit instead of single character component
description: When editing text with an IME in a contenteditable element, pressing Backspace removes the entire composed unit (syllable, character, etc.) instead of a single component. This makes fine-grained correction difficult and differs from native input fields. This affects multiple languages including Korean, Japanese, Chinese, and others.
category: ime
tags:
  - composition
  - ime
  - backspace
status: draft
---

When editing text with an IME in a `contenteditable` element, pressing Backspace removes the entire composed unit instead of a single component. This makes fine-grained correction difficult and differs from native input fields on the same platform.

## Language-Specific Manifestations

This issue manifests differently across languages:

- **Korean IME**: Entire syllable is removed instead of a single jamo (자모)
- **Japanese IME**: Entire character or word may be removed instead of a single character component
- **Chinese IME**: Entire character may be removed instead of allowing component-level editing
- **Other IMEs**: Similar issues may occur with other languages that use composition

This behavior can affect cursor movement, undo granularity, and diff calculation for text editors built on top of `contenteditable`.

This scenario has been observed in multiple environments with similar behavior across different languages.
