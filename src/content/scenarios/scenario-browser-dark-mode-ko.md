---
id: scenario-browser-dark-mode-ko
title: 다크 모드로 인한 캐럿 가시성 및 스타일 문제
description: "브라우저 다크 모드가 활성화되면 contenteditable 요소에서 캐럿이 보이지 않거나 잘 보이지 않음, 인라인 스타일 주입 충돌, 배경색 문제, 폼 컨트롤 스타일 문제가 발생할 수 있습니다. 이러한 문제는 color-scheme 선언 누락과 브라우저가 주입한 스타일과 커스텀 CSS 간의 충돌로 인해 발생합니다."
category: other
tags:
  - dark-mode
  - caret
  - styling
  - color-scheme
  - css
status: draft
locale: ko
---

브라우저 다크 모드가 활성화되면 `contenteditable` 요소에서 캐럿이 보이지 않거나 잘 보이지 않음, 인라인 스타일 주입 충돌, 배경색 문제, 폼 컨트롤 스타일 문제가 발생할 수 있습니다.

## 관찰된 동작

- **캐럿 보이지 않음**: 캐럿이 `currentColor` 또는 텍스트 색상을 사용하여 어두운 배경에서 보이지 않음
- **인라인 스타일 주입**: 브라우저가 편집 중 인라인 스타일을 삽입하여 다크 모드 CSS를 재정의함
- **배경색 충돌**: 커스텀 배경이 있는 자식 요소가 캐럿 렌더링을 방해함
- **폼 컨트롤 스타일**: 입력 플레이스홀더, 스크롤바, 테두리가 다크 모드로 올바르게 전환되지 않음
- **링크 색상 대비**: 기본 링크 색상이 어두운 배경에서 대비가 낮음

## 브라우저 비교

- **Safari**: HTML 전용 다크 모드에서 링크 색상 대비 문제
- **Chrome/Edge**: 자동 다크 모드 플래그가 색상을 전역적으로 반전시켜 콘텐츠를 왜곡시킬 수 있음
- **Firefox**: 강제 다크 모드에서 유사한 문제
- **모든 브라우저**: `color-scheme` 선언 누락으로 인한 문제

## 영향

- **사용자 경험 저하**: 사용자가 타이핑하는 위치를 볼 수 없음
- **접근성 문제**: 낮은 대비로 접근성 가이드라인을 충족하지 못함
- **시각적 불일치**: 스타일 충돌로 인한 불쾌한 외관
- **편집 어려움**: 다크 모드에서 편집을 좌절스럽게 만듦

## 해결 방법

### 1. color-scheme 선언 사용

밝은 모드와 어두운 모드 모두 지원 선언:

```css
:root {
  color-scheme: light dark;
}
```

### 2. 명시적 캐럿 스타일링

캐럿이 보이도록 보장:

```css
[contenteditable="true"] {
  caret-color: var(--caret-color, white);
}

@media (prefers-color-scheme: dark) {
  [contenteditable="true"] {
    caret-color: #ffffff;
  }
}
```

### 3. 자식 요소 처리

인라인 span에서 `position: relative` 피하기:

```css
[contenteditable="true"] span {
  position: static;
  /* 또는 */
  display: inline-block;
  z-index: 0;
}
```

### 4. 인라인 스타일 재정의

붙여넣은 콘텐츠 정리:

```javascript
function sanitizeContent(html) {
  const div = document.createElement('div');
  div.innerHTML = html;
  
  // 인라인 스타일 제거
  div.querySelectorAll('[style]').forEach(el => {
    el.removeAttribute('style');
  });
  
  return div.innerHTML;
}
```

### 5. 다크 모드 미디어 쿼리

다크 모드 색상 정의:

```css
@media (prefers-color-scheme: dark) {
  [contenteditable="true"] {
    background-color: #1a1a1a;
    color: #ffffff;
  }
  
  [contenteditable="true"]::placeholder {
    color: #888888;
  }
  
  [contenteditable="true"] a {
    color: #4a9eff;
  }
  
  [contenteditable="true"] a:visited {
    color: #9d4edd;
  }
}
```

### 6. 강제 다크 모드로 테스트

브라우저 플래그 시뮬레이션:

```css
/* 강제 다크 모드에 대한 폴백 */
@media (prefers-color-scheme: dark) {
  [contenteditable="true"] {
    filter: none; /* 색상 반전 방지 */
  }
}
```

## 참고 자료

- [Stack Overflow: position relative로 인한 보이지 않는 캐럿](https://stackoverflow.com/questions/70565449/why-is-the-caret-invisible-in-a-contenteditable-with-positionrelative) - 캐럿 가시성 문제
- [Stack Overflow: Chrome과 Safari가 CSS를 인라인 스타일로 교체](https://stackoverflow.com/questions/8332245/contenteditable-in-chrome-and-safari-replaces-css-classes-and-rules-with-inline) - 인라인 스타일 주입
- [WebKit: 다크 모드 지원](https://webkit.org/blog/8840/dark-mode-support-in-webkit/) - color-scheme 문서
- [MDN: caret-color](https://developer.mozilla.org/en-US/docs/Web/CSS/caret-color) - 캐럿 색상 속성
- [Temper Temper: Safari의 HTML 전용 다크 모드 버그 수정](https://www.tempertemper.net/blog/fixing-safaris-html-only-dark-mode-bug) - 링크 색상 수정
- [JavaScript Room: 다크 모드 구현 가이드](https://www.javascriptroom.com/css-mastery/a-guide-to-implementing-dark-mode-with-css/) - 종합 가이드
