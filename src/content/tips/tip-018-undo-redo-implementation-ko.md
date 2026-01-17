---
id: tip-018-undo-redo-implementation-ko
title: Undo/Redo 기능 구현하기
description: "모든 브라우저에서 안정적으로 작동하는 contenteditable용 사용자 정의 undo/redo 스택 구현 방법"
category: common-patterns
tags:
  - undo
  - redo
  - history
  - stack
  - state-management
  - pattern
difficulty: advanced
relatedScenarios:
  - scenario-undo-redo-stack
relatedCases: []
locale: ko
---

## 이 Tip을 사용할 때

다음과 같은 경우에 이 패턴을 사용하세요:
- 사용자 정의 undo/redo 기능 구현
- 에디터 상태 변경 추적
- 선택과 함께 이전 상태 복원
- 프레임워크(React, Vue 등)에서 undo/redo 처리
- 브라우저의 기본 undo/redo 동작 재정의

## 문제

브라우저의 기본 undo/redo 스택에는 제한이 있습니다:
- 프로그래밍 방식 DOM 변경이 포함되지 않음
- 예상치 못하게 지워질 수 있음
- 선택 위치를 보존하지 않음
- 브라우저 간 일관되지 않은 동작
- 추적할 내용을 사용자 정의할 수 없음

## 해결 방법

### 1. 기본 Undo/Redo 스택

HTML 상태를 사용한 간단한 구현:

```javascript
class UndoRedoStack {
  constructor(editor, maxSize = 50) {
    this.editor = editor;
    this.undoStack = [];
    this.redoStack = [];
    this.maxSize = maxSize;
    this.isUndoing = false;
    this.isRedoing = false;
    this.init();
  }
  
  init() {
    // 초기 상태 저장
    this.saveState();
    
    // 변경 사항 수신
    this.editor.addEventListener('input', () => {
      if (!this.isUndoing && !this.isRedoing) {
        this.saveState();
      }
    });
    
    // 키보드 단축키 처리
    this.editor.addEventListener('keydown', (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'z' && !e.shiftKey) {
        e.preventDefault();
        this.undo();
      } else if ((e.ctrlKey || e.metaKey) && (e.key === 'y' || (e.key === 'z' && e.shiftKey))) {
        e.preventDefault();
        this.redo();
      }
    });
  }
  
  saveState() {
    const state = {
      html: this.editor.innerHTML,
      selection: this.saveSelection(),
      timestamp: Date.now(),
    };
    
    this.undoStack.push(state);
    
    // 스택 크기 제한
    if (this.undoStack.length > this.maxSize) {
      this.undoStack.shift();
    }
    
    // 새 작업 시 redo 스택 지우기
    this.redoStack = [];
  }
  
  saveSelection() {
    const selection = window.getSelection();
    if (selection.rangeCount === 0) return null;
    
    const range = selection.getRangeAt(0);
    
    // 문자 오프셋 계산
    const startRange = range.cloneRange();
    startRange.selectNodeContents(this.editor);
    startRange.setEnd(range.startContainer, range.startOffset);
    const startOffset = startRange.toString().length;
    
    const endRange = range.cloneRange();
    endRange.selectNodeContents(this.editor);
    endRange.setEnd(range.endContainer, range.endOffset);
    const endOffset = endRange.toString().length;
    
    return {
      start: startOffset,
      end: endOffset,
      collapsed: range.collapsed,
    };
  }
  
  restoreSelection(saved) {
    if (!saved) return;
    
    const selection = window.getSelection();
    const range = document.createRange();
    
    // 시작 위치 찾기
    let currentOffset = 0;
    const walker = document.createTreeWalker(
      this.editor,
      NodeFilter.SHOW_TEXT,
      null
    );
    
    let startNode = null;
    let startOffset = 0;
    let node;
    
    while (node = walker.nextNode()) {
      const nodeLength = node.textContent.length;
      
      if (currentOffset + nodeLength >= saved.start) {
        startNode = node;
        startOffset = saved.start - currentOffset;
        break;
      }
      
      currentOffset += nodeLength;
    }
    
    if (!startNode) return;
    
    range.setStart(startNode, startOffset);
    
    if (saved.collapsed) {
      range.collapse(true);
    } else {
      // 끝 위치 찾기
      currentOffset = 0;
      const walker = document.createTreeWalker(
        this.editor,
        NodeFilter.SHOW_TEXT,
        null
      );
      
      while (node = walker.nextNode()) {
        const nodeLength = node.textContent.length;
        
        if (currentOffset + nodeLength >= saved.end) {
          const endNode = node;
          const endOffset = saved.end - currentOffset;
          range.setEnd(endNode, endOffset);
          break;
        }
        
        currentOffset += nodeLength;
      }
    }
    
    selection.removeAllRanges();
    selection.addRange(range);
  }
  
  undo() {
    if (this.undoStack.length <= 1) return; // 최소한 초기 상태 유지
    
    this.isUndoing = true;
    
    // 현재 상태를 redo 스택에 저장
    const currentState = {
      html: this.editor.innerHTML,
      selection: this.saveSelection(),
      timestamp: Date.now(),
    };
    this.redoStack.push(currentState);
    
    // undo 스택에서 팝
    this.undoStack.pop();
    const previousState = this.undoStack[this.undoStack.length - 1];
    
    // 상태 복원
    this.restoreState(previousState);
    
    this.isUndoing = false;
  }
  
  redo() {
    if (this.redoStack.length === 0) return;
    
    this.isRedoing = true;
    
    // redo 스택에서 상태 가져오기
    const nextState = this.redoStack.pop();
    
    // 현재 상태를 undo 스택에 저장
    const currentState = {
      html: this.editor.innerHTML,
      selection: this.saveSelection(),
      timestamp: Date.now(),
    };
    this.undoStack.push(currentState);
    
    // 상태 복원
    this.restoreState(nextState);
    
    this.isRedoing = false;
  }
  
  restoreState(state) {
    this.editor.innerHTML = state.html;
    
    // DOM 업데이트 후 선택 복원
    setTimeout(() => {
      this.restoreSelection(state.selection);
    }, 0);
  }
  
  canUndo() {
    return this.undoStack.length > 1;
  }
  
  canRedo() {
    return this.redoStack.length > 0;
  }
  
  clear() {
    this.undoStack = [];
    this.redoStack = [];
    this.saveState();
  }
}

// 사용법
const editor = document.querySelector('div[contenteditable]');
const undoRedo = new UndoRedoStack(editor);
```

### 2. 디바운스된 Undo/Redo 스택

너무 많은 상태를 피하기 위해 디바운싱으로 상태 저장:

```javascript
class DebouncedUndoRedoStack {
  constructor(editor, maxSize = 50, debounceMs = 300) {
    this.editor = editor;
    this.undoStack = [];
    this.redoStack = [];
    this.maxSize = maxSize;
    this.debounceMs = debounceMs;
    this.saveTimeout = null;
    this.isUndoing = false;
    this.isRedoing = false;
    this.init();
  }
  
  init() {
    this.saveState();
    
    this.editor.addEventListener('input', () => {
      if (!this.isUndoing && !this.isRedoing) {
        this.debouncedSave();
      }
    });
    
    this.editor.addEventListener('keydown', (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'z' && !e.shiftKey) {
        e.preventDefault();
        this.undo();
      } else if ((e.ctrlKey || e.metaKey) && (e.key === 'y' || (e.key === 'z' && e.shiftKey))) {
        e.preventDefault();
        this.redo();
      }
    });
  }
  
  debouncedSave() {
    if (this.saveTimeout) {
      clearTimeout(this.saveTimeout);
    }
    
    this.saveTimeout = setTimeout(() => {
      this.saveState();
    }, this.debounceMs);
  }
  
  saveState() {
    if (this.saveTimeout) {
      clearTimeout(this.saveTimeout);
      this.saveTimeout = null;
    }
    
    const state = {
      html: this.editor.innerHTML,
      selection: this.saveSelection(),
      timestamp: Date.now(),
    };
    
    // 마지막 상태와 동일하면 저장하지 않음
    if (this.undoStack.length > 0) {
      const lastState = this.undoStack[this.undoStack.length - 1];
      if (lastState.html === state.html) {
        return; // 변경 없음
      }
    }
    
    this.undoStack.push(state);
    
    if (this.undoStack.length > this.maxSize) {
      this.undoStack.shift();
    }
    
    this.redoStack = [];
  }
  
  saveSelection() {
    const selection = window.getSelection();
    if (selection.rangeCount === 0) return null;
    
    const range = selection.getRangeAt(0);
    
    const startRange = range.cloneRange();
    startRange.selectNodeContents(this.editor);
    startRange.setEnd(range.startContainer, range.startOffset);
    const startOffset = startRange.toString().length;
    
    const endRange = range.cloneRange();
    endRange.selectNodeContents(this.editor);
    endRange.setEnd(range.endContainer, range.endOffset);
    const endOffset = endRange.toString().length;
    
    return {
      start: startOffset,
      end: endOffset,
      collapsed: range.collapsed,
    };
  }
  
  restoreSelection(saved) {
    if (!saved) return;
    
    const selection = window.getSelection();
    const range = document.createRange();
    
    let currentOffset = 0;
    const walker = document.createTreeWalker(
      this.editor,
      NodeFilter.SHOW_TEXT,
      null
    );
    
    let startNode = null;
    let startOffset = 0;
    let node;
    
    while (node = walker.nextNode()) {
      const nodeLength = node.textContent.length;
      
      if (currentOffset + nodeLength >= saved.start) {
        startNode = node;
        startOffset = saved.start - currentOffset;
        break;
      }
      
      currentOffset += nodeLength;
    }
    
    if (!startNode) return;
    
    range.setStart(startNode, startOffset);
    
    if (saved.collapsed) {
      range.collapse(true);
    } else {
      currentOffset = 0;
      const walker = document.createTreeWalker(
        this.editor,
        NodeFilter.SHOW_TEXT,
        null
      );
      
      while (node = walker.nextNode()) {
        const nodeLength = node.textContent.length;
        
        if (currentOffset + nodeLength >= saved.end) {
          const endNode = node;
          const endOffset = saved.end - currentOffset;
          range.setEnd(endNode, endOffset);
          break;
        }
        
        currentOffset += nodeLength;
      }
    }
    
    selection.removeAllRanges();
    selection.addRange(range);
  }
  
  undo() {
    if (this.undoStack.length <= 1) return;
    
    this.isUndoing = true;
    
    // 현재 상태 저장
    const currentState = {
      html: this.editor.innerHTML,
      selection: this.saveSelection(),
      timestamp: Date.now(),
    };
    this.redoStack.push(currentState);
    
    // 이전 상태 가져오기
    this.undoStack.pop();
    const previousState = this.undoStack[this.undoStack.length - 1];
    
    this.restoreState(previousState);
    
    this.isUndoing = false;
  }
  
  redo() {
    if (this.redoStack.length === 0) return;
    
    this.isRedoing = true;
    
    const nextState = this.redoStack.pop();
    
    const currentState = {
      html: this.editor.innerHTML,
      selection: this.saveSelection(),
      timestamp: Date.now(),
    };
    this.undoStack.push(currentState);
    
    this.restoreState(nextState);
    
    this.isRedoing = false;
  }
  
  restoreState(state) {
    this.editor.innerHTML = state.html;
    
    setTimeout(() => {
      this.restoreSelection(state.selection);
    }, 0);
  }
  
  canUndo() {
    return this.undoStack.length > 1;
  }
  
  canRedo() {
    return this.redoStack.length > 0;
  }
}

// 사용법
const editor = document.querySelector('div[contenteditable]');
const undoRedo = new DebouncedUndoRedoStack(editor, 50, 300);
```

### 3. beforeinput 이벤트 사용

더 나은 제어를 위해 `beforeinput` 이벤트 활용:

```javascript
class ModernUndoRedoStack {
  constructor(editor, maxSize = 50) {
    this.editor = editor;
    this.undoStack = [];
    this.redoStack = [];
    this.maxSize = maxSize;
    this.init();
  }
  
  init() {
    this.saveState();
    
    // undo/redo 가로채기
    this.editor.addEventListener('beforeinput', (e) => {
      if (e.inputType === 'historyUndo') {
        e.preventDefault();
        this.undo();
      } else if (e.inputType === 'historyRedo') {
        e.preventDefault();
        this.redo();
      } else {
        // 다른 입력 전에 상태 저장
        if (this.shouldSaveInput(e.inputType)) {
          this.saveState();
        }
      }
    });
    
    // beforeinput이 없는 브라우저를 위한 대체
    this.editor.addEventListener('keydown', (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'z' && !e.shiftKey) {
        e.preventDefault();
        this.undo();
      } else if ((e.ctrlKey || e.metaKey) && (e.key === 'y' || (e.key === 'z' && e.shiftKey))) {
        e.preventDefault();
        this.redo();
      }
    });
  }
  
  shouldSaveInput(inputType) {
    // 이러한 입력 타입에 대해 상태 저장
    const saveTypes = [
      'insertText',
      'insertParagraph',
      'deleteContent',
      'deleteContentBackward',
      'deleteContentForward',
      'formatBold',
      'formatItalic',
      'formatUnderline',
    ];
    
    return saveTypes.includes(inputType);
  }
  
  saveState() {
    const state = {
      html: this.editor.innerHTML,
      selection: this.saveSelection(),
      timestamp: Date.now(),
    };
    
    // 중복 상태 저장하지 않음
    if (this.undoStack.length > 0) {
      const lastState = this.undoStack[this.undoStack.length - 1];
      if (lastState.html === state.html) {
        return;
      }
    }
    
    this.undoStack.push(state);
    
    if (this.undoStack.length > this.maxSize) {
      this.undoStack.shift();
    }
    
    this.redoStack = [];
  }
  
  saveSelection() {
    const selection = window.getSelection();
    if (selection.rangeCount === 0) return null;
    
    const range = selection.getRangeAt(0);
    
    const startRange = range.cloneRange();
    startRange.selectNodeContents(this.editor);
    startRange.setEnd(range.startContainer, range.startOffset);
    const startOffset = startRange.toString().length;
    
    const endRange = range.cloneRange();
    endRange.selectNodeContents(this.editor);
    endRange.setEnd(range.endContainer, range.endOffset);
    const endOffset = endRange.toString().length;
    
    return {
      start: startOffset,
      end: endOffset,
      collapsed: range.collapsed,
    };
  }
  
  restoreSelection(saved) {
    if (!saved) return;
    
    const selection = window.getSelection();
    const range = document.createRange();
    
    let currentOffset = 0;
    const walker = document.createTreeWalker(
      this.editor,
      NodeFilter.SHOW_TEXT,
      null
    );
    
    let startNode = null;
    let startOffset = 0;
    let node;
    
    while (node = walker.nextNode()) {
      const nodeLength = node.textContent.length;
      
      if (currentOffset + nodeLength >= saved.start) {
        startNode = node;
        startOffset = saved.start - currentOffset;
        break;
      }
      
      currentOffset += nodeLength;
    }
    
    if (!startNode) return;
    
    range.setStart(startNode, startOffset);
    
    if (saved.collapsed) {
      range.collapse(true);
    } else {
      currentOffset = 0;
      const walker = document.createTreeWalker(
        this.editor,
        NodeFilter.SHOW_TEXT,
        null
      );
      
      while (node = walker.nextNode()) {
        const nodeLength = node.textContent.length;
        
        if (currentOffset + nodeLength >= saved.end) {
          const endNode = node;
          const endOffset = saved.end - currentOffset;
          range.setEnd(endNode, endOffset);
          break;
        }
        
        currentOffset += nodeLength;
      }
    }
    
    selection.removeAllRanges();
    selection.addRange(range);
  }
  
  undo() {
    if (this.undoStack.length <= 1) return;
    
    const currentState = {
      html: this.editor.innerHTML,
      selection: this.saveSelection(),
      timestamp: Date.now(),
    };
    this.redoStack.push(currentState);
    
    this.undoStack.pop();
    const previousState = this.undoStack[this.undoStack.length - 1];
    
    this.restoreState(previousState);
  }
  
  redo() {
    if (this.redoStack.length === 0) return;
    
    const nextState = this.redoStack.pop();
    
    const currentState = {
      html: this.editor.innerHTML,
      selection: this.saveSelection(),
      timestamp: Date.now(),
    };
    this.undoStack.push(currentState);
    
    this.restoreState(nextState);
  }
  
  restoreState(state) {
    this.editor.innerHTML = state.html;
    
    requestAnimationFrame(() => {
      this.restoreSelection(state.selection);
    });
  }
  
  canUndo() {
    return this.undoStack.length > 1;
  }
  
  canRedo() {
    return this.redoStack.length > 0;
  }
}

// 사용법
const editor = document.querySelector('div[contenteditable]');
const undoRedo = new ModernUndoRedoStack(editor);
```

### 4. React 통합

React 상태와 함께 undo/redo:

```jsx
import React, { useRef, useState, useCallback } from 'react';

function ContentEditableWithUndo({ initialValue = '' }) {
  const editorRef = useRef(null);
  const [undoStack, setUndoStack] = useState([{ html: initialValue, selection: null }]);
  const [redoStack, setRedoStack] = useState([]);
  const [currentHtml, setCurrentHtml] = useState(initialValue);
  const selectionRef = useRef(null);
  
  const saveSelection = useCallback(() => {
    const selection = window.getSelection();
    if (selection.rangeCount === 0) return null;
    
    const range = selection.getRangeAt(0);
    const editor = editorRef.current;
    
    const startRange = range.cloneRange();
    startRange.selectNodeContents(editor);
    startRange.setEnd(range.startContainer, range.startOffset);
    const startOffset = startRange.toString().length;
    
    const endRange = range.cloneRange();
    endRange.selectNodeContents(editor);
    endRange.setEnd(range.endContainer, range.endOffset);
    const endOffset = endRange.toString().length;
    
    return {
      start: startOffset,
      end: endOffset,
      collapsed: range.collapsed,
    };
  }, []);
  
  const restoreSelection = useCallback((saved) => {
    if (!saved || !editorRef.current) return;
    
    const selection = window.getSelection();
    const range = document.createRange();
    const editor = editorRef.current;
    
    let currentOffset = 0;
    const walker = document.createTreeWalker(
      editor,
      NodeFilter.SHOW_TEXT,
      null
    );
    
    let startNode = null;
    let startOffset = 0;
    let node;
    
    while (node = walker.nextNode()) {
      const nodeLength = node.textContent.length;
      
      if (currentOffset + nodeLength >= saved.start) {
        startNode = node;
        startOffset = saved.start - currentOffset;
        break;
      }
      
      currentOffset += nodeLength;
    }
    
    if (!startNode) return;
    
    range.setStart(startNode, startOffset);
    
    if (saved.collapsed) {
      range.collapse(true);
    } else {
      currentOffset = 0;
      const walker = document.createTreeWalker(
        editor,
        NodeFilter.SHOW_TEXT,
        null
      );
      
      while (node = walker.nextNode()) {
        const nodeLength = node.textContent.length;
        
        if (currentOffset + nodeLength >= saved.end) {
          const endNode = node;
          const endOffset = saved.end - currentOffset;
          range.setEnd(endNode, endOffset);
          break;
        }
        
        currentOffset += nodeLength;
      }
    }
    
    selection.removeAllRanges();
    selection.addRange(range);
  }, []);
  
  const handleInput = useCallback((e) => {
    const html = e.currentTarget.innerHTML;
    const selection = saveSelection();
    
    setCurrentHtml(html);
    setUndoStack(prev => {
      const newStack = [...prev, { html, selection }];
      return newStack.slice(-50); // 50개 상태로 제한
    });
    setRedoStack([]);
  }, [saveSelection]);
  
  const handleUndo = useCallback((e) => {
    e.preventDefault();
    
    setUndoStack(prev => {
      if (prev.length <= 1) return prev;
      
      const currentState = {
        html: currentHtml,
        selection: saveSelection(),
      };
      
      setRedoStack(red => [currentState, ...red]);
      
      const newStack = prev.slice(0, -1);
      const previousState = newStack[newStack.length - 1];
      
      setCurrentHtml(previousState.html);
      
      setTimeout(() => {
        restoreSelection(previousState.selection);
      }, 0);
      
      return newStack;
    });
  }, [currentHtml, saveSelection, restoreSelection]);
  
  const handleRedo = useCallback((e) => {
    e.preventDefault();
    
    setRedoStack(prev => {
      if (prev.length === 0) return prev;
      
      const currentState = {
        html: currentHtml,
        selection: saveSelection(),
      };
      
      setUndoStack(undo => [...undo, currentState]);
      
      const nextState = prev[0];
      const newRedoStack = prev.slice(1);
      
      setCurrentHtml(nextState.html);
      
      setTimeout(() => {
        restoreSelection(nextState.selection);
      }, 0);
      
      return newRedoStack;
    });
  }, [currentHtml, saveSelection, restoreSelection]);
  
  return (
    <div>
      <div className="toolbar">
        <button 
          onClick={handleUndo}
          disabled={undoStack.length <= 1}
        >
          실행 취소
        </button>
        <button 
          onClick={handleRedo}
          disabled={redoStack.length === 0}
        >
          다시 실행
        </button>
      </div>
      <div
        ref={editorRef}
        contentEditable
        onInput={handleInput}
        onKeyDown={(e) => {
          if ((e.ctrlKey || e.metaKey) && e.key === 'z' && !e.shiftKey) {
            handleUndo(e);
          } else if ((e.ctrlKey || e.metaKey) && (e.key === 'y' || (e.key === 'z' && e.shiftKey))) {
            handleRedo(e);
          }
        }}
        suppressContentEditableWarning
        dangerouslySetInnerHTML={{ __html: currentHtml }}
      />
    </div>
  );
}
```

## 주의사항

- 각 상태와 함께 선택을 저장하여 커서 위치 복원
- DOM 변경을 견디기 위해 선택에 문자 오프셋 사용
- 너무 많은 상태를 피하기 위해 상태 저장 디바운싱
- 중복 상태 저장하지 않음 (HTML 동등성 확인)
- 새 작업 발생 시 redo 스택 지우기
- DOM 업데이트 후 선택 복원에 `requestAnimationFrame` 또는 `setTimeout` 사용
- 메모리 문제를 방지하기 위해 스택 크기 제한
- React/Vue의 경우 프레임워크 상태 관리와 통합
- 빠른 타이핑과 대용량 문서로 테스트

## 브라우저 호환성

- **Chrome/Edge**: `historyUndo`/`historyRedo`가 있는 `beforeinput` 완전 지원
- **Firefox**: 좋은 지원이지만 선택 복원을 테스트하세요
- **Safari**: `beforeinput` 지원이 제한적입니다 - 키보드 이벤트 대체 사용

## 관련 자료

- [시나리오: Undo/redo 스택](/scenarios/scenario-undo-redo-stack)
- [Tip: 선택 처리 패턴](/tips/tip-017-selection-handling-pattern)
