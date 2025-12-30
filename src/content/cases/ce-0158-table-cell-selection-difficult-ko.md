---
id: ce-0158
scenarioId: scenario-table-editing
locale: ko
os: Windows
osVersion: "11"
device: Desktop or Laptop
deviceVersion: Any
browser: Chrome
browserVersion: "120.0"
keyboard: US
caseTitle: 테이블 셀 콘텐츠 선택이 어려움
description: "Chrome에서 테이블 셀 내에서 텍스트를 선택하려고 할 때 선택이 셀 밖으로 확장되거나 제대로 작동하지 않을 수 있습니다. 셀 콘텐츠를 정확하게 선택하고 편집하기 어렵습니다."
tags:
  - table
  - cell
  - selection
  - chrome
status: draft
domSteps:
  - label: "Before"
    html: '<table><tr><td>Cell 1</td><td>Cell 2</td></tr></table>'
    description: "Table structure, attempting to select Cell 1 text"
  - label: "After Selection (Bug)"
    html: '<table><tr><td>Cell 1</td><td>Cell 2</td></tr></table>'
    description: "Selection expands to adjacent cells or ignores cell boundaries"
  - label: "✅ Expected"
    html: '<table><tr><td><span style="background: yellow;">Cell 1</span></td><td>Cell 2</td></tr></table>'
    description: "Expected: Selection limited to inside cell"
---

### 현상

Chrome에서 테이블 셀 내에서 텍스트를 선택하려고 할 때 선택이 셀 밖으로 확장되거나 제대로 작동하지 않을 수 있습니다. 셀 콘텐츠를 정확하게 선택하고 편집하기 어렵습니다.

### 재현 예시

1. 텍스트가 포함된 셀이 있는 테이블을 만듭니다
2. 셀 내에서 텍스트를 선택하려고 시도합니다
3. 선택 동작을 관찰합니다

### 관찰된 동작

- 선택이 인접한 셀로 확장될 수 있습니다
- 또는 선택이 전혀 작동하지 않을 수 있습니다
- 셀 경계가 존중되지 않습니다
- 정확한 선택이 어렵습니다

### 예상 동작

- 선택이 셀 내에 포함되어야 합니다
- 셀 경계가 존중되어야 합니다
- 선택이 부드럽게 작동해야 합니다
- 편집이 정확해야 합니다

### 브라우저 비교

- **Chrome/Edge**: 선택이 셀 밖으로 확장될 수 있음 (이 케이스)
- **Firefox**: 유사한 선택 문제
- **Safari**: 선택 동작이 가장 일관되지 않음

### 참고 및 해결 방법 가능한 방향

- 선택을 셀 경계로 제한
- 테이블 셀에서 선택 이벤트 가로채기
- 선택이 셀 밖으로 확장되는 것을 방지
- 셀 경계에 대한 시각적 피드백 제공
