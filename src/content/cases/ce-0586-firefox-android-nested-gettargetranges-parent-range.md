---
id: ce-0586-firefox-android-nested-gettargetranges-parent-range
scenarioId: scenario-gettargetranges-nested-wrong-scope
locale: en
os: Android
osVersion: "13+"
device: Phone
deviceVersion: Any
browser: Firefox
browserVersion: "120+"
keyboard: Gboard / stock
caseTitle: Firefox Android may report parent contenteditable range in beforeinput for nested inner editor
description: "With an outer and inner contenteditable, Fenix has been reported to return getTargetRanges() that span the outer host while the user types in the inner field, so custom beforeinput logic that applies targetRanges mutates the wrong subtree."
tags:
  - firefox
  - android
  - fenix
  - getTargetRanges
  - nested
  - beforeinput
status: draft
domSteps:
  - label: "Step 1: Nested editables"
    html: '<div id="outer" contenteditable="true"><p>Outer text</p><div id="inner" contenteditable="true">Inner</div></div>'
    description: "Outer host wraps an inner contenteditable paragraph."
  - label: "Step 2: Focus inner, press a key"
    html: '<div id="outer" contenteditable="true"><p>Outer text</p><div id="inner" contenteditable="true">Inner|</div></div>'
    description: "Caret inside inner; user types or deletes."
  - label: "Step 3: Bug — targetRanges describe outer"
    html: '<div id="outer" contenteditable="true"><p>Outer text</p><div id="inner" contenteditable="true">Innerx</div></div>'
    description: "In affected builds, beforeinput getTargetRanges()[0] startContainer may lie under #outer but not under #inner, while visual editing still targets inner—custom handlers that replace range contents damage outer structure."
  - label: "✅ Expected"
    html: '<div id="outer" contenteditable="true"><p>Outer text</p><div id="inner" contenteditable="true">Innerx</div></div>'
    description: "Expected: targetRanges are contained within the inner host that owns focus, matching getSelection()."
---

## Phenomenon

Firefox for Android (Fenix) has community reports that when a `contenteditable` element is nested inside another `contenteditable`, `beforeinput`’s `getTargetRanges()` sometimes returns a `StaticRange` anchored in the **outer** host instead of the **inner** focused editor. The failure is subtle because the keyboard still drives edits in the inner surface from the user’s perspective, but JavaScript that trusts `targetRanges[0]` for `preventDefault()` + manual DOM updates may run against the outer tree—merging lines, deleting outer paragraphs, or inserting adjacent to outer nodes.

## Reproduction Steps

1. Build HTML: outer `div contenteditable="true"` containing static text and an inner `div contenteditable="true"`.
2. Open the page in **Firefox for Android**.
3. Tap inside the inner editor and place the caret at the end of “Inner”.
4. Attach a `beforeinput` logger on `document` or the outer element that prints `getTargetRanges()[0]`’s `startContainer` chain and compares to `document.activeElement`.
5. Type a character or press Backspace.
6. On affected versions, compare logs: `activeElement` may be the inner host while `startContainer`’s `closest('[contenteditable]')` resolves to the outer host.

*(Exact builds vary; treat as a regression-sensitive area and re-test after Fenix / Gecko updates.)*

## Observed Behavior

- **Non-empty but wrong scope**: Unlike empty `targetRanges`, the array has entries—so code paths that only fall back when `length === 0` never run.
- **Custom editors break**: ProseMirror, Lexical, or hand-rolled `beforeinput` filters that unwrap `StaticRange` into `Range` and replace contents corrupt the outer document.
- **Selection vs targetRanges mismatch**: `window.getSelection()` may still point inside the inner host while `targetRanges` does not; naive “prefer targetRanges” policies fail.

## Expected Behavior

Per Input Events intent, `getTargetRanges()` for an edit operation scoped to the inner host should use boundary nodes **inside that host** (or its descendants), consistent with the focused `contenteditable` that will receive default actions.

## Impact

- **Data loss in outer regions**: Unintended deletion of outer paragraphs when the user meant to edit the inner caption.
- **Editor SDK bugs**: Frameworks assume `targetRanges` is authoritative when non-empty; mobile Firefox violates that assumption for nesting.

## Browser Comparison

- **Firefox Android**: Reports of wrong-scope `targetRanges` for nesting; verify on current release.
- **Chrome Android / Safari iOS**: Test separately; different engines, different nesting bugs.
- **Desktop Firefox**: Often behaves; do not extrapolate from desktop passes.

## Solutions

1. **Containment check**:

```javascript
function rangeInsideHost(range, host) {
  return host && range && host.contains(range.startContainer) && host.contains(range.endContainer);
}

editorRoot.addEventListener('beforeinput', (e) => {
  const host = document.activeElement?.closest?.('[contenteditable="true"]');
  const tr = e.getTargetRanges?.() ?? [];
  if (tr.length && host && !rangeInsideHost(tr[0], host)) {
    e.preventDefault(); // optional: block bad default
    // Fall back to Selection-based logic scoped to `host` only
  }
});
```

2. **Refuse nested contenteditable** in product if Fenix must be supported without complex guards.

3. **Track [Fenix #27569](https://github.com/mozilla-mobile/fenix/issues/27569)** and Gecko tickets for resolution status.

## References

- [Mozilla Fenix #27569](https://github.com/mozilla-mobile/fenix/issues/27569)
- [Scenario: getTargetRanges wrong scope when nested](scenario-gettargetranges-nested-wrong-scope)
