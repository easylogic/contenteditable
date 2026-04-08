---
id: scenario-ime-table-cell-pinyin-safari
title: Chinese Pinyin candidate window in table cells (Safari and cross-browser)
description: "When editing Chinese Pinyin inside a table cell—especially on iOS Safari—the IME candidate window can be clipped, positioned incorrectly, or behave differently than in a plain paragraph. Other browsers (Firefox, Edge, Chrome) also show layout-specific quirks."
category: ime
tags:
  - ime
  - chinese
  - pinyin
  - table
  - safari
  - ios
status: draft
locale: en
---

When editing Chinese Pinyin inside a table cell—especially on iOS Safari—the IME candidate window can be clipped, positioned incorrectly, or behave differently than in a plain paragraph. Other browsers (Firefox, Edge, Chrome) also show layout-specific quirks.

## Problem Overview

IME UI is anchored to the caret rect; table layout, overflow, and nested `contenteditable` regions change that rect and stacking context, so the candidate list may not appear where users expect.

## Observed Behavior

- Candidate window obscured by cell borders or scroll containers.
- Different behavior between cell vs block content outside tables.

## Impact

Users cannot see candidates; they commit wrong characters or cancel composition.

## Browser Comparison

Safari on iOS is frequently reported; Edge vs Chrome can differ on desktop with complex tables.

## Solutions

- Avoid `overflow: hidden` on immediate ancestors of the caret during composition if possible.
- Test Pinyin input in `<td contenteditable>` with real devices.
- Consider lifting the editable surface or using a portal for IME-heavy locales (advanced).

## Related Cases

- [ce-0236](ce-0236-chinese-ime-pinyin-table-safari-ko)
- [ce-0237](ce-0237-chinese-ime-pinyin-table-ios-safari-en)
- [ce-0238](ce-0238-chinese-ime-pinyin-table-edge-en)
- [ce-0239](ce-0239-chinese-ime-pinyin-table-firefox-en)

## References

- WebKit Bugzilla: search for IME + table / contenteditable
