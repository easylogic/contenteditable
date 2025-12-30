---
id: scenario-list-item-deletion
title: 리스트 항목 삭제 동작이 브라우저마다 다름
description: "리스트 항목의 시작 또는 끝에서 Backspace 또는 Delete를 누를 때 동작이 브라우저마다 크게 다릅니다. 일부 브라우저는 리스트 항목을 삭제하고 인접한 콘텐츠와 병합하는 반면, 다른 브라우저는 전체 리스트를 삭제하거나 예상치 못한 DOM 구조를 생성할 수 있습니다."
category: formatting
tags:
  - list
  - deletion
  - backspace
  - delete
  - browser-compatibility
status: draft
locale: ko
---

리스트 항목(`<li>`)의 시작 또는 끝에서 Backspace 또는 Delete를 누를 때 동작이 브라우저마다 크게 다릅니다. 일부 브라우저는 리스트 항목을 삭제하고 인접한 콘텐츠와 병합하는 반면, 다른 브라우저는 전체 리스트를 삭제하거나 예상치 못한 DOM 구조를 생성할 수 있습니다.

## 관찰된 동작

### 시나리오 1: 첫 번째 리스트 항목의 시작에서 Backspace
- **Chrome/Edge**: 리스트 항목을 삭제하고 단락으로 변환하거나 이전 콘텐츠와 병합합니다
- **Firefox**: 전체 리스트를 삭제하거나 중첩 구조를 생성할 수 있습니다
- **Safari**: 동작이 다를 수 있으며 때로는 빈 리스트 항목을 생성합니다

### 시나리오 2: 마지막 리스트 항목의 끝에서 Delete
- **Chrome/Edge**: 리스트 항목을 삭제하고 다음 콘텐츠와 병합합니다
- **Firefox**: 리스트 항목 또는 전체 리스트를 삭제할 수 있습니다
- **Safari**: 예상치 못한 DOM 구조를 생성할 수 있습니다

### 시나리오 3: 빈 리스트 항목에서 Backspace
- **Chrome/Edge**: 리스트 항목을 제거하며, 마지막 항목인 경우 전체 리스트를 제거할 수 있습니다
- **Firefox**: 리스트 항목을 제거하거나 빈 단락을 생성할 수 있습니다
- **Safari**: 동작이 다릅니다

## 영향

- 브라우저 간 일관되지 않은 사용자 경험
- 예상치 못한 DOM 구조 변경
- 사용자가 텍스트를 삭제할 것으로 예상할 때 리스트 포맷팅 손실
- 일관된 리스트 편집 동작 구현의 어려움

## 브라우저 비교

- **Chrome/Edge**: 일반적으로 더 예측 가능하며, 적절한 경우 리스트 항목을 단락으로 변환합니다
- **Firefox**: 리스트 구조 제거에 더 공격적일 수 있습니다
- **Safari**: 동작이 일관되지 않을 수 있으며, 때로는 잘못된 HTML을 생성합니다

## 해결 방법

리스트 항목 삭제를 처리할 때 `beforeinput` 이벤트를 가로채고 사용자 정의 삭제 로직을 구현합니다:

```javascript
element.addEventListener('beforeinput', (e) => {
  if (e.inputType === 'deleteContentBackward' || e.inputType === 'deleteContentForward') {
    const selection = window.getSelection();
    if (selection.rangeCount === 0) return;
    
    const range = selection.getRangeAt(0);
    const listItem = range.startContainer.closest('li');
    
    if (listItem) {
      // 커서가 리스트 항목의 시작/끝에 있는지 확인
      const isAtStart = range.startOffset === 0 && 
                       range.startContainer === listItem.firstChild;
      const isAtEnd = range.endOffset === (range.endContainer.textContent?.length || 0) &&
                      range.endContainer === listItem.lastChild;
      
      if (isAtStart || isAtEnd) {
        e.preventDefault();
        // 사용자 정의 리스트 항목 삭제 로직 구현
        handleListItemDeletion(listItem, e.inputType);
      }
    }
  }
});
```
