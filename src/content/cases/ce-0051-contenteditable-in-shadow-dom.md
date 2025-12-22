---
id: ce-0051
scenarioId: scenario-contenteditable-shadow-dom
locale: en
os: macOS
osVersion: "Ubuntu 22.04"
device: Desktop or Laptop
deviceVersion: Any
browser: Chrome
browserVersion: "120.0"
keyboard: US
caseTitle: contenteditable does not work correctly inside Shadow DOM
description: "When a contenteditable region is inside a Shadow DOM, its behavior may be broken or inconsistent. Selection, focus, and editing may not work as expected."
tags:
  - shadow-dom
  - contenteditable
  - isolation
  - chrome
status: draft
---

### Phenomenon

When a contenteditable region is inside a Shadow DOM, its behavior may be broken or inconsistent. Selection, focus, and editing may not work as expected.

### Reproduction example

1. Create a custom element with Shadow DOM.
2. Inside the Shadow DOM, create a contenteditable div.
3. Try to interact with the contenteditable (type, select, etc.).
4. Observe the behavior.

### Observed behavior

- In Chrome on macOS, contenteditable may not work correctly inside Shadow DOM.
- Selection may be broken.
- Focus may not work.
- Events may not fire correctly.

### Expected behavior

- contenteditable should work correctly inside Shadow DOM.
- Selection and focus should work as expected.
- Events should fire and bubble correctly.

