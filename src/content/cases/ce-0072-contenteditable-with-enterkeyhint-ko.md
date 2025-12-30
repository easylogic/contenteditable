---
id: ce-0072
scenarioId: scenario-enterkeyhint-behavior
locale: ko
os: Android
osVersion: "14.0"
device: Smartphone
deviceVersion: Any
browser: Chrome
browserVersion: "120.0"
keyboard: US
caseTitle: contenteditable에서 enterkeyhint 속성이 작동하지 않음
description: "모바일 키보드의 Enter 키 레이블을 제어하는 enterkeyhint 속성이 contenteditable 요소에서 작동하지 않습니다. 속성 값에 관계없이 Enter 키 레이블이 기본값으로 유지됩니다."
tags:
  - enterkeyhint
  - mobile
  - android
  - chrome
status: draft
---

### 현상

모바일 키보드의 Enter 키 레이블을 제어하는 `enterkeyhint` 속성이 contenteditable 요소에서 작동하지 않습니다. 속성 값에 관계없이 Enter 키 레이블이 기본값으로 유지됩니다.

### 재현 예시

1. `enterkeyhint="send"` 또는 `enterkeyhint="search"`가 있는 contenteditable div를 만듭니다.
2. Android 기기에서 contenteditable에 포커스합니다.
3. 가상 키보드의 Enter 키 레이블을 관찰합니다.
4. 동일한 속성이 있는 표준 입력 요소와 비교합니다.

### 관찰된 동작

- Android의 Chrome에서 contenteditable의 `enterkeyhint`가 무시됩니다.
- Enter 키가 항상 기본 레이블을 표시합니다.
- 사용자 정의가 불가능합니다.

### 예상 동작

- `enterkeyhint`가 contenteditable 요소에서 작동해야 합니다.
- Enter 키 레이블이 속성 값을 반영해야 합니다.
- 동작이 표준 입력 요소와 일치해야 합니다.
