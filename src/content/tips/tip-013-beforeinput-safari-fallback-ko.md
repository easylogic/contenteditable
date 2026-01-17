---
id: tip-013-beforeinput-safari-fallback-ko
title: Safari와의 beforeinput 이벤트 호환성 처리하기
description: "beforeinput 이벤트를 지원하지 않는 Safari를 포함하여 모든 브라우저에서 작동하는 입력 가로채기 구현 방법"
category: browser-feature
tags:
  - beforeinput
  - events
  - safari
  - compatibility
  - input-handling
  - polyfill
difficulty: intermediate
relatedScenarios:
  - scenario-beforeinput-support
relatedCases:
  - ce-0043-beforeinput-not-supported
locale: ko
---

## 문제

`beforeinput` 이벤트는 DOM에 커밋되기 전에 입력을 가로채고 수정하는 데 중요하지만, Safari는 이를 지원하지 않습니다. 이로 인해 모든 브라우저에서 일관되게 작동하는 사용자 정의 입력 처리를 구현하기 어렵습니다. `beforeinput` 없이는 입력이 DOM에 나타나기 전에 입력을 방지하거나 수정할 수 없으며, 이는 입력 검증, 포맷팅 또는 사용자 정의 동작과 같은 기능에 필수적입니다.

## 해결 방법

### 1. input 이벤트를 대체로 사용

Safari의 경우 `input` 이벤트를 사용하고 필요시 변경을 취소합니다:

```javascript
const editor = document.querySelector('div[contenteditable]');
let isHandlingInput = false;

// 지원되는 브라우저에 대해 beforeinput 사용
editor.addEventListener('beforeinput', (e) => {
  if (isHandlingInput) return;
  
  // 입력 수정 처리
  if (e.inputType === 'insertText') {
    const text = e.data;
    // 입력 수정 또는 방지
    if (shouldPreventInput(text)) {
      e.preventDefault();
      return;
    }
    
    // 입력 수정
    if (shouldModifyInput(text)) {
      e.preventDefault();
      insertTextAtCursor(transformText(text));
    }
  }
});

// Safari 대체
editor.addEventListener('input', (e) => {
  if (isHandlingInput) return;
  
  // beforeinput 지원 여부 확인
  if (typeof InputEvent.prototype.getTargetRanges === 'function') {
    // beforeinput이 지원됨, 건너뛰기
    return;
  }
  
  // Safari 대체: 수정 사항으로 취소 및 재실행
  isHandlingInput = true;
  
  const selection = window.getSelection();
  if (selection.rangeCount === 0) {
    isHandlingInput = false;
    return;
  }
  
  const range = selection.getRangeAt(0);
  const insertedText = getLastInsertedText(editor);
  
  if (insertedText && shouldModifyInput(insertedText)) {
    // 변경 취소
    document.execCommand('undo', false);
    
    // 수정된 텍스트 삽입
    insertTextAtCursor(transformText(insertedText));
  }
  
  isHandlingInput = false;
});

function getLastInsertedText(element) {
  // 이것은 단순화된 접근법입니다 - 실제로는 변경 사항을 추적해야 합니다
  const selection = window.getSelection();
  if (selection.rangeCount === 0) return null;
  
  const range = selection.getRangeAt(0);
  const text = range.toString();
  return text;
}

function insertTextAtCursor(text) {
  const selection = window.getSelection();
  if (selection.rangeCount === 0) return;
  
  const range = selection.getRangeAt(0);
  range.deleteContents();
  const textNode = document.createTextNode(text);
  range.insertNode(textNode);
  range.collapse(false);
  
  selection.removeAllRanges();
  selection.addRange(range);
}
```

### 2. beforeinput 지원 감지

지원을 감지하고 적절한 핸들러를 사용하는 유틸리티 생성:

```javascript
function supportsBeforeInput() {
  // beforeinput 지원 여부 확인
  const input = document.createElement('input');
  return 'onbeforeinput' in input || typeof InputEvent.prototype.getTargetRanges === 'function';
}

const editor = document.querySelector('div[contenteditable]');

if (supportsBeforeInput()) {
  // Chrome, Firefox, Edge에 대해 beforeinput 사용
  editor.addEventListener('beforeinput', handleBeforeInput);
} else {
  // Safari에 대해 input + execCommand 사용
  editor.addEventListener('input', handleInputSafari);
  editor.addEventListener('keydown', handleKeyDownSafari);
}

function handleBeforeInput(e) {
  // 표준 beforeinput 처리
  if (e.inputType === 'insertText') {
    const text = e.data;
    if (shouldPrevent(text)) {
      e.preventDefault();
    } else if (shouldModify(text)) {
      e.preventDefault();
      insertText(transform(text));
    }
  }
}

function handleInputSafari(e) {
  // input 이벤트를 사용한 Safari 특정 처리
  // 변경된 내용을 추적해야 하므로 더 복잡합니다
}

function handleKeyDownSafari(e) {
  // 입력이 발생하기 전에 가로채기
  if (e.key.length === 1) {
    const char = e.key;
    if (shouldPrevent(char)) {
      e.preventDefault();
      return;
    }
    
    if (shouldModify(char)) {
      e.preventDefault();
      insertText(transform(char));
    }
  }
}
```

### 3. Safari 대체를 위한 변경 사항 추적

Safari의 경우 DOM 변경 사항을 추적하여 beforeinput과 유사한 동작을 구현합니다:

```javascript
class InputHandler {
  constructor(editor) {
    this.editor = editor;
    this.lastContent = editor.innerHTML;
    this.supportsBeforeInput = this.checkSupport();
    this.init();
  }
  
  checkSupport() {
    return typeof InputEvent.prototype.getTargetRanges === 'function';
  }
  
  init() {
    if (this.supportsBeforeInput) {
      this.editor.addEventListener('beforeinput', this.handleBeforeInput.bind(this));
    } else {
      // Safari 대체
      this.editor.addEventListener('input', this.handleInputSafari.bind(this));
      this.editor.addEventListener('keydown', this.handleKeyDownSafari.bind(this));
    }
  }
  
  handleBeforeInput(e) {
    if (e.inputType === 'insertText') {
      const text = e.data;
      if (this.shouldModify(text)) {
        e.preventDefault();
        this.insertText(this.transform(text));
      }
    }
  }
  
  handleInputSafari(e) {
    // 현재 콘텐츠와 마지막으로 알려진 콘텐츠 비교
    const currentContent = this.editor.innerHTML;
    const diff = this.getDiff(this.lastContent, currentContent);
    
    if (diff.inserted) {
      const text = diff.inserted;
      if (this.shouldModify(text)) {
        // 변경 취소
        document.execCommand('undo', false);
        
        // 수정된 버전 삽입
        this.insertText(this.transform(text));
      }
    }
    
    this.lastContent = this.editor.innerHTML;
  }
  
  handleKeyDownSafari(e) {
    // 인쇄 가능한 문자 가로채기
    if (e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey) {
      const char = e.key;
      
      if (this.shouldPrevent(char)) {
        e.preventDefault();
        return;
      }
      
      if (this.shouldModify(char)) {
        e.preventDefault();
        this.insertText(this.transform(char));
      }
    }
  }
  
  getDiff(oldContent, newContent) {
    // 단순화된 diff - 실제로는 적절한 diff 알고리즘 사용
    // 이것은 기본 구현입니다
    const oldText = this.getTextContent(oldContent);
    const newText = this.getTextContent(newContent);
    
    if (newText.length > oldText.length) {
      return {
        inserted: newText.slice(oldText.length)
      };
    }
    
    return {};
  }
  
  getTextContent(html) {
    const div = document.createElement('div');
    div.innerHTML = html;
    return div.textContent || div.innerText || '';
  }
  
  shouldModify(text) {
    // 수정 로직
    return false;
  }
  
  shouldPrevent(text) {
    // 방지 로직
    return false;
  }
  
  transform(text) {
    // 변환 로직
    return text;
  }
  
  insertText(text) {
    const selection = window.getSelection();
    if (selection.rangeCount === 0) return;
    
    const range = selection.getRangeAt(0);
    range.deleteContents();
    const textNode = document.createTextNode(text);
    range.insertNode(textNode);
    range.collapse(false);
    
    selection.removeAllRanges();
    selection.addRange(range);
  }
}

// 사용법
const editor = document.querySelector('div[contenteditable]');
const handler = new InputHandler(editor);
```

### 4. textInput 이벤트 사용 (사용 중단되었지만 사용 가능)

Safari는 `input` 전에 발생하는 사용 중단된 `textInput` 이벤트를 지원합니다:

```javascript
const editor = document.querySelector('div[contenteditable]');

// 최신 브라우저에 대해 beforeinput 사용
editor.addEventListener('beforeinput', (e) => {
  if (e.inputType === 'insertText') {
    const text = e.data;
    if (shouldModify(text)) {
      e.preventDefault();
      insertText(transform(text));
    }
  }
});

// Safari 대체로 textInput 사용 (사용 중단되었지만 작동함)
editor.addEventListener('textInput', (e) => {
  const text = e.data;
  if (shouldModify(text)) {
    e.preventDefault();
    insertText(transform(text));
  }
}, { passive: false });
```

**참고**: `textInput`은 사용 중단되었으며 모든 입력 타입(IME 컴포지션 등)에 대해 작동하지 않을 수 있습니다.

### 5. 포괄적인 크로스 브라우저 입력 핸들러

모든 브라우저를 처리하는 완전한 해결책:

```javascript
class CrossBrowserInputHandler {
  constructor(editor) {
    this.editor = editor;
    this.supportsBeforeInput = this.detectBeforeInputSupport();
    this.lastState = this.captureState();
    this.init();
  }
  
  detectBeforeInputSupport() {
    // 지원을 감지하는 여러 방법 확인
    const input = document.createElement('input');
    return 'onbeforeinput' in input || 
           typeof InputEvent.prototype.getTargetRanges === 'function' ||
           'getTargetRanges' in InputEvent.prototype;
  }
  
  init() {
    if (this.supportsBeforeInput) {
      this.editor.addEventListener('beforeinput', this.handleBeforeInput.bind(this));
    } else {
      // Safari 대체 전략
      this.editor.addEventListener('keydown', this.handleKeyDown.bind(this));
      this.editor.addEventListener('input', this.handleInput.bind(this));
      this.editor.addEventListener('textInput', this.handleTextInput.bind(this));
    }
  }
  
  handleBeforeInput(e) {
    // 표준 beforeinput 처리
    if (e.inputType === 'insertText') {
      this.processInput(e.data, (modified) => {
        if (modified !== e.data) {
          e.preventDefault();
          this.insertText(modified);
        }
      });
    } else if (e.inputType === 'insertCompositionText') {
      // IME 컴포지션 처리
      this.processInput(e.data, (modified) => {
        if (modified !== e.data) {
          e.preventDefault();
          this.insertText(modified);
        }
      });
    }
  }
  
  handleKeyDown(e) {
    // Safari: 입력 전 가로채기
    if (e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey) {
      this.processInput(e.key, (modified) => {
        if (modified !== e.key) {
          e.preventDefault();
          this.insertText(modified);
        }
      });
    }
  }
  
  handleTextInput(e) {
    // Safari: textInput 이벤트 (사용 중단되었지만 사용 가능)
    this.processInput(e.data, (modified) => {
      if (modified !== e.data) {
        e.preventDefault();
        this.insertText(modified);
      }
    });
  }
  
  handleInput(e) {
    // Safari: keydown/textInput이 잡지 못한 경우의 대체
    // 이것은 덜 이상적입니다. input은 DOM이 업데이트된 후에 발생하기 때문입니다
    const currentState = this.captureState();
    const diff = this.getStateDiff(this.lastState, currentState);
    
    if (diff.inserted) {
      this.processInput(diff.inserted, (modified) => {
        if (modified !== diff.inserted) {
          // 취소하고 수정으로 재실행
          document.execCommand('undo', false);
          this.insertText(modified);
        }
      });
    }
    
    this.lastState = currentState;
  }
  
  processInput(text, callback) {
    // 입력 처리 로직
    const modified = this.transform(text);
    callback(modified);
  }
  
  transform(text) {
    // 예시: 대문자 변환
    // 실제 변환 로직으로 교체
    return text.toUpperCase();
  }
  
  captureState() {
    const selection = window.getSelection();
    return {
      html: this.editor.innerHTML,
      text: this.editor.textContent,
      selection: selection.rangeCount > 0 ? {
        start: selection.getRangeAt(0).startOffset,
        end: selection.getRangeAt(0).endOffset
      } : null
    };
  }
  
  getStateDiff(oldState, newState) {
    if (newState.text.length > oldState.text.length) {
      return {
        inserted: newState.text.slice(oldState.text.length)
      };
    }
    return {};
  }
  
  insertText(text) {
    const selection = window.getSelection();
    if (selection.rangeCount === 0) return;
    
    const range = selection.getRangeAt(0);
    range.deleteContents();
    const textNode = document.createTextNode(text);
    range.insertNode(textNode);
    range.collapse(false);
    
    selection.removeAllRanges();
    selection.addRange(range);
  }
  
  dispose() {
    this.editor.removeEventListener('beforeinput', this.handleBeforeInput);
    this.editor.removeEventListener('keydown', this.handleKeyDown);
    this.editor.removeEventListener('input', this.handleInput);
    this.editor.removeEventListener('textInput', this.handleTextInput);
  }
}

// 사용법
const editor = document.querySelector('div[contenteditable]');
const handler = new CrossBrowserInputHandler(editor);
```

## 주의사항

- Safari는 `beforeinput`을 지원하지 않으므로 대체 전략이 필요합니다
- `textInput` 이벤트(사용 중단됨)는 Safari에서 사용할 수 있지만 제한이 있습니다
- `input` 이벤트 + `execCommand('undo')` 사용은 해결책이지만 신뢰할 수 없을 수 있습니다
- `keydown` 이벤트는 문자를 가로챌 수 있지만 IME 컴포지션이나 붙여넣기에는 작동하지 않습니다
- IME 컴포지션 처리는 `beforeinput` 없이 Safari에서 특히 어렵습니다
- 이러한 크로스 브라우저 차이를 처리하는 ProseMirror나 Slate와 같은 라이브러리 사용을 고려하세요
- 다양한 입력 방법(키보드, IME, 붙여넣기, 드래그 앤 드롭)으로 철저히 테스트하세요
- InputEvent의 `getTargetRanges()` 메서드를 사용하여 `beforeinput` 지원을 감지할 수 있습니다

## 관련 자료

- [시나리오: beforeinput 이벤트 지원](/scenarios/scenario-beforeinput-support)
- [케이스: ce-0043](/cases/ce-0043-beforeinput-not-supported)
