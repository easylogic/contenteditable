---
id: ce-0569-firefox-drag-drop-text-failure
scenarioId: scenario-firefox-drag-drop-issues
locale: en
os: Linux
osVersion: "Ubuntu 24.04 / Windows 11"
device: Desktop
deviceVersion: Any
browser: Firefox
browserVersion: "135.0 (Latest)"
keyboard: US QWERTY
caseTitle: "Consolidated Firefox Drag and Drop Failures"
description: "A comprehensive index of Firefox's broken drag-drop behaviors, including text move failures, unwanted node duplication, and nested span corruption."
tags: ["drag-drop", "firefox", "ux", "reliability", "dom-corruption"]
status: confirmed
domSteps:
  - label: "Cluster A: Move Failure"
    html: '<div contenteditable="true">[Text to move] ... destination</div>'
    description: "Standard text selection fails to move when dropped; no events triggered."
  - label: "Cluster B: Node Duplication"
    html: '<div contenteditable="true"><span contenteditable="false">Widget</span></div>'
    description: "Dragging a non-editable wrapper node results in a duplicate instead of a move."
  - label: "Cluster C: Structural Corruption"
    html: '<div contenteditable="true">Text <span>inside span</span></div>'
    description: "Dragging text within a span causes Firefox to generate new, unnecessary nested span wrappers."
  - label: "✅ Expected"
    html: "Clean move operation with source deletion and destination insertion, maintaining existing DOM hierarchy."
---

## Phenomenon
Firefox (as of early 2026) remains the most divergent engine regarding Drag and Drop within `contenteditable`. Three primary failure modes exist:
1.  **Selection Stall**: Standard text selections often fail to move when dragged, leaving the original text intact and the destination empty.
2.  **Ghost Duplication**: When dragging `contenteditable="false"` elements (common for Mentions or Media), Firefox often inserts a clone at the destination without removing the source.
3.  **Encapsulation Leak**: Dragging text within a styled container like a `<span>` or `<code>` block triggers an internal "wrapper" logic that creates redundant nested elements (e.g., `<span><span>text</span></span>`).

## Reproduction Steps (General)
1. Open a `contenteditable` editor in Firefox.
2. Attempt to move text from a `textarea` into the `div`.
3. Attempt to move a `contenteditable="false"` widget.
4. Observe the lack of `beforeinput` events for `deleteByDrag`.

## Observed Behavior
- **`textarea` to `div`**: Complete failure; no text is transferred.
- **Node persistence**: The "move" effect is treated as a "copy," corrupting internal editor models.
- **Tag soup**: Unnecessary nesting accumulates, breaking CSS selectors and serialization.

## Impact
- **Broken UX**: Mouse-heavy users perceive the editor as completely broken.
- **Model De-sync**: Frameworks like Lexical or Slate cannot track these "ghost" mutations.

## References & Solutions
### Mitigation: High-Fidelity Drag Manager
A robust solution requires intercepting both `dragstart` and `drop` to manually coordinate the move via the editor's transformation engine.

```javascript
/* Unified Handler (Mitigates Clusters A, B, and C) */
element.addEventListener('drop', (e) => {
    // 1. Block native glitchy behavior
    e.preventDefault();
    
    // 2. Identify incoming data
    const data = e.dataTransfer.getData('text/plain');
    if (!data) return;

    // 3. Resolve destination
    const range = document.caretRangeFromPoint(e.clientX, e.clientY);
    
    // 4. Force 'Move' logic
    // Delete from source (using stored range from dragstart)
    // Insert at destination range
    editor.applyTransform('move', { text: data, at: range });
});
```

- [Mozilla Bugzilla #1898711](https://bugzilla.mozilla.org/show_bug.cgi?id=1898711)
- [Lexical Issue #8014](https://github.com/facebook/lexical/issues/8014)
- [Formerly ce-0013, ce-0300, ce-0310, ce-0554]
