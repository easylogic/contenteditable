---
id: ce-0011
scenarioId: scenario-formatting-persistence
locale: en
os: macOS
osVersion: "14.0"
device: Desktop or Laptop
deviceVersion: Any
browser: Safari
browserVersion: "17.0"
keyboard: US
caseTitle: Bold formatting is lost when typing after applying bold
description: "When applying bold formatting to selected text and then continuing to type, the bold formatting is not maintained for the newly typed characters in Safari."
tags:
  - formatting
  - bold
  - safari
status: draft
domSteps:
  - label: "Before"
    html: 'Hello World'
    description: "Basic text"
  - label: "After Bold"
    html: 'Hello <strong>World</strong>'
    description: "Bold formatting applied"
  - label: "After Typing (Bug)"
    html: 'Hello <strong>World</strong> New'
    description: "Newly typed text does not have bold formatting applied"
  - label: "✅ Expected"
    html: 'Hello <strong>World New</strong>'
    description: "Expected: Newly typed text also inherits bold formatting"
---

## Phenomenon

When applying bold formatting to selected text and then continuing to type, the bold formatting is not maintained for the newly typed characters in Safari.

## Reproduction example

1. Create a contenteditable div.
2. Type some text.
3. Select the text and apply bold formatting (Cmd+B or through execCommand).
4. Place the caret at the end of the bold text.
5. Continue typing.

## Observed behavior

- In Safari, newly typed characters after the bold text are not bold.
- The formatting state appears to be lost when the caret moves.

## Expected behavior

- Newly typed characters should inherit the formatting of the preceding text when the caret is within or immediately after formatted text.

