---
id: scenario-background-color-change-ko
title: 배경색 변경이 일관되지 않게 동작함
description: "contenteditable 요소에서 배경색(하이라이트) 변경이 브라우저마다 일관되지 않게 동작합니다. 배경색이 인라인 스타일로 적용될 수 있고, 입력 시 유지되지 않을 수 있으며, 텍스트 선택을 방해할 수 있습니다. 동작이 텍스트 색상 변경과 다릅니다."
category: formatting
tags:
  - color
  - background
  - highlight
  - css
status: draft
locale: ko
---

contenteditable 요소에서 배경색(하이라이트) 변경이 브라우저마다 일관되지 않게 동작합니다. 배경색이 인라인 스타일로 적용될 수 있고, 입력 시 유지되지 않을 수 있으며, 텍스트 선택을 방해할 수 있습니다. 동작이 텍스트 색상 변경과 다릅니다.

## 관찰된 동작

### 시나리오 1: 선택한 텍스트에 배경색 적용
- **Chrome/Edge**: 인라인 스타일로 background-color 적용
- **Firefox**: 유사한 동작이지만 유지되지 않을 수 있음
- **Safari**: 배경을 다르게 적용할 수 있음

### 시나리오 2: 배경색 적용 후 입력
- **Chrome/Edge**: 새 텍스트가 배경을 상속하거나 기본값 사용
- **Firefox**: 새 텍스트에 대해 배경이 유지되지 않을 수 있음
- **Safari**: 동작이 일관되지 않음

### 시나리오 3: 배경색과 텍스트 선택
- **Chrome/Edge**: 배경이 선택 가시성을 방해할 수 있음
- **Firefox**: 유사한 문제
- **Safari**: 선택 동작이 다를 수 있음

### 시나리오 4: 배경색 제거
- **Chrome/Edge**: 빈 style 속성을 남길 수 있음
- **Firefox**: 유사한 동작
- **Safari**: 제거를 다르게 처리할 수 있음

## 영향

- 일관되지 않은 배경색 적용
- 배경 서식이 유지되지 않을 수 있음
- 선택 가시성 문제
- DOM에 빈 style 속성

## 브라우저 비교

- **Chrome/Edge**: 일반적으로 더 나은 배경 처리
- **Firefox**: 배경 유지가 덜 안정적일 수 있음
- **Safari**: 가장 일관되지 않은 동작

## 해결 방법

사용자 정의 배경색 처리 구현:

```javascript
element.addEventListener('beforeinput', (e) => {
  if (e.inputType === 'formatBackColor') {
    e.preventDefault();
    const selection = window.getSelection();
    if (selection.rangeCount === 0) return;
    
    const range = selection.getRangeAt(0);
    const color = e.data || prompt('Enter background color:');
    
    if (color) {
      if (range.collapsed) {
        // 향후 입력을 위한 배경 설정
        const span = document.createElement('span');
        span.style.backgroundColor = color;
        range.insertNode(span);
        range.setStart(span, 0);
        range.collapse(true);
      } else {
        // 선택한 텍스트에 배경 적용
        const span = document.createElement('span');
        span.style.backgroundColor = color;
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

## 참고 자료

- [MDN: Document.execCommand](https://developer.mozilla.org/en-US/docs/Web/API/Document/execCommand) - execCommand API documentation
- [MDN: execCommand reference](https://devdoc.net/web/developer.mozilla.org/en-US/docs/Web/API/Document/execCommand.html) - backColor and hiliteColor
- [Stack Overflow: execCommand backColor CSS variable](https://stackoverflow.com/questions/53383478/why-document-execcommandbackcolor-does-not-work-with-css-variable-while-fo) - CSS variable limitations
