---
id: ce-0224-firefox-undo-corruption-ko
scenarioId: scenario-firefox-undo-dom-mutation
locale: ko
os: Windows
osVersion: "10/11"
device: Desktop
deviceVersion: Any
browser: Firefox
browserVersion: "115.0+"
keyboard: US QWERTY
caseTitle: Firefox에서 입력 중 DOM 변형으로 인한 실행 취소/다시 실행 스택 손상
description: "Firefox에서 사용자 입력 중 DOM 변형(예: 자동 포맷팅, 맞춤법 검사, 프로그래밍적 변경)이 발생하면 실행 취소/다시 실행 스택이 손상됩니다. 이후 실행 취소 작업이 잘못된 상태로 되돌아가거나, 다시 실행 작업이 실패하거나, 전체 실행 취소 기록이 손실될 수 있습니다."
tags:
  - firefox
  - undo
  - redo
  - dom-mutation
  - history-corruption
  - input-events
  - programmatic-changes
  - windows
status: draft
domSteps:
  - label: "입력 전"
    html: '<p>The quick brown fox jumps over the lazy dog.</p>'
    description: "초기 콘텐츠"
  - label: "사용자 입력 + DOM 변형"
    html: '<p>The quick brown fox jumps over the <strong>lazy</strong> dog.</p>'
    description: "사용자가 'dog'를 입력하고 자동 포맷이 굵게 적용됨"
  - label: "예상 실행 취소"
    html: '<p>The quick brown fox jumps over the lazy dog.</p>'
    description: "실행 취소는 사용자 입력만 되돌려야 함"
  - label: "실제 실행 취소"
    html: '<p>The quick brown fox jumps over the</p>'
    description: "실행 취소가 잘못된 상태로 되돌아가 콘텐츠 손실"
---

## 현상

Firefox에서 사용자 입력 중 DOM 변형(자동 포맷팅, 맞춤법 검사 수정, 프로그래밍적 변경 등)이 발생하면 실행 취소/다시 실행 스택이 손상됩니다. 이후 실행 취소 작업이 잘못된 상태로 되돌아가거나, 다시 실행 작업이 완전히 실패하거나, 전체 실행 취소 기록이 손실될 수 있습니다.

## 재현 예시

1. Firefox를 열고 `contenteditable` 요소를 만듭니다.
2. 입력 중에 트리거되는 자동 포맷팅을 설정합니다.
3. DOM 변형을 트리거하는 텍스트를 입력합니다 (예: 특정 단어 자동 굵게).
4. 실행 취소 기록을 구축하기 위해 계속 입력합니다.
5. Ctrl+Z를 눌러 실행 취소합니다.
6. 잘못된 상태 복원을 관찰합니다.
7. Ctrl+Y를 눌러 다시 실행을 시도합니다.
8. 실패한 다시 실행 또는 잘못된 복원을 관찰합니다.

## 관찰된 동작

### 실행 취소/다시 실행 손상 패턴:

1. **잘못된 상태 복원**: 실행 취소가 잘못된 DOM 상태로 되돌아감
2. **손실된 콘텐츠**: 콘텐츠의 일부가 실행 취소 중 사라짐
3. **다시 실행 실패**: Ctrl+Y가 손상된 실행 취소 후 작동하지 않음
4. **기록 손실**: 전체 실행 취소 기록을 사용할 수 없게 됨
5. **부분 실행 취소**: 최근 변경의 일부만 실행 취소됨

### 손상을 트리거하는 특정 시나리오:

**입력 중 자동 포맷팅:**
```javascript
editor.addEventListener('input', (e) => {
  // 특정 단어 자동 굵게
  if (e.data === 'important') {
    const selection = window.getSelection();
    const range = selection.getRangeAt(0);
    const text = range.commonAncestorContainer.textContent;
    
    // 굵은 버전으로 교체
    const bold = document.createElement('strong');
    bold.textContent = 'important';
    
    range.deleteContents();
    range.insertNode(bold);
  }
});
```

**맞춤법 검사 수정:**
```javascript
editor.addEventListener('input', (e) => {
  // 오타 자동 수정
  setTimeout(() => {
    const text = editor.textContent;
    const corrected = text.replace(/recieve/g, 'receive');
    if (text !== corrected) {
      editor.textContent = corrected;
    }
  }, 100);
});
```

**프로그래밍적 DOM 변경:**
```javascript
editor.addEventListener('input', (e) => {
  // 줄 번호 추가
  if (e.inputType === 'insertParagraph') {
    const lines = editor.innerHTML.split('\n');
    editor.innerHTML = lines.map((line, i) => 
      `<span class="line-number">${i + 1}</span>${line}`
    ).join('\n');
  }
});
```

### 손상을 보여주는 이벤트 시퀀스:

```javascript
// Firefox 손상된 실행 취소 시퀀스
[
  { type: 'input', data: 'The quick ', undoable: true },
  { type: 'input', data: 'brown ', undoable: true },
  { type: 'mutation', change: 'auto-bold', undoable: false }, // 문제!
  { type: 'input', data: 'fox ', undoable: true },
  { type: 'undo', result: 'The quick ' }, // 잘못된 상태!
  { type: 'redo', result: null } // 실패!
]
```

## 예상 동작

- 실행 취소는 사용자 입력 변경만 되돌려야 하며 프로그래밍적 변형은 되돌리지 않아야 합니다
- 다시 실행은 되돌린 상태를 올바르게 복원해야 합니다
- DOM 변형이 실행 취소 기록을 손상시키지 않아야 합니다
- 프로그래밍적 변경은 사용자 입력과 별도로 처리되어야 합니다
- 실행 취소/다시 실행은 DOM 변경과 관계없이 안정적으로 작동해야 합니다

## 영향

- **데이터 손실**: 사용자 콘텐츠가 실행 취소 중 사라질 수 있음
- **워크플로우 중단**: 사용자가 실행 취소/다시 실행 기능에 의존할 수 없음
- **예상치 못한 동작**: 실행 취소가 놀라운 결과를 생성함
- **신뢰 문제**: 사용자가 편집기에 대한 신뢰를 잃음
- **개발 복잡성**: Firefox를 위한 복잡한 해결 방법이 필요함

## 브라우저 비교

- **Firefox**: DOM 변형과 함께 뚜렷한 실행 취소 손상
- **Chrome**: DOM 변형을 올바르게 처리하고 프로그래밍적 변경을 분리함
- **Edge**: Chrome과 동일, 올바른 실행 취소/다시 실행 처리
- **Safari**: 일반적으로 올바른 동작, 복잡한 변형에서 드문 문제
- **Firefox를 제외한 모든 브라우저**: 사용자 vs 프로그래밍적 변경에 대해 별도의 실행 취소 스택 유지

## 해결 방법

### 1. 사용자 정의 실행 취소/다시 실행 시스템

```javascript
class FirefoxUndoManager {
  constructor(editor) {
    this.editor = editor;
    this.isFirefox = /Firefox/.test(navigator.userAgent);
    
    if (this.isFirefox) {
      this.setupCustomUndo();
    }
  }
  
  setupCustomUndo() {
    this.undoStack = [];
    this.redoStack = [];
    this.currentMutation = null;
    
    // 네이티브 실행 취소/다시 실행 비활성화
    this.editor.addEventListener('keydown', this.handleKeydown.bind(this));
    
    // 변형과 별도로 사용자 입력 추적
    this.editor.addEventListener('input', this.handleInput.bind(this));
    this.setupMutationObserver();
    
    // 프로그래밍적으로 실행 취소/다시 실행 처리
    this.setupUndoRedo();
  }
  
  handleKeydown(e) {
    if (e.ctrlKey || e.metaKey) {
      if (e.key === 'z' && !e.shiftKey) {
        e.preventDefault();
        this.undo();
      } else if ((e.key === 'y') || (e.key === 'z' && e.shiftKey)) {
        e.preventDefault();
        this.redo();
      }
    }
  }
  
  handleInput(e) {
    // 프로그래밍적 변경이 아닌 사용자 시작 입력만 추적
    if (this.isProgrammaticChange(e)) {
      return;
    }
    
    // 변경 전 상태 저장
    const beforeState = this.captureState();
    
    // 실행 취소 스택에 저장
    setTimeout(() => {
      const afterState = this.captureState();
      
      this.undoStack.push({
        before: beforeState,
        after: afterState,
        type: 'user-input',
        timestamp: Date.now()
      });
      
      // 새 입력 시 다시 실행 스택 지우기
      this.redoStack = [];
      
      // 스택 크기 제한
      if (this.undoStack.length > 100) {
        this.undoStack.shift();
      }
    }, 0);
  }
  
  setupMutationObserver() {
    this.observer = new MutationObserver((mutations) => {
      // 프로그래밍적 변경을 별도로 추적
      mutations.forEach(mutation => {
        this.currentMutation = {
          type: mutation.type,
          target: mutation.target,
          data: mutation,
          timestamp: Date.now()
        };
      });
    });
    
    this.observer.observe(this.editor, {
      childList: true,
      characterData: true,
      subtree: true,
      attributes: true
    });
  }
  
  isProgrammaticChange(e) {
    // 프로그래밍적 vs 사용자 입력을 감지하는 휴리스틱
    return (
      this.currentMutation && 
      Date.now() - this.currentMutation.timestamp < 50
    );
  }
  
  setupUndoRedo() {
    // 실행 취소/다시 실행을 위한 execCommand 재정의
    const originalExecCommand = document.execCommand;
    
    document.execCommand = (command, showUI, value) => {
      if (command === 'undo') {
        this.undo();
        return true;
      } else if (command === 'redo') {
        this.redo();
        return true;
      }
      
      return originalExecCommand.call(document, command, showUI, value);
    };
  }
  
  undo() {
    if (this.undoStack.length === 0) return;
    
    const lastChange = this.undoStack.pop();
    
    // 현재 상태를 다시 실행 스택에 저장
    const currentState = this.captureState();
    this.redoStack.push({
      before: currentState,
      after: lastChange.before,
      type: 'undo',
      timestamp: Date.now()
    });
    
    // 이전 상태 복원
    this.restoreState(lastChange.before);
    
    // 현재 변형 마커 지우기
    this.currentMutation = null;
  }
  
  redo() {
    if (this.redoStack.length === 0) return;
    
    const lastUndo = this.redoStack.pop();
    
    // 현재 상태를 실행 취소 스택에 저장
    const currentState = this.captureState();
    this.undoStack.push({
      before: currentState,
      after: lastUndo.after,
      type: 'redo',
      timestamp: Date.now()
    });
    
    // 앞으로 상태 복원
    this.restoreState(lastUndo.after);
  }
  
  captureState() {
    return {
      html: this.editor.innerHTML,
      selection: this.saveSelection(),
      scrollPosition: {
        x: this.editor.scrollLeft,
        y: this.editor.scrollTop
      }
    };
  }
  
  restoreState(state) {
    // 일시적으로 관찰자 연결 해제
    this.observer.disconnect();
    
    try {
      // HTML 복원
      this.editor.innerHTML = state.html;
      
      // 선택 복원
      this.restoreSelection(state.selection);
      
      // 스크롤 위치 복원
      this.editor.scrollLeft = state.scrollPosition.x;
      this.editor.scrollTop = state.scrollPosition.y;
      
    } finally {
      // 관찰자 재연결
      this.observer.observe(this.editor, {
        childList: true,
        characterData: true,
        subtree: true,
        attributes: true
      });
    }
  }
  
  saveSelection() {
    const selection = window.getSelection();
    if (selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      return {
        startContainer: this.serializeNode(range.startContainer),
        startOffset: range.startOffset,
        endContainer: this.serializeNode(range.endContainer),
        endOffset: range.endOffset
      };
    }
    return null;
  }
  
  restoreSelection(selection) {
    if (!selection) return;
    
    try {
      const startNode = this.deserializeNode(selection.startContainer);
      const endNode = this.deserializeNode(selection.endContainer);
      
      if (startNode && endNode) {
        const range = document.createRange();
        range.setStart(startNode, selection.startOffset);
        range.setEnd(endNode, selection.endOffset);
        
        const sel = window.getSelection();
        sel.removeAllRanges();
        sel.addRange(range);
      }
    } catch (e) {
      console.warn('선택을 복원할 수 없습니다:', e);
    }
  }
  
  serializeNode(node) {
    // 노드에 대한 고유 식별자 생성
    if (node.nodeType === Node.TEXT_NODE) {
      return {
        type: 'text',
        parent: this.serializeNode(node.parentElement),
        index: Array.from(node.parentElement.childNodes).indexOf(node)
      };
    }
    
    return {
      type: 'element',
      tagName: node.tagName,
      className: node.className,
      id: node.id
    };
  }
  
  deserializeNode(nodeData) {
    if (nodeData.type === 'element') {
      const elements = this.editor.querySelectorAll(nodeData.tagName);
      return Array.from(elements).find(el => 
        el.className === nodeData.className && 
        el.id === nodeData.id
      );
    } else if (nodeData.type === 'text') {
      const parent = this.deserializeNode(nodeData.parent);
      if (parent && parent.childNodes[nodeData.index]) {
        return parent.childNodes[nodeData.index];
      }
    }
    
    return null;
  }
}
```

### 2. 변형 버퍼링

```javascript
class MutationBuffer {
  constructor(editor) {
    this.editor = editor;
    this.isFirefox = /Firefox/.test(navigator.userAgent);
    
    if (this.isFirefox) {
      this.setupBuffering();
    }
  }
  
  setupBuffering() {
    this.pendingMutations = [];
    this.bufferTimeout = null;
    
    this.setupMutationObserver();
    this.setupInputHandling();
  }
  
  setupMutationObserver() {
    this.observer = new MutationObserver((mutations) => {
      // 즉시 적용하는 대신 변형 버퍼링
      this.pendingMutations.push(...mutations);
      
      // 입력이 안정된 후 버퍼된 변형 적용
      clearTimeout(this.bufferTimeout);
      this.bufferTimeout = setTimeout(() => {
        this.applyBufferedMutations();
      }, 150);
    });
    
    this.observer.observe(this.editor, {
      childList: true,
      characterData: true,
      subtree: true
    });
  }
  
  setupInputHandling() {
    this.editor.addEventListener('beforeinput', (e) => {
      // 사용자 입력 전 버퍼 지우기
      this.applyBufferedMutations();
    });
  }
  
  applyBufferedMutations() {
    if (this.pendingMutations.length === 0) return;
    
    // 일시적으로 관찰자 연결 해제
    this.observer.disconnect();
    
    // 실행 취소 스택에 영향을 주지 않고 수동으로 변형 적용
    const mutations = this.pendingMutations.splice(0);
    
    mutations.forEach(mutation => {
      this.applyMutation(mutation);
    });
    
    // 관찰자 재연결
    this.observer.observe(this.editor, {
      childList: true,
      characterData: true,
      subtree: true
    });
  }
  
  applyMutation(mutation) {
    // 실행 취소에 영향을 주지 않는 방식으로 변형 적용
    switch (mutation.type) {
      case 'childList':
        this.applyChildListMutation(mutation);
        break;
      case 'characterData':
        this.applyCharacterDataMutation(mutation);
        break;
    }
  }
  
  applyChildListMutation(mutation) {
    const parent = mutation.target;
    
    mutation.removedNodes.forEach(node => {
      if (parent.contains(node)) {
        parent.removeChild(node);
      }
    });
    
    mutation.addedNodes.forEach(node => {
      if (mutation.nextSibling) {
        parent.insertBefore(node, mutation.nextSibling);
      } else {
        parent.appendChild(node);
      }
    });
  }
  
  applyCharacterDataMutation(mutation) {
    mutation.target.textContent = mutation.newValue;
  }
}
```

### 3. Firefox 특정 감지 및 처리

```javascript
class FirefoxUndoFix {
  static isFirefoxUndoCorrupted(editor) {
    // Firefox 실행 취소가 손상되었는지 테스트
    const originalContent = editor.innerHTML;
    
    // 일부 텍스트 입력
    editor.focus();
    document.execCommand('insertText', false, 'test');
    
    // 실행 취소 시도
    document.execCommand('undo');
    
    const afterUndo = editor.innerHTML;
    
    // 원래 콘텐츠 복원
    editor.innerHTML = originalContent;
    
    // 실행 취소가 올바르게 작동했는지 확인
    return afterUndo !== originalContent;
  }
  
  static applyFix(editor) {
    if (!this.isFirefoxUndoCorrupted(editor)) {
      return; // Firefox 실행 취소가 올바르게 작동 중
    }
    
    // 사용자 정의 실행 취소 관리자 적용
    new FirefoxUndoManager(editor);
    
    console.log('Firefox 실행 취소 손상 수정 적용됨');
  }
}
```

## 테스트 권장 사항

1. **다양한 DOM 변형**: 자동 포맷팅, 맞춤법 검사, 자동 수정
2. **다양한 입력 유형**: 텍스트 입력, 붙여넣기, 삭제, 포맷팅
3. **복잡한 콘텐츠**: 중첩 요소, 테이블, 목록
4. **실행 취소/다시 실행 시퀀스**: 여러 실행 취소 및 다시 실행
5. **타이밍 변형**: 변형이 있는 빠른 vs 느린 입력
6. **Firefox 버전**: 110, 111, 112, 113, 114, 115, 최신

## 참고사항

- 이것은 여러 버전에 걸친 오래된 Firefox 문제입니다
- Firefox의 실행 취소/다시 실행 구현 vs 다른 브라우저와 관련이 있습니다
- 문제는 즉시 DOM 변형에서 가장 뚜렷합니다
- Firefox 개발자들은 알고 있지만 수정에는 아키텍처 변경이 필요합니다
- 해결 방법은 상당한 복잡성을 추가하지만 신뢰할 수 있는 기능을 제공합니다
- 문제는 자동 포맷팅 또는 프로그래밍적 변경이 있는 모든 편집기에 영향을 미칩니다
