---
id: ce-0014
scenarioId: scenario-nested-contenteditable
locale: ko
os: Any
osVersion: "Ubuntu 22.04"
device: Desktop or Laptop
deviceVersion: Any
browser: Chrome
browserVersion: "120.0"
keyboard: US
caseTitle: 중첩된 contenteditable 요소가 포커스 및 선택 문제를 일으킴
description: "contenteditable 요소가 다른 contenteditable 요소를 포함할 때 포커스 동작이 예측할 수 없게 됩니다. 중첩된 요소를 클릭해도 제대로 포커스되지 않을 수 있으며, 선택 범위가 예상치 못하게 두 요소 모두에 걸칠 수 있습니다."
tags:
  - nested
  - focus
  - selection
status: draft
domSteps:
  - label: "Before"
    html: '<div contenteditable="true">Outer <div contenteditable="true">Inner</div></div>'
    description: "중첩된 contenteditable 요소"
  - label: "After Click Inner (Bug)"
    html: '<div contenteditable="true">Outer <div contenteditable="true">Inner</div></div>'
    description: "내부 요소를 클릭할 때 포커스가 외부 요소에 유지됨, 선택이 두 요소 모두에 걸침"
  - label: "✅ Expected"
    html: '<div contenteditable="true">Outer <div contenteditable="true">Inner</div></div>'
    description: "예상: 내부 요소를 클릭할 때 내부 요소에 포커스, 선택이 내부 요소로만 제한됨"
---

### 현상

contenteditable 요소가 다른 contenteditable 요소를 포함할 때 포커스 동작이 예측할 수 없게 됩니다. 중첩된 요소를 클릭해도 제대로 포커스되지 않을 수 있으며, 선택 범위가 두 요소 모두에 잘못 걸칠 수 있습니다.

### 재현 예시

1. contenteditable div를 만듭니다.
2. 그 안에 다른 contenteditable div를 만듭니다.
3. 내부 contenteditable 요소를 클릭합니다.
4. 내부 요소 내에서 텍스트를 선택하려고 시도합니다.
5. 포커스 및 선택 동작을 관찰합니다.

### 관찰된 동작

- 포커스가 내부 요소로 이동하는 대신 외부 contenteditable에 유지될 수 있습니다.
- 선택 범위가 외부 및 내부 요소 모두의 콘텐츠를 포함할 수 있습니다.
- 중첩된 요소 내에서 클릭할 때 캐럿 위치가 잘못될 수 있습니다.

### 예상 동작

- 중첩된 contenteditable을 클릭하면 해당 요소에 포커스가 있어야 합니다.
- 선택은 포커스된 contenteditable 요소 내에 포함되어야 합니다.
- 캐럿이 중첩된 요소 내의 클릭 위치에 나타나야 합니다.
