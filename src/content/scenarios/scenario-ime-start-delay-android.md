---
id: scenario-ime-start-delay-android
title: IME composition start delay on Android
description: "On Android Chrome and other WebView-based surfaces, compositionstart and the first compositionupdate can arrive later than on desktop after the user begins typing—especially for Japanese, Chinese, or Korean IMEs. Code that assumes immediate isComposing === true can mis-handle the first few keystrokes."
category: ime
tags:
  - android
  - ime
  - composition
  - delay
  - chrome
status: draft
locale: en
---

On Android Chrome and other WebView-based surfaces, `compositionstart` and the first `compositionupdate` can arrive later than on desktop after the user begins typing—especially for Japanese, Chinese, or Korean IMEs. Code that assumes immediate `isComposing === true` can mis-handle the first few keystrokes.

## Problem Overview

Mobile keyboards bundle input differently; the pipeline from key events to composition events has higher latency and may interleave with `beforeinput`/`input` in orders that differ from desktop.

## Observed Behavior

- Brief window where Latin or partial input appears before composition state flips.
- Duplicate or missing characters if the editor normalizes too early.

## Impact

Race conditions in framework-controlled editors; tests that only run on desktop miss the issue.

## Browser Comparison

Chrome vs WebView vs Samsung Internet can differ; same codebase in in-app browsers may diverge from Chrome.

## Solutions

- Gate structural DOM changes on `compositionend` when possible.
- Do not rely solely on `keydown` keyCode for IME on Android—pair with composition events.
- Test on real devices with Gboard + language packs.

## Related Cases

- [ce-0240](ce-0240-ime-start-delay-android-ko)
- [ce-0241](ce-0241-ime-start-delay-android-ja-en)
- [ce-0242](ce-0242-ime-start-delay-android-ja)
- [ce-0243](ce-0243-ime-start-delay-android-zh)

## References

- [UI Events — Composition events](https://www.w3.org/TR/uievents/)
