---
id: scenario-text-color-change
title: 텍스트 색상 변경이 일관되지 않게 동작함
description: "contenteditable 요소에서 텍스트 색상을 변경하는 것은 브라우저마다 일관되지 않게 동작합니다. 색상이 인라인 스타일, font 태그로 적용되거나, 입력 시 유지되지 않을 수 있습니다. 색상 형식(hex, rgb, 명명된 색상) 처리도 다릅니다."
category: formatting
tags:
  - color
  - text
  - css
  - formatting
status: draft
---

contenteditable 요소에서 텍스트 색상을 변경하는 것은 브라우저마다 일관되지 않게 동작합니다. 색상이 인라인 스타일, font 태그로 적용되거나, 입력 시 유지되지 않을 수 있습니다. 색상 형식(hex, rgb, 명명된 색상) 처리도 다릅니다.

## 관찰된 동작

### 시나리오 1: 선택한 텍스트에 색상 적용
- **Chrome/Edge**: 인라인 스타일로 색상을 적용하며, hex 또는 rgb를 사용할 수 있습니다
- **Firefox**: 유사한 동작이지만 형식이 다를 수 있습니다
- **Safari**: 색상을 다르게 적용할 수 있습니다

### 시나리오 2: 색상 적용 후 입력
- **Chrome/Edge**: 새 텍스트가 색상을 상속하거나 기본값을 사용할 수 있습니다
- **Firefox**: 새 텍스트에 색상이 유지되지 않을 수 있습니다
- **Safari**: 동작이 일관되지 않습니다

### 시나리오 3: 색상 형식 변환
- **Chrome/Edge**: hex, rgb, 명명된 색상 간 변환할 수 있습니다
- **Firefox**: 형식을 보존하거나 변환할 수 있습니다
- **Safari**: 형식 처리가 다릅니다

### 시나리오 4: 색상 제거
- **Chrome/Edge**: 빈 style 속성을 남길 수 있습니다
- **Firefox**: 유사한 동작입니다
- **Safari**: 제거를 다르게 처리할 수 있습니다

## 영향

- 일관되지 않은 색상 적용
- 색상 포맷팅이 유지되지 않을 수 있음
- 형식 변환 문제
- DOM에 빈 style 속성

## 브라우저 비교

- **Chrome/Edge**: 일반적으로 더 나은 색상 처리입니다
- **Firefox**: 색상 유지가 덜 신뢰할 수 있습니다
- **Safari**: 가장 일관되지 않은 동작입니다

## 해결 방법

사용자 정의 색상 처리를 구현합니다:

```javascript
element.addEventListener('beforeinput', (e) => {
  if (e.inputType === 'formatForeColor') {
    e.preventDefault();
    const selection = window.getSelection();
    if (selection.rangeCount === 0) return;
    
    const range = selection.getRangeAt(0);
    const color = e.data || prompt('색상 입력 (예: #ff0000, red, rgb(255,0,0)):');
    
    if (color) {
      if (range.collapsed) {
        // 향후 입력을 위한 색상 설정
        const span = document.createElement('span');
        span.style.color = color;
        range.insertNode(span);
        range.setStart(span, 0);
        range.collapse(true);
      } else {
        // 선택한 텍스트에 색상 적용
        const span = document.createElement('span');
        span.style.color = color;
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
