---
id: scenario-ime-composition-focus-change
title: IME composition when focus moves between elements (Korean and others)
description: "If the user switches focus to another field, button, or nested contenteditable while Korean (or other) IME composition is active, browsers differ on whether composition is committed, cancelled, or leaves orphan state. Chrome, Safari, and Firefox do not agree; mobile adds more variance."
category: ime
tags:
  - ime
  - composition
  - focus
  - blur
  - korean
  - chrome
  - safari
  - firefox
status: draft
locale: en
---

If the user switches **focus** to another field, button, or nested `contenteditable` while Korean (or other) IME composition is active, browsers differ on whether composition is **committed**, **cancelled**, or leaves **orphan** state. Chrome, Safari, and Firefox do not agree; mobile adds more variance.

## Problem Overview

`blur` during composition triggers `compositionend` in some paths but not others; the same gesture on three engines can yield three different DOM outcomes.

## Observed Behavior

- Focus moves to toolbar: in-flight Hangul may commit to the editor or disappear.
- Nested editables: focus may move without a full composition lifecycle.

## Impact

Lost input, duplicate characters when refocusing, or editor state diverging from IME state.

## Browser Comparison

This scenario groups **ce-0229 / ce-0230 / ce-0231** (Chrome, Firefox, Safari) for Korean IME focus/blur—compare reproduction steps across cases.

## Solutions

- On `blur`, if `isComposing`, optionally **commit or cancel** explicitly via IME-aware paths (platform-dependent; test only).
- Avoid moving focus programmatically during active composition unless unavoidable.

## Related Cases

- [ce-0229](ce-0229-korean-ime-focus-blur-chrome)
- [ce-0230](ce-0230-korean-ime-focus-blur-firefox)
- [ce-0231](ce-0231-korean-ime-focus-blur-safari)

## References

- [UI Events — Composition events](https://www.w3.org/TR/uievents/)
