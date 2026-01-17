---
id: tip-008-keyboard-navigation-accessibility-ko
title: contenteditable에서 키보드 탐색 접근성 구현하기
description: "WCAG 요구사항을 준수하는 키보드 탐색을 contenteditable에 구현하는 방법"
category: accessibility
tags:
  - keyboard
  - accessibility
  - wcag
  - tab
  - arrow-keys
  - focus
difficulty: intermediate
relatedScenarios:
  - scenario-keyboard-navigation
relatedCases: []
locale: ko
---

## 문제

contenteditable 요소의 키보드 탐색은 WCAG 2.1.1 (키보드) 및 2.1.2 (키보드 트랩 없음) 요구사항을 준수해야 합니다. Tab 키는 일반적으로 contenteditable에서 포커스를 이동시키고, 화살표 키는 캐럿을 이동시킵니다.

## 해결 방법

### 1. Tab 키로 들여쓰기 삽입

Tab 키를 가로채서 탭 문자를 삽입합니다.

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

탈출 메커니즘을 제공합니다.

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

포커스가 보이도록 보장합니다.

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

복잡한 위젯에 적절한 ARIA를 사용합니다.

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

### 5. 로빙 Tabindex (복합 위젯용)

툴바나 메뉴에 사용합니다.

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

## WCAG 요구사항

- **WCAG 2.1.1 키보드 (Level A)**: 모든 기능이 키보드를 통해 작동 가능해야 함
- **WCAG 2.1.2 키보드 트랩 없음 (Level A)**: 사용자가 키보드를 사용하여 모든 컴포넌트에서 나갈 수 있어야 함
- **WCAG 2.4.7 포커스 가시성 (Level AA)**: 포커스 표시기가 보여야 함
- **WCAG 2.4.3 포커스 순서 (Level A)**: 논리적 탭 순서가 유지되어야 함

## 주의사항

- Tab 동작을 재정의할 때는 반드시 탈출 메커니즘 제공
- 화살표 키는 기본적으로 캐럿을 이동시키므로 특별한 경우가 아니면 재정의하지 않음
- 복합 위젯에서는 ARIA 역할과 상태를 올바르게 설정해야 함

## 관련 자료

- [시나리오: 키보드 탐색](/scenarios/scenario-keyboard-navigation)
