---
id: scenario-nested-formatting
title: 중첩된 포맷팅 요소가 복잡한 DOM 구조를 생성함
description: "여러 포맷팅 작업(굵게, 기울임꼴, 밑줄 등)을 적용하면 복잡하고 관리하기 어려운 중첩된 HTML 요소가 생성됩니다. 브라우저는 중첩된 포맷팅을 다르게 처리하며, 결과 DOM 구조가 일관되지 않을 수 있습니다."
category: formatting
tags:
  - formatting
  - nested
  - bold
  - italic
  - structure
status: draft
locale: ko
---

여러 포맷팅 작업(굵게, 기울임꼴, 밑줄 등)을 적용하면 복잡하고 관리하기 어려운 중첩된 HTML 요소가 생성됩니다. 브라우저는 중첩된 포맷팅을 다르게 처리하며, 결과 DOM 구조가 일관되지 않을 수 있습니다.

## 관찰된 동작

### 시나리오 1: 굵게 다음에 기울임꼴 적용
- **Chrome/Edge**: `<b><i>text</i></b>` 또는 `<i><b>text</b></i>`를 생성할 수 있습니다
- **Firefox**: 유사한 중첩 구조이며, 순서가 다를 수 있습니다
- **Safari**: 중첩 순서가 가장 일관되지 않습니다

### 시나리오 2: 중첩된 포맷팅 제거
- **Chrome/Edge**: 빈 요소나 부분 중첩을 남길 수 있습니다
- **Firefox**: 유사한 문제가 있습니다
- **Safari**: 포맷팅 제거가 구조를 손상시킬 가능성이 가장 높습니다

### 시나리오 3: 겹치는 포맷팅
- **Chrome/Edge**: 복잡한 중첩 구조를 생성할 수 있습니다
- **Firefox**: 유사한 동작입니다
- **Safari**: 가장 복잡한 중첩입니다

### 시나리오 4: 포맷팅 정규화
- **Chrome/Edge**: 자동 정규화가 없습니다
- **Firefox**: 유사하게 정규화가 부족합니다
- **Safari**: 정규화 동작이 다릅니다

## 영향

- 복잡하고 비대한 DOM
- 포맷팅 상태 관리의 어려움
- 일관되지 않은 포맷팅 구조
- 정규화 로직 필요

## 브라우저 비교

- **Chrome/Edge**: 일반적으로 더 예측 가능한 중첩을 생성합니다
- **Firefox**: 유사한 중첩 동작입니다
- **Safari**: 가장 일관되지 않은 중첩입니다

## 해결 방법

포맷팅 구조를 정규화합니다:

```javascript
function normalizeFormatting(element) {
  // 중첩된 포맷팅을 일관된 구조로 정규화
  const formattingTags = ['b', 'strong', 'i', 'em', 'u', 's', 'strike'];
  
  formattingTags.forEach(tag => {
    const elements = element.querySelectorAll(tag);
    elements.forEach(el => {
      // 요소가 공백만 포함하는 경우 제거
      if (!el.textContent.trim()) {
        const parent = el.parentNode;
        while (el.firstChild) {
          parent.insertBefore(el.firstChild, el);
        }
        el.remove();
        return;
      }
      
      // 부모가 동일한 태그를 가진 경우 병합
      if (el.parentElement && el.parentElement.tagName.toLowerCase() === tag) {
        const parent = el.parentElement;
        while (el.firstChild) {
          parent.insertBefore(el.firstChild, el);
        }
        el.remove();
      }
    });
  });
  
  // 일관된 태그 사용 보장 (b vs strong, i vs em)
  element.querySelectorAll('strong').forEach(strong => {
    const b = document.createElement('b');
    while (strong.firstChild) {
      b.appendChild(strong.firstChild);
    }
    strong.parentNode.replaceChild(b, strong);
  });
  
  element.querySelectorAll('em').forEach(em => {
    const i = document.createElement('i');
    while (em.firstChild) {
      i.appendChild(em.firstChild);
    }
    em.parentNode.replaceChild(i, em);
  });
}

element.addEventListener('input', () => {
  requestAnimationFrame(() => {
    normalizeFormatting(element);
  });
});
```
