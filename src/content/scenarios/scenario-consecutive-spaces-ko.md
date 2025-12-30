---
id: scenario-consecutive-spaces
title: contenteditable에서 연속된 공백이 축소됨
description: "contenteditable 요소에서 여러 개의 연속된 공백을 입력할 때 브라우저가 기본적으로 하나의 공백으로 축소합니다(HTML 공백 규칙을 따름). 이 동작은 네이티브 텍스트 입력과 다르며 여러 공백을 보존해야 하는 사용자에게 예상치 못할 수 있습니다."
category: formatting
tags:
  - whitespace
  - space
  - html
  - formatting
status: draft
---

contenteditable 요소에서 여러 개의 연속된 공백을 입력할 때 브라우저가 기본적으로 하나의 공백으로 축소합니다(HTML 공백 규칙을 따름). 이 동작은 네이티브 텍스트 입력과 다르며 여러 공백을 보존해야 하는 사용자에게 예상치 못할 수 있습니다.

## 관찰된 동작

### 시나리오 1: 여러 공백 입력
- **Chrome/Edge**: DOM에서 공백이 하나의 공백으로 축소됨
- **Firefox**: 공백이 하나의 공백으로 축소됨
- **Safari**: 공백이 하나의 공백으로 축소됨

### 시나리오 2: 여러 공백이 있는 텍스트 붙여넣기
- **Chrome/Edge**: HTML로 붙여넣으면 여러 공백이 보존될 수 있지만 일반 텍스트로 붙여넣으면 축소됨
- **Firefox**: Chrome과 유사한 동작
- **Safari**: 붙여넣기 형식에 따라 보존하거나 축소할 수 있음

### 시나리오 3: 줄바꿈 없는 공백 사용
- **Chrome/Edge**: `&nbsp;` 엔티티는 간격을 보존하지만 일반 공백으로 변환될 수 있음
- **Firefox**: 유사한 동작
- **Safari**: `&nbsp;`를 다르게 처리할 수 있음

## 영향

- 사용자가 여러 공백을 직접 입력할 수 없음
- 간격을 보존하기 위해 해결 방법(줄바꿈 없는 공백, CSS) 사용 필요
- 네이티브 텍스트 입력과 비교하여 일관되지 않은 동작
- 여러 공백이 필요한 서식 유지 어려움

## 브라우저 비교

- **모든 브라우저**: 기본적으로 연속된 공백을 축소함 (HTML 표준 동작)
- **해결 방법 필요**: `white-space: pre-wrap` CSS 또는 `&nbsp;` 엔티티 사용

## 해결 방법

공백을 보존하기 위해 CSS 사용:

```css
[contenteditable="true"] {
  white-space: pre-wrap; /* 공백과 줄바꿈 보존 */
}
```

또는 공백 삽입을 수동으로 처리:

```javascript
element.addEventListener('beforeinput', (e) => {
  if (e.inputType === 'insertText' && e.data === ' ') {
    const selection = window.getSelection();
    if (selection.rangeCount === 0) return;
    
    const range = selection.getRangeAt(0);
    const previousChar = range.startContainer.textContent?.[range.startOffset - 1];
    
    // 이전 문자도 공백이면 줄바꿈 없는 공백 삽입
    if (previousChar === ' ') {
      e.preventDefault();
      const nbsp = document.createTextNode('\u00A0'); // 줄바꿈 없는 공백
      range.insertNode(nbsp);
      range.setStartAfter(nbsp);
      range.collapse(true);
      selection.removeAllRanges();
      selection.addRange(range);
    }
  }
});
```
