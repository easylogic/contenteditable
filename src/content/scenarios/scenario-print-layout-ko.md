---
id: scenario-print-layout-ko
title: contenteditable 요소의 인쇄 레이아웃 문제
description: "contenteditable 요소를 인쇄할 때, 인쇄 스타일이 화면 스타일에 의해 재정의될 수 있고, 페이지 나누기가 적용되지 않을 수 있으며, contenteditable 특정 스타일링(패딩, 마진)이 캐럿 및 포맷팅 문제를 일으킬 수 있습니다. CSS Grid 레이아웃과 transform도 인쇄 렌더링을 방해할 수 있습니다."
category: other
tags:
  - print
  - css
  - media-query
  - layout
  - page-break
status: draft
locale: ko
---

`contenteditable` 요소를 인쇄할 때, 인쇄 스타일이 화면 스타일에 의해 재정의될 수 있고, 페이지 나누기가 적용되지 않을 수 있으며, contenteditable 특정 스타일링(패딩, 마진)이 캐럿 및 포맷팅 문제를 일으킬 수 있습니다.

## 관찰된 동작

- **인쇄 스타일 재정의**: 나중에 로드된 화면 스타일이 인쇄 규칙을 재정의함
- **페이지 나누기 무시**: `page-break-before`, `page-break-after`, `page-break-inside`가 float, transform, CSS Grid와 함께 작동하지 않음
- **패딩/마진 문제**: contenteditable 내부에서 패딩이나 마진을 사용하면 캐럿이 잘못 위치함
- **Grid 레이아웃 버그**: CSS Grid 내부의 contenteditable이 인쇄 시 활성화 및 레이아웃 문제를 일으킴
- **스타일 충돌**: 화면 전용 미디어 쿼리가 인쇄 규칙을 차단함

## 브라우저 비교

- **Chrome**: 전환/애니메이션이 정의된 경우 인쇄 규칙을 무시할 수 있음
- **Firefox**: 인쇄 미디어 쿼리에서 유사한 문제
- **Safari**: 인쇄 렌더링이 미리보기와 다름
- **모든 브라우저**: 특정 레이아웃에서 페이지 나누기 규칙 실패

## 영향

- **인쇄 품질 저하**: 콘텐츠가 예상대로 인쇄되지 않음
- **레이아웃 깨짐**: 페이지 나누기가 잘못된 위치에서 발생
- **스타일 손실**: 인쇄 스타일이 올바르게 적용되지 않음
- **사용자 좌절**: 인쇄된 문서가 화면 모양과 일치하지 않음

## 해결 방법

### 1. 별도의 인쇄 스타일시트 사용

`media="print"`가 있는 외부 스타일시트 사용:

```html
<link rel="stylesheet" href="print.css" media="print">
```

또는 `@media print`로 감싸기:

```css
@media print {
  [contenteditable="true"] {
    /* 인쇄 전용 스타일 */
  }
}
```

### 2. 순서 및 특이성

인쇄 규칙이 화면 규칙 뒤에 나타나도록 보장:

```css
/* 먼저 화면 스타일 */
[contenteditable="true"] {
  padding: 10px;
}

/* 이후 인쇄 스타일, 더 구체적 */
@media print {
  [contenteditable="true"] {
    padding: 0 !important;
  }
}
```

### 3. 화면 전용 한정자 피하기

필요하지 않으면 `screen` 포함하지 않기:

```css
/* 잘못됨 */
@media screen and (min-width: 48em) { }

/* 올바름 */
@media (min-width: 48em) { } /* 둘 다 적용 */
@media print { } /* 인쇄만 */
```

### 4. 페이지 나누기 신중하게 처리

페이지 나누기 규칙 추가:

```css
@media print {
  h1, h2, .section { 
    page-break-before: always; 
  }
  .no-break { 
    page-break-inside: avoid; 
  }
  [contenteditable="true"] {
    page-break-inside: avoid;
  }
}
```

### 5. 패딩 대신 구조 사용

contenteditable 패딩 문제:

```css
/* contenteditable에 패딩 대신 */
.editor-wrapper {
  padding: 10px;
}

[contenteditable="true"] {
  padding: 0;
}
```

또는 의사 요소 사용:

```css
[contenteditable="true"]::before {
  content: '';
  display: block;
  height: 10px;
}
```

### 6. 브라우저 및 인쇄 엔진에서 테스트

다른 렌더링 엔진:

```css
@media print {
  /* 브라우저별 수정 */
  @supports (-webkit-appearance: none) {
    /* Safari 전용 */
  }
}
```

## 참고 자료

- [Stack Overflow: 화면 미디어 쿼리가 인쇄 규칙을 재정의](https://stackoverflow.com/questions/34921096/screen-media-queries-overriding-print-rules-in-chrome) - Chrome 인쇄 문제
- [Matuzo: 인쇄 스타일시트를 완전히 잊었습니다](https://www.matuzo.at/blog/i-totally-forgot-about-print-style-sheets/) - 인쇄 미디어 쿼리 모범 사례
- [Stack Overflow: 인쇄 페이지 나누기 무시됨](https://sharepoint.stackexchange.com/questions/254984/media-print-page-breaks-getting-ignored-when-printing-an-html-form-placed-in-co) - 페이지 나누기 문제
- [Stack Overflow: contenteditable에서 패딩 보존](https://stackoverflow.com/questions/60693504/how-can-i-preserve-padding-as-an-element-boundary-in-a-contenteditable-div) - 패딩 해결 방법
- [Stack Overflow: CSS Grid의 contenteditable](https://stackoverflow.com/questions/72670758/contenteditable-inside-a-css-grid-element-seems-to-be-a-bug-in-google-chrome) - Grid 레이아웃 문제
- [MDN: CSS 미디어 쿼리 - 인쇄](https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Media_queries/Printing) - 인쇄 미디어 쿼리 가이드
