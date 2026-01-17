---
id: ce-0138-selection-collapse-on-click-ko
scenarioId: scenario-selection-restoration
locale: ko
os: macOS
osVersion: "14.0"
device: Desktop or Laptop
deviceVersion: Any
browser: Safari
browserVersion: "17.0"
keyboard: US
caseTitle: 편집 중 클릭 시 선택이 예상치 못하게 축소됨
description: "Safari에서 편집 작업 중 contenteditable 요소를 클릭할 때 텍스트 선택이 예상치 못하게 축소될 수 있습니다. 선택 범위가 무효화되거나 예상치 못한 위치로 이동합니다."
tags:
  - selection
  - click
  - collapse
  - safari
status: draft
domSteps:
  - label: "Before"
    html: 'Hello <span style="background: yellow;">World</span> Test'
    description: "Selected text (World)"
  - label: "After Click (Bug)"
    html: 'Hello World Test'
    description: "Click collapses or invalidates selection at unexpected position"
  - label: "✅ Expected"
    html: 'Hello World Test'
    description: "Expected: Selection collapses to click position (predictable behavior)"
---

## 현상

Safari에서 편집 작업 중 contenteditable 요소를 클릭할 때 텍스트 선택이 예상치 못하게 축소될 수 있습니다. 선택 범위가 무효화되거나 예상치 못한 위치로 이동합니다.

## 재현 예시

1. 일부 텍스트를 선택합니다
2. contenteditable의 다른 곳을 클릭합니다
3. 선택 상태를 관찰합니다

## 관찰된 동작

- 선택이 한 점으로 축소됩니다
- 또는 선택이 예상치 못한 위치로 이동합니다
- 선택 범위가 무효화될 수 있습니다
- 클릭을 통해 선택을 유지할 수 없습니다

## 예상 동작

- 선택이 클릭 위치로 축소되어야 합니다 (정상 동작)
- 또는 원하는 경우 선택이 유지되어야 합니다
- 동작이 예측 가능해야 합니다
- 선택이 유효하게 유지되어야 합니다

## 브라우저 비교

- **Chrome/Edge**: 선택이 일반적으로 올바르게 동작함
- **Firefox**: 선택이 예상치 못하게 축소될 수 있음
- **Safari**: 선택 축소가 가장 예측 불가능함 (이 케이스)

## 참고 및 해결 방법 가능한 방향

- 필요한 경우 선택을 보존하기 위해 클릭 이벤트 처리
- 원하는 경우 클릭 후 선택 복원
- 선택 축소 동작 문서화
- 클릭을 통해 선택이 지속되어야 하는지 고려
