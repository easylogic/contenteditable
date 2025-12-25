---
id: scenario-ime-enter-breaks
title: Composition is cancelled when pressing Enter inside contenteditable
description: When composing text with an IME in a contenteditable element, pressing Enter cancels the composition and sometimes commits only a partial character or syllable. The caret moves to the next line but the last composed character may be lost. This affects multiple languages including Korean, Japanese, Chinese, and others.
category: ime
tags:
  - composition
  - ime
  - enter
status: draft
---

When composing text with an IME in a `contenteditable` element, pressing Enter cancels the composition and sometimes commits only a partial character or syllable. In some browser and IME combinations, the caret moves to the next line but the last composed character is lost.

## Language-Specific Manifestations

This issue manifests differently across languages:

- **Korean IME**: Partial syllable may be lost (e.g., "한" becomes "하" when Enter is pressed during composition)
- **Japanese IME**: Partial romaji or incomplete kanji conversion may be committed
- **Chinese IME**: Partial Pinyin or incomplete character conversion may be committed
- **Other IMEs**: Similar issues may occur with other languages that use composition

This scenario has been observed in multiple environments with similar behavior across different languages.
