---
id: scenario-list-formatting-persistence
title: 리스트 항목 편집 시 리스트 포맷팅이 손실됨
description: "리스트 항목 내에서 텍스트를 편집할 때 굵게, 기울임꼴 또는 링크와 같은 포맷팅이 손실되거나 예상치 못하게 동작할 수 있습니다. 특정 작업(예: 콘텐츠 붙여넣기 또는 포맷팅 적용)을 수행하면 리스트 구조 자체도 손실될 수 있습니다."
category: formatting
tags:
  - list
  - formatting
  - paste
  - bold
  - italic
status: draft
locale: ko
---

리스트 항목 내에서 텍스트를 편집할 때 굵게, 기울임꼴 또는 링크와 같은 포맷팅이 손실되거나 예상치 못하게 동작할 수 있습니다. 특정 작업(예: 콘텐츠 붙여넣기 또는 포맷팅 적용)을 수행하면 리스트 구조 자체도 손실될 수 있습니다.

## 관찰된 동작

### 시나리오 1: 리스트 항목의 텍스트에 굵게 포맷팅 적용
- **Chrome/Edge**: 포맷팅이 적용되지만 새 리스트 항목을 만들기 위해 Enter를 누르면 손실될 수 있습니다
- **Firefox**: 리스트 항목을 편집할 때 포맷팅이 유지되지 않을 수 있습니다
- **Safari**: 포맷팅이 예상치 못하게 손실될 수 있습니다

### 시나리오 2: 리스트 항목에 포맷팅된 콘텐츠 붙여넣기
- **Chrome/Edge**: 포맷팅을 보존할 수 있지만 리스트 구조를 손실할 수 있습니다
- **Firefox**: 리스트 항목을 단락으로 변환할 수 있습니다
- **Safari**: 예상치 못한 중첩 구조를 생성할 수 있습니다

### 시나리오 3: 리스트를 다른 리스트에 붙여넣기
- **Chrome/Edge**: 중첩된 리스트를 생성하거나 구조를 평탄화할 수 있습니다
- **Firefox**: 중첩된 리스트 구조를 손실할 수 있습니다
- **Safari**: 잘못된 HTML을 생성할 수 있습니다

### 시나리오 4: 여러 리스트 항목에 걸쳐 포맷팅 적용
- **Chrome/Edge**: 리스트 구조를 손상시킬 수 있습니다
- **Firefox**: 리스트 항목을 단락으로 변환할 수 있습니다
- **Safari**: 동작이 일관되지 않습니다

## 영향

- 리스트 편집 시 포맷팅 손실
- 예상치 못한 리스트 구조 변경
- 일관된 리스트 외관 유지의 어려움
- 포맷팅이 손실될 때 사용자 좌절

## 브라우저 비교

- **Chrome/Edge**: 일반적으로 포맷팅을 더 잘 보존하지만 리스트 구조가 영향을 받을 수 있습니다
- **Firefox**: 포맷팅이나 리스트 구조를 손실할 가능성이 더 높습니다
- **Safari**: 가장 일관되지 않은 동작입니다

## 해결 방법

포맷팅 작업을 가로채고 리스트 구조가 보존되도록 합니다:

```javascript
element.addEventListener('beforeinput', (e) => {
  if (e.inputType === 'formatBold' || e.inputType === 'formatItalic') {
    const selection = window.getSelection();
    if (selection.rangeCount === 0) return;
    
    const range = selection.getRangeAt(0);
    const listItems = Array.from(range.commonAncestorContainer.closest('ul, ol')?.querySelectorAll('li') || [])
      .filter(li => range.intersectsNode(li));
    
    if (listItems.length > 0) {
      e.preventDefault();
      // 리스트 구조를 보존하면서 포맷팅 적용
      applyFormattingToSelection(e.inputType, range, listItems);
    }
  }
});

element.addEventListener('paste', (e) => {
  const selection = window.getSelection();
  if (selection.rangeCount === 0) return;
  
  const range = selection.getRangeAt(0);
  const listItem = range.startContainer.closest('li');
  
  if (listItem) {
    e.preventDefault();
    // 리스트 구조를 보존하면서 리스트 항목에 붙여넣기 처리
    handlePasteInListItem(e.clipboardData, range, listItem);
  }
});
```
