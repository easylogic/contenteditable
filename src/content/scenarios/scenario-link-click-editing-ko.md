---
id: scenario-link-click-editing
title: 링크 클릭이 contenteditable 편집을 간섭함
description: "링크가 contenteditable 요소 내부에 있을 때 링크를 클릭하면 텍스트 편집을 허용하는 대신 이동하거나 예상치 못한 동작이 트리거될 수 있습니다. 동작은 브라우저마다 다르며 링크 텍스트를 편집하거나 삭제할 링크를 선택하기 어렵게 만들 수 있습니다."
category: formatting
tags:
  - link
  - click
  - navigation
  - editing
status: draft
locale: ko
---

링크가 contenteditable 요소 내부에 있을 때 링크를 클릭하면 텍스트 편집을 허용하는 대신 이동하거나 예상치 못한 동작이 트리거될 수 있습니다. 동작은 브라우저마다 다르며 링크 텍스트를 편집하거나 삭제할 링크를 선택하기 어렵게 만들 수 있습니다.

## 관찰된 동작

### 시나리오 1: 링크에 단일 클릭
- **Chrome/Edge**: 링크 URL로 이동하거나 텍스트 선택을 허용할 수 있으며, 동작이 일관되지 않습니다
- **Firefox**: 클릭 시 즉시 이동할 수 있습니다
- **Safari**: 이동하거나 편집을 허용할 수 있으며, 동작이 다릅니다

### 시나리오 2: 링크에 더블 클릭
- **Chrome/Edge**: 일반적으로 편집을 위해 링크 텍스트를 선택합니다
- **Firefox**: 이동하거나 텍스트를 선택할 수 있습니다
- **Safari**: 동작이 일관되지 않습니다

### 시나리오 3: 링크에 우클릭
- **Chrome/Edge**: 링크 옵션이 있는 컨텍스트 메뉴를 표시합니다
- **Firefox**: 컨텍스트 메뉴를 표시합니다
- **Safari**: 컨텍스트 메뉴를 표시하지만 동작이 다를 수 있습니다

### 시나리오 4: 편집을 위해 링크 텍스트 선택
- **Chrome/Edge**: 어려울 수 있으며, 탐색을 트리거할 수 있습니다
- **Firefox**: 선택이 완료되기 전에 이동할 수 있습니다
- **Safari**: 선택이 탐색에 의해 중단될 수 있습니다

## 영향

- 링크 텍스트 편집의 어려움
- 편집을 시도할 때 실수로 탐색
- 에디터에서 링크 작업 시 나쁜 사용자 경험
- 탐색을 방지하기 위한 해결 방법 필요

## 브라우저 비교

- **Chrome/Edge**: 일반적으로 텍스트 선택을 더 잘 허용하지만, 탐색이 여전히 발생할 수 있습니다
- **Firefox**: 클릭 시 더 많이 이동할 가능성이 있습니다
- **Safari**: 동작이 일관되지 않습니다

## 해결 방법

기본 링크 동작을 방지하고 클릭을 수동으로 처리합니다:

```javascript
element.addEventListener('click', (e) => {
  const link = e.target.closest('a');
  if (link && e.target.closest('[contenteditable="true"]')) {
    // 탐색 방지
    e.preventDefault();
    
    // 단일 클릭 시 텍스트 선택 허용
    if (e.detail === 1) {
      // 단일 클릭 - 선택 허용
      const selection = window.getSelection();
      const range = document.createRange();
      range.selectNodeContents(link);
      selection.removeAllRanges();
      selection.addRange(range);
    } else if (e.detail === 2) {
      // 더블 클릭 - 편집 시작
      link.contentEditable = 'true';
      link.focus();
    }
  }
});

// 링크가 포커스될 때 Enter 키로 탐색 방지
element.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' && e.target.tagName === 'A') {
    e.preventDefault();
    // 줄바꿈 삽입 또는 새 단락 생성
    insertLineBreak(e.target);
  }
});
```
