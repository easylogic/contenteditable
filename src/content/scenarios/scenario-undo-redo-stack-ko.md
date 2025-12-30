---
id: scenario-undo-redo-stack
title: 실행 취소/다시 실행 스택 관리가 일관되지 않음
description: "contenteditable 요소의 실행 취소/다시 실행 스택은 브라우저마다 일관되지 않게 동작합니다. 프로그래밍 방식 DOM 변경이 실행 취소 스택에 추가되거나 추가되지 않을 수 있으며, 스택이 예상치 못하게 지워질 수 있습니다. 사용자 정의 실행 취소/다시 실행 구현이 종종 필요합니다."
category: other
tags:
  - undo
  - redo
  - history
  - stack
status: draft
locale: ko
---

contenteditable 요소의 실행 취소/다시 실행 스택은 브라우저마다 일관되지 않게 동작합니다. 프로그래밍 방식 DOM 변경이 실행 취소 스택에 추가되거나 추가되지 않을 수 있으며, 스택이 예상치 못하게 지워질 수 있습니다. 사용자 정의 실행 취소/다시 실행 구현이 종종 필요합니다.

## 관찰된 동작

### 시나리오 1: 프로그래밍 방식 DOM 변경
- **Chrome/Edge**: 변경이 실행 취소 스택에 추가되지 않을 수 있습니다
- **Firefox**: 유사한 동작입니다
- **Safari**: 실행 취소 스택 처리가 다릅니다

### 시나리오 2: preventDefault() 작업
- **Chrome/Edge**: 사용자 정의 작업이 실행 취소 스택에 없을 수 있습니다
- **Firefox**: 유사한 문제가 있습니다
- **Safari**: 실행 취소 스택이 가장 일관되지 않습니다

### 시나리오 3: 스택 지우기
- **Chrome/Edge**: 포커스 변경 시 스택이 지워질 수 있습니다
- **Firefox**: 유사한 동작입니다
- **Safari**: 스택 지우기가 가장 예측 불가능합니다

### 시나리오 4: 여러 실행 취소 작업
- **Chrome/Edge**: 한 번에 여러 작업을 실행 취소할 수 있습니다
- **Firefox**: 유사한 동작입니다
- **Safari**: 실행 취소 세분성이 다릅니다

## 영향

- 실행 취소 기록 손실
- 사용자 정의 작업 실행 취소 불가능
- 예상치 못한 스택 지우기
- 사용자 정의 실행 취소/다시 실행 구현 필요

## 브라우저 비교

- **Chrome/Edge**: 일반적으로 더 나은 실행 취소 스택 처리입니다
- **Firefox**: 실행 취소 기록을 잃을 가능성이 더 높습니다
- **Safari**: 가장 일관되지 않은 실행 취소 동작입니다

## 해결 방법

사용자 정의 실행 취소/다시 실행을 구현합니다:

```javascript
class UndoRedoManager {
  constructor(element) {
    this.element = element;
    this.undoStack = [];
    this.redoStack = [];
    this.maxStackSize = 50;
  }
  
  saveState() {
    const state = {
      html: this.element.innerHTML,
      selection: this.saveSelection()
    };
    
    this.undoStack.push(state);
    if (this.undoStack.length > this.maxStackSize) {
      this.undoStack.shift();
    }
    this.redoStack = []; // 새 작업에서 다시 실행 스택 지우기
  }
  
  undo() {
    if (this.undoStack.length === 0) return;
    
    const currentState = {
      html: this.element.innerHTML,
      selection: this.saveSelection()
    };
    this.redoStack.push(currentState);
    
    const previousState = this.undoStack.pop();
    this.restoreState(previousState);
  }
  
  redo() {
    if (this.redoStack.length === 0) return;
    
    const currentState = {
      html: this.element.innerHTML,
      selection: this.saveSelection()
    };
    this.undoStack.push(currentState);
    
    const nextState = this.redoStack.pop();
    this.restoreState(nextState);
  }
  
  restoreState(state) {
    this.element.innerHTML = state.html;
    this.restoreSelection(state.selection);
  }
  
  saveSelection() {
    const selection = window.getSelection();
    if (selection.rangeCount === 0) return null;
    const range = selection.getRangeAt(0);
    return {
      startContainer: range.startContainer,
      startOffset: range.startOffset,
      endContainer: range.endContainer,
      endOffset: range.endOffset
    };
  }
  
  restoreSelection(saved) {
    if (!saved) return;
    try {
      const range = document.createRange();
      range.setStart(saved.startContainer, saved.startOffset);
      range.setEnd(saved.endContainer, saved.endOffset);
      const selection = window.getSelection();
      selection.removeAllRanges();
      selection.addRange(range);
    } catch (e) {
      // 선택이 유효하지 않음, 무시
    }
  }
}

const undoRedo = new UndoRedoManager(element);

element.addEventListener('input', () => {
  undoRedo.saveState();
});

// Ctrl+Z 및 Ctrl+Y 처리
element.addEventListener('keydown', (e) => {
  if (e.ctrlKey || e.metaKey) {
    if (e.key === 'z' && !e.shiftKey) {
      e.preventDefault();
      undoRedo.undo();
    } else if ((e.key === 'y') || (e.key === 'z' && e.shiftKey)) {
      e.preventDefault();
      undoRedo.redo();
    }
  }
});
```
