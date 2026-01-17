---
id: scenario-browser-auto-formatting-ko
title: 브라우저 자동 포맷팅이 contenteditable 편집을 방해함
description: "브라우저가 contenteditable 요소에서 텍스트를 자동으로 포맷팅할 수 있습니다. 예를 들어 URL을 링크로 변환하거나, 텍스트를 대문자로 변환하거나, 숫자를 포맷팅하거나, 다른 변환을 적용할 수 있습니다. 이 자동 포맷팅이 편집을 방해하고, 커서 위치 문제를 일으키며, 원하지 않는 마크업이나 스타일 변경을 생성할 수 있습니다."
category: formatting
tags:
  - auto-formatting
  - browser-feature
  - capitalization
  - number-formatting
  - text-transformation
status: draft
locale: ko
---

브라우저가 `contenteditable` 요소에서 텍스트를 자동으로 포맷팅할 수 있습니다. 예를 들어 URL을 링크로 변환하거나, 텍스트를 대문자로 변환하거나, 숫자를 포맷팅하거나, 다른 변환을 적용할 수 있습니다.

## 관찰된 동작

- **자동 대문자화**: 텍스트가 자동으로 대문자화됨(첫 글자, 문장)
- **숫자 포맷팅**: 숫자가 쉼표, 통화 기호 등으로 포맷팅됨
- **URL/이메일 링크**: URL과 이메일이 링크로 변환됨(별도 시나리오에서 다룸)
- **텍스트 변환**: 텍스트 대소문자가 자동으로 변경됨
- **스타일 주입**: 포맷팅을 위해 인라인 스타일이 추가됨

## 브라우저 비교

- **Chrome**: 모바일에서 자동 대문자화, 일부 포맷팅 기능
- **Safari**: 자동 대문자화, 스마트 따옴표, 날짜 포맷팅
- **Firefox**: 덜 공격적인 자동 포맷팅
- **Edge**: Chrome과 유사
- **모바일 브라우저**: 모바일 기기에서 더 공격적인 자동 포맷팅

## 영향

- **원하지 않는 포맷팅**: 텍스트가 포맷팅되어서는 안 되는 경우에 포맷팅됨
- **편집 방해**: 자동 포맷팅이 타이핑 흐름을 방해함
- **데이터 손상**: 포맷팅이 예상치 못한 방식으로 콘텐츠를 변경함
- **사용자 좌절**: 사용자가 지속적으로 포맷팅을 되돌리거나 수정해야 함

## 해결 방법

### 1. 자동 대문자화 비활성화

CSS 및 속성 사용:

```html
<div 
  contenteditable="true"
  autocapitalize="none"
  autocorrect="off"
  autocomplete="off"
  spellcheck="false"
>
  자동 대문자화 없는 콘텐츠
</div>
```

```css
[contenteditable="true"] {
  text-transform: none;
  font-variant: normal;
}
```

### 2. 포맷팅 가로채고 방지

입력 이벤트 모니터링:

```javascript
editableElement.addEventListener('beforeinput', (e) => {
  // 자동 포맷팅 방지
  if (e.inputType === 'formatBold' || 
      e.inputType === 'formatItalic' ||
      e.inputType === 'formatSetBlockTextDirection') {
    e.preventDefault();
  }
});
```

### 3. 입력 후 정리

원하지 않는 포맷팅 제거:

```javascript
function sanitizeFormatting(element) {
  // 자동 대문자화 제거
  const text = element.textContent;
  element.textContent = text;
  
  // 원하지 않는 인라인 스타일 제거
  element.querySelectorAll('[style]').forEach(el => {
    const style = el.getAttribute('style');
    if (style.includes('text-transform') || 
        style.includes('font-variant')) {
      el.removeAttribute('style');
    }
  });
}

editableElement.addEventListener('input', () => {
  setTimeout(() => sanitizeFormatting(editableElement), 0);
});
```

### 4. contenteditable="plaintext-only" 사용

대부분의 포맷팅 비활성화:

```html
<div contenteditable="plaintext-only">
  일반 텍스트, 자동 포맷팅 없음
</div>
```

### 5. CSS 재정의

브라우저 기본값 재정의:

```css
[contenteditable="true"] {
  text-transform: none !important;
  font-variant: normal !important;
  font-feature-settings: normal !important;
}

[contenteditable="true"] * {
  text-transform: inherit;
}
```

## 참고 자료

- [MDN: autocapitalize 속성](https://developer.mozilla.org/docs/Web/HTML/Reference/Global_attributes/autocapitalize) - 자동 대문자화 비활성화
- [MDN: autocorrect 속성](https://developer.mozilla.org/docs/Web/HTML/Reference/Global_attributes/autocorrect) - 자동 수정 비활성화
- [Stack Overflow: contenteditable에서 자동 대문자화 비활성화](https://stackoverflow.com/questions/2984799/disable-auto-capitalization-in-contenteditable-div) - 모바일 브라우저 문제
