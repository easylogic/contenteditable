---
id: ce-0148
scenarioId: scenario-table-editing
locale: ko
os: Windows
osVersion: "11"
device: Desktop or Laptop
deviceVersion: Any
browser: Chrome
browserVersion: "120.0"
keyboard: US
caseTitle: 테이블 셀에 콘텐츠 붙여넣기가 테이블 구조를 깨뜨림
description: "Chrome에서 테이블 셀에 서식이 있는 콘텐츠를 붙여넣을 때 테이블 구조가 깨질 수 있습니다. 셀이 제거되거나 행이 삭제되거나 테이블이 잘못 형성될 수 있습니다."
tags:
  - table
  - paste
  - structure
  - chrome
status: draft
domSteps:
  - label: "Before"
    html: '<table><tr><td>Cell 1</td><td>Cell 2</td></tr></table>'
    description: "Table structure"
  - label: "Clipboard"
    html: '<div><strong>Bold</strong> Text</div>'
    description: "Copied formatted content"
  - label: "❌ After Paste"
    html: '<table><tr><td></td></tr></table>'
    description: "Table structure damaged, cells deleted or structure broken"
  - label: "✅ Expected"
    html: '<table><tr><td><strong>Bold</strong> Text</td><td>Cell 2</td></tr></table>'
    description: "Table structure maintained, content inserted inside cells"
---

### 현상

Chrome에서 테이블 셀에 서식이 있는 콘텐츠를 붙여넣을 때 테이블 구조가 깨질 수 있습니다. 셀이 제거되거나 행이 삭제되거나 테이블이 잘못 형성될 수 있습니다.

### 재현 예시

1. 테이블을 만듭니다: `<table><tr><td>Cell 1</td><td>Cell 2</td></tr></table>`
2. 셀에 서식이 있는 HTML 콘텐츠를 붙여넣습니다
3. 테이블 구조를 관찰합니다

### 관찰된 동작

- 테이블 셀이 제거될 수 있습니다
- 행이 삭제될 수 있습니다
- 테이블 구조가 잘못 형성됩니다
- DOM 구조가 깨집니다

### 예상 동작

- 테이블 구조가 유지되어야 합니다
- 셀이 그대로 유지되어야 합니다
- 붙여넣은 콘텐츠가 셀 내에 있어야 합니다
- 구조가 보존되어야 합니다

### 브라우저 비교

- **Chrome/Edge**: 구조를 깨뜨릴 수 있음 (이 케이스)
- **Firefox**: 구조를 깨뜨릴 가능성이 더 높음
- **Safari**: 구조를 깨뜨릴 가능성이 가장 높음

### 참고 및 해결 방법 가능한 방향

- 테이블 셀에서 붙여넣기 가로채기
- 붙여넣은 콘텐츠에서 블록 레벨 요소 제거
- 테이블 구조 보존
- 붙여넣기 후 구조 검증
