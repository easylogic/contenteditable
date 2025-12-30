---
id: scenario-image-deletion
title: 이미지 삭제 동작이 브라우저마다 다름
description: "contenteditable 요소에서 이미지를 삭제하는 것이 브라우저마다 다르게 동작합니다. 일부 브라우저는 이미지를 깨끗하게 삭제하지만 다른 브라우저는 빈 요소를 남기거나, DOM 구조를 깨뜨리거나, 여러 삭제 작업이 필요할 수 있습니다."
category: formatting
tags:
  - image
  - deletion
  - backspace
  - delete
status: draft
---

contenteditable 요소에서 이미지를 삭제하는 것이 브라우저마다 다르게 동작합니다. 일부 브라우저는 이미지를 깨끗하게 삭제하지만 다른 브라우저는 빈 요소를 남기거나, DOM 구조를 깨뜨리거나, 여러 삭제 작업이 필요할 수 있습니다.

## 관찰된 동작

### 시나리오 1: 이미지 선택 및 삭제
- **Chrome/Edge**: 이미지가 삭제되지만 빈 부모 요소를 남길 수 있음
- **Firefox**: 이미지를 삭제하거나 여러 작업이 필요할 수 있음
- **Safari**: 동작이 다양하며 DOM 구조를 깨뜨릴 수 있음

### 시나리오 2: 선택한 이미지에서 Backspace
- **Chrome/Edge**: 이미지를 삭제하지만 커서 위치가 예상치 못할 수 있음
- **Firefox**: 이미지를 삭제하거나 커서가 예상치 못하게 이동할 수 있음
- **Safari**: 동작이 일관되지 않음

### 시나리오 3: 선택한 이미지에서 Delete 키
- **Chrome/Edge**: 앞으로 이미지 삭제
- **Firefox**: 유사한 동작
- **Safari**: 다르게 동작할 수 있음

### 시나리오 4: 빈 이미지 요소
- **Chrome/Edge**: 빈 `<img>` 태그 또는 래퍼 div를 만들 수 있음
- **Firefox**: 유사한 문제
- **Safari**: 다른 빈 구조를 만들 수 있음

## 영향

- 일관되지 않은 삭제 경험
- 잘못된 HTML 생성 위험
- DOM에 빈 요소 남음
- 삭제 후 커서 위치 문제

## 브라우저 비교

- **Chrome/Edge**: 일반적으로 이미지를 삭제하지만 빈 요소를 남길 수 있음
- **Firefox**: 빈 구조를 남길 가능성이 더 높음
- **Safari**: 가장 일관되지 않은 동작

## 해결 방법

사용자 정의 이미지 삭제 처리 구현:

```javascript
element.addEventListener('beforeinput', (e) => {
  if (e.inputType === 'deleteContentBackward' || e.inputType === 'deleteContentForward') {
    const selection = window.getSelection();
    if (selection.rangeCount === 0) return;
    
    const range = selection.getRangeAt(0);
    const img = range.startContainer.nodeType === Node.ELEMENT_NODE 
      ? range.startContainer.querySelector('img')
      : range.startContainer.parentElement?.querySelector('img');
    
    if (img && (range.intersectsNode(img) || selection.containsNode(img, true))) {
      e.preventDefault();
      
      // 이미지 및 빈 래퍼 요소 정리
      const parent = img.parentElement;
      img.remove();
      
      // 빈 래퍼 div 제거
      if (parent && parent.tagName !== 'BODY' && 
          (!parent.textContent || parent.textContent.trim() === '') &&
          parent.children.length === 0) {
        parent.remove();
      }
      
      // 삭제 후 커서 위치 설정
      const newRange = document.createRange();
      if (parent && parent.nextSibling) {
        newRange.setStartBefore(parent.nextSibling);
      } else if (parent && parent.previousSibling) {
        newRange.setStartAfter(parent.previousSibling);
      } else {
        newRange.setStart(parent || element, 0);
      }
      newRange.collapse(true);
      selection.removeAllRanges();
      selection.addRange(newRange);
    }
  }
});
```
