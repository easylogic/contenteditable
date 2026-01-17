---
id: ce-0021-bold-formatting-chrome
scenarioId: scenario-formatting-persistence
locale: en
os: Windows
osVersion: "11"
device: Desktop or Laptop
deviceVersion: Any
browser: Chrome
browserVersion: "120.0"
keyboard: US
caseTitle: Bold formatting is lost when typing after applying bold
description: "When applying bold formatting to selected text and then continuing to type, the bold formatting is not maintained for the newly typed characters in Chrome on Windows."
tags:
  - formatting
  - bold
  - chrome
status: draft
domSteps:
  - label: "Before"
    html: '<b>Hello</b>|'
    description: "Bold text, cursor (|) at the end"
  - label: "After Typing (Bug)"
    html: '<b>Hello</b>World'
    description: "Newly typed text does not have bold applied"
  - label: "✅ Expected"
    html: '<b>HelloWorld</b>'
    description: "Expected: Newly typed text also inherits bold"
---

## Phenomenon

When applying bold formatting to selected text and then continuing to type, the bold formatting is not maintained for the newly typed characters in Chrome on Windows.

## Reproduction example

1. Create a contenteditable div.
2. Type some text.
3. Select the text and apply bold formatting (Ctrl+B or through execCommand).
4. Place the caret at the end of the bold text.
5. Continue typing.

## Observed behavior

- In Chrome on Windows, newly typed characters after the bold text are not bold.
- The formatting state appears to be lost when the caret moves.

## Expected behavior

- Newly typed characters should inherit the formatting of the preceding text when the caret is within or immediately after formatted text.

