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
locale: en
---

When composing text with an IME in a `contenteditable` element, pressing Enter cancels the composition and sometimes commits only a partial character or syllable. In some browser and IME combinations, the caret moves to the next line but the last composed character is lost.

## Language-Specific Manifestations

This issue manifests differently across languages:

- **Korean IME**: Partial syllable may be lost (e.g., "한" becomes "하" when Enter is pressed during composition)
- **Japanese IME**: Partial romaji or incomplete kanji conversion may be committed
- **Chinese IME**: Partial Pinyin or incomplete character conversion may be committed
- **Other IMEs**: Similar issues may occur with other languages that use composition

This scenario has been observed in multiple environments with similar behavior across different languages.

## References

- [Ghostty Issue #8440: Korean IME character loss with arrow keys](https://github.com/ghostty-org/ghostty/issues/8440) - Related IME composition issues
- [ProseMirror Issue #1484: Enter during Korean IME causes character to vanish](https://github.com/ProseMirror/prosemirror/issues/1484) - Enter key during composition
- [Microsoft Support: Korean/Japanese IME composition issues](https://support.microsoft.com/en-us/topic/korean-or-japanese-ime-composition-may-not-work-correctly-in-internet-explorer-11-or-microsoft-edge-901941be-8632-1efd-df3b-7102112f0e91) - IME composition problems
