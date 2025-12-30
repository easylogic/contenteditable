---
id: scenario-auto-scroll-on-typing
title: 입력 중 자동 스크롤 동작이 브라우저마다 다름
description: "contenteditable 요소의 가장자리 근처에서 입력할 때 브라우저가 커서를 보이게 유지하기 위해 자동으로 스크롤합니다. 그러나 스크롤 동작, 타이밍 및 부드러움이 브라우저마다 다르며, 이것은 불쾌한 사용자 경험을 일으킬 수 있습니다."
category: performance
tags:
  - scroll
  - cursor
  - viewport
  - typing
status: draft
---

contenteditable 요소의 가장자리 근처에서 입력할 때 브라우저가 커서를 보이게 유지하기 위해 자동으로 스크롤합니다. 그러나 스크롤 동작, 타이밍 및 부드러움이 브라우저마다 다르며, 이것은 불쾌한 사용자 경험을 일으킬 수 있습니다.

## 관찰된 동작

### 시나리오 1: 하단 가장자리에서 입력
- **Chrome/Edge**: 커서를 보이게 유지하기 위해 부드럽게 스크롤
- **Firefox**: 더 급격하게 스크롤할 수 있음
- **Safari**: 스크롤 동작이 다를 수 있음

### 시나리오 2: 상단 가장자리에서 입력
- **Chrome/Edge**: 커서를 보여주기 위해 위로 스크롤
- **Firefox**: 유사한 동작이지만 타이밍이 다를 수 있음
- **Safari**: 스크롤 타이밍과 부드러움이 다양함

### 시나리오 3: 빠른 입력
- **Chrome/Edge**: 여러 번 스크롤하거나 지연될 수 있음
- **Firefox**: 유사한 스크롤 지연 문제
- **Safari**: 스크롤 성능이 다를 수 있음

### 시나리오 4: 스크롤 위치 복원
- **Chrome/Edge**: 작업 후 스크롤 위치를 복원할 수 있음
- **Firefox**: 유사한 동작
- **Safari**: 스크롤 복원이 일관되지 않을 수 있음

## 영향

- 불쾌한 스크롤 경험
- 빠른 입력 중 성능 문제
- 커서가 보이지 않을 수 있음
- 일관되지 않은 사용자 경험

## 브라우저 비교

- **Chrome/Edge**: 일반적으로 더 부드러운 스크롤
- **Firefox**: 더 급격하게 스크롤할 수 있음
- **Safari**: 스크롤 동작이 가장 일관되지 않음

## 해결 방법

사용자 정의 스크롤 관리 구현:

```javascript
function scrollIntoViewIfNeeded(element, range) {
  const rect = range.getBoundingClientRect();
  const containerRect = element.getBoundingClientRect();
  
  const scrollMargin = 50; // 픽셀
  
  // 커서가 상단 가장자리 근처에 있는지 확인
  if (rect.top < containerRect.top + scrollMargin) {
    element.scrollTop -= (containerRect.top + scrollMargin - rect.top);
  }
  
  // 커서가 하단 가장자리 근처에 있는지 확인
  if (rect.bottom > containerRect.bottom - scrollMargin) {
    element.scrollTop += (rect.bottom - containerRect.bottom + scrollMargin);
  }
  
  // 커서가 왼쪽 가장자리 근처에 있는지 확인
  if (rect.left < containerRect.left + scrollMargin) {
    element.scrollLeft -= (containerRect.left + scrollMargin - rect.left);
  }
  
  // 커서가 오른쪽 가장자리 근처에 있는지 확인
  if (rect.right > containerRect.right - scrollMargin) {
    element.scrollLeft += (rect.right - containerRect.right + scrollMargin);
  }
}

element.addEventListener('input', () => {
  const selection = window.getSelection();
  if (selection.rangeCount > 0) {
    const range = selection.getRangeAt(0);
    // 부드러운 스크롤을 위해 requestAnimationFrame 사용
    requestAnimationFrame(() => {
      scrollIntoViewIfNeeded(element, range);
    });
  }
});
```
