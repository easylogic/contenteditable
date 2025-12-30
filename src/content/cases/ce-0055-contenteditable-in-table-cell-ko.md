---
id: ce-0055
scenarioId: scenario-contenteditable-table
locale: ko
os: Windows
osVersion: "11"
device: Desktop or Laptop
deviceVersion: Any
browser: Firefox
browserVersion: "120.0"
keyboard: US
caseTitle: 테이블 셀의 contenteditable이 레이아웃 문제를 일으킴
description: "contenteditable 영역이 테이블 셀(td) 내부에 있을 때 Firefox에서 콘텐츠를 편집하면 레이아웃 문제가 발생할 수 있습니다. 테이블이 예상치 못하게 크기가 조정되거나 셀이 넘칠 수 있습니다."
tags:
  - table
  - layout
  - contenteditable
  - firefox
status: draft
---

### 현상

contenteditable 영역이 테이블 셀(`<td>`) 내부에 있을 때 Firefox에서 콘텐츠를 편집하면 레이아웃 문제가 발생할 수 있습니다. 테이블이 예상치 못하게 크기가 조정되거나 셀이 넘칠 수 있습니다.

### 재현 예시

1. contenteditable 셀이 있는 테이블을 만듭니다:
   ```html
   <table>
     <tr>
       <td contenteditable>Editable content</td>
     </tr>
   </table>
   ```
2. 셀의 콘텐츠를 편집합니다 (텍스트 추가 또는 제거).
3. 테이블 레이아웃을 관찰합니다.

### 관찰된 동작

- Windows의 Firefox에서 테이블 셀의 콘텐츠를 편집하면 레이아웃 문제가 발생할 수 있습니다.
- 테이블이 예상치 못하게 크기가 조정될 수 있습니다.
- 셀이 넘치거나 크기가 변경될 수 있습니다.
- 레이아웃이 불안정해질 수 있습니다.

### 예상 동작

- 테이블 셀의 콘텐츠를 편집해도 레이아웃 문제가 발생하지 않아야 합니다.
- 테이블이 구조를 유지해야 합니다.
- 편집 중 셀 크기가 안정적으로 유지되어야 합니다.
