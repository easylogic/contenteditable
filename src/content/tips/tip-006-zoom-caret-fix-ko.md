---
id: tip-006-zoom-caret-fix-ko
title: 브라우저 확대/축소 시 캐럿 위치 수정하기
description: "브라우저 확대/축소나 CSS transform으로 인한 캐럿 위치 부정확 문제를 해결하는 방법"
category: selection
tags:
  - zoom
  - caret
  - selection
  - positioning
  - transform
difficulty: intermediate
relatedScenarios:
  - scenario-browser-zoom
relatedCases:
  - ce-0563-browser-zoom-caret-positioning
locale: ko
---

## 문제

브라우저가 확대/축소되거나 CSS transform으로 콘텐츠가 스케일링될 때, contenteditable 요소의 캐럿 위치와 텍스트 선택이 부정확해집니다.

## 해결 방법

### 1. display: inline-block 사용

Chrome에서 캐럿 배치에 도움이 됩니다.

```css
[contenteditable="true"] {
  display: inline-block;
}
```

### 2. 비어있을 때 보이는 BR 추가

Firefox에서 캐럿이 보이지 않는 문제를 방지합니다.

```javascript
if (editableElement.innerHTML.trim() === '') {
  editableElement.innerHTML = '<br>';
}
```

### 3. 제로 너비 공백 삽입

`contenteditable="false"` 요소 주변에 제로 너비 공백을 삽입합니다.

```javascript
function insertZWS(element) {
  const zws = document.createTextNode('\u200B');
  element.parentNode.insertBefore(zws, element.nextSibling);
}
```

### 4. CSS transform: scale 피하기

대신 font-size나 레이아웃 조정을 사용합니다.

```css
/* 나쁨 */
.editor {
  transform: scale(1.5);
}

/* 좋음 */
.editor {
  font-size: 150%;
}
```

### 5. window.visualViewport API 사용

커스텀 UI 계산에 사용합니다.

```javascript
function getViewportAdjustedRect(element) {
  const rect = element.getBoundingClientRect();
  const viewport = window.visualViewport;
  return {
    top: rect.top - viewport.offsetTop,
    left: rect.left - viewport.offsetLeft,
    width: rect.width / viewport.scale,
    height: rect.height / viewport.scale
  };
}
```

### 6. 일관된 Line-Height

빈 공간 클릭 문제를 방지합니다.

```css
[contenteditable="true"] {
  line-height: 1.5;
  font-size: 16px;
}
```

## 주의사항

- Firefox에서 CSS transform 사용 시 가장 많이 영향받음
- Chrome v106 이전 버전에서는 비편집 가능한 요소 주변에서 문제 발생
- 모바일 브라우저에서 더 심각할 수 있음

## 관련 자료

- [시나리오: 브라우저 확대/축소](/scenarios/scenario-browser-zoom)
- [케이스: ce-0563](/cases/ce-0563-browser-zoom-caret-positioning)
