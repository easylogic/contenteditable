---
id: ce-0315-ie11-non-editable-double-click-editable-ko
scenarioId: scenario-ie11-non-editable-double-click-editable
locale: ko
os: Windows
osVersion: Any
device: Desktop or Laptop
deviceVersion: Any
browser: Internet Explorer
browserVersion: "11"
keyboard: US
caseTitle: Non-editable elements become editable on double-click in IE11
description: "In Internet Explorer 11, non-editable elements (contenteditable='false') within editable parents can become editable upon double-clicking, bypassing the read-only restriction."
tags:
  - internet-explorer
  - contenteditable-false
  - double-click
  - security
status: draft
---

## Phenomenon

In Internet Explorer 11, when a parent element has `contenteditable="true"` and a child element has `contenteditable="false"`, double-clicking the non-editable child element can make it editable, bypassing the intended read-only restriction. This issue was addressed in a security update.

## Reproduction example

1. Create a contenteditable div with `contenteditable="true"`.
2. Add a child element with `contenteditable="false"`.
3. In Internet Explorer 11, double-click on the non-editable child element.
4. Try to edit the content of the child element.
5. Observe that editing is possible despite `contenteditable="false"`.

## Observed behavior

- **Double-click enables editing**: Double-clicking makes non-editable element editable.
- **Security issue**: Read-only restriction is bypassed.
- **IE11-specific**: This issue is specific to Internet Explorer 11.
- **Security update**: Microsoft addressed this in a security update.
- **Single-click**: Single-click correctly prevents editing.

## Expected behavior

- `contenteditable="false"` should always prevent editing.
- Double-click should not enable editing in non-editable elements.
- Read-only restriction should be enforced regardless of click type.
- Security should not be compromised by user interaction.

## Analysis

This was a security vulnerability in Internet Explorer 11's contenteditable implementation. The browser's event handling allowed double-click to override the `contenteditable="false"` attribute, potentially exposing read-only content to modification.

## Workarounds

- Apply Internet Explorer 11 security updates that fix this issue.
- Use alternative methods to create read-only regions (CSS, event prevention).
- Test in updated IE11 to verify the fix is applied.
- Consider using modern browsers that don't have this vulnerability.
- Implement server-side validation to prevent unauthorized content modification.
