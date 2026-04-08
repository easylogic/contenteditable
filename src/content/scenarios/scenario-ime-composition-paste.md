---
id: scenario-ime-composition-paste
title: Paste during IME composition cancels or corrupts composition
description: "Pasting from the clipboard while IME composition is active may cancel the composition session, replace the wrong range, or interleave pasted text with unfinished syllables—Firefox and Chrome show different behavior for Korean and Hindi IME paths."
category: ime
tags:
  - ime
  - paste
  - composition
  - korean
  - hindi
  - firefox
  - chrome
status: draft
locale: en
---

**Pasting** from the clipboard while IME composition is active may **cancel** the composition session, **replace** the wrong range, or **interleave** pasted text with unfinished syllables—**Firefox** and **Chrome** show different behavior for Korean and Hindi IME paths.

## Problem Overview

Paste generates `beforeinput` / `input` with `insertFromPaste`; composition may still be active (`isComposing` true), producing undefined ordering relative to `compositionend`.

## Observed Behavior

- Korean IME + Firefox: paste cancels composition (see cases).
- Hindi IME + Chrome: paste disrupts Devanagari composition.

## Impact

Lost composing text, mixed scripts, or duplicate fragments.

## Solutions

- Defer non-text clipboard handling until `compositionend` when feasible.
- Validate selection after paste if IME was active.

## Related Cases

- [ce-0193](ce-0193-korean-ime-paste-cancels-firefox)
- [ce-0204](ce-0204-hindi-ime-paste-cancels-chrome)

## References

- [Input Events](https://www.w3.org/TR/input-events/)
