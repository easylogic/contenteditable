---
id: scenario-gettargetranges-nested-wrong-scope
title: getTargetRanges() can reference the wrong contenteditable when editors are nested
description: "On some engines (notably Firefox for Android / Fenix), beforeinput getTargetRanges() may describe the outer contenteditable host instead of the inner focused editor. Custom handlers that trust targetRanges alone may delete or insert in the parent surface while the user believes they are typing in a nested field."
category: input
tags:
  - getTargetRanges
  - beforeinput
  - nested
  - contenteditable
  - firefox
  - android
  - mobile
status: draft
locale: en
---

Nested `contenteditable` layouts (outer page shell with `contenteditable="true"` and an inner `contenteditable="true"` for a caption, comment box, or embedded widget) are fragile. Even when focus and the visible caret are inside the inner host, `InputEvent.getTargetRanges()` may still return a `StaticRange` spanning the **outer** editable root on certain builds. That is a different failure mode from “empty `targetRanges`”: the array is non-empty but **semantically wrong**, so fallback-to-selection and trust-targetRanges strategies both break in opposite ways.

## Problem Overview

The Input Events specification assumes `getTargetRanges()` reflects the DOM ranges that will be modified by the incoming edit. With nested editables, the editing engine must disambiguate which host owns the current editing session. When the engine attaches the range to the outer host, `beforeinput` listeners that call `preventDefault()` and apply their own mutation using `targetRanges[0]` will corrupt the outer document—while keyboard input still *visually* appears tied to the inner field in some steps.

## Observed Behavior

- **Fenix (Firefox for Android)**: Reported behavior: nested inner `contenteditable` receives keystrokes but `getTargetRanges()` points at the parent range; text can be applied to the wrong tree location relative to editor expectations.
- **Desktop Firefox / Chrome**: May behave correctly for simple nesting; still verify for shadow DOM, `contenteditable="plaintext-only"`, and custom wrappers.

```javascript
outer.addEventListener('beforeinput', (e) => {
  const tr = e.getTargetRanges?.() ?? [];
  if (tr.length) {
    const { startContainer } = tr[0];
    console.log('range root editable:', startContainer.parentElement?.closest('[contenteditable]'));
  }
});
```

## Impact

- **Wrong delete/insert span**: `deleteContentBackward` uses a range that removes parent content instead of the inner field.
- **Collaborative / OT bugs**: Operational transforms keyed off bad ranges duplicate or drop characters.
- **Security-adjacent UX**: Less common, but surprising mutations in the outer shell are hard to undo from the user’s mental model.

## Browser Comparison

- **Firefox Android (Fenix)**: Community reports of parent-scoped `getTargetRanges()` with nested editables; treat as high risk until verified fixed.
- **Blink / WebKit (typical desktop)**: Often correct for simple nesting; still test mobile WebKit.
- **Empty vs wrong**: Contrast with [scenario-gettargetranges-empty](scenario-gettargetranges-empty), where the array is empty and you must fall back to selection.

## Solutions

1. **Validate range against focused node**: Before applying `targetRanges[0]`, require `focusedEditable.contains(startContainer)` where `focusedEditable` is your innermost `contenteditable="true"` that matches `document.activeElement` or shadow-aware active element.

2. **Prefer active editable host**: If `targetRanges` and `getSelection()` disagree, prefer the range whose `commonAncestorContainer` is contained in the same host as `document.activeElement`.

3. **Avoid nested contenteditable**: Where possible, use a single outer host and inner `contenteditable="false"` islands with programmatic editing, or isolate nested fields in iframes (trade-offs apply).

4. **Feature-detect bad coupling**: On Firefox Android, run a one-time manual test harness logging `activeElement`, `getSelection()`, and `getTargetRanges()` on a single keypress; cache a “do not trust targetRanges for nested” flag per UA if needed.

## Best Practices

- Never treat non-empty `targetRanges` as automatically correct when multiple editables nest.
- Log **both** selection and `targetRanges` when debugging mobile Firefox reports.
- Track upstream issues; engine fixes can narrow the workaround surface.

## Related Cases

- [ce-0586-firefox-android-nested-gettargetranges-parent-range](ce-0586-firefox-android-nested-gettargetranges-parent-range) – Fenix-style nested editable wrong scope (draft)

## Related Scenarios

- [scenario-gettargetranges-empty](scenario-gettargetranges-empty) – Empty `targetRanges` and fallback strategies

## References

- [Mozilla Fenix #27569: getTargetRanges returns parent contenteditable](https://github.com/mozilla-mobile/fenix/issues/27569) – Nested editable discussion
- [MDN: InputEvent.getTargetRanges()](https://developer.mozilla.org/en-US/docs/Web/API/InputEvent/getTargetRanges)
- [W3C Input Events](https://www.w3.org/TR/input-events-2/)
