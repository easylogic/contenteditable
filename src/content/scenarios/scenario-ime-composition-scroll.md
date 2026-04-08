---
id: scenario-ime-composition-scroll
title: Scrolling cancels or disrupts IME composition
description: "User scrolling the page or scrollable editor while the IME candidate window is open may cancel composition or move the caret out of sync—reported on iOS Safari with Japanese IME and Android Chrome with Chinese IME when scroll containers move the editing context."
category: ime
tags:
  - ime
  - scroll
  - composition
  - japanese
  - chinese
  - ios
  - android
status: draft
locale: en
---

User **scrolling** the page or scrollable editor while the IME candidate window is open may **cancel** composition or move the caret **out of sync**—reported on **iOS Safari** with Japanese IME and **Android Chrome** with Chinese IME when scroll containers move the editing context.

## Problem Overview

IME UI is anchored to the caret; scroll changes the viewport without necessarily firing the same events as keyboard-driven caret moves.

## Observed Behavior

- Japanese + iOS Safari: scroll during composition cancels (see cases).
- Chinese + Android Chrome: scroll cancels or loses candidate alignment.

## Impact

Composition cancelled mid-syllable; frustrating on long pages or nested scrollers.

## Solutions

- Avoid programmatic scroll that fights the user during `isComposing` when possible.
- Stabilize scroll containers around the active editor.

## Related Cases

- [ce-0194](ce-0194-japanese-ime-scroll-cancels-ios-safari)
- [ce-0205](ce-0205-chinese-ime-scroll-cancels-android-chrome)

## References

- [UI Events](https://www.w3.org/TR/uievents/)
