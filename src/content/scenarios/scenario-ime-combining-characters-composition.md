---
id: scenario-ime-combining-characters-composition
title: Combining characters and complex scripts during IME composition
description: "Scripts that use combining marks, conjuncts, or tone marks (e.g. Thai, Devanagari, Vietnamese, Cyrillic) may compose differently across browsers. Diacritics can be lost, reordered, or split across DOM nodes when the editor normalizes or wraps text during composition."
category: ime
tags:
  - ime
  - composition
  - combining-characters
  - devanagari
  - thai
  - vietnamese
  - cyrillic
status: draft
locale: en
---

Scripts that use combining marks, conjuncts, or tone marks (e.g. Thai, Devanagari, Vietnamese, Cyrillic) may compose differently across browsers. Diacritics can be lost, reordered, or split across DOM nodes when the editor normalizes or wraps text during composition.

## Problem Overview

Unicode combining sequences and grapheme clusters do not always map 1:1 to DOM `Text` nodes or to editor transactions. Frameworks that slice strings by JavaScript `length` or insert zero-width characters for placeholders can break Indic or Thai input.

## Observed Behavior

- Tone marks or vowel signs appear in the wrong order relative to the base character.
- Conjunct formation fails until a space or punctuation is typed.
- Cyrillic composition behaves differently from Latin IME expectations.

## Impact

Corrupted words, broken spell-check ranges, and undo stacks that do not match user expectations.

## Browser Comparison

Harfbuzz shaping and platform IMEs differ; Safari vs Chrome on the same OS can diverge for Vietnamese and Thai.

## Solutions

- Prefer grapheme-aware operations (e.g. `Intl.Segmenter` or libraries) when mutating text during composition.
- Avoid splitting `Text` nodes during `compositionupdate` unless necessary.
- Debounce normalization until `compositionend`.

## Best Practices

- Test Vietnamese Telex/VNI and Thai with multiple keyboard layouts.

## Related Cases

- [ce-0177](ce-0177-thai-ime-tone-mark-positioning-firefox)
- [ce-0178](ce-0178-vietnamese-ime-diacritic-loss-chrome)
- [ce-0180](ce-0180-hindi-ime-devanagari-conjuncts-chrome)
- [ce-0206](ce-0206-russian-ime-cyrillic-composition-chrome)

## References

- [Unicode Standard Annex #29](https://unicode.org/reports/tr29/) — text segmentation
- [CSS Text Module](https://www.w3.org/TR/css-text-3/) — typographic behavior
