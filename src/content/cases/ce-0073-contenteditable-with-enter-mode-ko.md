---
id: ce-0073-contenteditable-with-enter-mode-ko
scenarioId: scenario-entermode-behavior
locale: ko
os: iOS
osVersion: "17.0"
device: iPhone
deviceVersion: Any
browser: Safari
browserVersion: "17.0"
keyboard: US
caseTitle: enterkeyhint와 inputmode가 Enter 키 동작에 일관되지 않게 영향을 줌
description: "모바일 기기에서 enterkeyhint와 inputmode 속성의 조합이 contenteditable 요소에서 Enter 키 동작에 일관되지 않게 영향을 줄 수 있습니다. Enter 키가 제출해야 할 때 줄바꿈을 삽입하거나 그 반대일 수 있습니다."
tags:
  - enterkeyhint
  - inputmode
  - mobile
  - ios
  - safari
status: draft
---

## 현상

모바일 기기에서 `enterkeyhint`와 `inputmode` 속성의 조합이 contenteditable 요소에서 Enter 키 동작에 일관되지 않게 영향을 줄 수 있습니다. Enter 키가 작업을 수행해야 할 때 줄바꿈을 삽입하거나 그 반대일 수 있습니다.

## 재현 예시

1. `inputmode="search"` 및 `enterkeyhint="search"`가 있는 contenteditable div를 만듭니다.
2. iOS 기기에서 contenteditable에 포커스합니다.
3. Enter 키를 누릅니다.
4. 줄바꿈을 삽입하는지 또는 검색 작업을 트리거하는지 관찰합니다.

## 관찰된 동작

- iOS의 Safari에서 Enter 키 동작이 속성 값과 일치하지 않을 수 있습니다.
- 작업이 예상될 때도 줄바꿈이 삽입될 수 있습니다.
- 동작이 표준 입력 요소와 다를 수 있습니다.

## 예상 동작

- Enter 키 동작이 속성 값과 일치해야 합니다.
- `enterkeyhint`는 레이블뿐만 아니라 작업도 제어해야 합니다.
- 동작이 표준 입력 요소와 일관되어야 합니다.
