---
id: scenario-space-during-composition
title: Space key behavior during IME composition
description: "During active IME composition, pressing Space may commit the segment, insert a literal space, be ignored, or cancel composition—depending on language, IME, and browser. Editors that assume Space always inserts U+0020 can lose characters or break composition state."
category: ime
tags:
  - ime
  - composition
  - space
  - thai
  - japanese
  - arabic
  - hindi
status: draft
locale: en
---

During active IME composition, pressing Space may commit the segment, insert a literal space, be ignored, or cancel composition—depending on language, IME, and browser. Editors that assume Space always inserts U+0020 can lose characters or break composition state.

## Problem Overview

Space is overloaded: it can mean “pick first candidate”, “insert word separator”, or “commit and insert space”. The same physical key is handled differently in CJK, Thai, Indic, and RTL scripts. `beforeinput` / `input` sequences also vary.

## Observed Behavior

- Space is swallowed or ignored until composition ends.
- Space commits early and loses the intended syllable.
- Conflicts between editor shortcuts and IME expectations.

## Impact

Lost or duplicated characters, broken undo boundaries, and divergent behavior between desktop and mobile keyboards.

## Browser Comparison

Chromium, WebKit, and Gecko each route Space through different IME pipelines; Linux IBus/Fcitx stacks add another layer.

## Solutions

- Do not handle Space globally while `isComposing` is true unless you have a language-specific reason.
- Prefer reading the final committed text from `input` events rather than predicting Space behavior.
- Test Thai, Japanese, Arabic, and Hindi IMEs explicitly—patterns differ from Korean/Chinese.

## Best Practices

- Respect `compositionstart` / `compositionend` and avoid DOM mutations that split the composing range.

## Related Cases

- [ce-0010](ce-0010-space-lost-during-composition)
- [ce-0183](ce-0183-japanese-ime-space-conversion-chrome)
- [ce-0184](ce-0184-thai-ime-space-ignored-firefox)
- [ce-0197](ce-0197-arabic-ime-space-ignored-chrome)
- [ce-0198](ce-0198-hindi-ime-space-ignored-firefox)

## References

- [UI Events](https://www.w3.org/TR/uievents/)
- MDN: [CompositionEvent](https://developer.mozilla.org/en-US/docs/Web/API/CompositionEvent)
