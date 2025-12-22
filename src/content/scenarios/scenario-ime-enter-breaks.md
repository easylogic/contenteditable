---
id: scenario-ime-enter-breaks
title: Composition is cancelled when pressing Enter inside contenteditable
description: When composing text with an IME in a contenteditable element, pressing Enter cancels the composition and sometimes commits only a partial syllable. The caret moves to the next line but the last composed character may be lost.
category: ime
tags:
  - composition
  - ime
  - enter
status: draft
---

When composing Korean text with an IME in a `contenteditable` element, pressing Enter cancels the
composition and sometimes commits only a partial syllable. In some browser and IME combinations,
the caret moves to the next line but the last composed character is lost.

This scenario has been observed in multiple environments with similar behavior.
