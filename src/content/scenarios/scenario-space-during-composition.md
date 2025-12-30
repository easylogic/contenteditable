---
id: scenario-space-during-composition
title: Space key during composition is ignored or committed inconsistently
description: While composing text with an IME in a contenteditable element, pressing the Space key is either ignored or commits the composition in an inconsistent way compared to native text controls. This affects multiple languages including Korean, Japanese, Chinese, Thai, and others.
category: ime
tags:
  - composition
  - ime
  - space
status: draft
locale: en
---

While composing text with an IME in a `contenteditable` element, pressing the Space key is either ignored or commits the composition in an inconsistent way compared to native text controls.

## Language-Specific Manifestations

This issue manifests differently across languages:

- **Korean IME**: Space may be ignored during composition, or composition may be committed unexpectedly
- **Japanese IME**: Space is used for kanji conversion, which may conflict with inserting a space character
- **Chinese IME**: Space is used for character conversion, which may conflict with inserting a space character
- **Thai IME**: Space may be ignored or may commit composition unexpectedly
- **Other IMEs**: Similar issues may occur with other languages that use composition

The behavior can affect how products interpret word boundaries and trigger autocomplete or suggestion features.
