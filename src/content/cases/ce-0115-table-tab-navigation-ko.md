---
id: ce-0115
scenarioId: scenario-table-editing
locale: ko
os: Windows
osVersion: "11"
device: Desktop or Laptop
deviceVersion: Any
browser: Chrome
browserVersion: "120.0"
keyboard: US
caseTitle: Tab 키가 다음 셀로 이동하는 대신 탭 문자를 삽입함
description: "contenteditable 요소에서 테이블 셀을 편집할 때 Tab을 누르면 다음 셀로 이동하는 대신 탭 문자가 삽입됩니다. 이것은 테이블 탐색을 어렵게 만듭니다."
tags:
  - table
  - tab
  - navigation
  - chrome
status: draft
domSteps:
  - label: "Before"
    html: '<table><tr><td>Cell 1</td><td>Cell 2</td></tr></table>'
    description: "Table structure, cursor in first cell"
  - label: "After Tab (Bug)"
    html: '<table><tr><td>Cell 1\t</td><td>Cell 2</td></tr></table>'
    description: "Tab key inserts tab character, does not move to next cell"
  - label: "✅ Expected"
    html: '<table><tr><td>Cell 1</td><td>Cell 2</td></tr></table>'
    description: "Expected: Tab key moves to next cell, tab character not inserted"
---

### 현상

contenteditable 요소에서 테이블 셀을 편집할 때 Tab을 누르면 다음 셀로 이동하는 대신 탭 문자가 삽입됩니다. 이것은 테이블 탐색을 어렵게 만듭니다.

### 재현 예시

1. contenteditable에 테이블을 만듭니다
2. 테이블 셀 내부를 클릭합니다
3. Tab 키를 누릅니다

### 관찰된 동작

- 탭 문자가 셀에 삽입됩니다
- 커서가 다음 셀로 이동하지 않습니다
- 테이블 탐색이 깨집니다
- 사용자가 셀 간을 쉽게 탐색할 수 없습니다

### 예상 동작

- Tab은 다음 셀로 이동해야 합니다
- Shift+Tab은 이전 셀로 이동해야 합니다
- 탭 문자가 삽입되지 않아야 합니다
- 탐색이 스프레드시트 애플리케이션처럼 작동해야 합니다

### 브라우저 비교

- **모든 브라우저**: Tab이 문자를 삽입함 (기본 동작)
- 테이블 탐색을 위한 사용자 정의 처리 필요

### 참고 및 해결 방법 가능한 방향

- 테이블 셀에서 Tab 키 가로채기
- 기본 동작 방지
- 다음/이전 셀 찾기
- 커서를 다음 셀로 이동
- 엣지 케이스 처리 (마지막 셀, 첫 번째 셀)
