---
id: scenario-auto-scroll-on-typing
title: Auto-scroll while typing in contenteditable
description: "Browsers try to keep the caret visible by scrolling the editable container or the page. During rapid typing—especially near the bottom or right edge—scroll updates can lag, batch, or feel jarring, so the caret temporarily leaves the viewport or the view jumps unexpectedly."
category: performance
tags:
  - scroll
  - caret
  - typing
  - contenteditable
  - chrome
  - safari
status: draft
locale: en
---

Browsers try to keep the caret visible by scrolling the editable container or the page. During rapid typing—especially near the bottom or right edge—scroll updates can lag, batch, or feel jarring, so the caret temporarily leaves the viewport or the view jumps unexpectedly.

## Problem Overview

Rich editors often rely on the browser’s built-in “scroll into view” behavior for the active selection. That behavior is not specified in fine detail for `contenteditable`, and timing differs by engine. Editors that measure layout or virtualize lines may fight the same scroll logic, amplifying jank.

## Observed Behavior

- **Lag**: Scroll catches up after several keystrokes; the caret is briefly off-screen.
- **Jarring jumps**: Large scroll corrections after a burst of input.
- **Performance**: Noticeable cost when the editable is inside nested scrollers or heavy layouts.

## Impact

Users lose track of the insertion point; accessibility users may hear updates out of sync with what is visible. Editor frameworks that assume “caret is always visible” can desynchronize internal state from DOM selection.

## Browser Comparison

Blink often scrolls the nearest scrollable ancestor; WebKit may differ when the caret is near replaced elements or soft wraps. Gecko has its own scroll anchoring and undo interactions that can interact with typing near edges.

## Solutions

- Reduce work per keystroke (debounce decoration, avoid synchronous layout reads).
- For custom scroll containers, call `scrollIntoView` / `scrollTo` on the active range with `block: 'nearest'` after your own layout pass—coordinate with `requestAnimationFrame`.
- Consider `overflow-anchor` / scroll anchoring awareness when content height changes above the caret.

## Best Practices

- Do not read `getBoundingClientRect` on every `input` in hot paths.
- Test rapid typing at the bottom of a tall `contenteditable` inside a `max-height` container.

## Related Cases

- [ce-0122](ce-0122-auto-scroll-jarring) — jarring scroll during typing
- [ce-0131](ce-0131-auto-scroll-lag-rapid-typing) — lag when typing near edges
- [ce-0161](ce-0161-auto-scroll-performance) — scroll performance cost

## References

- [CSS Overflow Module](https://www.w3.org/TR/css-overflow-3/) — scrollable overflow
- [Selection API](https://www.w3.org/TR/selection-api/) — caret and range
