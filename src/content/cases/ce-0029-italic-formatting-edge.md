---
id: ce-0029
scenarioId: scenario-formatting-persistence
locale: en
os: Windows
osVersion: "11"
device: Desktop or Laptop
deviceVersion: Any
browser: Edge
browserVersion: "120.0"
keyboard: US
caseTitle: Italic formatting is lost when typing after applying italic
description: "When applying italic formatting to selected text and then continuing to type, the italic formatting is not maintained for the newly typed characters in Edge on Windows."
tags:
  - formatting
  - italic
  - edge
status: draft
domSteps:
  - label: "Before"
    html: '<i>Hello</i>|'
    description: "이탤릭 텍스트, 커서(|)가 끝에 위치"
  - label: "After Typing (Bug)"
    html: '<i>Hello</i>World'
    description: "새로 입력한 텍스트가 이탤릭 적용되지 않음"
  - label: "✅ Expected"
    html: '<i>HelloWorld</i>'
    description: "정상: 새로 입력한 텍스트도 이탤릭 상속됨"
---

### Phenomenon

When applying italic formatting to selected text and then continuing to type, the italic formatting is not maintained for the newly typed characters in Edge on Windows.

### Reproduction example

1. Create a contenteditable div.
2. Type some text.
3. Select the text and apply italic formatting (Ctrl+I or through execCommand).
4. Place the caret at the end of the italic text.
5. Continue typing.

### Observed behavior

- In Edge on Windows, newly typed characters after the italic text are not italic.
- The formatting state appears to be lost when the caret moves.

### Expected behavior

- Newly typed characters should inherit the formatting of the preceding text when the caret is within or immediately after formatted text.

