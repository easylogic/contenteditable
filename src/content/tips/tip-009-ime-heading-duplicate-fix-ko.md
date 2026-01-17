---
id: tip-009-ime-heading-duplicate-fix-ko
title: 제목 요소에서 IME 중복 텍스트 수정하기
description: "WebKit 브라우저에서 제목 요소(H1-H6)에 IME 컴포지션 사용 시 Pinyin 중복 텍스트를 방지하는 방법"
category: ime
tags:
  - ime
  - composition
  - heading
  - webkit
  - chinese
  - duplicate-text
  - safari
difficulty: intermediate
relatedScenarios:
  - scenario-ime-duplicate-text-heading
relatedCases:
  - ce-0232-chinese-ime-pinyin-heading-safari-ko
  - ce-0233-chinese-ime-pinyin-heading-chrome-en
locale: ko
---

## 문제

WebKit 브라우저(Safari, Chrome)에서 제목 요소(`<h1>`-`<h6>`)에 중국어나 기타 CJK 언어의 IME(입력기)를 사용할 때, 스페이스바로 컴포지션을 확정하면 원본 Pinyin 버퍼(예: "nihao")와 확정된 문자(예: "你好")가 함께 표시됩니다. 결과적으로 "你好"만 표시되어야 하는데 "nihao 你好"처럼 중복 텍스트가 나타납니다.

이 문제는 제목 요소에서만 발생하며, 문단이나 div 요소에서는 발생하지 않습니다. Firefox는 이 버그가 없이 정상적으로 작동합니다.

## 해결 방법

### 1. 컴포지션 완료 후 DOM 정리

`compositionend` 이벤트를 사용하여 컴포지션이 완료된 후 Pinyin 버퍼를 제거합니다:

```javascript
const heading = document.querySelector('h2[contenteditable]');
let isComposing = false;

heading.addEventListener('compositionstart', () => {
  isComposing = true;
});

heading.addEventListener('compositionend', () => {
  isComposing = false;
  // 컴포지션 완료 후 Pinyin 텍스트 정리
  setTimeout(() => {
    const text = heading.textContent;
    // 소문자(Pinyin 버퍼) 제거
    const cleaned = text.replace(/[a-z]+\s*/g, '').trim();
    if (cleaned !== text) {
      heading.textContent = cleaned;
      // 커서 위치 복원
      const range = document.createRange();
      range.selectNodeContents(heading);
      range.collapse(false);
      const selection = window.getSelection();
      selection.removeAllRanges();
      selection.addRange(range);
    }
  }, 0);
});
```

### 2. 컴포지션 중 스페이스 키 가로채기

컴포지션 중 스페이스 키가 처리되지 않도록 막아 IME가 자연스럽게 처리하도록 합니다:

```javascript
const heading = document.querySelector('h2[contenteditable]');
let isComposing = false;

heading.addEventListener('compositionstart', () => {
  isComposing = true;
});

heading.addEventListener('compositionend', () => {
  isComposing = false;
});

heading.addEventListener('keydown', (e) => {
  if (isComposing && e.key === ' ') {
    e.preventDefault();
    e.stopPropagation();
    // IME가 컴포지션을 자연스럽게 완료하도록 함
    return false;
  }
});
```

### 3. 제목 대신 문단 사용

시맨틱 제목 요소를 스타일링된 문단으로 대체하여 WebKit 버그를 완전히 피합니다:

```html
<!-- <h2> 대신 -->
<p class="heading-2" contenteditable="true">여기에 입력</p>

<style>
.heading-2 {
  font-size: 1.5rem;
  font-weight: 700;
  margin: 1rem 0;
}
</style>
```

### 4. 강력한 정리 기능을 갖춘 통합 접근법

여러 전략을 결합하여 더 견고한 해결책을 만듭니다:

```javascript
class HeadingIMEHandler {
  constructor(element) {
    this.element = element;
    this.isComposing = false;
    this.caretPosition = null;
    
    this.init();
  }
  
  init() {
    this.element.addEventListener('compositionstart', this.handleCompositionStart.bind(this));
    this.element.addEventListener('compositionupdate', this.handleCompositionUpdate.bind(this));
    this.element.addEventListener('compositionend', this.handleCompositionEnd.bind(this));
    this.element.addEventListener('keydown', this.handleKeyDown.bind(this));
  }
  
  handleCompositionStart() {
    this.isComposing = true;
    this.saveCaretPosition();
  }
  
  handleCompositionUpdate(e) {
    // 컴포지션 상태 추적
  }
  
  handleCompositionEnd() {
    this.isComposing = false;
    // DOM이 업데이트되도록 짧은 지연 후 정리
    setTimeout(() => {
      this.cleanupPinyin();
      this.restoreCaretPosition();
    }, 10);
  }
  
  handleKeyDown(e) {
    if (this.isComposing && e.key === ' ') {
      e.preventDefault();
      e.stopPropagation();
      return false;
    }
  }
  
  saveCaretPosition() {
    const selection = window.getSelection();
    if (selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      this.caretPosition = {
        startContainer: range.startContainer,
        startOffset: range.startOffset
      };
    }
  }
  
  restoreCaretPosition() {
    if (!this.caretPosition) return;
    
    try {
      const range = document.createRange();
      range.setStart(this.caretPosition.startContainer, this.caretPosition.startOffset);
      range.collapse(true);
      
      const selection = window.getSelection();
      selection.removeAllRanges();
      selection.addRange(range);
    } catch (e) {
      // 대체: 커서를 끝으로 이동
      const range = document.createRange();
      range.selectNodeContents(this.element);
      range.collapse(false);
      const selection = window.getSelection();
      selection.removeAllRanges();
      selection.addRange(range);
    }
  }
  
  cleanupPinyin() {
    const text = this.element.textContent;
    // 소문자 Pinyin 패턴 제거 (예: "nihao", "wo", "ni")
    // CJK 문자와 기타 내용은 유지
    const cleaned = text.replace(/[a-z]+\s*/g, '').trim();
    
    if (cleaned !== text) {
      this.element.textContent = cleaned;
    }
  }
  
  dispose() {
    this.element.removeEventListener('compositionstart', this.handleCompositionStart);
    this.element.removeEventListener('compositionupdate', this.handleCompositionUpdate);
    this.element.removeEventListener('compositionend', this.handleCompositionEnd);
    this.element.removeEventListener('keydown', this.handleKeyDown);
  }
}

// 사용법
const heading = document.querySelector('h2[contenteditable]');
const handler = new HeadingIMEHandler(heading);
```

## 주의사항

- 이 버그는 WebKit 기반 브라우저(Safari, Chrome)에만 해당하며 Firefox에서는 발생하지 않습니다
- 문제는 제목 요소(`<h1>`-`<h6>`)에서만 발생하며, 문단이나 div 요소에서는 발생하지 않습니다
- 정리 접근법은 Pinyin과 문자를 모두 유지하려는 합법적인 사용 사례와 충돌할 수 있습니다
- 제목 대신 문단을 사용하면 SEO와 접근성에 영향을 줄 수 있으므로, 필요시 ARIA 속성과 함께 적절한 제목 시맨틱을 고려하세요
- 다양한 IME(중국어, 일본어, 한국어)로 철저히 테스트하세요. 동작이 다를 수 있습니다
- 정리에서 `setTimeout` 지연은 `compositionend` 후 DOM 업데이트가 비동기적으로 발생하기 때문에 필요합니다

## 관련 자료

- [시나리오: 제목 요소에서 IME 중복 텍스트](/scenarios/scenario-ime-duplicate-text-heading)
- [케이스: ce-0232](/cases/ce-0232-chinese-ime-pinyin-heading-safari-ko)
- [케이스: ce-0233](/cases/ce-0233-chinese-ime-pinyin-heading-chrome-en)
