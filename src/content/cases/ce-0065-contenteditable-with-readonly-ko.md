---
id: ce-0065
scenarioId: scenario-readonly-attribute
locale: ko
os: Linux
osVersion: "Ubuntu 22.04"
device: Desktop or Laptop
deviceVersion: Any
browser: Firefox
browserVersion: "120.0"
keyboard: US
caseTitle: readonly 속성이 contenteditable에서 편집을 방지하지 않음
description: "양식 입력에서 편집을 방지해야 하는 readonly 속성이 Firefox의 contenteditable 영역에서 작동하지 않습니다. readonly가 설정되어 있어도 사용자가 콘텐츠를 편집할 수 있습니다."
tags:
  - readonly
  - editing
  - firefox
status: draft
---

### 현상

양식 입력에서 편집을 방지해야 하는 `readonly` 속성이 Firefox의 contenteditable 영역에서 작동하지 않습니다. `readonly`가 설정되어 있어도 사용자가 콘텐츠를 편집할 수 있습니다.

### 재현 예시

1. `readonly` 속성이 있는 contenteditable div를 만듭니다.
2. 콘텐츠를 편집하려고 시도합니다.
3. 편집이 방지되는지 관찰합니다.

### 관찰된 동작

- Linux의 Firefox에서 `readonly` 속성이 편집을 방지하지 않습니다.
- 사용자가 여전히 콘텐츠를 수정할 수 있습니다.
- 속성이 무시됩니다.

### 예상 동작

- `readonly` 속성이 contenteditable에서 편집을 방지해야 합니다.
- `readonly`가 설정되면 콘텐츠가 보기 전용이어야 합니다.
- 동작이 표준 입력 요소와 일치해야 합니다.
