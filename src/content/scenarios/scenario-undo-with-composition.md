---
id: scenario-undo-with-composition
title: Undo during IME composition clears more text than expected
description: Pressing Undo while an IME composition is active in a `contenteditable` element removes more text
category: ime
tags:
  - undo
  - composition
  - ime
status: draft
---

Pressing Undo while an IME composition is active in a `contenteditable` element removes more text
than expected, including characters that were committed before the current composition.
