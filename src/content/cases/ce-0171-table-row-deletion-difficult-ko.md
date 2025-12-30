---
id: ce-0171
scenarioId: scenario-table-editing
locale: ko
os: Windows
osVersion: "11"
device: Desktop or Laptop
deviceVersion: Any
browser: Chrome
browserVersion: "120.0"
keyboard: US
caseTitle: 사용자 정의 구현 없이는 테이블 행 삭제가 어려움
description: "Chrome에서 contenteditable 요소에서 테이블 행을 삭제하려고 할 때 행을 삭제하는 네이티브 방법이 없습니다. 사용자는 모든 셀 콘텐츠를 수동으로 삭제하거나 사용자 정의 구현을 사용해야 합니다."
tags:
  - table
  - row
  - deletion
  - chrome
status: draft
domSteps:
  - label: "Before"
    html: '<table><tr><td>Row 1 Cell 1</td><td>Row 1 Cell 2</td></tr><tr><td>Row 2 Cell 1</td><td>Row 2 Cell 2</td></tr></table>'
    description: "Table structure, second row selected"
  - label: "After Manual Delete (Bug)"
    html: '<table><tr><td>Row 1 Cell 1</td><td>Row 1 Cell 2</td></tr><tr><td></td><td></td></tr></table>'
    description: "Only cell content manually deleted, empty row remains"
  - label: "✅ Expected"
    html: '<table><tr><td>Row 1 Cell 1</td><td>Row 1 Cell 2</td></tr></table>'
    description: "Expected: Entire row deleted, table structure maintained"
---

## 현상

Chrome에서 contenteditable 요소에서 테이블 행을 삭제하려고 할 때 행을 삭제하는 네이티브 방법이 없습니다. 사용자는 모든 셀 콘텐츠를 수동으로 삭제하거나 사용자 정의 구현을 사용해야 합니다.

## 재현 예시

1. 여러 행이 있는 테이블을 만듭니다
2. 전체 행을 삭제하려고 시도합니다
3. 사용 가능한 옵션을 관찰합니다

## 관찰된 동작

- 행을 삭제하는 네이티브 방법이 없습니다
- 셀 콘텐츠를 수동으로 삭제해야 합니다
- 또는 사용자 정의 구현을 사용해야 합니다
- 행 삭제가 직관적이지 않습니다

## 예상 동작

- 행을 쉽게 삭제할 수 있어야 합니다
- 또는 네이티브 행 삭제가 사용 가능해야 합니다
- 삭제가 직관적이어야 합니다
- 테이블 구조가 유지되어야 합니다

## 브라우저 비교

- **모든 브라우저**: 네이티브 행 삭제 없음
- 행 작업을 위한 사용자 정의 구현 필요

## 참고 및 해결 방법 가능한 방향

- 사용자 정의 행 삭제 구현
- 행 작업을 위한 UI 제공
- 프로그래밍 방식으로 행 삭제 처리
- 삭제 후 테이블 구조 유지
