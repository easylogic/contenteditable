---
id: tip-016-insert-text-pattern-ko
title: 커서 위치에 텍스트 삽입하기
description: "contenteditable에서 접힌 선택과 펼쳐진 선택을 모두 처리하여 현재 커서 위치에 텍스트를 안정적으로 삽입하는 방법"
category: common-patterns
tags:
  - insert-text
  - selection
  - cursor
  - text-insertion
  - pattern
difficulty: intermediate
relatedScenarios: []
relatedCases: []
locale: ko
---

## 이 Tip을 사용할 때

다음과 같은 경우에 이 패턴을 사용하세요:
- 커서 위치에 프로그래밍 방식으로 텍스트 삽입
- 선택된 텍스트를 새 텍스트로 교체
- 사용자 작업(버튼, 단축키 등)에 대한 응답으로 텍스트 삽입
- 접힌 선택(커서만)과 펼쳐진 선택(텍스트 선택됨) 모두 처리
- 모든 브라우저에서 일관된 동작 보장

## 문제

contenteditable에서 커서 위치에 텍스트를 삽입하려면 다음이 필요합니다:
- 접힌 선택 vs 펼쳐진 선택 처리
- 선택된 텍스트가 있으면 교체
- 삽입 후 커서 위치 유지
- 크로스 브라우저 호환성
- 충돌을 피하기 위한 적절한 이벤트 처리

## 해결 방법

### 1. 기본 텍스트 삽입 패턴

간단하고 안정적인 텍스트 삽입:

```javascript
function insertTextAtCursor(text) {
  const selection = window.getSelection();
  if (selection.rangeCount === 0) return;
  
  const range = selection.getRangeAt(0);
  
  // 선택된 내용이 있으면 삭제
  if (!range.collapsed) {
    range.deleteContents();
  }
  
  // 텍스트 노드 삽입
  const textNode = document.createTextNode(text);
  range.insertNode(textNode);
  
  // 삽입된 텍스트 뒤로 커서 이동
  range.setStartAfter(textNode);
  range.collapse(true);
  
  // 선택 업데이트
  selection.removeAllRanges();
  selection.addRange(range);
}

// 사용법
const editor = document.querySelector('div[contenteditable]');
editor.addEventListener('click', () => {
  insertTextAtCursor('Hello, World!');
});
```

### 2. beforeinput 이벤트 사용

`beforeinput`으로 텍스트 삽입을 가로채고 처리:

```javascript
class TextInserter {
  constructor(editor) {
    this.editor = editor;
    this.init();
  }
  
  init() {
    this.editor.addEventListener('beforeinput', (e) => {
      if (e.inputType === 'insertText' && e.data) {
        // 선택적으로 기본 동작을 방지하고 수동으로 처리
        // e.preventDefault();
        // this.insertText(e.data);
      }
    });
  }
  
  insertText(text) {
    const selection = window.getSelection();
    if (selection.rangeCount === 0) return;
    
    const range = selection.getRangeAt(0);
    
    // 선택된 내용 삭제
    if (!range.collapsed) {
      range.deleteContents();
    }
    
    // 텍스트 삽입
    const textNode = document.createTextNode(text);
    range.insertNode(textNode);
    
    // 텍스트 뒤로 커서 이동
    range.setStartAfter(textNode);
    range.collapse(true);
    
    selection.removeAllRanges();
    selection.addRange(range);
  }
  
  insertTextAtPosition(text, position) {
    // 특정 위치(문자 오프셋)에 삽입
    const selection = window.getSelection();
    if (selection.rangeCount === 0) return;
    
    const range = selection.getRangeAt(0);
    const textContent = this.editor.textContent;
    
    // 위치에 범위 생성
    const newRange = document.createRange();
    newRange.setStart(this.editor, 0);
    newRange.setEnd(this.editor, 0);
    
    // DOM에서 위치 찾기
    let offset = 0;
    const walker = document.createTreeWalker(
      this.editor,
      NodeFilter.SHOW_TEXT,
      null
    );
    
    let node;
    while (node = walker.nextNode()) {
      const nodeLength = node.textContent.length;
      if (offset + nodeLength >= position) {
        newRange.setStart(node, position - offset);
        newRange.setEnd(node, position - offset);
        break;
      }
      offset += nodeLength;
    }
    
    // 텍스트 삽입
    const textNode = document.createTextNode(text);
    newRange.insertNode(textNode);
    
    // 커서 이동
    newRange.setStartAfter(textNode);
    newRange.collapse(true);
    
    selection.removeAllRanges();
    selection.addRange(newRange);
  }
}

// 사용법
const editor = document.querySelector('div[contenteditable]');
const inserter = new TextInserter(editor);

// 버튼 클릭 시 텍스트 삽입
document.querySelector('.insert-button').addEventListener('click', () => {
  inserter.insertText('삽입된 텍스트');
});
```

### 3. 선택 영역을 텍스트로 교체

선택된 텍스트를 새 텍스트로 교체:

```javascript
function replaceSelectionWithText(text) {
  const selection = window.getSelection();
  if (selection.rangeCount === 0) return;
  
  const range = selection.getRangeAt(0);
  
  // 선택된 내용 삭제
  if (!range.collapsed) {
    range.deleteContents();
  }
  
  // 새 텍스트 삽입
  const textNode = document.createTextNode(text);
  range.insertNode(textNode);
  
  // 삽입된 텍스트 선택 (선택 사항)
  // range.selectNodeContents(textNode);
  
  // 또는 텍스트 뒤로 커서 이동
  range.setStartAfter(textNode);
  range.collapse(true);
  
  selection.removeAllRanges();
  selection.addRange(range);
}

// 사용법
const editor = document.querySelector('div[contenteditable]');
editor.addEventListener('mouseup', () => {
  const selection = window.getSelection();
  if (selection.toString().trim()) {
    // 텍스트가 선택됨, 교체
    replaceSelectionWithText('교체 텍스트');
  }
});
```

### 4. 포맷팅과 함께 텍스트 삽입

포맷팅(굵게, 기울임 등)과 함께 텍스트 삽입:

```javascript
function insertFormattedText(text, formatTag = null) {
  const selection = window.getSelection();
  if (selection.rangeCount === 0) return;
  
  const range = selection.getRangeAt(0);
  
  // 선택된 내용 삭제
  if (!range.collapsed) {
    range.deleteContents();
  }
  
  // 텍스트 노드 생성
  const textNode = document.createTextNode(text);
  
  // 지정된 경우 포맷 태그로 감싸기
  if (formatTag) {
    const wrapper = document.createElement(formatTag);
    wrapper.appendChild(textNode);
    range.insertNode(wrapper);
    
    // 래퍼 뒤로 커서 이동
    range.setStartAfter(wrapper);
  } else {
    range.insertNode(textNode);
    range.setStartAfter(textNode);
  }
  
  range.collapse(true);
  
  selection.removeAllRanges();
  selection.addRange(range);
}

// 사용법
insertFormattedText('굵은 텍스트', 'strong');
insertFormattedText('기울임 텍스트', 'em');
insertFormattedText('일반 텍스트'); // 포맷팅 없음
```

### 5. 특정 위치에 텍스트 삽입

특정 문자 위치에 텍스트 삽입:

```javascript
class PositionalTextInserter {
  constructor(editor) {
    this.editor = editor;
  }
  
  getCharacterOffset() {
    const selection = window.getSelection();
    if (selection.rangeCount === 0) return 0;
    
    const range = selection.getRangeAt(0);
    const preRange = range.cloneRange();
    preRange.selectNodeContents(this.editor);
    preRange.setEnd(range.startContainer, range.startOffset);
    
    return preRange.toString().length;
  }
  
  setCharacterOffset(offset) {
    const selection = window.getSelection();
    const range = document.createRange();
    
    let currentOffset = 0;
    const walker = document.createTreeWalker(
      this.editor,
      NodeFilter.SHOW_TEXT,
      null
    );
    
    let node;
    while (node = walker.nextNode()) {
      const nodeLength = node.textContent.length;
      
      if (currentOffset + nodeLength >= offset) {
        const nodeOffset = offset - currentOffset;
        range.setStart(node, nodeOffset);
        range.setEnd(node, nodeOffset);
        break;
      }
      
      currentOffset += nodeLength;
    }
    
    selection.removeAllRanges();
    selection.addRange(range);
  }
  
  insertTextAtOffset(text, offset) {
    this.setCharacterOffset(offset);
    this.insertText(text);
  }
  
  insertText(text) {
    const selection = window.getSelection();
    if (selection.rangeCount === 0) return;
    
    const range = selection.getRangeAt(0);
    
    if (!range.collapsed) {
      range.deleteContents();
    }
    
    const textNode = document.createTextNode(text);
    range.insertNode(textNode);
    
    range.setStartAfter(textNode);
    range.collapse(true);
    
    selection.removeAllRanges();
    selection.addRange(range);
  }
}

// 사용법
const editor = document.querySelector('div[contenteditable]');
const inserter = new PositionalTextInserter(editor);

// 현재 커서 위치에 삽입
inserter.insertText('Hello');

// 특정 문자 오프셋에 삽입
inserter.insertTextAtOffset('World', 5);
```

### 6. 완전한 텍스트 삽입 관리자

여러 삽입 방법을 제공하는 포괄적인 해결책:

```javascript
class TextInsertionManager {
  constructor(editor) {
    this.editor = editor;
    this.init();
  }
  
  init() {
    // 키보드 단축키 처리
    this.editor.addEventListener('keydown', (e) => {
      // Ctrl+Shift+T로 타임스탬프 삽입
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'T') {
        e.preventDefault();
        this.insertText(new Date().toLocaleString());
      }
    });
  }
  
  insertText(text, options = {}) {
    const {
      replaceSelection = true,
      moveCursorAfter = true,
      selectInserted = false,
    } = options;
    
    const selection = window.getSelection();
    if (selection.rangeCount === 0) return;
    
    const range = selection.getRangeAt(0);
    
    // 교체하는 경우 선택된 내용 삭제
    if (replaceSelection && !range.collapsed) {
      range.deleteContents();
    }
    
    // 텍스트 삽입
    const textNode = document.createTextNode(text);
    range.insertNode(textNode);
    
    // 커서/선택 처리
    if (selectInserted) {
      range.selectNodeContents(textNode);
    } else if (moveCursorAfter) {
      range.setStartAfter(textNode);
      range.collapse(true);
    }
    
    selection.removeAllRanges();
    selection.addRange(range);
    
    // 프레임워크 호환성을 위해 input 이벤트 트리거
    this.editor.dispatchEvent(new Event('input', { bubbles: true }));
  }
  
  insertFormattedText(text, formatTag, attributes = {}) {
    const selection = window.getSelection();
    if (selection.rangeCount === 0) return;
    
    const range = selection.getRangeAt(0);
    
    if (!range.collapsed) {
      range.deleteContents();
    }
    
    // 포맷된 요소 생성
    const element = document.createElement(formatTag);
    Object.entries(attributes).forEach(([key, value]) => {
      element.setAttribute(key, value);
    });
    element.textContent = text;
    
    range.insertNode(element);
    
    // 요소 뒤로 커서 이동
    range.setStartAfter(element);
    range.collapse(true);
    
    selection.removeAllRanges();
    selection.addRange(range);
    
    this.editor.dispatchEvent(new Event('input', { bubbles: true }));
  }
  
  insertHTML(html) {
    const selection = window.getSelection();
    if (selection.rangeCount === 0) return;
    
    const range = selection.getRangeAt(0);
    
    if (!range.collapsed) {
      range.deleteContents();
    }
    
    // 임시 컨테이너 생성
    const temp = document.createElement('div');
    temp.innerHTML = html;
    
    // 모든 노드 삽입
    const fragment = document.createDocumentFragment();
    while (temp.firstChild) {
      fragment.appendChild(temp.firstChild);
    }
    
    range.insertNode(fragment);
    
    // 삽입된 콘텐츠 뒤로 커서 이동
    range.setStartAfter(fragment.lastChild || fragment);
    range.collapse(true);
    
    selection.removeAllRanges();
    selection.addRange(range);
    
    this.editor.dispatchEvent(new Event('input', { bubbles: true }));
  }
  
  insertAtPosition(text, position) {
    // 현재 선택 저장
    const selection = window.getSelection();
    const savedRange = selection.rangeCount > 0 
      ? selection.getRangeAt(0).cloneRange() 
      : null;
    
    // 위치 설정
    this.setCursorPosition(position);
    
    // 텍스트 삽입
    this.insertText(text);
    
    // 필요시 선택 복원
    if (savedRange) {
      selection.removeAllRanges();
      selection.addRange(savedRange);
    }
  }
  
  setCursorPosition(position) {
    const selection = window.getSelection();
    const range = document.createRange();
    
    let offset = 0;
    const walker = document.createTreeWalker(
      this.editor,
      NodeFilter.SHOW_TEXT,
      null
    );
    
    let node;
    while (node = walker.nextNode()) {
      const nodeLength = node.textContent.length;
      
      if (offset + nodeLength >= position) {
        const nodeOffset = position - offset;
        range.setStart(node, Math.min(nodeOffset, nodeLength));
        range.setEnd(node, Math.min(nodeOffset, nodeLength));
        break;
      }
      
      offset += nodeLength;
    }
    
    // 위치가 콘텐츠를 넘어서면 끝에 설정
    if (!node) {
      range.selectNodeContents(this.editor);
      range.collapse(false);
    }
    
    selection.removeAllRanges();
    selection.addRange(range);
  }
}

// 사용법
const editor = document.querySelector('div[contenteditable]');
const manager = new TextInsertionManager(editor);

// 일반 텍스트 삽입
manager.insertText('Hello, World!');

// 포맷된 텍스트 삽입
manager.insertFormattedText('굵은 텍스트', 'strong');
manager.insertFormattedText('링크', 'a', { href: 'https://example.com' });

// HTML 삽입
manager.insertHTML('<strong>굵게</strong> 및 <em>기울임</em>');

// 옵션과 함께 삽입
manager.insertText('선택된 텍스트', { selectInserted: true });
```

## 주의사항

- 텍스트를 삽입하기 전에 항상 선택이 존재하는지 확인하세요
- 삽입하기 전에 선택된 내용을 삭제하여 선택을 교체하세요
- 삽입된 텍스트 뒤로 커서를 이동하여 편집 흐름을 유지하세요
- 일반 텍스트의 경우 XSS를 방지하기 위해 `document.createTextNode()`를 사용하세요
- HTML 삽입의 경우 보안 문제를 방지하기 위해 콘텐츠를 정화하세요
- 삽입 후 프레임워크 호환성을 위해 `input` 이벤트를 트리거하세요
- IME 컴포지션으로 테스트하세요 - 일부 브라우저는 컴포지션 중 삽입을 다르게 처리합니다
- 구형 브라우저를 위한 대체 방법으로 `execCommand('insertText')` 사용을 고려하세요 (사용 중단되었지만 널리 지원됨)

## 브라우저 호환성

- **Chrome/Edge**: 모든 방법 완전 지원
- **Firefox**: 좋은 지원이지만 `insertNode` 동작이 약간 다를 수 있습니다
- **Safari**: 잘 작동하지만 IME 컴포지션으로 테스트하세요

## 관련 자료

- [실용 패턴: 텍스트 삽입](/docs/practical-patterns#insert-text-pattern)
- [Tip: 포맷 토글 패턴](/tips/tip-015-format-toggle-pattern)
