---
id: ce-0126
scenarioId: scenario-table-editing
locale: ko
os: Windows
osVersion: "11"
device: Desktop or Laptop
deviceVersion: Any
browser: Safari
browserVersion: "17.0"
keyboard: US
caseTitle: Safari에서 테이블 셀 콘텐츠 편집이 테이블 구조를 깨뜨림
description: "Safari에서 테이블 셀 내에서 텍스트를 편집할 때 테이블 구조가 깨질 수 있습니다. 셀이 제거되거나 행이 삭제되거나 테이블이 잘못 형성될 수 있습니다."
tags:
  - table
  - cell
  - structure
  - safari
status: draft
domSteps:
  - label: "Before"
    html: '<table><tr><td>Cell 1</td><td>Cell 2</td></tr></table>'
    description: "Table structure, editing 'Cell 1'"
  - label: "After Editing (Bug)"
    html: '<table><tr><td>Cell 2</td></tr></table>'
    description: "After editing, cell deleted or table structure damaged"
  - label: "✅ Expected"
    html: '<table><tr><td>New Cell 1</td><td>Cell 2</td></tr></table>'
    description: "Expected: Table structure maintained, only cell content changed"
---

### 현상

Safari에서 테이블 셀 내에서 텍스트를 편집할 때 테이블 구조가 깨질 수 있습니다. 셀이 제거되거나 행이 삭제되거나 테이블이 잘못 형성될 수 있습니다.

### 재현 예시

1. 테이블을 만듭니다: `<table><tr><td>Cell 1</td><td>Cell 2</td></tr></table>`
2. 셀에서 텍스트를 편집합니다
3. 서식을 적용하거나 텍스트를 삭제합니다
4. 테이블 구조를 관찰합니다

### 관찰된 동작

- 테이블 셀이 제거될 수 있습니다
- 행이 삭제될 수 있습니다
- 테이블 구조가 잘못 형성됩니다
- DOM 구조가 깨집니다

### 예상 동작

- 테이블 구조가 유지되어야 합니다
- 셀이 그대로 유지되어야 합니다
- 행이 삭제되지 않아야 합니다
- 편집 중 구조가 보존되어야 합니다

### 브라우저 비교

- **Chrome/Edge**: 일반적으로 테이블 구조 유지
- **Firefox**: 가끔 구조를 깨뜨릴 수 있음
- **Safari**: 구조를 깨뜨릴 가능성이 가장 높음 (이 케이스)

### 참고 및 해결 방법 가능한 방향

- 테이블 셀에서 편집 작업 가로채기
- 구조를 깨뜨리는 작업 방지
- 작업 후 테이블 구조 검증
- 깨진 경우 구조 복원
