---
id: ce-0031
scenarioId: scenario-formatting-persistence
locale: en
os: Linux
osVersion: "Ubuntu 22.04"
device: Desktop or Laptop
deviceVersion: Any
browser: Firefox
browserVersion: "120.0"
keyboard: US
caseTitle: Underline formatting is lost when typing after applying underline
description: "When applying underline formatting to selected text and then continuing to type, the underline formatting is not maintained for the newly typed characters in Firefox on Linux."
tags:
  - formatting
  - underline
  - firefox
status: draft
domSteps:
  - label: "Before"
    html: '<u>Hello</u>|'
    description: "밑줄 텍스트, 커서(|)가 끝에 위치"
  - label: "After Typing (Bug)"
    html: '<u>Hello</u>World'
    description: "새로 입력한 텍스트가 밑줄 적용되지 않음"
  - label: "✅ Expected"
    html: '<u>HelloWorld</u>'
    description: "정상: 새로 입력한 텍스트도 밑줄 상속됨"
---

### Phenomenon

When applying underline formatting to selected text and then continuing to type, the underline formatting is not maintained for the newly typed characters in Firefox on Linux.

### Reproduction example

1. Create a contenteditable div.
2. Type some text.
3. Select the text and apply underline formatting (Ctrl+U or through execCommand).
4. Place the caret at the end of the underlined text.
5. Continue typing.

### Observed behavior

- In Firefox on Linux, newly typed characters after the underlined text are not underlined.
- The formatting state appears to be lost when the caret moves.

### Expected behavior

- Newly typed characters should inherit the formatting of the preceding text when the caret is within or immediately after formatted text.

