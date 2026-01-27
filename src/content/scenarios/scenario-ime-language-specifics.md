---
id: scenario-ime-language-specifics
title: "IME & Language Specifics: CJK, RTL, and Complex Scripts"
description: "Advanced handling of language-specific input behaviors, BiDi layout, and syllabic granularity."
category: "language"
tags: ["ime", "cjk", "rtl", "granularity", "composition"]
status: "confirmed"
locale: "en"
---

## Overview
Global editors must handle scripts that don't follow the "one key = one character" rule. This whitepaper covers the unique architectural requirements for CJK (syllabic composition), RTL (bidirectional flow), and Thai (tone mark stacking).

## Language Clusters

### 1. CJK (Korean, Japanese, Chinese)
The primary challenge is the **Active Buffer**.
- **Korean (Hangul)**: Syllables are built from individual jamo. Backspacing might delete a single jamo rather than the whole block.
- **Japanese**: Requires a conversion phase (Hiragana to Kanji). Events like `keydown` report code 229 during this entire process.

### 2. RTL (Arabic, Hebrew)
Directionality changes everything.
- **BiDi Engine**: Mixing RTL and LTR text (digits, English) often breaks selection rectangles.
- **Caret Alignment**: Chromium 124+ has known issues anchoring the caret to the left edge in RTL modes within scrolling containers.

### 3. Complex Scripts (Thai, Indic)
Scripts like Thai use multiple vertical levels for vowels and tone marks.
- **Caret Movement**: The cursor must jump across a "cluster" of marks, not individual bytes.

## Implementation Strategy

### Context-Aware Input
Detect the current language via the `lang` attribute or `InputMethodContext` (where available) to adjust backspace and selection behaviors dynamically.

## Related Cases
- [ce-0175: Japanese Kanji conversion](file:///Users/user/github/barocss/contenteditable/src/content/cases/ce-0175-japanese-ime-kanji-conversion-chrome.md)
- [ce-0570: RTL scroll alignment](file:///Users/user/github/barocss/contenteditable/src/content/cases/ce-0570-chromium-rtl-scroll-alignment-bug.md)
- [ce-0177: Thai tone mark positioning](file:///Users/user/github/barocss/contenteditable/src/content/cases/ce-0177-thai-ime-tone-mark-positioning-firefox.md)
