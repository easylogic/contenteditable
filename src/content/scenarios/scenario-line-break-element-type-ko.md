---
id: scenario-line-break-element-type
title: 줄바꿈 요소 유형이 브라우저마다 다름
description: "contenteditable 요소에서 줄바꿈을 생성할 때 브라우저는 다른 HTML 요소를 사용합니다: <br>, <p>, 또는 <div>. 이 불일치는 DOM 구조를 예측하고 정규화하기 어렵게 만들며, 특히 리치 텍스트 에디터를 작업할 때 그렇습니다."
category: formatting
tags:
  - line-break
  - br
  - paragraph
  - div
  - dom-structure
status: draft
locale: ko
---

contenteditable 요소에서 줄바꿈을 생성할 때 브라우저는 다른 HTML 요소를 사용합니다: `<br>`, `<p>`, 또는 `<div>`. 이 불일치는 DOM 구조를 예측하고 정규화하기 어렵게 만들며, 특히 리치 텍스트 에디터를 작업할 때 그렇습니다.

## 관찰된 동작

### 시나리오 1: Enter를 누르면 생성됨
- **Chrome/Edge**: 기본적으로 `<div>` 요소를 생성합니다
- **Firefox**: 기본적으로 `<p>` 요소를 생성합니다
- **Safari**: 컨텍스트에 따라 `<div>`, `<p>`, 또는 `<br>`을 생성할 수 있습니다

### 시나리오 2: 빈 줄 생성
- **Chrome/Edge**: 빈 `<div><br></div>` 구조를 생성합니다
- **Firefox**: 빈 `<p><br></p>` 또는 단순히 `<p></p>`를 생성합니다
- **Safari**: 다른 구조를 생성할 수 있습니다

### 시나리오 3: 정규화
- **Chrome/Edge**: `<div>`를 `<p>`로 변환하는 정규화가 필요합니다
- **Firefox**: 일관된 구조를 보장하기 위해 정규화가 필요할 수 있습니다
- **Safari**: 가장 많은 정규화 작업이 필요합니다

### 시나리오 4: CSS 스타일링 영향
- **Chrome/Edge**: `<div>` 요소는 `<p>`보다 다른 기본 여백을 가질 수 있습니다
- **Firefox**: `<p>` 요소는 기본 여백을 가집니다
- **Safari**: 요소 유형에 따라 스타일링이 다릅니다

## 영향

- 브라우저 간 일관되지 않은 DOM 구조
- 정규화 로직 필요
- CSS 스타일링 차이
- 일관된 외관 유지의 어려움

## 브라우저 비교

- **Chrome/Edge**: 기본적으로 `<div>`를 사용합니다
- **Firefox**: 기본적으로 `<p>`를 사용합니다
- **Safari**: 가장 일관되지 않습니다

## 해결 방법

DOM 구조를 정규화합니다:

```javascript
function normalizeLineBreaks(element) {
  // 줄바꿈에 사용된 모든 <div> 요소를 <p>로 변환
  const divs = element.querySelectorAll('div');
  divs.forEach(div => {
    // div가 단락으로 사용되는지 확인 (컨테이너가 아님)
    const hasBlockChildren = Array.from(div.children).some(
      child => ['DIV', 'P', 'UL', 'OL', 'BLOCKQUOTE'].includes(child.tagName)
    );
    
    if (!hasBlockChildren) {
      const p = document.createElement('p');
      while (div.firstChild) {
        p.appendChild(div.firstChild);
      }
      div.parentNode.replaceChild(p, div);
    }
  });
  
  // 적절한 표시를 위해 빈 단락에 <br> 보장
  const paragraphs = element.querySelectorAll('p');
  paragraphs.forEach(p => {
    if (!p.textContent.trim() && !p.querySelector('br')) {
      p.appendChild(document.createElement('br'));
    }
  });
}

// 입력 후 정규화
element.addEventListener('input', () => {
  normalizeLineBreaks(element);
});
```
