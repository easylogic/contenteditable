---
id: scenario-ime-language-specifics
title: "Language-Specific IME Logic: CJK, RTL, and Combining Chars"
description: "A deep dive into the unique structural requirements for Korean, Japanese, Chinese, Arabic, and Thai IME implementations."
category: "logic"
tags: ["ime", "cjk", "rtl", "combining-characters", "localization"]
status: "confirmed"
locale: "en"
---

## Overview
Every language has a different "Composition Topology." Handling Korean syllables is fundamentally different from Japanese Kanji conversion or Arabic character joining.

## Technical Divergence

### 1. Korean (Hangul): Syllabic Synthesis
Hangul IMEs build characters from Jamo (consonants/vowels). 
- **The 'Half-Full' Trap**: Some browsers report a character as "Composing" until the final syllable is closed by the NEXT character, leading to off-by-one errors in model synchronization.

### 2. Japanese/Chinese: The Candidate List
These IMEs require users to select from a list of homophones.
- **The Selection Mismatch**: In Safari, `window.getSelection()` often returns an empty range or points to the start of the composition while the user is actively browsing the candidate list.

### 3. Arabic/Hebrew: RTL Intersection
RTL IMEs must handle character joining (ligatures) dynamically.
- **The Cursor Flip**: In Chromium, the caret often "jumps" to the start of the line when a composition session begins in RTL mode, only to snap back once the first character is committed.

### 4. Thai: Tone Mark Positioning
Thai uses combining characters that stack vertically.
- **The 'Zero-Width' Bug**: Some browsers treat combining marks as having width during composition, causing text to "jitter" horizontally as the user types.

## Handling Structural Intersects

### Composition in Tables and Lists
Composing text inside a `<td>` or `<li>` often triggers the browser's "Safe Node" logic, where it wraps the composition in a temporary `<span>` or `font` tag.
- **Warning**: Do NOT apply global CSS resets like `span { display: block }` as it will break the IME's physical positioning.

## Related Cases
- [ce-0575: ProseMirror Safari Table cell leak](file:///Users/user/github/barocss/contenteditable/src/content/cases/ce-0575-prosemirror-safari-empty-table-leak.md)
- [ce-0175: Japanese IME Kanji conversion in Chrome](file:///Users/user/github/barocss/contenteditable/src/content/cases/ce-0175-japanese-ime-kanji-conversion-chrome.md)
---
id: scenario-ime-language-specifics
title: "Language-Specific IME Logic: CJK, RTL, and Combining Chars"
description: "A deep dive into the unique structural requirements for Korean, Japanese, Chinese, Arabic, and Thai IME implementations."
category: "logic"
tags: ["ime", "cjk", "rtl", "combining-characters", "localization"]
status: "confirmed"
locale: "en"
---

## Overview
Every language has a different "Composition Topology." Handling Korean syllables is fundamentally different from Japanese Kanji conversion or Arabic character joining.

## Technical Divergence

### 1. Korean (Hangul): Syllabic Synthesis
Hangul IMEs build characters from Jamo (consonants/vowels). 
- **The 'Half-Full' Trap**: Some browsers report a character as "Composing" until the final syllable is closed by the NEXT character, leading to off-by-one errors in model synchronization.

### 2. Japanese/Chinese: The Candidate List
These IMEs require users to select from a list of homophones.
- **The Selection Mismatch**: In Safari, `window.getSelection()` often returns an empty range or points to the start of the composition while the user is actively browsing the candidate list.

### 3. Arabic/Hebrew: RTL Intersection
RTL IMEs must handle character joining (ligatures) dynamically.
- **The Cursor Flip**: In Chromium, the caret often "jumps" to the start of the line when a composition session begins in RTL mode, only to snap back once the first character is committed.

### 4. Thai: Tone Mark Positioning
Thai uses combining characters that stack vertically.
- **The 'Zero-Width' Bug**: Some browsers treat combining marks as having width during composition, causing text to "jitter" horizontally as the user types.

## Handling Structural Intersects

### Composition in Tables and Lists
Composing text inside a `<td>` or `<li>` often triggers the browser's "Safe Node" logic, where it wraps the composition in a temporary `<span>` or `font` tag.
- **Warning**: Do NOT apply global CSS resets like `span { display: block }` as it will break the IME's physical positioning.

## Related Cases
- [ce-0575: ProseMirror Safari Table cell leak](file:///Users/user/github/barocss/contenteditable/src/content/cases/ce-0575-prosemirror-safari-empty-table-leak.md)
- [ce-0175: Japanese IME Kanji conversion in Chrome](file:///Users/user/github/barocss/contenteditable/src/content/cases/ce-0175-japanese-ime-kanji-conversion-chrome.md)
