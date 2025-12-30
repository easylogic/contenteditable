---
id: scenario-selection-restoration
title: DOM 조작 후 선택 복원이 신뢰할 수 없음
description: "contenteditable 요소에서 프로그래밍 방식으로 DOM을 조작한 후 텍스트 선택(커서 위치)을 복원하는 것은 브라우저 간에 신뢰할 수 없습니다. 선택이 손실되거나, 잘못된 위치로 이동하거나, 유효하지 않게 될 수 있습니다."
category: selection
tags:
  - selection
  - range
  - cursor
  - dom-manipulation
status: draft
locale: ko
---

contenteditable 요소에서 프로그래밍 방식으로 DOM을 조작한 후 텍스트 선택(커서 위치)을 복원하는 것은 브라우저 간에 신뢰할 수 없습니다. 선택이 손실되거나, 잘못된 위치로 이동하거나, 유효하지 않게 될 수 있습니다.

## 관찰된 동작

### 시나리오 1: 프로그래밍 방식으로 콘텐츠 삽입
- **Chrome/Edge**: 선택이 손실되거나 이동할 수 있습니다
- **Firefox**: 선택 복원이 더 신뢰할 수 없습니다
- **Safari**: 선택이 손실될 가능성이 가장 높습니다

### 시나리오 2: 콘텐츠 교체
- **Chrome/Edge**: 선택이 유효하지 않게 될 수 있습니다
- **Firefox**: 유사한 문제가 있습니다
- **Safari**: 선택 복원이 일관되지 않습니다

### 시나리오 3: 요소로 콘텐츠 감싸기
- **Chrome/Edge**: 선택이 새 요소 내부로 이동할 수 있습니다
- **Firefox**: 선택 위치가 예측 불가능합니다
- **Safari**: 가장 일관되지 않은 동작입니다

### 시나리오 4: 요소 제거 및 다시 추가
- **Chrome/Edge**: 선택이 완전히 손실될 수 있습니다
- **Firefox**: 유사한 문제가 있습니다
- **Safari**: 선택 복원이 가장 신뢰할 수 없습니다

## 영향

- 작업 후 커서 위치 손실
- 나쁜 사용자 경험
- 신뢰할 수 있는 편집 기능 구현의 어려움
- 복잡한 선택 복원 로직 필요

## 브라우저 비교

- **Chrome/Edge**: 일반적으로 더 나은 선택 복원입니다
- **Firefox**: 선택을 잃을 가능성이 더 높습니다
- **Safari**: 가장 신뢰할 수 없는 선택 복원입니다

## 해결 방법

강력한 선택 복원을 구현합니다:

```javascript
function saveSelection() {
  const selection = window.getSelection();
  if (selection.rangeCount === 0) return null;
  
  const range = selection.getRangeAt(0);
  return {
    startContainer: range.startContainer,
    startOffset: range.startOffset,
    endContainer: range.endContainer,
    endOffset: range.endOffset,
    commonAncestorContainer: range.commonAncestorContainer
  };
}

function restoreSelection(saved) {
  if (!saved) return false;
  
  try {
    const range = document.createRange();
    range.setStart(saved.startContainer, saved.startOffset);
    range.setEnd(saved.endContainer, saved.endOffset);
    
    const selection = window.getSelection();
    selection.removeAllRanges();
    selection.addRange(range);
    return true;
  } catch (e) {
    // 선택이 유효하지 않음, 가장 가까운 유효한 위치 찾기 시도
    return restoreSelectionFallback(saved);
  }
}

function restoreSelectionFallback(saved) {
  // 공통 조상 찾기
  let node = saved.commonAncestorContainer;
  
  // 유효한 텍스트 노드 또는 요소를 찾을 때까지 위로 이동
  while (node && node.nodeType !== Node.TEXT_NODE && node.nodeType !== Node.ELEMENT_NODE) {
    node = node.parentNode;
  }
  
  if (!node) return false;
  
  try {
    const range = document.createRange();
    if (node.nodeType === Node.TEXT_NODE) {
      const length = node.textContent.length;
      range.setStart(node, Math.min(saved.startOffset, length));
      range.setEnd(node, Math.min(saved.endOffset, length));
    } else {
      range.selectNodeContents(node);
      range.collapse(true);
    }
    
    const selection = window.getSelection();
    selection.removeAllRanges();
    selection.addRange(range);
    return true;
  } catch (e) {
    return false;
  }
}

// DOM 조작 전에 사용
element.addEventListener('beforeinput', (e) => {
  if (e.inputType === 'insertText' || e.inputType === 'insertParagraph') {
    const saved = saveSelection();
    e.savedSelection = saved; // 나중에 복원하기 위해 저장
  }
});

// 조작 후 복원
function manipulateDOM(callback) {
  const saved = saveSelection();
  callback();
  
  // DOM 업데이트 후 선택 복원
  requestAnimationFrame(() => {
    if (!restoreSelection(saved)) {
      restoreSelectionFallback(saved);
    }
  });
}
```
