---
id: ce-0073
scenarioId: scenario-entermode-behavior
locale: en
os: iOS
osVersion: "17.0"
device: iPhone
deviceVersion: Any
browser: Safari
browserVersion: "17.0"
keyboard: US
caseTitle: enterkeyhint and inputmode affect Enter key behavior inconsistently
description: "On mobile devices, the combination of enterkeyhint and inputmode attributes may affect Enter key behavior inconsistently on contenteditable elements. The Enter key may insert line breaks when it should submit or vice versa."
tags:
  - enterkeyhint
  - inputmode
  - mobile
  - ios
  - safari
status: draft
---

### Phenomenon

On mobile devices, the combination of `enterkeyhint` and `inputmode` attributes may affect Enter key behavior inconsistently on contenteditable elements. The Enter key may insert line breaks when it should perform an action, or vice versa.

### Reproduction example

1. Create a contenteditable div with `inputmode="search"` and `enterkeyhint="search"`.
2. On an iOS device, focus the contenteditable.
3. Press the Enter key.
4. Observe whether it inserts a line break or triggers a search action.

### Observed behavior

- In Safari on iOS, Enter key behavior may not match the attribute values.
- Line breaks may be inserted even when an action is expected.
- The behavior may differ from standard input elements.

### Expected behavior

- Enter key behavior should match the attribute values.
- `enterkeyhint` should control the action, not just the label.
- Behavior should be consistent with standard input elements.

