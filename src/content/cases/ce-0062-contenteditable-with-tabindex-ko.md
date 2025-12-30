---
id: ce-0062
scenarioId: scenario-tabindex-behavior
locale: ko
os: Windows
osVersion: "11"
device: Desktop or Laptop
deviceVersion: Any
browser: Edge
browserVersion: "120.0"
keyboard: US
caseTitle: tabindex 속성이 포커스 순서를 올바르게 제어하지 않음
description: "여러 contenteditable 영역에 tabindex 속성이 있을 때 Edge에서 탭 순서가 tabindex 값을 올바르게 따르지 않을 수 있습니다. 포커스 순서가 일관되지 않거나 잘못될 수 있습니다."
tags:
  - tabindex
  - focus
  - keyboard-navigation
  - edge
status: draft
---

### 현상

여러 contenteditable 영역에 `tabindex` 속성이 있을 때 Edge에서 탭 순서가 `tabindex` 값을 올바르게 따르지 않을 수 있습니다. 포커스 순서가 일관되지 않거나 잘못될 수 있습니다.

### 재현 예시

1. 다른 `tabindex` 값을 가진 여러 contenteditable div를 만듭니다:
   ```html
   <div contenteditable tabindex="3">Third</div>
   <div contenteditable tabindex="1">First</div>
   <div contenteditable tabindex="2">Second</div>
   ```
2. Tab 키를 사용하여 탐색합니다.
3. 포커스 순서를 관찰합니다.

### 관찰된 동작

- Windows의 Edge에서 `tabindex`가 포커스 순서를 올바르게 제어하지 않을 수 있습니다.
- 포커스가 요소를 건너뛰거나 예상치 못한 순서를 따를 수 있습니다.
- 키보드 탐색이 일관되지 않습니다.

### 예상 동작

- `tabindex`는 지정된 대로 포커스 순서를 제어해야 합니다.
- 요소는 `tabindex` 값의 순서대로 포커스를 받아야 합니다.
- 키보드 탐색이 예측 가능하고 접근 가능해야 합니다.
