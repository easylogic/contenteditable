---
id: ce-0580
scenarioId: scenario-ime-ui-experience
locale: en
os: iOS
osVersion: "18.0"
device: iPhone / iPad
deviceVersion: Any
browser: Safari
browserVersion: "18.x"
keyboard: Virtual Keyboard
caseTitle: "iOS Safari: Scroll anchoring failure when focusing long editors"
description: "Focusing a contenteditable region or triggering a command in a long document causes the viewport to jump to the top of the container instead of scrolling the caret into the center."
tags: ["ios", "safari-18", "scrolling", "focus", "ux-jump"]
status: confirmed
domSteps:
  - label: "1. Long Document"
    html: '<div contenteditable="true" style="height: 2000px;">... scrolling ... |</div>'
    description: "Initialize an editor with a large body of text that exceeds the screen height."
  - label: "2. Trigger Focus/Command"
    html: '<!-- Script: element.focus() or execCommand -->'
    description: "Programmatically focus the editor or run a formatting command that updates the selection."
  - label: "3. Result (Bug)"
    html: '<!-- Viewport Jumps to Top -->'
    description: "Safari fails to anchor the virtual viewport to the caret, jumping to (0,0) of the parent container."
  - label: "✅ Expected"
    html: '<!-- Caret Centered -->'
    description: "Expected: The browser should use smooth scroll anchoring to keep the active selection visible and centered in the viewport."
---

## Phenomenon
A persistent regression in iOS 18 (Safari) affects scroll anchoring within `contenteditable`. Traditionally, when an element is focused, the browser is supposed to ensure the caret is visible. In recent versions, if the editor is inside a scrollable container (or the document itself is long), focusing the editor or running a command like `bold` causes the entire viewport to snap-jump to the top of the editor. This forces the user to manually scroll back down to find their cursor.

## Reproduction Steps
1. Create a webpage with enough content to cause vertical scrolling.
2. Place a `contenteditable` `div` at the bottom of the page.
3. Scroll to the bottom and click inside the editor.
4. Try to run `document.execCommand('italic')` via a toolbar button.
5. Observe the viewport position after the command executes.

## Observed Behavior
- **The 'Jump'**: The scroll position of the `window` or the parent `div` resets to the top edge of the editor container.
- **Scroll Inertia Break**: If the user was scrolling while focus was triggered, the inertia is canceled, and the snap happens instantly.

## Impact
- **Disorienting UX**: Users lose their context and must fight the browser to stay on the active line.
- **Form Submission Issues**: If the 'Save' button is at the bottom, and the viewport jumps, the user may accidentally click a header link instead.

## Browser Comparison
- **iOS Safari 18**: High frequency of anchoring failure.
- **Android Chrome**: Generally keeps the caret in view, though it may trigger a layout "Resize" which affects fixed elements.

## References & Solutions
### Mitigation: Visual Viewport Manual Sync
Use the **Visual Viewport API** to detect focuses and manually trigger a `scrollIntoView({ behavior: 'smooth', block: 'center' })` on a temporary span placed at the selection range.

- [WebKit Bug #270634: Scroll anchoring issues in editable regions](https://bugs.webkit.org/show_bug.cgi?id=270634)
- [ProseMirror Forum: Collaborative jumping issues on iOS Safari](https://discuss.prosemirror.net/t/collaborative-jumping-issues/1531)
