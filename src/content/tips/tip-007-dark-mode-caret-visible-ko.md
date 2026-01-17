---
id: tip-007-dark-mode-caret-visible-ko
title: 다크 모드에서 캐럿을 보이게 만들기
description: "다크 모드에서 contenteditable의 캐럿이 보이지 않는 문제를 해결하는 방법"
category: browser-feature
tags:
  - dark-mode
  - caret
  - styling
  - color-scheme
  - visibility
difficulty: beginner
relatedScenarios:
  - scenario-browser-dark-mode
relatedCases:
  - ce-0564-browser-dark-mode-caret-invisible
locale: ko
---

## 문제

브라우저 다크 모드가 활성화되면 contenteditable 요소의 캐럿이 보이지 않거나 잘 보이지 않습니다.

## 해결 방법

### 1. color-scheme 선언 사용

밝은 모드와 어두운 모드 모두 지원을 선언합니다.

```css
:root {
  color-scheme: light dark;
}
```

### 2. 명시적 캐럿 색상 설정

캐럿이 보이도록 명시적으로 색상을 설정합니다.

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

인라인 span에서 `position: relative`를 피합니다.

```css
[contenteditable="true"] span {
  position: static;
  /* 또는 */
  display: inline-block;
  z-index: 0;
}
```

### 4. 인라인 스타일 정리

붙여넣은 콘텐츠에서 인라인 스타일을 제거합니다.

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

다크 모드 색상을 정의합니다.

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

## 주의사항

- `color-scheme` 선언 없이는 브라우저가 다크 모드 지원을 인식하지 못할 수 있음
- 자식 요소의 배경색이 캐럿을 가릴 수 있음
- 브라우저가 주입한 인라인 스타일이 다크 모드 CSS를 재정의할 수 있음

## 관련 자료

- [시나리오: 브라우저 다크 모드](/scenarios/scenario-browser-dark-mode)
- [케이스: ce-0564](/cases/ce-0564-browser-dark-mode-caret-invisible)
