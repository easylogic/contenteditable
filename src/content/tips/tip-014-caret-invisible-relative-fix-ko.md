---
id: tip-014-caret-invisible-relative-fix-ko
title: position:relative 요소에서 보이지 않는 캐럿 수정하기
description: "position:relative CSS 속성을 가진 요소 내부에서 콘텐츠를 편집할 때 텍스트 캐럿(커서)을 보이게 만드는 방법"
category: selection
tags:
  - caret
  - cursor
  - css
  - position-relative
  - webkit
  - safari
  - chrome
  - visibility
difficulty: beginner
relatedScenarios:
  - scenario-caret-invisible-relative
relatedCases:
  - ce-0271-caret-invisible-relative-safari-ko
  - ce-0272-caret-invisible-relative-chrome-macos-en
locale: ko
---

## 문제

`position:relative` CSS 속성을 가진 요소 내부에서 콘텐츠를 편집할 때 텍스트 캐럿(커서)이 완전히 보이지 않게 됩니다. 텍스트를 입력할 수 있고 에디터에 나타나지만, 삽입 지점이 어디에 있는지 시각적 피드백이 없습니다. 이로 인해 사용자가 다음 문자가 어디에 삽입될지 볼 수 없어 편집이 어려워집니다.

이 문제는 contenteditable 요소가 `position:relative` 스타일링을 가진 요소 내부에 중첩되거나 가지고 있을 때 모든 주요 브라우저(Safari, Chrome, Firefox)에 영향을 줍니다.

## 해결 방법

### 1. position:relative 제거 또는 변경

가장 간단한 해결책은 contenteditable 요소나 그 직계 부모에서 `position:relative`를 피하는 것입니다:

```css
/* 대신 */
.editable-container {
  position: relative;
}

/* 사용 */
.editable-container {
  position: static; /* 또는 position 속성을 완전히 제거 */
}
```

또는 HTML 구조를 재구성합니다:

```html
<!-- 대신 -->
<div class="container" style="position: relative;">
  <div contenteditable="true">편집 가능한 콘텐츠</div>
</div>

<!-- 사용 -->
<div class="container">
  <div contenteditable="true">편집 가능한 콘텐츠</div>
</div>
```

### 2. position:relative를 조상 요소로 이동

레이아웃 목적으로 `position:relative`가 필요한 경우, 조상 요소로 이동합니다:

```html
<div class="wrapper" style="position: relative;">
  <div class="editable-container" style="position: static;">
    <div contenteditable="true">편집 가능한 콘텐츠</div>
  </div>
</div>
```

```css
.wrapper {
  position: relative; /* 레이아웃/위치 지정 컨텍스트용 */
}

.editable-container {
  position: static; /* 캐럿 렌더링 허용 */
}

.editable-container[contenteditable="true"] {
  /* 편집 가능한 요소 자체는 position:relative를 가져서는 안 됩니다 */
}
```

### 3. caret-color 속성 사용

`caret-color` CSS 속성을 사용하여 캐럿 가시성을 강제합니다 (일부 브라우저에서 작동할 수 있음):

```css
[contenteditable="true"] {
  caret-color: #000; /* 검은색 캐럿 */
  /* 또는 */
  caret-color: currentColor; /* 텍스트 색상 사용 */
}
```

참고: 이것이 모든 브라우저에서 문제를 완전히 해결하지는 못할 수 있지만 시도해볼 가치가 있습니다.

### 4. 사용자 정의 캐럿 표시기 생성

삽입 지점을 보여주는 사용자 정의 캐럿 요소를 구현합니다:

```javascript
class CustomCaret {
  constructor(editor) {
    this.editor = editor;
    this.caretElement = null;
    this.init();
  }
  
  init() {
    this.createCaretElement();
    this.editor.addEventListener('focus', this.showCaret.bind(this));
    this.editor.addEventListener('blur', this.hideCaret.bind(this));
    this.editor.addEventListener('input', this.updateCaret.bind(this));
    this.editor.addEventListener('keyup', this.updateCaret.bind(this));
    this.editor.addEventListener('mouseup', this.updateCaret.bind(this));
  }
  
  createCaretElement() {
    this.caretElement = document.createElement('span');
    this.caretElement.className = 'custom-caret';
    this.caretElement.style.cssText = `
      position: absolute;
      width: 2px;
      height: 1.2em;
      background: currentColor;
      pointer-events: none;
      animation: blink 1s infinite;
      z-index: 1000;
    `;
    
    // 깜빡임 애니메이션 추가
    if (!document.getElementById('custom-caret-style')) {
      const style = document.createElement('style');
      style.id = 'custom-caret-style';
      style.textContent = `
        @keyframes blink {
          0%, 50% { opacity: 1; }
          51%, 100% { opacity: 0; }
        }
      `;
      document.head.appendChild(style);
    }
  }
  
  showCaret() {
    this.updateCaret();
  }
  
  hideCaret() {
    if (this.caretElement && this.caretElement.parentNode) {
      this.caretElement.parentNode.removeChild(this.caretElement);
    }
  }
  
  updateCaret() {
    const selection = window.getSelection();
    if (selection.rangeCount === 0) {
      this.hideCaret();
      return;
    }
    
    const range = selection.getRangeAt(0);
    const rect = range.getBoundingClientRect();
    const editorRect = this.editor.getBoundingClientRect();
    
    // 에디터를 기준으로 위치 계산
    const top = rect.top - editorRect.top + this.editor.scrollTop;
    const left = rect.left - editorRect.left + this.editor.scrollLeft;
    
    // 캐럿 요소 위치 지정
    this.caretElement.style.top = `${top}px`;
    this.caretElement.style.left = `${left}px`;
    this.caretElement.style.height = `${rect.height || 1.2}em`;
    
    // 아직 삽입되지 않은 경우 에디터에 삽입
    if (!this.caretElement.parentNode) {
      this.editor.style.position = 'relative';
      this.editor.appendChild(this.caretElement);
    }
  }
  
  dispose() {
    this.hideCaret();
    this.editor.removeEventListener('focus', this.showCaret);
    this.editor.removeEventListener('blur', this.hideCaret);
    this.editor.removeEventListener('input', this.updateCaret);
    this.editor.removeEventListener('keyup', this.updateCaret);
    this.editor.removeEventListener('mouseup', this.updateCaret);
  }
}

// 사용법
const editor = document.querySelector('div[contenteditable]');
const customCaret = new CustomCaret(editor);
```

### 5. position:relative 대신 CSS Transform 사용

레이아웃을 위해 위치 지정이 필요한 경우 CSS transform을 사용합니다:

```css
/* 대신 */
.container {
  position: relative;
  top: 10px;
  left: 20px;
}

/* 사용 */
.container {
  transform: translate(20px, 10px);
}
```

Transform은 캐럿 렌더링에 영향을 주지 않습니다.

### 6. 절대 위치 지정으로 재구성

컨테이너에 relative 대신 자식 요소에 absolute 위치 지정을 사용합니다:

```html
<div class="container">
  <div class="absolute-child" style="position: absolute; top: 10px; left: 20px;">
    <div contenteditable="true">편집 가능한 콘텐츠</div>
  </div>
</div>
```

```css
.container {
  /* 여기에 position:relative 없음 */
  position: static;
}

.absolute-child {
  position: absolute;
  /* 자식은 캐럿에 영향을 주지 않고 절대 위치 지정 가능 */
}
```

### 7. 포괄적인 해결책

모든 경우를 처리하는 완전한 해결책:

```javascript
class CaretVisibilityFix {
  constructor(editor) {
    this.editor = editor;
    this.originalPosition = window.getComputedStyle(editor).position;
    this.init();
  }
  
  init() {
    // 에디터나 부모가 position:relative를 가지고 있는지 확인
    if (this.hasRelativePosition(this.editor)) {
      // 위치를 변경하여 수정 시도
      this.fixPosition();
    }
    
    // 백업으로 caret-color 추가
    this.editor.style.caretColor = 'currentColor';
    
    // 위치 변경 모니터링
    this.observePositionChanges();
  }
  
  hasRelativePosition(element) {
    const style = window.getComputedStyle(element);
    if (style.position === 'relative') {
      return true;
    }
    
    // 부모 요소 확인
    let parent = element.parentElement;
    while (parent && parent !== document.body) {
      const parentStyle = window.getComputedStyle(parent);
      if (parentStyle.position === 'relative') {
        return true;
      }
      parent = parent.parentElement;
    }
    
    return false;
  }
  
  fixPosition() {
    // static으로 변경 시도
    if (this.editor.style.position === 'relative' || 
        window.getComputedStyle(this.editor).position === 'relative') {
      this.editor.style.position = 'static';
    }
  }
  
  observePositionChanges() {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'attributes' && mutation.attributeName === 'style') {
          // 위치가 변경되었을 수 있음, 다시 확인
          if (this.hasRelativePosition(this.editor)) {
            this.fixPosition();
          }
        }
      });
    });
    
    observer.observe(this.editor, {
      attributes: true,
      attributeFilter: ['style', 'class']
    });
    
    // 부모 변경도 관찰
    let parent = this.editor.parentElement;
    while (parent) {
      observer.observe(parent, {
        attributes: true,
        attributeFilter: ['style', 'class']
      });
      parent = parent.parentElement;
    }
  }
  
  dispose() {
    // 필요시 원래 위치 복원
    if (this.originalPosition) {
      this.editor.style.position = this.originalPosition;
    }
  }
}

// 사용법
const editor = document.querySelector('div[contenteditable]');
const fix = new CaretVisibilityFix(editor);
```

## 주의사항

- 이 문제는 `position:relative`가 사용될 때 모든 주요 브라우저에 영향을 줍니다
- 가장 간단한 수정은 contenteditable 요소에서 `position:relative`를 피하는 것입니다
- 레이아웃을 위해 `position:relative`를 반드시 사용해야 하는 경우, 조상 요소로 이동하세요
- CSS transform은 종종 레이아웃 목적으로 `position:relative`를 대체할 수 있습니다
- 사용자 정의 캐럿 표시기는 복잡하지만 완전한 제어를 제공합니다
- `caret-color` 속성이 도움이 될 수 있지만 문제를 완전히 해결하지는 못합니다
- 동작이 다를 수 있으므로 모든 브라우저에서 테스트하세요
- 위치 지정 대신 CSS Grid나 Flexbox를 레이아웃에 사용하는 것을 고려하세요

## 관련 자료

- [시나리오: position:relative에서 캐럿이 보이지 않음](/scenarios/scenario-caret-invisible-relative)
- [케이스: ce-0271](/cases/ce-0271-caret-invisible-relative-safari-ko)
- [케이스: ce-0272](/cases/ce-0272-caret-invisible-relative-chrome-macos-en)
