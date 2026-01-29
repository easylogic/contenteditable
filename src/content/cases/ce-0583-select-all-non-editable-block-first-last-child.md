---
id: ce-0583
scenarioId: scenario-select-all-non-editable-block
locale: en
os: macOS
osVersion: "14"
device: Desktop
deviceVersion: Any
browser: Safari
browserVersion: "17"
keyboard: US QWERTY
caseTitle: Select All (Ctrl+A) fails when non-editable block is first or last child
description: "In Safari (and Chrome), when a contenteditable has a non-editable block as its first or last child, Ctrl+A collapses the selection in the wrong direction instead of selecting all content."
tags: ["selection", "select-all", "non-editable", "safari", "chrome", "wysiwyg"]
status: draft
domSteps:
  - label: "Step 1: contenteditable with non-editable first child"
    html: '<div contenteditable="true"><div contenteditable="false">[Widget]</div><p>Paragraph one.</p><p>Paragraph two.</p></div>'
    description: "Editable root has an embedded non-editable block first, then two editable paragraphs."
  - label: "Step 2: User presses Ctrl+A"
    html: '<div contenteditable="true"><div contenteditable="false">[Widget]</div><p>Paragraph one.</p><p>Paragraph two.</p></div>'
    description: "Expected: entire content selected. Actual: selection collapses toward editable content; widget may be excluded."
  - label: "✅ Expected"
    html: '<div contenteditable="true"><div contenteditable="false">[Widget]</div><p>Paragraph one.</p><p>Paragraph two.</p></div>'
    description: "Entire root contents (including non-editable block) should be selected so Copy/Delete affects the whole document."
---

## Phenomenon

When a contenteditable container has a block-level non-editable child (e.g. `contenteditable="false"`) as the **first** or **last** child, the native Select All command (Ctrl+A or Cmd+A) does not select the entire content. Instead, the selection collapses in the direction away from the non-editable block, so that the non-editable block and possibly other nodes are left out of the range. This has been reproduced in Safari, Chrome, and Opera; it remains in Safari 15.5 as of 2022. The failure is critical for WYSIWYG editors that embed widgets, images, or other non-editable blocks at document boundaries.

## Reproduction Steps

1. Create a contenteditable div whose first child is a block with `contenteditable="false"` (e.g. an embedded widget or image), followed by two or more editable paragraphs.
2. Place the caret inside one of the editable paragraphs.
3. Press Ctrl+A (Windows/Linux) or Cmd+A (macOS).
4. Observe the selection: it may cover only the editable paragraphs and exclude the first child, or collapse to a single caret position instead of a full range.
5. Repeat with the non-editable block as the **last** child (e.g. widget at the end); Ctrl+A again fails to select the full content.

## Observed Behavior

- **Event sequence**: `keydown` (Ctrl+A / Cmd+A) → browser runs default "Select All" → selection is updated to a range that does not include the non-editable first/last child, or the range collapses.
- **Direction**: The selection tends to collapse "away" from the non-editable block (e.g. if the block is first, the selection collapses toward the end but does not extend to include the block).
- **Consistency**: Reproduced in Safari 17, Safari 15.5, Chrome; Firefox may behave differently.

## Expected Behavior

Per user expectation and accessibility, Select All should select every node inside the contenteditable root, including non-editable blocks. The resulting Range should span from the start of the first child to the end of the last child, so that Copy, Cut, or Replace operations affect the whole document.

## Impact

- **WYSIWYG**: "Select All → Delete" or "Select All → Copy" does not cover the embedded widget, so the document is not fully replaced or copied.
- **Accessibility**: Keyboard-only users cannot reliably select the entire document for replacement or clipboard copy.
- **Consistency**: Differs from native `<textarea>` and from user mental model.

## Browser Comparison

- **Safari (WebKit)**: Reproduced; selection collapses in the wrong direction relative to the non-editable block; still present in Safari 15.5 and 17.
- **Chrome (Blink)**: Same failure when non-editable block is first or last child.
- **Firefox (Gecko)**: May not exhibit the same bug; version-specific testing recommended.

## Solutions

1. **Custom Ctrl+A / Cmd+A handler**: On `keydown`, detect Ctrl+A (or Cmd+A), call `preventDefault()`, then create a Range with `range.selectNodeContents(editor)` and set it on the Selection. This guarantees the entire root (including non-editable blocks) is selected.
2. **Avoid bare non-editable boundaries**: Where possible, avoid having the only non-editable block as the very first or last child; wrap with an editable block or use a placeholder so the engine’s select-all includes all nodes.
3. **Fallback after native Select All**: On `selectionchange` or after a short timeout following Ctrl+A, check whether the current selection covers the full root; if not, run the programmatic select-all logic.

## References

- [WebKit Bug 124765: Select all is broken when non-editable block is first/last child](https://bugs.webkit.org/show_bug.cgi?id=124765)
- [MDN: Range.selectNodeContents](https://developer.mozilla.org/en-US/docs/Web/API/Range/selectNodeContents)
- [MDN: Selection](https://developer.mozilla.org/en-US/docs/Web/API/Selection)
