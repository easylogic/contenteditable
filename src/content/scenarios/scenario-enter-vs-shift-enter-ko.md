---
id: scenario-enter-vs-shift-enter
title: Enter vs Shift+Enter 동작이 브라우저마다 다름
description: "contenteditable 요소에서 Enter와 Shift+Enter 키의 동작이 브라우저마다 다릅니다. Enter는 새 단락, 줄바꿈 또는 div를 만들 수 있는 반면 Shift+Enter는 줄바꿈을 만들거나 다르게 동작할 수 있습니다. 결과 DOM 구조도 다양합니다."
category: formatting
tags:
  - enter
  - line-break
  - paragraph
  - newline
status: draft
locale: ko
---

contenteditable 요소에서 Enter와 Shift+Enter 키의 동작이 브라우저마다 다릅니다. Enter는 새 단락, 줄바꿈 또는 div를 만들 수 있는 반면 Shift+Enter는 줄바꿈을 만들거나 다르게 동작할 수 있습니다. 결과 DOM 구조도 다양합니다.

## 관찰된 동작

### 시나리오 1: Enter 누르기
- **Chrome/Edge**: 새로운 `<div>` 또는 `<p>` 요소 생성
- **Firefox**: 새로운 `<p>` 또는 `<br>` 요소 생성
- **Safari**: 컨텍스트에 따라 `<div>`, `<p>` 또는 `<br>` 생성

### 시나리오 2: Shift+Enter 누르기
- **Chrome/Edge**: `<br>` 줄바꿈 생성
- **Firefox**: `<br>` 줄바꿈 생성
- **Safari**: `<br>`을 만들거나 Enter처럼 동작할 수 있음

### 시나리오 3: 다른 컨텍스트에서 Enter
- **Chrome/Edge**: 목록, blockquote 등에서 동작이 다를 수 있음
- **Firefox**: 유사한 컨텍스트 종속 동작
- **Safari**: 컨텍스트 간에 더 일관되지 않음

### 시나리오 4: 빈 단락/div 생성
- **Chrome/Edge**: 정리가 필요한 빈 요소를 만들 수 있음
- **Firefox**: 유사한 동작
- **Safari**: 다른 빈 구조를 만들 수 있음

## 영향

- 일관되지 않은 줄바꿈 동작
- 예상치 못한 DOM 구조 생성
- Enter 키 후 DOM 정규화 필요
- 일관된 편집 동작 구현 어려움

## 브라우저 비교

- **Chrome/Edge**: 일반적으로 Enter에 대해 `<div>`, Shift+Enter에 대해 `<br>` 생성
- **Firefox**: Enter에 대해 `<p>`를 만들 가능성이 더 높음
- **Safari**: 가장 일관되지 않은 동작

## 해결 방법

Enter 키 동작 정규화:

```javascript
element.addEventListener('beforeinput', (e) => {
  if (e.inputType === 'insertParagraph') {
    e.preventDefault();
    
    const selection = window.getSelection();
    if (selection.rangeCount === 0) return;
    
    const range = selection.getRangeAt(0);
    const isShiftEnter = e.getModifierState?.('Shift');
    
    if (isShiftEnter) {
      // 줄바꿈 삽입
      const br = document.createElement('br');
      range.deleteContents();
      range.insertNode(br);
      range.setStartAfter(br);
      range.collapse(true);
    } else {
      // 새 단락 삽입
      const p = document.createElement('p');
      const br = document.createElement('br');
      p.appendChild(br);
      
      range.deleteContents();
      range.insertNode(p);
      range.setStartBefore(br);
      range.collapse(true);
    }
    
    selection.removeAllRanges();
    selection.addRange(range);
  }
});
```
