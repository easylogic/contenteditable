---
id: scenario-empty-element-cleanup
title: 편집 중 DOM에 빈 요소가 누적됨
description: "편집 작업 중 빈 요소(빈 단락, div, 콘텐츠가 없는 span)가 DOM에 누적됩니다. 이러한 요소는 레이아웃 문제를 일으킬 수 있고, HTML을 비대하게 만들며, 예상치 못한 동작을 만들 수 있습니다. 브라우저가 빈 요소 정리를 일관되게 처리하지 않습니다."
category: formatting
tags:
  - empty
  - cleanup
  - dom
  - structure
status: draft
locale: ko
---

편집 작업 중 빈 요소(빈 단락, div, 콘텐츠가 없는 span)가 DOM에 누적됩니다. 이러한 요소는 레이아웃 문제를 일으킬 수 있고, HTML을 비대하게 만들며, 예상치 못한 동작을 만들 수 있습니다. 브라우저가 빈 요소 정리를 일관되게 처리하지 않습니다.

## 관찰된 동작

### 시나리오 1: 삭제 후 빈 단락
- **Chrome/Edge**: 빈 `<p>` 또는 `<div>` 요소를 남길 수 있음
- **Firefox**: 유사한 동작
- **Safari**: 다른 빈 구조를 만들 수 있음

### 시나리오 2: 서식 제거 후 빈 span
- **Chrome/Edge**: style 속성이 있는 빈 `<span>` 요소가 남을 수 있음
- **Firefox**: 유사한 문제
- **Safari**: 빈 span 처리가 다양함

### 시나리오 3: 중첩된 빈 요소
- **Chrome/Edge**: 중첩된 빈 구조를 만들 수 있음
- **Firefox**: 유사한 동작
- **Safari**: 중첩된 빈 요소가 가장 흔함

### 시나리오 4: 빈 목록 항목
- **Chrome/Edge**: 빈 `<li>` 요소가 남을 수 있음
- **Firefox**: 유사한 동작
- **Safari**: 빈 목록 처리가 일관되지 않음

## 영향

- 비대한 HTML
- 빈 요소로 인한 레이아웃 문제
- 예상치 못한 간격 및 동작
- 정리 로직 필요

## 브라우저 비교

- **Chrome/Edge**: 일반적으로 정리에 더 좋지만 여전히 빈 요소를 남김
- **Firefox**: 빈 요소를 남길 가능성이 더 높음
- **Safari**: 빈 요소를 누적할 가능성이 가장 높음

## 해결 방법

정리 로직 구현:

```javascript
function cleanupEmptyElements(element) {
  // 빈 span 제거 (의미 있는 속성이 있는 것 제외)
  const spans = element.querySelectorAll('span');
  spans.forEach(span => {
    const hasContent = span.textContent.trim() || span.querySelector('img, br');
    const hasOnlyWhitespace = span.textContent.trim() === '' && !span.querySelector('img, br');
    
    if (hasOnlyWhitespace && !span.hasAttribute('data-keep')) {
      // 자식을 부모로 이동
      const parent = span.parentNode;
      while (span.firstChild) {
        parent.insertBefore(span.firstChild, span);
      }
      span.remove();
    }
  });
  
  // 빈 단락 및 div 제거 (하나 이상은 유지)
  const blocks = element.querySelectorAll('p, div');
  let hasContentBlock = false;
  
  blocks.forEach(block => {
    const hasContent = block.textContent.trim() || block.querySelector('img, br, ul, ol');
    if (hasContent) {
      hasContentBlock = true;
    }
  });
  
  blocks.forEach(block => {
    const hasContent = block.textContent.trim() || block.querySelector('img, br, ul, ol');
    if (!hasContent && hasContentBlock) {
      // 빈 블록 제거, 하지만 유일한 경우 구조 유지
      const parent = block.parentNode;
      while (block.firstChild) {
        parent.insertBefore(block.firstChild, block);
      }
      block.remove();
    } else if (!hasContent && !hasContentBlock) {
      // 최소한 하나의 빈 블록을 <br>과 함께 유지
      if (!block.querySelector('br')) {
        block.appendChild(document.createElement('br'));
      }
    }
  });
  
  // 빈 목록 항목 제거
  const listItems = element.querySelectorAll('li');
  listItems.forEach(li => {
    if (!li.textContent.trim() && li.children.length === 0) {
      const list = li.parentElement;
      li.remove();
      
      // 빈 경우 목록 제거
      if (list.children.length === 0) {
        list.remove();
      }
    }
  });
}

// 입력 시 정리
element.addEventListener('input', () => {
  requestAnimationFrame(() => {
    cleanupEmptyElements(element);
  });
});
```
