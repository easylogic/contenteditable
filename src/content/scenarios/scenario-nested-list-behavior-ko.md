---
id: scenario-nested-list-behavior
title: 중첩된 리스트 편집 동작이 일관되지 않음
description: "중첩된 리스트(리스트 항목 내의 리스트)를 편집할 때 Enter, Backspace, Delete, Tab 키의 동작이 브라우저마다 크게 다릅니다. 중첩된 리스트 항목 생성, 편집, 삭제는 예상치 못한 DOM 구조나 손실된 포맷팅을 초래할 수 있습니다."
category: formatting
tags:
  - list
  - nested
  - indentation
  - tab
  - enter
status: draft
locale: ko
---

중첩된 리스트(리스트 항목 내의 리스트)를 편집할 때 Enter, Backspace, Delete, Tab 키의 동작이 브라우저마다 크게 다릅니다. 중첩된 리스트 항목 생성, 편집, 삭제는 예상치 못한 DOM 구조나 손실된 포맷팅을 초래할 수 있습니다.

## 관찰된 동작

### 시나리오 1: 중첩된 리스트 항목에서 Enter 누르기
- **Chrome/Edge**: 동일한 중첩 수준에서 새 리스트 항목을 생성합니다
- **Firefox**: 새 리스트 항목 또는 단락을 생성할 수 있으며, 동작이 일관되지 않습니다
- **Safari**: 예상치 못한 중첩 수준을 생성할 수 있습니다

### 시나리오 2: 리스트 항목 들여쓰기를 위해 Tab 누르기
- **Chrome/Edge**: 중첩된 리스트 구조를 생성하거나 CSS 들여쓰기를 사용할 수 있습니다
- **Firefox**: 동작이 다르며 Tab 들여쓰기를 지원하지 않을 수 있습니다
- **Safari**: 중첩된 리스트나 예상치 못한 구조를 생성할 수 있습니다

### 시나리오 3: 중첩된 리스트 항목의 시작에서 Backspace 누르기
- **Chrome/Edge**: 리스트 항목을 내어쓰거나 삭제할 수 있습니다
- **Firefox**: 중첩된 리스트를 삭제하거나 잘못된 HTML을 생성할 수 있습니다
- **Safari**: 동작이 예측 불가능할 수 있습니다

### 시나리오 4: 중첩된 리스트 삭제
- **Chrome/Edge**: 부모 리스트 항목과 병합하거나 빈 리스트 항목을 생성할 수 있습니다
- **Firefox**: 예상치 못하게 전체 중첩 구조를 삭제할 수 있습니다
- **Safari**: 손상된 HTML 구조를 생성할 수 있습니다

## 영향

- 일관된 중첩된 리스트 편집 구현의 어려움
- 사용자가 브라우저마다 다른 동작을 경험함
- 잘못된 HTML 생성 위험
- 중첩된 항목 편집 시 리스트 구조 손실

## 브라우저 비교

- **Chrome/Edge**: 일반적으로 중첩된 리스트에 대한 더 나은 지원을 하지만, 동작이 여전히 일관되지 않을 수 있습니다
- **Firefox**: 덜 예측 가능한 중첩된 리스트 동작입니다
- **Safari**: 가장 일관되지 않으며, 종종 예상치 못한 구조를 생성합니다

## 해결 방법

중첩된 리스트 작업에 대한 사용자 정의 처리를 구현합니다:

```javascript
element.addEventListener('beforeinput', (e) => {
  if (e.inputType === 'insertParagraph') {
    const selection = window.getSelection();
    if (selection.rangeCount === 0) return;
    
    const range = selection.getRangeAt(0);
    const listItem = range.startContainer.closest('li');
    
    if (listItem) {
      // 중첩된 리스트에 있는지 확인
      const parentList = listItem.closest('ul, ol');
      const parentListItem = parentList?.parentElement;
      
      if (parentListItem?.tagName === 'LI') {
        e.preventDefault();
        // 사용자 정의 중첩된 리스트 항목 생성 구현
        handleNestedListItemInsertion(listItem, range);
      }
    }
  }
  
  // 들여쓰기를 위한 Tab 처리
  if (e.inputType === 'insertText' && e.data === '\t') {
    const selection = window.getSelection();
    if (selection.rangeCount === 0) return;
    
    const range = selection.getRangeAt(0);
    const listItem = range.startContainer.closest('li');
    
    if (listItem) {
      e.preventDefault();
      // 사용자 정의 들여쓰기 로직 구현
      handleListIndentation(listItem);
    }
  }
});
```
