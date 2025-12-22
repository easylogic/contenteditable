---
id: scenario-ime-backspace-granularity
title: Backspace removes a whole composed syllable instead of a single jamo
description: When editing Korean text in a `contenteditable` element, pressing Backspace removes the entire
category: ime
tags:
  - composition
  - ime
  - backspace
status: draft
---

When editing Korean text in a `contenteditable` element, pressing Backspace removes the entire
composed syllable instead of a single jamo. This makes fine-grained correction difficult and
differs from native input fields on the same platform.

This scenario has been observed in multiple environments with similar behavior.
