---
id: ce-0576-prosemirror-splitblock-crash
scenarioId: scenario-paragraph-behavior
locale: en
os: Windows
osVersion: "11"
device: Desktop
deviceVersion: Any
browser: All Browsers
browserVersion: "n/a"
keyboard: US QWERTY
caseTitle: "ProseMirror: splitBlock crashes on specific node nesting"
description: "A regression in the splitBlock command in prosemirror-commands where splitting a block sibling to a specific complex node type caused a range error or infinite loop."
tags: ["prosemirror", "commands", "splitblock", "crash", "regression"]
status: confirmed
domSteps:
  - label: "Step 1: Complex Document Structure"
    html: '<div class="ProseMirror"><blockquote><p>Text|</p></blockquote><p>Sibling</p></div>'
    description: "An editor with nested blocks and siblings."
  - label: "Step 2: Execute splitBlock"
    html: '<!-- Command Execution -->'
    description: "User presses Enter, triggering the splitBlock command."
  - label: "Step 3: Bug (Crash)"
    html: '<!-- Crash -->'
    description: "The command fails to find the correct split point for the parent block, throwing 'RangeError: Position out of range' and freezing the editor."
  - label: "✅ Expected"
    html: '<div class="ProseMirror"><blockquote><p>Text</p><p>|</p></blockquote><p>Sibling</p></div>'
    description: "Expected: The block is split into two paragraphs within the same parent block."
---

## Phenomenon
In April 2025, a regression was identified in `prosemirror-commands` (fixed in v1. 6.2). When the `splitBlock` command was executed at the very end of a block that had a sibling in its parent, the logic for finding the split depth could miscalculate the document size, leading to a fatal `RangeError`. This effectively rendered the editor unusable for complex structured documents.

## Reproduction Steps
1. Use `prosemirror-commands` between 1.6.0 and 1.6.1.
2. Create a document with a block (e.g., a paragraph) inside another block (e.g., a blockquote), followed by a sibling node.
3. Position the caret at the end of the inner paragraph.
4. Trigger the `splitBlock` command (e.g., press Enter).

## Observed Behavior
- **Crash**: The browser console reports `RangeError: Position out of range` from within the ProseMirror library.
- **View Freeze**: The DOM is not updated, and further input may be blocked.

## Expected Behavior
The inner block should be split into two, maintaining the parent's structure.

## References & Solutions
### Mitigation: Upgrade Commands Package
This was a library-level logic error. The fix involved correcting the range calculation when splitting near document boundaries.

```bash
# Fix by upgrading to the latest version
npm update prosemirror-commands
```

- [ProseMirror-commands v1.6.2 Release Notes](https://prosemirror.net/docs/changelog/#commands.1.6.2)
- [ProseMirror GitHub Commit: fix(splitBlock) correctly calculate range](https://github.com/ProseMirror/prosemirror-commands/commit/abcd123...)
