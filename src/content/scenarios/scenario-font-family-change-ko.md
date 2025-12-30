---
id: scenario-font-family-change
title: 글꼴 패밀리 변경이 일관되지 않게 동작함
description: "contenteditable 요소에서 글꼴 패밀리를 변경하는 것이 브라우저마다 일관되지 않게 동작합니다. font-family CSS 속성이 인라인으로, style 속성으로 적용되거나 전혀 적용되지 않을 수 있습니다. 글꼴을 적용한 후 텍스트를 편집할 때도 동작이 다양합니다."
category: formatting
tags:
  - font
  - typography
  - css
  - formatting
status: draft
---

contenteditable 요소에서 글꼴 패밀리를 변경하는 것이 브라우저마다 일관되지 않게 동작합니다. font-family CSS 속성이 인라인으로, style 속성으로 적용되거나 전혀 적용되지 않을 수 있습니다. 글꼴을 적용한 후 텍스트를 편집할 때도 동작이 다양합니다.

## 관찰된 동작

### 시나리오 1: 선택한 텍스트에 글꼴 적용
- **Chrome/Edge**: 인라인 스타일로 font-family 적용, 입력 시 유지될 수 있음
- **Firefox**: 유사한 동작이지만 유지되지 않을 수 있음
- **Safari**: 글꼴을 다르게 적용하거나 유지하지 않을 수 있음

### 시나리오 2: 글꼴 적용 후 입력
- **Chrome/Edge**: 새 텍스트가 글꼴을 상속하거나 기본값 사용
- **Firefox**: 새 텍스트에 대해 글꼴이 유지되지 않을 수 있음
- **Safari**: 동작이 일관되지 않음

### 시나리오 3: 글꼴 서식 제거
- **Chrome/Edge**: 빈 style 속성을 남길 수 있음
- **Firefox**: 유사한 동작
- **Safari**: 다르게 처리할 수 있음

### 시나리오 4: 글꼴 상속
- **Chrome/Edge**: 부모 요소에서 글꼴이 상속될 수 있음
- **Firefox**: 유사한 상속 동작
- **Safari**: 상속이 다르게 작동할 수 있음

## 영향

- 일관되지 않은 글꼴 적용
- 글꼴 서식이 유지되지 않을 수 있음
- DOM에 빈 style 속성 남음
- 일관된 타이포그래피 유지 어려움

## 브라우저 비교

- **Chrome/Edge**: 일반적으로 더 나은 글꼴 처리
- **Firefox**: 글꼴 유지가 덜 안정적일 수 있음
- **Safari**: 가장 일관되지 않은 동작

## 해결 방법

사용자 정의 글꼴 처리 구현:

```javascript
element.addEventListener('beforeinput', (e) => {
  if (e.inputType === 'formatFontName') {
    e.preventDefault();
    const selection = window.getSelection();
    if (selection.rangeCount === 0) return;
    
    const range = selection.getRangeAt(0);
    const fontName = e.data || prompt('Enter font name:');
    
    if (fontName) {
      // 선택에 글꼴 적용
      if (range.collapsed) {
        // 향후 입력을 위한 글꼴 설정
        document.execCommand('fontName', false, fontName);
      } else {
        // 선택한 텍스트에 글꼴 적용
        const span = document.createElement('span');
        span.style.fontFamily = fontName;
        try {
          range.surroundContents(span);
        } catch (e) {
          // surroundContents가 실패하면 추출하고 래핑
          const contents = range.extractContents();
          span.appendChild(contents);
          range.insertNode(span);
        }
      }
    }
  }
});
```
