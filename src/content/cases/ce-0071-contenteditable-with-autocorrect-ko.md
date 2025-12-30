---
id: ce-0071
scenarioId: scenario-autocorrect-behavior
locale: ko
os: iOS
osVersion: "17.0"
device: iPhone
deviceVersion: Any
browser: Safari
browserVersion: "17.0"
keyboard: US
caseTitle: contenteditable에서 autocorrect 속성 동작이 다름
description: "모바일 키보드에서 자동 텍스트 수정을 제어하는 autocorrect 속성이 표준 입력 요소와 비교하여 contenteditable 요소에서 다르게 동작합니다. 수정 제안이 나타나지 않거나 일관되지 않게 동작할 수 있습니다."
tags:
  - autocorrect
  - mobile
  - ios
  - safari
status: draft
---

### 현상

모바일 키보드에서 자동 텍스트 수정을 제어하는 `autocorrect` 속성이 표준 입력 요소와 비교하여 contenteditable 요소에서 다르게 동작합니다. 수정 제안이 편집을 방해할 수 있습니다.

### 재현 예시

1. `autocorrect="on"` 또는 `autocorrect="off"`가 있는 contenteditable div를 만듭니다.
2. iOS 기기에서 contenteditable에 포커스합니다.
3. 의도적으로 철자가 틀린 텍스트를 입력합니다.
4. 자동 수정 동작을 관찰하고 표준 입력과 비교합니다.

### 관찰된 동작

- iOS의 Safari에서 contenteditable의 `autocorrect`가 속성 값을 존중하지 않을 수 있습니다.
- `autocorrect="off"`일 때도 자동 수정 제안이 나타날 수 있습니다.
- 동작이 표준 입력 요소와 다를 수 있습니다.

### 예상 동작

- `autocorrect`가 contenteditable과 표준 입력에서 동일하게 작동해야 합니다.
- 속성 값이 존중되어야 합니다.
- 자동 수정이 IME 컴포지션을 방해하지 않아야 합니다.
