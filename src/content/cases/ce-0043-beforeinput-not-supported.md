---
id: ce-0043
scenarioId: scenario-beforeinput-support
locale: en
os: macOS
osVersion: "Ubuntu 22.04"
device: Desktop or Laptop
deviceVersion: Any
browser: Safari
browserVersion: "120.0"
keyboard: US
caseTitle: beforeinput event is not supported in Safari
description: "The beforeinput event, which is crucial for intercepting and modifying input before it's committed to the DOM, is not supported in Safari. This makes it difficult to implement custom input handling."
tags:
  - beforeinput
  - events
  - safari
  - compatibility
status: draft
---

### Phenomenon

The `beforeinput` event, which is crucial for intercepting and modifying input before it's committed to the DOM, is not supported in Safari. This makes it difficult to implement custom input handling that works across all browsers.

### Reproduction example

1. Create a contenteditable div.
2. Add an event listener for the `beforeinput` event.
3. Type some text.
4. Observe whether the `beforeinput` event fires.

### Observed behavior

- In Safari on macOS, the `beforeinput` event does not fire.
- Event listeners for `beforeinput` are never called.
- Alternative approaches must be used, but they are less reliable.

### Expected behavior

- The `beforeinput` event should be supported in all modern browsers.
- The event should fire before input is committed to the DOM.
- It should provide a way to prevent or modify the default input behavior.

