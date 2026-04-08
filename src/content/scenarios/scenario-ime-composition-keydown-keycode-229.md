---
id: scenario-ime-composition-keydown-keycode-229
title: keyCode 229 and Enter during IME composition
description: "During IME composition, keydown often reports keyCode 229 (VK_PROCESSKEY on Windows) for many keys, meaning the event is part of an input method sequence. Enter may commit composition, insert a newline, or be swallowed—Chrome vs Firefox vs Japanese layouts differ. Handlers that assume Enter always means insertParagraph break composition incorrectly."
category: ime
tags:
  - ime
  - composition
  - keyCode
  - keydown
  - enter
  - chrome
  - firefox
status: draft
locale: en
---

During IME composition, `keydown` often reports **keyCode 229** (`VK_PROCESSKEY` on Windows) for many keys, meaning the event is part of an input method sequence. **Enter** may commit composition, insert a newline, or be swallowed—Chrome vs Firefox vs Japanese layouts differ. Handlers that assume Enter always means `insertParagraph` break composition incorrectly.

## Problem Overview

Legacy `keyCode` / `which` APIs are deprecated but still used in hot paths. **229** is a sentinel: “handled by IME; don’t treat as a normal key.” Ignoring that and running custom Enter logic during `isComposing` causes double commits or cancelled composition.

## Observed Behavior

- Enter fires with keyCode 229 during composition; `beforeinput` may carry `insertLineBreak` or composition commit depending on engine.
- Japanese IME: Enter to select first candidate vs newline differs by IME settings.

## Impact

Duplicate lines, lost syllables, or editors that block Enter entirely during IME.

## Browser Comparison

Chrome and Firefox dispatch different sequences around Enter + composition; macOS vs Windows keyboard stacks add variance.

## Solutions

- Prefer **`e.isComposing`** and `beforeinput` `inputType` over raw keyCode for control flow.
- If you must use `keydown`, treat **229** as “possibly IME—do not insert structural nodes.”
- Test **Japanese** and **Korean** Enter behavior explicitly.

## Related Cases

- [ce-0210](ce-0210-ime-keydown-keycode-229-enter-chrome)
- [ce-0211](ce-0211-ime-keydown-keycode-229-enter-firefox)
- [ce-0212](ce-0212-ime-keydown-keycode-229-enter-japanese-chrome)

## References

- MDN: [KeyboardEvent: keyCode](https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/keyCode) (deprecated)
- [UI Events](https://www.w3.org/TR/uievents/)
