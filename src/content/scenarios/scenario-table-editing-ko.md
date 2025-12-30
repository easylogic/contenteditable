---
id: scenario-table-editing
title: contenteditable에서 테이블 편집이 제한적이고 일관되지 않음
description: "contenteditable 요소 내에서 테이블 편집은 제한적이며 브라우저마다 일관되지 않게 동작합니다. 테이블 생성, 셀 편집, 행/열 추가/제거, 테이블 구조 유지 모두 브라우저별 동작과 제한이 있습니다."
category: formatting
tags:
  - table
  - cell
  - row
  - column
status: draft
---

contenteditable 요소 내에서 테이블 편집은 제한적이며 브라우저마다 일관되지 않게 동작합니다. 테이블 생성, 셀 편집, 행/열 추가/제거, 테이블 구조 유지 모두 브라우저별 동작과 제한이 있습니다.

## 관찰된 동작

### 시나리오 1: 테이블 생성
- **Chrome/Edge**: execCommand 또는 수동 삽입을 통해 테이블 생성을 지원할 수 있습니다
- **Firefox**: 제한된 테이블 생성 지원입니다
- **Safari**: 테이블 생성 동작이 다릅니다

### 시나리오 2: 테이블 셀 편집
- **Chrome/Edge**: 셀 편집이 작동하지만 구조를 손상시킬 수 있습니다
- **Firefox**: 구조에 대한 유사한 문제가 있습니다
- **Safari**: 셀 편집이 구조를 손상시킬 가능성이 가장 높습니다

### 시나리오 3: 행 추가/제거
- **Chrome/Edge**: execCommand를 통해 지원할 수 있지만 동작이 일관되지 않습니다
- **Firefox**: 제한된 지원입니다
- **Safari**: 행 조작이 신뢰할 수 없습니다

### 시나리오 4: 테이블에서 Tab 탐색
- **Chrome/Edge**: Tab이 다음 셀로 이동하거나 탭 문자를 삽입할 수 있습니다
- **Firefox**: 유사한 일관되지 않은 동작입니다
- **Safari**: Tab 처리가 다릅니다

## 영향

- 테이블 편집 기능 구현의 어려움
- 테이블 구조 손상 위험
- 일관되지 않은 사용자 경험
- 사용자 정의 테이블 편집 구현 필요

## 브라우저 비교

- **Chrome/Edge**: 가장 나은 테이블 편집 지원이지만 여전히 제한적입니다
- **Firefox**: 더 제한된 테이블 지원입니다
- **Safari**: 가장 일관되지 않은 테이블 동작입니다

## 해결 방법

사용자 정의 테이블 처리를 구현합니다:

```javascript
// 테이블 셀에서 Tab 키 처리
element.addEventListener('keydown', (e) => {
  if (e.key === 'Tab') {
    const selection = window.getSelection();
    if (selection.rangeCount === 0) return;
    
    const range = selection.getRangeAt(0);
    const cell = range.startContainer.closest('td, th');
    
    if (cell) {
      e.preventDefault();
      
      const table = cell.closest('table');
      const row = cell.parentElement;
      const cells = Array.from(row.cells);
      const currentIndex = cells.indexOf(cell);
      
      if (e.shiftKey) {
        // Shift+Tab: 이전 셀
        if (currentIndex > 0) {
          focusCell(cells[currentIndex - 1]);
        } else {
          // 이전 행의 마지막 셀로 이동
          const prevRow = row.previousElementSibling;
          if (prevRow) {
            focusCell(prevRow.cells[prevRow.cells.length - 1]);
          }
        }
      } else {
        // Tab: 다음 셀
        if (currentIndex < cells.length - 1) {
          focusCell(cells[currentIndex + 1]);
        } else {
          // 다음 행의 첫 번째 셀로 이동
          const nextRow = row.nextElementSibling;
          if (nextRow) {
            focusCell(nextRow.cells[0]);
          } else {
            // 새 행 추가
            const newRow = table.insertRow();
            const newCell = newRow.insertCell();
            newCell.contentEditable = 'true';
            focusCell(newCell);
          }
        }
      }
    }
  }
});

function focusCell(cell) {
  const range = document.createRange();
  range.selectNodeContents(cell);
  range.collapse(true);
  const selection = window.getSelection();
  selection.removeAllRanges();
  selection.addRange(range);
  cell.focus();
}
```
