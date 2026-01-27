---
id: ce-0579
scenarioId: scenario-ime-interaction-patterns
locale: en
os: macOS
osVersion: "15.0 (Sequoia)"
device: Desktop
deviceVersion: Any
browser: All Browsers (ProseMirror context)
browserVersion: "Latest (Nov 2025)"
keyboard: Apple Magic Keyboard (US)
caseTitle: "macOS: Double-space period breaks inclusive:false marks"
description: "The macOS 'Add period with double-space' feature triggers a replacement event that incorrectly applies the preceding word's marks to the inserted period, even if the marks are defined as non-inclusive."
tags: ["macos", "ux", "auto-correct", "marks", "prosemirror"]
status: confirmed
domSteps:
  - label: "1. Type Bold Word"
    html: '<b>Hello</b>|'
    description: "User types 'Hello' with a bold mark that is NOT inclusive on the right (inclusive: false)."
  - label: "2. First Space"
    html: '<b>Hello</b> |'
    description: "One space is added. It is NOT bold (correct behavior for non-inclusive mark)."
  - label: "3. Second Space (Bug)"
    html: '<b>Hello. </b>|'
    description: "macOS replaces the space with '. '. The period is incorrectly BOLDS because the replacement range overlaps the bold node boundary."
  - label: "✅ Expected"
    html: '<b>Hello</b>. |'
    description: "Expected: The period should remain plain text, inheriting the style of the space it replaced, not the word before it."
---

## Phenomenon
A subtle but annoying interaction bug exists on macOS across all browsers when using rich text editors (like ProseMirror or Lexical). macOS has a system-level feature that replaces two spaces with a period and a space (`. `). When this happens at the boundary of a "Mark" (like **Bold** or `Code`), the browser's `textInput` or `beforeinput` replacement logic often uses the attributes of the logical start of the replacement range. If the mark is `inclusive: false` (meaning it shouldn't expand to new characters), the auto-inserted period incorrectly "steals" the bold style.

## Reproduction Steps
1. Use a macOS device with "Add period with double-space" enabled in Keyboard settings.
2. In a rich text editor, create a bold word. Ensure the bold mark configuration is non-inclusive on the right.
3. Type a single space (it should be plain text).
4. Type a second space.
5. Watch the period appear.

## Observed Behavior
- **Mark Expansion**: The period becomes bold, extending the bold range unexpectedly.
- **Selection Desync**: In some internal models, the replacement causes the editor to lose track of whether the caret is inside or outside the mark node, leading to "sticky" formatting for the next sentence.

## Impact
- **Formatting Pollution**: Users have to manually select and un-bold the periods at the end of every sentence.
- **Inconsistent Document Model**: Programmatic checks that expect punctuation to be outside marks will fail.

## Browser Comparison
- **macOS / Any Browser**: Affected, as it is a system-level replacement event.
- **Windows / Chrome**: Not affected (different auto-correct engine).

## References & Solutions
### Mitigation: Event Interception
Modern editors must explicitly handle `inputType: "insertReplacementText"` to detect the macOS period shortcut and manually apply the "Plain Text" schema to the resulting range.

- [ProseMirror Issue #1542: Unexpected interaction between double-space period and inclusive: false marks](https://github.com/prosemirror/prosemirror/issues/1542)
- [Lexical Discussion: Fighting the macOS replacement buffer](https://github.com/facebook/lexical/discussions/2103)
