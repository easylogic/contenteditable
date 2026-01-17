---
id: ce-0063-contenteditable-with-required-ko
scenarioId: scenario-required-validation
locale: ko
os: macOS
osVersion: "Ubuntu 22.04"
device: Desktop or Laptop
deviceVersion: Any
browser: Chrome
browserVersion: "120.0"
keyboard: US
caseTitle: required 속성이 검증을 위해 지원되지 않음
description: "필수 필드를 나타내기 위해 양식 입력에서 작동하는 required 속성이 contenteditable 영역에서 지원되지 않습니다. 양식 검증을 위해 contenteditable을 필수로 표시하는 내장 방법이 없습니다."
tags:
  - required
  - validation
  - form
  - chrome
status: draft
---

## 현상

필수 필드를 나타내기 위해 양식 입력에서 작동하는 `required` 속성이 contenteditable 영역에서 지원되지 않습니다. 양식 검증을 위해 contenteditable을 필수로 표시하는 내장 방법이 없습니다.

## 재현 예시

1. 양식 내부에 `required` 속성이 있는 contenteditable div를 만듭니다.
2. 콘텐츠를 입력하지 않고 양식을 제출하려고 시도합니다.
3. 검증이 발생하는지 관찰합니다.

## 관찰된 동작

- macOS의 Chrome에서 contenteditable의 `required` 속성이 무시됩니다.
- 양식 검증이 contenteditable 영역을 확인하지 않습니다.
- 내장된 검증이 없습니다.

## 예상 동작

- `required` 속성이 contenteditable에서 작동해야 합니다.
- 양식 검증이 contenteditable 영역을 확인해야 합니다.
- 또는 contenteditable 콘텐츠를 검증하는 표준 방법이 있어야 합니다.
