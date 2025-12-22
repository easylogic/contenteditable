---
id: ce-0005
scenarioId: scenario-caret-movement-with-emoji
locale: en
os: macOS
osVersion: "14.0"
device: Laptop
deviceVersion: MacBook Pro
browser: Chrome
browserVersion: "120.0"
keyboard: US
caseTitle: Arrow keys skip over emoji in contenteditable
description: "When using the left and right arrow keys in a contenteditable element that contains emoji, the caret sometimes jumps over entire emoji clusters instead of moving by a single visual position."
tags:
  - caret
  - emoji
  - navigation
status: draft
---

### Phenomenon

When using the left and right arrow keys in a `contenteditable` element that contains emoji, the
caret sometimes jumps over entire emoji clusters instead of moving by a single visual position.

### Reproduction example

1. Focus the editable area.
2. Type a short ASCII word.
3. Insert one or more emoji characters (for example, from the macOS emoji picker).
4. Use the left and right arrow keys to move the caret across the text and emoji.

### Observed behavior

- The caret jumps over emoji, landing either before or after the entire emoji cluster.
- Intermediate caret positions inside the cluster are not reachable with arrow keys.

### Expected behavior

- The caret moves consistently across visual positions, or at least behaves in the same way as a
  native `<textarea>` in the same environment.

### Notes

- This behavior can affect selection granularity, especially when users try to select text around
  emoji.
- Investigate how the browser defines caret positions for grapheme clusters in `contenteditable`
  compared to other editable controls.


