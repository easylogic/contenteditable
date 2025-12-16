---
id: ce-0034
scenarioId: scenario-composition-events
locale: en
os: macOS
osVersion: "Ubuntu 22.04"
device: Desktop or Laptop
deviceVersion: Any
browser: Safari
browserVersion: "120.0"
keyboard: Chinese IME
caseTitle: Composition events are not fired consistently for all IMEs
tags:
  - ime
  - composition
  - events
  - safari
status: draft
---

### Phenomenon

When using certain IMEs (Input Method Editors) like Chinese IME in Safari, composition events (`compositionstart`, `compositionupdate`, `compositionend`) may not fire consistently or may fire in an unexpected order.

### Reproduction example

1. Create a contenteditable div.
2. Add event listeners for `compositionstart`, `compositionupdate`, and `compositionend`.
3. Switch to Chinese IME.
4. Start typing Chinese characters.
5. Observe which events fire and in what order.

### Observed behavior

- In Safari on macOS with Chinese IME, composition events may not fire for all keystrokes.
- The event order may be inconsistent.
- Some composition operations may complete without firing `compositionend`.

### Expected behavior

- Composition events should fire consistently for all IMEs.
- The event order should be predictable: `compositionstart` → `compositionupdate` (multiple) → `compositionend`.
- All composition operations should properly signal their completion.

