---
id: scenario-keyboard-navigation-ko
title: contenteditable에서 키보드 탐색 접근성 문제
description: "contenteditable 요소의 키보드 탐색은 WCAG 2.1.1 (키보드) 및 2.1.2 (키보드 트랩 없음) 요구사항을 준수해야 합니다. Tab 키는 일반적으로 contenteditable에서 포커스를 이동시키고, 화살표 키는 캐럿을 이동시킵니다. 커스텀 키보드 처리는 모든 기능이 키보드로 작동 가능하고 포커스가 보이도록 보장해야 합니다."
category: accessibility
tags:
  - keyboard
  - accessibility
  - wcag
  - tab
  - arrow-keys
  - focus
status: draft
locale: ko
---

`contenteditable` 요소의 키보드 탐색은 WCAG 2.1.1 (키보드) 및 2.1.2 (키보드 트랩 없음) 요구사항을 준수해야 합니다. Tab 키는 일반적으로 contenteditable에서 포커스를 이동시키고, 화살표 키는 캐럿을 이동시킵니다.

## 관찰된 동작

- **Tab이 포커스 이동**: Tab 키는 기본적으로 contenteditable에서 포커스를 이동시킴
- **화살표 키가 캐럿 이동**: 화살표 키는 콘텐츠 내에서 캐럿 위치를 탐색함
- **탭 문자 삽입 없음**: Tab이 기본적으로 탭 문자를 삽입하지 않음
- **포커스 가시성**: 포커스가 시각적으로 구별 가능해야 함
- **키보드 트랩**: 커스텀 Tab 처리가 키보드 트랩을 만들 수 있음

## WCAG 요구사항

- **WCAG 2.1.1 키보드 (Level A)**: 모든 기능이 키보드를 통해 작동 가능해야 함
- **WCAG 2.1.2 키보드 트랩 없음 (Level A)**: 사용자가 키보드를 사용하여 모든 컴포넌트에서 나갈 수 있어야 함
- **WCAG 2.4.7 포커스 가시성 (Level AA)**: 포커스 표시기가 보여야 함
- **WCAG 2.4.3 포커스 순서 (Level A)**: 논리적 탭 순서가 유지되어야 함

## 브라우저 비교

- **모든 브라우저**: Tab이 기본적으로 포커스를 이동시킴
- **모든 브라우저**: 화살표 키가 콘텐츠 내에서 캐럿을 이동시킴
- **모든 브라우저**: 포커스 가시성은 CSS에 의존함
- **모든 브라우저**: 키보드 트랩 방지는 개발자 책임

## 영향

- **접근성 준수**: WCAG 요구사항을 충족해야 함
- **사용자 경험**: 키보드만 사용하는 사용자가 에디터를 사용할 수 있어야 함
- **법적 준수**: 접근성 표준에 따라 요구될 수 있음
- **개발 오버헤드**: 신중한 키보드 처리 필요

## 해결 방법

### 1. Tab이 들여쓰기 삽입하도록 만들기

Tab을 가로채고 탭 문자 삽입:

```javascript
editableElement.addEventListener('keydown', (e) => {
  if (e.key === 'Tab' && !e.shiftKey) {
    e.preventDefault();
    document.execCommand('insertText', false, '\t');
  }
  // Shift+Tab은 여전히 포커스를 뒤로 이동해야 함
});
```

### 2. 포커스 종료 보장

탈출 메커니즘 제공:

```javascript
editableElement.addEventListener('keydown', (e) => {
  if (e.key === 'Tab' && !e.shiftKey) {
    // 콘텐츠 끝에 있으면 Tab이 포커스를 이동하도록 허용
    const selection = window.getSelection();
    const range = selection.getRangeAt(0);
    const isAtEnd = range.collapsed && 
                    range.startOffset === range.endContainer.textContent.length;
    
    if (isAtEnd) {
      // 기본 Tab 동작을 허용하여 포커스 이동
      return;
    }
    
    e.preventDefault();
    document.execCommand('insertText', false, '\t');
  }
  
  if (e.key === 'Escape') {
    editableElement.blur();
  }
});
```

### 3. 보이는 포커스 표시기

포커스가 보이도록 보장:

```css
[contenteditable="true"]:focus {
  outline: 2px solid #0066cc;
  outline-offset: 2px;
}

[contenteditable="true"]:focus-visible {
  outline: 2px solid #0066cc;
}
```

### 4. ARIA 역할 및 속성

복잡한 위젯에 적절한 ARIA 사용:

```html
<div 
  contenteditable="true"
  role="textbox"
  aria-label="에디터"
  aria-multiline="true"
  tabindex="0"
>
  편집 가능한 콘텐츠
</div>
```

### 5. 복합 위젯을 위한 로빙 Tabindex

툴바나 메뉴용:

```javascript
class Toolbar {
  constructor(items) {
    this.items = items;
    this.activeIndex = 0;
    this.setupKeyboard();
  }
  
  setupKeyboard() {
    this.items.forEach((item, index) => {
      item.tabIndex = index === 0 ? 0 : -1;
      item.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowRight') {
          this.moveFocus(1);
        } else if (e.key === 'ArrowLeft') {
          this.moveFocus(-1);
        }
      });
    });
  }
  
  moveFocus(direction) {
    this.items[this.activeIndex].tabIndex = -1;
    this.activeIndex = (this.activeIndex + direction + this.items.length) % this.items.length;
    this.items[this.activeIndex].tabIndex = 0;
    this.items[this.activeIndex].focus();
  }
}
```

## 참고 자료

- [WCAG 2.1.1: 키보드](https://www.w3.org/WAI/WCAG21/Understanding/keyboard.html) - 키보드 접근성 요구사항
- [WCAG 2.1.2: 키보드 트랩 없음](https://www.w3.org/WAI/WCAG21/Understanding/no-keyboard-trap.html) - 키보드 트랩 방지
- [ARIA 작성 관행: 키보드 인터페이스](https://www.w3.org/WAI/ARIA/apg/practices/keyboard-interface/) - 키보드 탐색 패턴
- [Stack Overflow: Tab이 탭 문자 삽입하도록 만들기](https://stackoverflow.com/questions/2237497/make-the-tab-key-insert-a-tab-character-in-a-contenteditable-div-and-not-blur) - Tab 처리
- [ARIA Practices: Grid 패턴](https://www.w3.org/TR/2021/NOTE-wai-aria-practices-1.2-20211129/) - 그리드의 키보드 탐색
- [Test Party: 키보드 탐색 테스트](https://testparty.ai/blog/keyboard-navigation-testing) - 테스트 가이드라인
