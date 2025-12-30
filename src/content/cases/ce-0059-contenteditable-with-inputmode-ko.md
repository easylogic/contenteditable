---
id: ce-0059
scenarioId: scenario-inputmode-behavior
locale: ko
os: iOS
osVersion: "Ubuntu 22.04"
device: Mobile
deviceVersion: Any
browser: Safari
browserVersion: "120.0"
keyboard: System virtual keyboard
caseTitle: inputmode 속성이 모바일에서 가상 키보드에 영향을 주지 않음
description: "모바일 기기에서 표시되는 가상 키보드 유형을 제어해야 하는 inputmode 속성이 iOS Safari의 contenteditable 영역에서 작동하지 않습니다. 키보드 유형을 제어할 수 없습니다."
tags:
  - inputmode
  - mobile
  - keyboard
  - ios
status: draft
---

## 현상

모바일 기기에서 표시되는 가상 키보드 유형을 제어해야 하는 `inputmode` 속성이 iOS Safari의 contenteditable 영역에서 작동하지 않습니다. 키보드 유형을 제어할 수 없습니다.

## 재현 예시

1. `inputmode="numeric"`이 있는 contenteditable div를 만듭니다.
2. iOS Safari에서 페이지를 엽니다.
3. contenteditable에 포커스합니다.
4. 나타나는 가상 키보드 유형을 관찰합니다.

## 관찰된 동작

- iOS Safari에서 contenteditable의 `inputmode` 속성이 무시됩니다.
- 항상 기본 키보드가 나타납니다.
- 숫자, 이메일 또는 URL 키보드를 트리거할 수 없습니다.

## 예상 동작

- `inputmode` 속성이 가상 키보드 유형을 제어해야 합니다.
- 숫자, 이메일, URL 및 기타 키보드 유형을 사용할 수 있어야 합니다.
- 동작이 표준 입력 요소와 일치해야 합니다.
