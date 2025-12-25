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
    description: "기본 텍스트"
  - label: "After Bold"
    html: 'Hello <strong>World</strong>'
    description: "볼드 서식 적용"
  - label: "After Typing (Bug)"
    html: 'Hello <strong>World</strong> New'
    description: "새로 입력한 텍스트에 볼드 서식 미적용"
  - label: "✅ Expected"
    html: 'Hello <strong>World New</strong>'
    description: "정상: 새로 입력한 텍스트도 볼드 서식 상속"
---

### Phenomenon

When applying bold formatting to selected text and then continuing to type, the bold formatting is not maintained for the newly typed characters in Safari.

### Reproduction example

1. Create a contenteditable div.
2. Type some text.
3. Select the text and apply bold formatting (Cmd+B or through execCommand).
4. Place the caret at the end of the bold text.
5. Continue typing.

### Observed behavior

- In Safari, newly typed characters after the bold text are not bold.
- The formatting state appears to be lost when the caret moves.

### Expected behavior

- Newly typed characters should inherit the formatting of the preceding text when the caret is within or immediately after formatted text.

