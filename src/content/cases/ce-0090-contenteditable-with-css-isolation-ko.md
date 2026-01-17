---
id: ce-0090-contenteditable-with-css-isolation-ko
scenarioId: scenario-css-isolation
locale: ko
os: macOS
osVersion: "14.0"
device: Desktop or Laptop
deviceVersion: MacBook Pro
browser: Safari
browserVersion: "17.0"
keyboard: US
caseTitle: CSS isolation 속성이 contenteditable 스태킹 컨텍스트에 영향을 줄 수 있음
description: "contenteditable 요소에 CSS isolation: isolate 속성이 있을 때 새로운 스태킹 컨텍스트가 생성됩니다. 이것이 선택 핸들과 IME 후보 창이 요소에 상대적으로 배치되는 방식에 영향을 줄 수 있습니다."
tags:
  - css-isolation
  - stacking-context
  - safari
  - macos
status: draft
---

## 현상

contenteditable 요소에 CSS `isolation: isolate` 속성이 있을 때 새로운 스태킹 컨텍스트가 생성됩니다. 이것이 선택 핸들과 IME 후보 창이 contenteditable에 상대적으로 배치되는 방식에 영향을 줄 수 있습니다.

## 재현 예시

1. `isolation: isolate`가 있는 contenteditable div를 만듭니다.
2. IME를 사용하여 텍스트를 컴포지션합니다.
3. IME 후보 창의 위치를 관찰합니다.
4. 텍스트를 선택하고 선택 핸들을 관찰합니다.
5. 격리가 없는 contenteditable과 비교합니다.

## 관찰된 동작

- macOS의 Safari에서 격리가 IME 후보 창 위치에 영향을 줄 수 있습니다.
- 선택 핸들이 잘못된 위치에 배치될 수 있습니다.
- Z-index 스태킹이 영향을 받을 수 있습니다.
- 오버레이가 올바르게 나타나지 않을 수 있습니다.

## 예상 동작

- CSS isolation이 contenteditable UI 요소에 영향을 주지 않아야 합니다.
- IME 후보 창이 올바른 위치에 배치되어야 합니다.
- 선택 핸들이 올바른 위치에 나타나야 합니다.
