---
id: ce-0057-contenteditable-with-maxlength-ko
scenarioId: scenario-maxlength-behavior
locale: ko
os: Windows
osVersion: "11"
device: Desktop or Laptop
deviceVersion: Any
browser: Chrome
browserVersion: "120.0"
keyboard: US
caseTitle: contenteditable에서 maxlength 속성이 지원되지 않음
description: "input 및 textarea 요소에서 작동하는 maxlength 속성이 contenteditable 영역에서 지원되지 않습니다. 입력할 수 있는 콘텐츠 양을 제한하는 내장 방법이 없습니다."
tags:
  - maxlength
  - validation
  - chrome
status: draft
---

## 현상

`<input>` 및 `<textarea>` 요소에서 작동하는 `maxlength` 속성이 contenteditable 영역에서 지원되지 않습니다. 입력할 수 있는 콘텐츠 양을 제한하는 내장 방법이 없습니다.

## 재현 예시

1. `maxlength="100"`이 있는 contenteditable div를 만듭니다.
2. 100자 이상 입력하려고 시도합니다.
3. 입력이 제한되는지 관찰합니다.

## 관찰된 동작

- Windows의 Chrome에서 contenteditable의 `maxlength` 속성이 무시됩니다.
- 사용자가 무제한 콘텐츠를 입력할 수 있습니다.
- 내장된 검증이나 제한이 없습니다.

## 예상 동작

- `maxlength` 속성이 contenteditable에서 지원되어야 합니다.
- 입력이 지정된 길이로 제한되어야 합니다.
- 또는 콘텐츠 길이를 제한하는 표준 방법이 있어야 합니다.
