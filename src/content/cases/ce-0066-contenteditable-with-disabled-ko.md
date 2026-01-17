---
id: ce-0066-contenteditable-with-disabled-ko
scenarioId: scenario-disabled-attribute
locale: ko
os: macOS
osVersion: "Ubuntu 22.04"
device: Desktop or Laptop
deviceVersion: Any
browser: Safari
browserVersion: "120.0"
keyboard: US
caseTitle: disabled 속성이 contenteditable을 비활성화하지 않음
description: "양식 입력을 비활성화하는 disabled 속성이 Safari의 contenteditable 영역에서 작동하지 않습니다. disabled가 설정되어 있어도 contenteditable이 편집 가능하고 상호작용 가능한 상태로 유지됩니다."
tags:
  - disabled
  - editing
  - safari
status: draft
---

## 현상

양식 입력을 비활성화하는 `disabled` 속성이 Safari의 contenteditable 영역에서 작동하지 않습니다. `disabled`가 설정되어 있어도 contenteditable이 편집 가능하고 상호작용 가능한 상태로 유지됩니다.

## 재현 예시

1. `disabled` 속성이 있는 contenteditable div를 만듭니다.
2. 콘텐츠에 포커스하고 편집하려고 시도합니다.
3. 요소가 비활성화되는지 관찰합니다.

## 관찰된 동작

- macOS의 Safari에서 `disabled` 속성이 contenteditable을 비활성화하지 않습니다.
- 요소가 편집 가능하고 포커스 가능한 상태로 유지됩니다.
- 속성이 무시됩니다.

## 예상 동작

- `disabled` 속성이 contenteditable을 비활성화해야 합니다.
- 비활성화되었을 때 요소가 편집 가능하거나 포커스 가능하지 않아야 합니다.
- 동작이 표준 입력 요소와 일치해야 합니다.
