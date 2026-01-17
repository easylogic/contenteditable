---
id: scenario-browser-autofill-ko
title: 브라우저 자동완성 및 자동채우기가 contenteditable에서 작동하지 않음
description: "브라우저 자동완성 및 자동채우기 기능은 input과 textarea 같은 폼 관련 요소용으로 설계되어 있으며, 일반 contenteditable 요소에서는 작동하지 않습니다. autocomplete 속성은 contenteditable 요소에서 무시되며, 브라우저는 contenteditable 영역에서 타이핑할 때 자동채우기 제안을 제공하지 않습니다."
category: other
tags:
  - autofill
  - autocomplete
  - form
  - browser-feature
status: draft
locale: ko
---

브라우저 자동완성 및 자동채우기 기능은 `<input>`과 `<textarea>` 같은 폼 관련 요소용으로 설계되어 있으며, 일반 `contenteditable` 요소에서는 작동하지 않습니다. `autocomplete` 속성은 contenteditable 요소에서 무시되며, 브라우저는 contenteditable 영역에서 타이핑할 때 자동채우기 제안을 제공하지 않습니다.

## 관찰된 동작

- **Autocomplete 무시**: `autocomplete` 속성이 contenteditable 요소에서 효과 없음
- **자동채우기 제안 없음**: 브라우저가 contenteditable에 대해 자동채우기 드롭다운을 표시하지 않음
- **폼 통합 누락**: contenteditable이 폼 자동채우기 휴리스틱에 참여하지 않음
- **기능 제한**: 브라우저의 내장 비밀번호 관리자나 주소 자동채우기를 사용할 수 없음

## 브라우저 비교

- **Chrome**: Autocomplete 속성 무시, 자동채우기 지원 없음
- **Firefox**: 유사한 동작, 자동채우기 지원 없음
- **Safari**: contenteditable에 대한 자동채우기 지원 없음
- **Edge**: Chrome과 유사
- **모든 브라우저**: Autocomplete는 input, textarea, select에서만 작동

## 영향

- **사용자 경험 저하**: 사용자가 브라우저 자동채우기 기능을 사용할 수 없음
- **폼과 유사한 제한**: contenteditable을 폼 입력 대체로 사용할 수 없음
- **접근성 문제**: 자동채우기에 의존하는 사용자가 불리함
- **개발 오버헤드**: 커스텀 자동완성 솔루션 구현 필요

## 해결 방법

### 1. 숨겨진 Input 요소 사용

자동채우기를 위해 숨겨진 input과 동기화:

```html
<form>
  <input 
    type="text" 
    autocomplete="email" 
    name="email"
    style="position: absolute; opacity: 0; pointer-events: none;"
    id="hidden-email"
  >
  <div 
    contenteditable="true" 
    id="email-editor"
    aria-label="Email"
  ></div>
</form>

<script>
const hiddenInput = document.getElementById('hidden-email');
const editor = document.getElementById('email-editor');

// 에디터를 숨겨진 input에 동기화
editor.addEventListener('input', () => {
  hiddenInput.value = editor.textContent;
});

// 숨겨진 input을 에디터에 동기화 (자동채우기용)
hiddenInput.addEventListener('input', () => {
  if (hiddenInput.value !== editor.textContent) {
    editor.textContent = hiddenInput.value;
  }
});
</script>
```

### 2. 가능하면 textarea 사용

간단한 텍스트 편집용:

```html
<textarea 
  autocomplete="email"
  name="email"
  style="resize: none; overflow: hidden;"
></textarea>
```

### 3. 커스텀 자동완성 구현

JavaScript 기반 자동완성 구축:

```javascript
class ContentEditableAutocomplete {
  constructor(element, options) {
    this.element = element;
    this.options = options;
    this.setupAutocomplete();
  }
  
  setupAutocomplete() {
    this.element.addEventListener('input', (e) => {
      const text = e.currentTarget.textContent;
      const suggestions = this.getSuggestions(text);
      this.showSuggestions(suggestions);
    });
  }
  
  getSuggestions(text) {
    // 커스텀 자동완성 로직
    return this.options.suggestions.filter(s => 
      s.toLowerCase().startsWith(text.toLowerCase())
    );
  }
  
  showSuggestions(suggestions) {
    // 제안이 있는 드롭다운 표시
  }
}
```

### 4. 의미론적 autocomplete 토큰 사용

Input 요소 사용 시:

```html
<input 
  type="email" 
  autocomplete="email"
  name="email"
>

<input 
  type="text" 
  autocomplete="given-name"
  name="firstName"
>

<input 
  type="tel" 
  autocomplete="tel"
  name="phone"
>
```

## 참고 자료

- [MDN: autocomplete 속성](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Attributes/autocomplete) - autocomplete 문서
- [Medium: 브라우저 자동채우기가 예상대로 작동하지 않는 이유](https://diko-dev99.medium.com/why-browser-autofill-doesnt-work-the-way-you-expect-and-how-to-test-it-properly-0b5d86fcde0d) - 자동채우기 휴리스틱
- [jQuery UI Bug #14917: Autocomplete가 contenteditable을 인식하지 않음](https://bugs.jqueryui.com/ticket/14917) - 라이브러리 호환성 문제
- [GitHub: contenteditable-autocomplete](https://github.com/gr2m/contenteditable-autocomplete) - 커스텀 자동완성 라이브러리
- [Contenteditable Autocomplete 데모](https://gr2m.github.io/contenteditable-autocomplete/) - 라이브러리 예제
