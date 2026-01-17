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
locale: en
---

Pressing Undo while an IME composition is active in a `contenteditable` element removes more text
than expected, including characters that were committed before the current composition.

## References

- [Chromium Editing Dev: Undo with IME is super-wonky](https://groups.google.com/a/chromium.org/g/editing-dev/c/Rf5cK48yY3Y) - Chromium Issue 787598
- [Ghostty Issue #8440: Korean IME character loss](https://github.com/ghostty-org/ghostty/issues/8440) - Character loss issues
- [Scintilla Bug #2137: IME state not cleared](https://sourceforge.net/p/scintilla/bugs/2137/) - IME state management
