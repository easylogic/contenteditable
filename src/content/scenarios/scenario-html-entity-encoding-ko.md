---
id: scenario-html-entity-encoding
title: HTML 엔티티 인코딩 및 디코딩이 일관되지 않음
description: "contenteditable 요소의 특수 문자가 브라우저마다 일관되지 않게 HTML 엔티티(&lt;, &gt;, &amp; 등)로 인코딩되거나 실제 문자로 디코딩될 수 있습니다. 이것은 콘텐츠를 복사, 붙여넣기 또는 직렬화할 때 문제를 일으킬 수 있습니다."
category: formatting
tags:
  - html
  - entity
  - encoding
  - special-characters
status: draft
locale: ko
---

contenteditable 요소의 특수 문자가 브라우저마다 일관되지 않게 HTML 엔티티(`&lt;`, `&gt;`, `&amp;` 등)로 인코딩되거나 실제 문자로 디코딩될 수 있습니다. 이것은 콘텐츠를 복사, 붙여넣기 또는 직렬화할 때 문제를 일으킬 수 있습니다.

## 관찰된 동작

### 시나리오 1: 특수 문자 입력
- **Chrome/Edge**: 문자가 엔티티 또는 실제 문자로 저장될 수 있음
- **Firefox**: 유사한 일관되지 않은 동작
- **Safari**: 다르게 인코딩/디코딩할 수 있음

### 시나리오 2: 엔티티가 있는 콘텐츠 복사
- **Chrome/Edge**: 엔티티 또는 디코딩된 문자로 복사할 수 있음
- **Firefox**: 유사한 동작
- **Safari**: 클립보드의 인코딩이 다양함

### 시나리오 3: 엔티티가 있는 콘텐츠 붙여넣기
- **Chrome/Edge**: 엔티티를 디코딩하거나 보존할 수 있음
- **Firefox**: 유사한 동작
- **Safari**: 엔티티 처리가 일관되지 않음

### 시나리오 4: 콘텐츠 직렬화(innerHTML)
- **Chrome/Edge**: 엔티티를 인코딩하거나 디코딩할 수 있음
- **Firefox**: 유사한 동작
- **Safari**: 인코딩 동작이 다양함

## 영향

- 일관되지 않은 문자 표현
- 특수 문자 복사/붙여넣기 문제
- 콘텐츠 직렬화 문제
- 정확한 문자 표현 유지 어려움

## 브라우저 비교

- **Chrome/Edge**: 일반적으로 더 일관된 인코딩
- **Firefox**: 다르게 인코딩/디코딩할 수 있음
- **Safari**: 가장 일관되지 않은 동작

## 해결 방법

엔티티 인코딩 정규화:

```javascript
function normalizeEntities(element) {
  const walker = document.createTreeWalker(
    element,
    NodeFilter.SHOW_TEXT,
    null
  );
  
  let node;
  while (node = walker.nextNode()) {
    // 일반 엔티티를 실제 문자로 디코딩
    node.textContent = node.textContent
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&amp;/g, '&')
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'");
  }
}

// 입력 시 정규화
element.addEventListener('input', () => {
  normalizeEntities(element);
});

// 붙여넣기 처리
element.addEventListener('paste', (e) => {
  e.preventDefault();
  const text = e.clipboardData.getData('text/plain');
  const html = e.clipboardData.getData('text/html');
  
  const selection = window.getSelection();
  if (selection.rangeCount > 0) {
    const range = selection.getRangeAt(0);
    range.deleteContents();
    
    if (html) {
      // HTML의 엔티티 디코딩
      const temp = document.createElement('div');
      temp.innerHTML = html;
      normalizeEntities(temp);
      range.insertNode(document.createRange().createContextualFragment(temp.innerHTML));
    } else {
      range.insertNode(document.createTextNode(text));
    }
  }
});
```
