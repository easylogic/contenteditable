---
id: tip-017-selection-handling-pattern-ko
title: 선택 범위 저장 및 복원하기
description: "특히 DOM 조작 후 contenteditable에서 선택 범위를 안정적으로 저장하고 복원하는 방법"
category: common-patterns
tags:
  - selection
  - range
  - save
  - restore
  - cursor
  - pattern
difficulty: intermediate
relatedScenarios: []
relatedCases: []
locale: ko
---

## 이 Tip을 사용할 때

다음과 같은 경우에 이 패턴을 사용하세요:
- DOM 조작 전에 선택 저장
- DOM 변경 후 선택 복원
- React/Vue 리렌더링 중 커서 위치 유지
- 프레임워크 상태 업데이트 간 선택 처리
- 프로그래밍 방식으로 콘텐츠를 수정할 때 사용자의 선택 보존

## 문제

contenteditable에서 DOM을 조작하면 브라우저가 선택을 추적하지 못합니다. 다음 상황에서 발생합니다:
- React/Vue 리렌더링이 DOM 노드를 교체할 때
- 프로그래밍 방식 DOM 변경이 발생할 때
- 텍스트 노드가 분할되거나 병합될 때
- 요소가 감싸지거나 언래핑될 때
- 콘텐츠가 교체될 때

## 해결 방법

### 1. 기본 선택 저장/복원

선택을 저장하고 복원하는 간단한 패턴:

```javascript
class SelectionManager {
  constructor(editor) {
    this.editor = editor;
    this.savedRange = null;
  }
  
  saveSelection() {
    const selection = window.getSelection();
    if (selection.rangeCount === 0) {
      this.savedRange = null;
      return;
    }
    
    const range = selection.getRangeAt(0);
    this.savedRange = {
      startContainer: range.startContainer,
      startOffset: range.startOffset,
      endContainer: range.endContainer,
      endOffset: range.endOffset,
      commonAncestorContainer: range.commonAncestorContainer,
    };
  }
  
  restoreSelection() {
    if (!this.savedRange) return;
    
    const selection = window.getSelection();
    const range = document.createRange();
    
    try {
      // 노드가 여전히 DOM에 있는지 확인
      if (!this.savedRange.startContainer.isConnected ||
          !this.savedRange.endContainer.isConnected) {
        // 노드가 제거됨, 동등한 위치 찾기 시도
        this.restoreSelectionFallback();
        return;
      }
      
      range.setStart(
        this.savedRange.startContainer,
        this.savedRange.startOffset
      );
      range.setEnd(
        this.savedRange.endContainer,
        this.savedRange.endOffset
      );
      
      selection.removeAllRanges();
      selection.addRange(range);
    } catch (e) {
      console.error('선택 복원 실패:', e);
      this.restoreSelectionFallback();
    }
  }
  
  restoreSelectionFallback() {
    // 대체: 에디터 끝에 커서 설정
    const selection = window.getSelection();
    const range = document.createRange();
    range.selectNodeContents(this.editor);
    range.collapse(false);
    selection.removeAllRanges();
    selection.addRange(range);
  }
  
  clearSelection() {
    this.savedRange = null;
  }
}

// 사용법
const editor = document.querySelector('div[contenteditable]');
const selectionManager = new SelectionManager(editor);

// DOM 조작 전
selectionManager.saveSelection();

// ... DOM 변경 수행 ...

// DOM 조작 후
selectionManager.restoreSelection();
```

### 2. 문자 오프셋 기반 선택

선택을 문자 오프셋으로 저장 (DOM 변경에 더 강함):

```javascript
class CharacterOffsetSelection {
  constructor(editor) {
    this.editor = editor;
  }
  
  saveSelection() {
    const selection = window.getSelection();
    if (selection.rangeCount === 0) return null;
    
    const range = selection.getRangeAt(0);
    
    // 시작 오프셋 계산
    const startRange = range.cloneRange();
    startRange.selectNodeContents(this.editor);
    startRange.setEnd(range.startContainer, range.startOffset);
    const startOffset = startRange.toString().length;
    
    // 끝 오프셋 계산
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
  
  restoreSelection(savedSelection) {
    if (!savedSelection) return;
    
    const selection = window.getSelection();
    const range = document.createRange();
    
    // 시작 위치 찾기
    const startPos = this.findPosition(savedSelection.start);
    if (startPos) {
      range.setStart(startPos.node, startPos.offset);
    } else {
      return; // 복원 불가
    }
    
    // 끝 위치 찾기
    if (savedSelection.collapsed) {
      range.collapse(true);
    } else {
      const endPos = this.findPosition(savedSelection.end);
      if (endPos) {
        range.setEnd(endPos.node, endPos.offset);
      } else {
        range.collapse(true);
      }
    }
    
    selection.removeAllRanges();
    selection.addRange(range);
  }
  
  findPosition(offset) {
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
        return {
          node,
          offset: offset - currentOffset,
        };
      }
      
      currentOffset += nodeLength;
    }
    
    // 오프셋이 콘텐츠를 넘어서면 마지막 위치 반환
    const lastNode = this.getLastTextNode(this.editor);
    if (lastNode) {
      return {
        node: lastNode,
        offset: lastNode.textContent.length,
      };
    }
    
    return null;
  }
  
  getLastTextNode(element) {
    const walker = document.createTreeWalker(
      element,
      NodeFilter.SHOW_TEXT,
      null
    );
    
    let lastNode = null;
    let node;
    while (node = walker.nextNode()) {
      lastNode = node;
    }
    
    return lastNode;
  }
}

// 사용법
const editor = document.querySelector('div[contenteditable]');
const selectionManager = new CharacterOffsetSelection(editor);

// DOM 변경 전 저장
const saved = selectionManager.saveSelection();

// ... DOM 수정 ...

// 변경 후 복원
selectionManager.restoreSelection(saved);
```

### 3. React 통합 패턴

React에서 선택 저장/복원하여 커서 점프 방지:

```jsx
import React, { useRef, useEffect, useCallback } from 'react';

function ContentEditable({ value, onChange }) {
  const editorRef = useRef(null);
  const selectionRef = useRef(null);
  
  const saveSelection = useCallback(() => {
    const selection = window.getSelection();
    if (selection.rangeCount === 0) return;
    
    const range = selection.getRangeAt(0);
    const editor = editorRef.current;
    
    // 문자 오프셋 계산
    const startRange = range.cloneRange();
    startRange.selectNodeContents(editor);
    startRange.setEnd(range.startContainer, range.startOffset);
    const startOffset = startRange.toString().length;
    
    const endRange = range.cloneRange();
    endRange.selectNodeContents(editor);
    endRange.setEnd(range.endContainer, range.endOffset);
    const endOffset = endRange.toString().length;
    
    selectionRef.current = {
      start: startOffset,
      end: endOffset,
      collapsed: range.collapsed,
    };
  }, []);
  
  const restoreSelection = useCallback(() => {
    if (!selectionRef.current || !editorRef.current) return;
    
    const selection = window.getSelection();
    const range = document.createRange();
    const editor = editorRef.current;
    
    // 시작 위치 찾기
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
      
      if (currentOffset + nodeLength >= selectionRef.current.start) {
        startNode = node;
        startOffset = selectionRef.current.start - currentOffset;
        break;
      }
      
      currentOffset += nodeLength;
    }
    
    if (!startNode) return;
    
    range.setStart(startNode, startOffset);
    
    if (selectionRef.current.collapsed) {
      range.collapse(true);
    } else {
      // 끝 위치 찾기
      let endNode = null;
      let endOffset = 0;
      currentOffset = 0;
      walker = document.createTreeWalker(
        editor,
        NodeFilter.SHOW_TEXT,
        null
      );
      
      while (node = walker.nextNode()) {
        const nodeLength = node.textContent.length;
        
        if (currentOffset + nodeLength >= selectionRef.current.end) {
          endNode = node;
          endOffset = selectionRef.current.end - currentOffset;
          break;
        }
        
        currentOffset += nodeLength;
      }
      
      if (endNode) {
        range.setEnd(endNode, endOffset);
      } else {
        range.collapse(true);
      }
    }
    
    selection.removeAllRanges();
    selection.addRange(range);
  }, []);
  
  useEffect(() => {
    const editor = editorRef.current;
    if (!editor) return;
    
    // 입력 시 선택 저장
    editor.addEventListener('input', saveSelection);
    editor.addEventListener('keyup', saveSelection);
    editor.addEventListener('mouseup', saveSelection);
    
    return () => {
      editor.removeEventListener('input', saveSelection);
      editor.removeEventListener('keyup', saveSelection);
      editor.removeEventListener('mouseup', saveSelection);
    };
  }, [saveSelection]);
  
  useEffect(() => {
    // 값 변경 후 선택 복원
    if (editorRef.current && selectionRef.current) {
      // DOM이 업데이트되었는지 확인하기 위해 setTimeout 사용
      setTimeout(() => {
        restoreSelection();
      }, 0);
    }
  }, [value, restoreSelection]);
  
  const handleInput = (e) => {
    saveSelection();
    onChange(e.currentTarget.textContent);
  };
  
  return (
    <div
      ref={editorRef}
      contentEditable
      onInput={handleInput}
      suppressContentEditableWarning
      dangerouslySetInnerHTML={{ __html: value }}
    />
  );
}
```

### 4. 포괄적인 선택 관리자

여러 저장/복원 전략을 제공하는 완전한 해결책:

```javascript
class ComprehensiveSelectionManager {
  constructor(editor) {
    this.editor = editor;
    this.savedSelection = null;
    this.strategy = 'character-offset'; // 'node-offset' | 'character-offset' | 'marker'
  }
  
  saveSelection(strategy = this.strategy) {
    const selection = window.getSelection();
    if (selection.rangeCount === 0) {
      this.savedSelection = null;
      return;
    }
    
    const range = selection.getRangeAt(0);
    
    switch (strategy) {
      case 'node-offset':
        this.savedSelection = this.saveNodeOffset(range);
        break;
      case 'character-offset':
        this.savedSelection = this.saveCharacterOffset(range);
        break;
      case 'marker':
        this.savedSelection = this.saveWithMarkers(range);
        break;
      default:
        this.savedSelection = this.saveCharacterOffset(range);
    }
    
    this.savedSelection.strategy = strategy;
  }
  
  saveNodeOffset(range) {
    return {
      strategy: 'node-offset',
      startContainer: range.startContainer,
      startOffset: range.startOffset,
      endContainer: range.endContainer,
      endOffset: range.endOffset,
    };
  }
  
  saveCharacterOffset(range) {
    const startRange = range.cloneRange();
    startRange.selectNodeContents(this.editor);
    startRange.setEnd(range.startContainer, range.startOffset);
    const startOffset = startRange.toString().length;
    
    const endRange = range.cloneRange();
    endRange.selectNodeContents(this.editor);
    endRange.setEnd(range.endContainer, range.endOffset);
    const endOffset = endRange.toString().length;
    
    return {
      strategy: 'character-offset',
      start: startOffset,
      end: endOffset,
      collapsed: range.collapsed,
    };
  }
  
  saveWithMarkers(range) {
    // 선택 경계에 보이지 않는 마커 삽입
    const startMarker = document.createTextNode('\uFEFF');
    const endMarker = document.createTextNode('\uFEFF');
    
    try {
      range.insertNode(startMarker);
      range.collapse(false);
      range.insertNode(endMarker);
    } catch (e) {
      return this.saveCharacterOffset(range);
    }
    
    return {
      strategy: 'marker',
      startMarker,
      endMarker,
    };
  }
  
  restoreSelection() {
    if (!this.savedSelection) return;
    
    const strategy = this.savedSelection.strategy || this.strategy;
    
    switch (strategy) {
      case 'node-offset':
        this.restoreNodeOffset(this.savedSelection);
        break;
      case 'character-offset':
        this.restoreCharacterOffset(this.savedSelection);
        break;
      case 'marker':
        this.restoreWithMarkers(this.savedSelection);
        break;
    }
  }
  
  restoreNodeOffset(saved) {
    const selection = window.getSelection();
    const range = document.createRange();
    
    try {
      if (!saved.startContainer.isConnected ||
          !saved.endContainer.isConnected) {
        throw new Error('Nodes disconnected');
      }
      
      range.setStart(saved.startContainer, saved.startOffset);
      range.setEnd(saved.endContainer, saved.endOffset);
      
      selection.removeAllRanges();
      selection.addRange(range);
    } catch (e) {
      // 문자 오프셋으로 대체
      const charOffset = this.saveCharacterOffset(range);
      this.restoreCharacterOffset(charOffset);
    }
  }
  
  restoreCharacterOffset(saved) {
    const selection = window.getSelection();
    const range = document.createRange();
    
    const startPos = this.findCharacterPosition(saved.start);
    if (!startPos) return;
    
    range.setStart(startPos.node, startPos.offset);
    
    if (saved.collapsed) {
      range.collapse(true);
    } else {
      const endPos = this.findCharacterPosition(saved.end);
      if (endPos) {
        range.setEnd(endPos.node, endPos.offset);
      } else {
        range.collapse(true);
      }
    }
    
    selection.removeAllRanges();
    selection.addRange(range);
  }
  
  restoreWithMarkers(saved) {
    const selection = window.getSelection();
    const range = document.createRange();
    
    if (!saved.startMarker.isConnected || !saved.endMarker.isConnected) {
      // 마커 제거됨, 대체
      return;
    }
    
    range.setStartBefore(saved.startMarker);
    range.setEndAfter(saved.endMarker);
    
    // 마커 제거
    saved.startMarker.remove();
    saved.endMarker.remove();
    
    selection.removeAllRanges();
    selection.addRange(range);
  }
  
  findCharacterPosition(offset) {
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
        return {
          node,
          offset: Math.min(offset - currentOffset, nodeLength),
        };
      }
      
      currentOffset += nodeLength;
    }
    
    // 콘텐츠를 넘어서면 마지막 위치 반환
    const lastNode = this.getLastTextNode();
    if (lastNode) {
      return {
        node: lastNode,
        offset: lastNode.textContent.length,
      };
    }
    
    return null;
  }
  
  getLastTextNode() {
    const walker = document.createTreeWalker(
      this.editor,
      NodeFilter.SHOW_TEXT,
      null
    );
    
    let lastNode = null;
    let node;
    while (node = walker.nextNode()) {
      lastNode = node;
    }
    
    return lastNode;
  }
  
  clearSelection() {
    this.savedSelection = null;
  }
  
  getCurrentSelection() {
    const selection = window.getSelection();
    if (selection.rangeCount === 0) return null;
    
    return selection.getRangeAt(0);
  }
  
  isSelectionCollapsed() {
    const range = this.getCurrentSelection();
    return range ? range.collapsed : true;
  }
  
  getSelectedText() {
    const selection = window.getSelection();
    return selection.toString();
  }
}

// 사용법
const editor = document.querySelector('div[contenteditable]');
const manager = new ComprehensiveSelectionManager(editor);

// DOM 조작 전 저장
manager.saveSelection('character-offset');

// ... DOM 수정 ...

// 변경 후 복원
manager.restoreSelection();
```

## 주의사항

- 문자 오프셋 전략은 노드 오프셋보다 DOM 변경에 더 강합니다
- 노드 기반 선택을 복원하기 전에 항상 노드가 여전히 연결되어 있는지 확인하세요
- 비동기 DOM 업데이트 후 복원할 때 `setTimeout` 또는 `requestAnimationFrame`을 사용하세요
- 마커 전략은 빠르지만 일부 작업에 의해 마커가 제거될 수 있습니다
- IME 컴포지션으로 테스트하세요 - 컴포지션 중 선택 동작이 다릅니다
- React/Vue의 경우 모든 input 이벤트에서 저장하고 상태 업데이트 후 복원하세요
- 빈번한 업데이트로 인한 성능을 위해 선택 저장을 디바운싱하는 것을 고려하세요

## 브라우저 호환성

- **Chrome/Edge**: 모든 전략이 잘 작동합니다
- **Firefox**: 좋은 지원이지만 문자 오프셋 계산을 테스트하세요
- **Safari**: 잘 작동하지만 IME 컴포지션에 주의하세요

## 관련 자료

- [Tip: React에서 캐럿 보존](/tips/tip-001-caret-preservation-react)
- [Tip: 텍스트 삽입 패턴](/tips/tip-016-insert-text-pattern)
