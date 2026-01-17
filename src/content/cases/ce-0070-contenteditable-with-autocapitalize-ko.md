---
id: ce-0070-contenteditable-with-autocapitalize-ko
scenarioId: scenario-autocapitalize-behavior
locale: ko
os: iOS
osVersion: "17.0"
device: iPhone
deviceVersion: Any
browser: Safari
browserVersion: "17.0"
keyboard: US
caseTitle: contenteditable에서 autocapitalize 속성이 일관되게 작동하지 않음
description: "모바일 키보드에서 자동 대문자화를 제어하는 autocapitalize 속성이 contenteditable 요소에서 일관되게 작동하지 않습니다. 동작이 표준 입력 요소와 다를 수 있습니다."
tags:
  - autocapitalize
  - mobile
  - ios
  - safari
status: draft
---

## 현상

모바일 키보드에서 자동 대문자화를 제어하는 `autocapitalize` 속성이 contenteditable 요소에서 일관되게 작동하지 않습니다. 동작이 표준 입력 요소와 다를 수 있습니다.

## 재현 예시

1. `autocapitalize="sentences"`가 있는 contenteditable div를 만듭니다.
2. iOS 기기에서 contenteditable에 포커스합니다.
3. 텍스트를 입력하고 대문자화 동작을 관찰합니다.
4. 동일한 속성이 있는 표준 입력 요소와 비교합니다.

## 관찰된 동작

- iOS의 Safari에서 contenteditable의 `autocapitalize`가 예상대로 작동하지 않을 수 있습니다.
- 대문자화 동작이 표준 입력과 다를 수 있습니다.
- 경우에 따라 속성이 무시될 수 있습니다.

## 예상 동작

- `autocapitalize`가 contenteditable과 표준 입력에서 동일하게 작동해야 합니다.
- 대문자화가 지정된 모드(문장, 단어, 문자, 없음)를 따라야 합니다.
- 동작이 브라우저와 기기 간에 일관되어야 합니다.
