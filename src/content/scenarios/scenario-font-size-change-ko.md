---
id: scenario-font-size-change
title: 글꼴 크기 변경이 일관되지 않게 동작함
description: "contenteditable 요소에서 글꼴 크기를 변경하는 것이 브라우저마다 일관되지 않게 동작합니다. 글꼴 크기가 인라인 스타일로, font 태그로 적용되거나 새 텍스트를 입력할 때 유지되지 않을 수 있습니다. 단위(px, em, rem) 처리도 다양합니다."
category: formatting
tags:
  - font
  - size
  - typography
  - css
status: draft
locale: ko
---

contenteditable 요소에서 글꼴 크기를 변경하는 것이 브라우저마다 일관되지 않게 동작합니다. 글꼴 크기가 인라인 스타일로, font 태그로 적용되거나 새 텍스트를 입력할 때 유지되지 않을 수 있습니다. 단위(px, em, rem) 처리도 다양합니다.

## 관찰된 동작

### 시나리오 1: 선택한 텍스트에 글꼴 크기 적용
- **Chrome/Edge**: 인라인 스타일로 font-size 적용, px 단위 사용할 수 있음
- **Firefox**: 유사한 동작이지만 단위 처리가 다를 수 있음
- **Safari**: 크기를 다르게 적용하거나 다른 단위 사용할 수 있음

### 시나리오 2: 글꼴 크기 적용 후 입력
- **Chrome/Edge**: 새 텍스트가 크기를 상속하거나 기본값 사용
- **Firefox**: 새 텍스트에 대해 크기가 유지되지 않을 수 있음
- **Safari**: 동작이 일관되지 않음

### 시나리오 3: 상대 vs 절대 단위
- **Chrome/Edge**: 상대 단위(em, rem)를 절대(px)로 변환할 수 있음
- **Firefox**: 단위를 보존하거나 변환할 수 있음
- **Safari**: 단위 처리가 다양함

### 시나리오 4: 글꼴 크기 제거
- **Chrome/Edge**: 빈 style 속성을 남길 수 있음
- **Firefox**: 유사한 동작
- **Safari**: 제거를 다르게 처리할 수 있음

## 영향

- 일관되지 않은 글꼴 크기 적용
- 크기 서식이 유지되지 않을 수 있음
- 단위 변환 문제
- DOM에 빈 style 속성

## 브라우저 비교

- **Chrome/Edge**: 일반적으로 더 나은 크기 처리
- **Firefox**: 크기 유지가 덜 안정적일 수 있음
- **Safari**: 가장 일관되지 않은 동작

## 해결 방법

사용자 정의 글꼴 크기 처리 구현:

```javascript
element.addEventListener('beforeinput', (e) => {
  if (e.inputType === 'formatFontSize') {
    e.preventDefault();
    const selection = window.getSelection();
    if (selection.rangeCount === 0) return;
    
    const range = selection.getRangeAt(0);
    const fontSize = e.data || prompt('Enter font size (e.g., 16px, 1.2em):');
    
    if (fontSize) {
      if (range.collapsed) {
        // 향후 입력을 위한 크기 설정
        const span = document.createElement('span');
        span.style.fontSize = fontSize;
        range.insertNode(span);
        range.setStart(span, 0);
        range.collapse(true);
      } else {
        // 선택한 텍스트에 크기 적용
        const span = document.createElement('span');
        span.style.fontSize = fontSize;
        try {
          range.surroundContents(span);
        } catch (e) {
          const contents = range.extractContents();
          span.appendChild(contents);
          range.insertNode(span);
        }
      }
      
      selection.removeAllRanges();
      selection.addRange(range);
    }
  }
});
```
