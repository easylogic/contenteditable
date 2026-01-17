---
id: scenario-browser-zoom-ko
title: 브라우저 확대/축소로 인한 캐럿 및 선택 위치 문제
description: "브라우저가 확대/축소되거나(CSS transform으로 콘텐츠가 스케일링될 때), contenteditable 요소의 캐럿 위치와 텍스트 선택이 부정확해질 수 있습니다. 특정 위치를 클릭해도 캐럿이 다른 곳에 위치하고, 선택 하이라이트가 시각적 선택과 일치하지 않을 수 있습니다."
category: selection
tags:
  - zoom
  - caret
  - selection
  - positioning
  - transform
  - scale
status: draft
locale: ko
---

브라우저가 확대/축소되거나(CSS transform으로 콘텐츠가 스케일링될 때), `contenteditable` 요소의 캐럿 위치와 텍스트 선택이 부정확해질 수 있습니다. 특정 위치를 클릭해도 캐럿이 다른 곳에 위치하고, 선택 하이라이트가 시각적 선택과 일치하지 않을 수 있습니다.

## 관찰된 동작

- **캐럿 위치 불일치**: 위치를 클릭해도 캐럿이 다른 곳에 나타남
- **선택 부정확성**: 선택 하이라이트가 잘못된 텍스트를 강조함
- **캐럿 사라짐**: Firefox와 IE에서 `transform: scale()`을 사용할 때 캐럿이 보이지 않음
- **캐럿 이동**: 확대/축소 상태에서 `contenteditable="false"` 요소 주변을 탐색할 때 캐럿이 잘못 위치함
- **픽셀 반올림 오류**: 서브픽셀 렌더링으로 인한 좌표 계산 문제

## 브라우저 비교

- **Firefox**: CSS transform에서 가장 많이 영향받음
- **Chrome**: 확대/축소 및 비편집 가능한 요소 문제 (v106+에서 수정됨)
- **Safari**: transform과 유사한 문제
- **Edge**: Chrome과 유사
- **IE**: 확대/축소 및 캐럿 위치 지정의 과거 문제

## 영향

- **사용자 경험 저하**: 사용자가 커서를 정확하게 배치하거나 텍스트를 선택할 수 없음
- **접근성 문제**: 확대/축소가 필요한 사용자의 편집을 어렵게 만듦
- **시각적 불일치**: 사용자가 보는 것과 실제 선택이 일치하지 않음
- **편집 좌절**: 연속적인 편집이 어려워짐

## 해결 방법

### 1. display: inline-block 사용

Chrome에서 캐럿 배치에 도움:

```css
[contenteditable="true"] {
  display: inline-block;
}
```

### 2. 비어있을 때 보이는 BR 추가

Firefox 캐럿 보이지 않음 문제 방지:

```javascript
if (editableElement.innerHTML.trim() === '') {
  editableElement.innerHTML = '<br>';
}
```

### 3. 제로 너비 공백 삽입

`contenteditable="false"` 요소 주변에:

```javascript
function insertZWS(element) {
  const zws = document.createTextNode('\u200B');
  element.parentNode.insertBefore(zws, element.nextSibling);
}
```

### 4. CSS transform: scale 피하기

대신 font-size나 레이아웃 조정 사용:

```css
/* 대신: */
.editor {
  transform: scale(1.5);
}

/* 사용: */
.editor {
  font-size: 150%;
}
```

### 5. window.visualViewport API 사용

커스텀 UI 계산용:

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

빈 공간 클릭 문제 방지:

```css
[contenteditable="true"] {
  line-height: 1.5;
  font-size: 16px;
}
```

## 참고 자료

- [Stack Overflow: Firefox에서 축소 시 캐럿 사라짐](https://stackoverflow.com/questions/16031918/why-does-the-contenteditables-caret-disappear-when-it-is-scaled-down-in-firefox) - Transform scale 문제
- [ProseMirror Discuss: Chromium < 106에서 잘못된 커서 위치](https://discuss.prosemirror.net/t/wrong-cursor-position-in-chromium-version-less-than-106-x/4976) - Chrome 확대/축소 수정
- [Stack Overflow: 큰 line-height로 캐럿 위치 지정](https://stackoverflow.com/questions/56837287/positioning-the-caret-in-a-contenteditable-with-large-line-height-in-chrome) - Line-height 문제
- [WebKit Bug 19058: 변환된 contentEditable에서 캐럿 그리기](https://lists.webkit.org/pipermail/webkit-unassigned/2010-November/1082244.html) - WebKit transform 버그
- [Stack Overflow: CSS zoom과 getBoundingClientRect](https://stackoverflow.com/questions/44277435/css-zoom-property-not-working-with-boundingclientrectangle) - 좌표 계산
