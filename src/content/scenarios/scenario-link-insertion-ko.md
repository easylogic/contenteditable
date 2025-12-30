---
id: scenario-link-insertion
title: 링크 삽입 및 편집 동작이 브라우저마다 다름
description: "contenteditable 요소에서 링크를 삽입하거나 편집할 때 동작이 브라우저마다 크게 다릅니다. 링크 생성, 링크 텍스트 편집, 링크 제거는 예상치 못한 DOM 구조나 손실된 포맷팅을 초래할 수 있습니다."
category: formatting
tags:
  - link
  - anchor
  - href
  - formatting
status: draft
locale: ko
---

contenteditable 요소에서 링크를 삽입하거나 편집할 때 동작이 브라우저마다 크게 다릅니다. 링크 생성, 링크 텍스트 편집, 링크 제거는 예상치 못한 DOM 구조나 손실된 포맷팅을 초래할 수 있습니다.

## 관찰된 동작

### 시나리오 1: 선택한 텍스트에서 링크 생성
- **Chrome/Edge**: 선택한 텍스트 주위에 `<a>` 요소를 생성하고 포맷팅을 보존합니다
- **Firefox**: 중첩된 링크를 생성하거나 포맷팅을 손실할 수 있습니다
- **Safari**: 예상치 못한 DOM 구조를 생성할 수 있습니다

### 시나리오 2: 링크 내부의 텍스트 편집
- **Chrome/Edge**: 텍스트 편집이 작동하지만 모든 텍스트가 삭제되면 링크가 손실될 수 있습니다
- **Firefox**: 편집 시 링크 구조가 손상될 수 있습니다
- **Safari**: 중첩된 요소를 생성하거나 링크를 손실할 수 있습니다

### 시나리오 3: 링크 제거 (텍스트 유지)
- **Chrome/Edge**: 수동 DOM 조작이 필요할 수 있습니다
- **Firefox**: 동작이 다르며 빈 앵커 태그를 남길 수 있습니다
- **Safari**: 예상치 못한 구조를 생성할 수 있습니다

### 시나리오 4: 링크 붙여넣기
- **Chrome/Edge**: 링크를 생성하거나 일반 텍스트로 붙여넣을 수 있습니다
- **Firefox**: 동작이 일관되지 않습니다
- **Safari**: 중첩된 링크를 생성하거나 링크 구조를 손실할 수 있습니다

## 영향

- 일관되지 않은 링크 생성 및 편집 경험
- 잘못된 HTML 생성 위험 (중첩된 링크)
- 편집 시 링크 구조 손실
- 일관된 링크 동작 구현의 어려움

## 브라우저 비교

- **Chrome/Edge**: 일반적으로 더 나은 링크 처리를 하지만 여전히 엣지 케이스가 있습니다
- **Firefox**: 중첩된 링크를 생성하거나 구조를 손실할 가능성이 더 높습니다
- **Safari**: 가장 일관되지 않은 동작입니다

## 해결 방법

사용자 정의 링크 처리를 구현합니다:

```javascript
element.addEventListener('beforeinput', (e) => {
  if (e.inputType === 'formatCreateLink') {
    e.preventDefault();
    const selection = window.getSelection();
    if (selection.rangeCount === 0) return;
    
    const range = selection.getRangeAt(0);
    const url = prompt('URL 입력:');
    
    if (url) {
      // 중첩된 링크를 피하면서 링크 생성
      createLinkSafely(range, url);
    }
  }
});

function createLinkSafely(range, url) {
  // 선택이 이미 링크 내부에 있는지 확인
  const existingLink = range.commonAncestorContainer.closest('a');
  if (existingLink) {
    // 먼저 기존 링크 제거
    const parent = existingLink.parentNode;
    while (existingLink.firstChild) {
      parent.insertBefore(existingLink.firstChild, existingLink);
    }
    parent.removeChild(existingLink);
  }
  
  // 새 링크 생성
  const link = document.createElement('a');
  link.href = url;
  link.textContent = range.toString();
  
  range.deleteContents();
  range.insertNode(link);
}
```
