---
id: tip-015-format-toggle-pattern-ko
title: 선택한 텍스트에 포맷 토글하기
description: "모든 브라우저에서 올바른 선택 처리로 포맷 토글(굵게, 기울임 등)을 안정적으로 구현하는 방법"
category: common-patterns
tags:
  - formatting
  - bold
  - italic
  - selection
  - toggle
  - pattern
difficulty: intermediate
relatedScenarios: []
relatedCases: []
locale: ko
---

## 이 Tip을 사용할 때

다음과 같은 경우에 이 패턴을 사용하세요:
- 선택한 텍스트에 포맷 토글 (굵게, 기울임, 밑줄 등)
- 접힌 선택(커서만)과 펼쳐진 선택(텍스트 선택됨) 모두 처리
- 모든 브라우저에서 일관된 동작 보장
- 리치 텍스트 에디터 툴바 구현

## 문제

contenteditable에서 선택한 텍스트에 포맷을 토글하려면 여러 엣지 케이스를 처리해야 합니다:
- 접힌 선택(커서만) vs 펼쳐진 선택(텍스트 선택됨)
- 이미 포맷된 텍스트 vs 포맷되지 않은 텍스트
- 브라우저별 포맷팅 동작 차이
- DOM 조작 후 선택 복원

## 해결 방법

### 1. 기본 포맷 토글 패턴

접힌 선택과 펼쳐진 선택을 모두 처리합니다:

```javascript
class FormatToggle {
  constructor(editor, formatType) {
    this.editor = editor;
    this.formatType = formatType; // 'bold', 'italic', 'underline' 등
    this.init();
  }
  
  init() {
    this.editor.addEventListener('beforeinput', (e) => {
      if (e.inputType === `format${this.capitalize(this.formatType)}`) {
        e.preventDefault();
        this.toggleFormat();
      }
    });
  }
  
  toggleFormat() {
    const selection = window.getSelection();
    if (selection.rangeCount === 0) return;
    
    const range = selection.getRangeAt(0);
    
    if (range.collapsed) {
      // 접힌 선택: 다음 문자에 대한 상태 토글
      this.toggleFormatState();
    } else {
      // 펼쳐진 선택: 포맷 적용/제거
      const isFormatted = this.isFormatted(range);
      
      if (isFormatted) {
        this.removeFormatting(range);
      } else {
        this.applyFormatting(range);
      }
      
      // 선택 복원
      this.restoreSelection(range);
    }
  }
  
  isFormatted(range) {
    // 선택이 이미 포맷되어 있는지 확인
    const container = range.commonAncestorContainer;
    const element = container.nodeType === Node.TEXT_NODE 
      ? container.parentElement 
      : container;
    
    // 포맷 태그 확인 (예: <strong>, <em>, <u>)
    const formatTag = this.getFormatTag();
    return element.closest(formatTag) !== null;
  }
  
  applyFormatting(range) {
    // 선택을 포맷 태그로 감싸기
    const formatTag = this.getFormatTag();
    const wrapper = document.createElement(formatTag);
    
    try {
      range.surroundContents(wrapper);
    } catch (e) {
      // surroundContents가 실패하면 수동으로 감싸기
      const contents = range.extractContents();
      wrapper.appendChild(contents);
      range.insertNode(wrapper);
    }
  }
  
  removeFormatting(range) {
    // 범위 내의 모든 포맷 태그를 찾아 언래핑
    const formatTag = this.getFormatTag();
    const contents = range.cloneContents();
    const formatElements = contents.querySelectorAll(formatTag);
    
    // 포맷 요소 언래핑
    formatElements.forEach((el) => {
      const parent = el.parentNode;
      while (el.firstChild) {
        parent.insertBefore(el.firstChild, el);
      }
      parent.removeChild(el);
    });
    
    // 범위가 포맷 요소 내부에 있는지도 확인
    let container = range.commonAncestorContainer;
    if (container.nodeType === Node.TEXT_NODE) {
      container = container.parentElement;
    }
    
    const formatElement = container.closest(formatTag);
    if (formatElement) {
      this.unwrapElement(formatElement);
    }
  }
  
  unwrapElement(element) {
    const parent = element.parentNode;
    while (element.firstChild) {
      parent.insertBefore(element.firstChild, element);
    }
    parent.removeChild(element);
  }
  
  getFormatTag() {
    const tagMap = {
      bold: 'strong',
      italic: 'em',
      underline: 'u',
      strikethrough: 's',
    };
    return tagMap[this.formatType] || 'span';
  }
  
  toggleFormatState() {
    // 다음 문자에 대한 포맷 의도 저장
    // 구현은 에디터 아키텍처에 따라 다름
    this.editor.dataset.formatIntent = this.formatType;
  }
  
  restoreSelection(range) {
    const selection = window.getSelection();
    selection.removeAllRanges();
    selection.addRange(range);
  }
  
  capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }
}

// 사용법
const editor = document.querySelector('div[contenteditable]');
const boldToggle = new FormatToggle(editor, 'bold');
const italicToggle = new FormatToggle(editor, 'italic');
```

### 2. execCommand 사용 (사용 중단되었지만 간단함)

빠른 구현을 위해 `execCommand`를 사용할 수 있습니다 (사용 중단되었지만 널리 지원됨):

```javascript
function toggleFormatExecCommand(command) {
  const selection = window.getSelection();
  if (selection.rangeCount === 0) return;
  
  // 이미 포맷되어 있는지 확인
  const isFormatted = document.queryCommandState(command);
  
  if (isFormatted) {
    document.execCommand(command, false, null);
  } else {
    document.execCommand(command, false, null);
  }
  
  // 선택 복원
  const range = selection.getRangeAt(0);
  selection.removeAllRanges();
  selection.addRange(range);
}

// 사용법
editor.addEventListener('click', (e) => {
  if (e.target.classList.contains('bold-button')) {
    toggleFormatExecCommand('bold');
  }
});
```

### 3. 최신 Input Events 접근법

더 나은 제어를 위해 `beforeinput` 이벤트 사용:

```javascript
class ModernFormatToggle {
  constructor(editor) {
    this.editor = editor;
    this.init();
  }
  
  init() {
    this.editor.addEventListener('beforeinput', (e) => {
      if (e.inputType.startsWith('format')) {
        e.preventDefault();
        this.handleFormat(e.inputType);
      }
    });
  }
  
  handleFormat(inputType) {
    const formatType = inputType.replace('format', '').toLowerCase();
    const selection = window.getSelection();
    if (selection.rangeCount === 0) return;
    
    const range = selection.getRangeAt(0);
    
    if (range.collapsed) {
      // 포맷 의도 저장
      this.setFormatIntent(formatType);
    } else {
      // 선택에 포맷 토글
      this.toggleFormatOnRange(range, formatType);
    }
  }
  
  toggleFormatOnRange(range, formatType) {
    const isFormatted = this.checkFormat(range, formatType);
    
    if (isFormatted) {
      this.removeFormat(range, formatType);
    } else {
      this.applyFormat(range, formatType);
    }
    
    // 선택 복원
    this.restoreSelection(range);
  }
  
  checkFormat(range, formatType) {
    const tagMap = {
      bold: ['strong', 'b'],
      italic: ['em', 'i'],
      underline: ['u'],
    };
    
    const tags = tagMap[formatType] || [];
    const container = range.commonAncestorContainer;
    const element = container.nodeType === Node.TEXT_NODE 
      ? container.parentElement 
      : container;
    
    return tags.some(tag => element.closest(tag) !== null);
  }
  
  applyFormat(range, formatType) {
    const tagMap = {
      bold: 'strong',
      italic: 'em',
      underline: 'u',
    };
    
    const tag = tagMap[formatType] || 'span';
    const wrapper = document.createElement(tag);
    
    try {
      range.surroundContents(wrapper);
    } catch (e) {
      // 복잡한 선택에 대한 대체 방법
      const contents = range.extractContents();
      wrapper.appendChild(contents);
      range.insertNode(wrapper);
    }
  }
  
  removeFormat(range, formatType) {
    const tagMap = {
      bold: ['strong', 'b'],
      italic: ['em', 'i'],
      underline: ['u'],
    };
    
    const tags = tagMap[formatType] || [];
    
    // 범위 내의 모든 포맷 태그 언래핑
    const contents = range.cloneContents();
    tags.forEach(tag => {
      const elements = contents.querySelectorAll(tag);
      elements.forEach(el => {
        const parent = el.parentNode;
        while (el.firstChild) {
          parent.insertBefore(el.firstChild, el);
        }
        parent.removeChild(el);
      });
    });
    
    // 범위가 포맷 요소 내부에 있는 경우도 언래핑
    let container = range.commonAncestorContainer;
    if (container.nodeType === Node.TEXT_NODE) {
      container = container.parentElement;
    }
    
    tags.forEach(tag => {
      const formatElement = container.closest(tag);
      if (formatElement) {
        this.unwrapElement(formatElement);
      }
    });
  }
  
  unwrapElement(element) {
    const parent = element.parentNode;
    while (element.firstChild) {
      parent.insertBefore(element.firstChild, element);
    }
    parent.removeChild(element);
  }
  
  setFormatIntent(formatType) {
    this.editor.dataset.formatIntent = formatType;
  }
  
  restoreSelection(range) {
    const selection = window.getSelection();
    selection.removeAllRanges();
    selection.addRange(range);
  }
}

// 사용법
const editor = document.querySelector('div[contenteditable]');
const formatToggle = new ModernFormatToggle(editor);
```

### 4. 완전한 툴바 구현

툴바 버튼이 있는 완전한 예제:

```javascript
class RichTextEditor {
  constructor(editorElement) {
    this.editor = editorElement;
    this.formatToggle = new ModernFormatToggle(this.editor);
    this.setupToolbar();
  }
  
  setupToolbar() {
    const toolbar = document.querySelector('.editor-toolbar');
    if (!toolbar) return;
    
    toolbar.addEventListener('click', (e) => {
      const button = e.target.closest('[data-format]');
      if (!button) return;
      
      e.preventDefault();
      const formatType = button.dataset.format;
      this.toggleFormat(formatType);
      this.updateToolbarState();
    });
  }
  
  toggleFormat(formatType) {
    const selection = window.getSelection();
    if (selection.rangeCount === 0) return;
    
    const range = selection.getRangeAt(0);
    
    if (range.collapsed) {
      // 접힌 선택의 경우, 의도만 저장
      this.editor.dataset.formatIntent = formatType;
    } else {
      // 선택에 포맷 토글
      this.formatToggle.toggleFormatOnRange(range, formatType);
    }
  }
  
  updateToolbarState() {
    const selection = window.getSelection();
    if (selection.rangeCount === 0) return;
    
    const range = selection.getRangeAt(0);
    const toolbar = document.querySelector('.editor-toolbar');
    
    toolbar.querySelectorAll('[data-format]').forEach(button => {
      const formatType = button.dataset.format;
      const isActive = this.formatToggle.checkFormat(range, formatType);
      button.classList.toggle('active', isActive);
    });
  }
}

// HTML
// <div class="editor-toolbar">
//   <button data-format="bold">굵게</button>
//   <button data-format="italic">기울임</button>
//   <button data-format="underline">밑줄</button>
// </div>
// <div contenteditable="true" class="editor"></div>

// 사용법
const editor = document.querySelector('.editor');
const richTextEditor = new RichTextEditor(editor);
```

## 주의사항

- 포맷을 적용하기 전에 항상 선택이 접혀 있는지 확인하세요
- 더 나은 제어와 크로스 브라우저 호환성을 위해 `beforeinput` 이벤트를 사용하세요
- `surroundContents()`는 복잡한 선택에서 실패할 수 있습니다 - 대체 방법을 준비하세요
- DOM 조작 후 선택을 복원하여 사용자의 커서 위치를 유지하세요
- 더 많은 제어를 위해 HTML 태그 대신 CSS 클래스를 사용하는 것을 고려하세요
- IME 컴포지션으로 테스트하세요 - 일부 브라우저는 컴포지션 중 포맷팅을 다르게 처리합니다
- `execCommand`는 사용 중단되었지만 여전히 널리 사용됩니다 - Input Events API로 마이그레이션을 고려하세요

## 브라우저 호환성

- **Chrome/Edge**: `beforeinput` 및 포맷 이벤트 완전 지원
- **Firefox**: 좋은 지원이지만 `surroundContents`에 일부 엣지 케이스가 있습니다
- **Safari**: `beforeinput` 지원이 제한적입니다 - `execCommand`로 대체해야 할 수 있습니다

## 관련 자료

- [실용 패턴: 포맷 토글](/docs/practical-patterns#format-toggle-pattern)
