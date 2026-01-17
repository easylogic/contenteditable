---
id: tip-021-svelte-integration-ko
title: Svelte와 contenteditable 통합하기
description: "Svelte와 contenteditable 요소를 올바르게 통합하고, 반응형 상태를 처리하며, 커서 위치 문제를 방지하는 방법"
category: framework
tags:
  - svelte
  - framework
  - state-sync
  - caret
  - contenteditable
  - reactivity
difficulty: intermediate
relatedScenarios:
  - scenario-framework-state-sync
relatedCases: []
locale: ko
---

## 이 Tip을 사용할 때

다음과 같은 경우에 이 패턴을 사용하세요:
- Svelte와 contenteditable 통합
- 반응형 상태 바인딩 처리
- 반응형 업데이트 시 커서 위치 점프 방지
- Svelte의 반응성 시스템과 작업
- contenteditable과 양방향 바인딩 구현

## 문제

Svelte의 반응성이 contenteditable에서 문제를 일으킬 수 있습니다:
- 반응형 업데이트 시 커서 위치 점프
- 반응형 문이 커서를 재설정하는 DOM 업데이트 트리거
- DOM과 Svelte 상태 간 상태 동기화
- 콘텐츠를 직접 바인딩하면 문제 발생 가능

## 해결 방법

### 1. contenteditable이 있는 기본 Svelte 컴포넌트

수동 상태 관리가 있는 간단한 통합:

```svelte
<script>
  let content = '';
  let editableElement;
  
  function handleInput(event) {
    content = event.currentTarget.innerHTML;
  }
  
  function handleBlur(event) {
    content = event.currentTarget.innerHTML;
  }
</script>

<div
  bind:this={editableElement}
  contenteditable="true"
  on:input={handleInput}
  on:blur={handleBlur}
  innerHTML={content}
></div>
```

### 2. 커서 위치 보존

점프를 방지하기 위해 커서 위치 저장 및 복원:

```svelte
<script>
  let content = '';
  let editableElement;
  let savedSelection = null;
  let isUpdating = false;
  
  function saveCaretPosition() {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return;
    
    const range = selection.getRangeAt(0);
    
    // 문자 오프셋 계산
    const startRange = range.cloneRange();
    startRange.selectNodeContents(editableElement);
    startRange.setEnd(range.startContainer, range.startOffset);
    const startOffset = startRange.toString().length;
    
    const endRange = range.cloneRange();
    endRange.selectNodeContents(editableElement);
    endRange.setEnd(range.endContainer, range.endOffset);
    const endOffset = endRange.toString().length;
    
    savedSelection = {
      start: startOffset,
      end: endOffset,
      collapsed: range.collapsed,
    };
  }
  
  function restoreCaretPosition() {
    if (!savedSelection || !editableElement) return;
    
    const selection = window.getSelection();
    const range = document.createRange();
    
    // 시작 위치 찾기
    let currentOffset = 0;
    const walker = document.createTreeWalker(
      editableElement,
      NodeFilter.SHOW_TEXT,
      null
    );
    
    let startNode = null;
    let startOffset = 0;
    let node;
    
    while (node = walker.nextNode()) {
      const nodeLength = node.textContent.length;
      
      if (currentOffset + nodeLength >= savedSelection.start) {
        startNode = node;
        startOffset = savedSelection.start - currentOffset;
        break;
      }
      
      currentOffset += nodeLength;
    }
    
    if (!startNode) return;
    
    range.setStart(startNode, startOffset);
    
    if (savedSelection.collapsed) {
      range.collapse(true);
    } else {
      // 끝 위치 찾기
      currentOffset = 0;
      const walker = document.createTreeWalker(
        editableElement,
        NodeFilter.SHOW_TEXT,
        null
      );
      
      while (node = walker.nextNode()) {
        const nodeLength = node.textContent.length;
        
        if (currentOffset + nodeLength >= savedSelection.end) {
          const endNode = node;
          const endOffset = savedSelection.end - currentOffset;
          range.setEnd(endNode, endOffset);
          break;
        }
        
        currentOffset += nodeLength;
      }
    }
    
    selection.removeAllRanges();
    selection.addRange(range);
  }
  
  function handleInput(event) {
    if (isUpdating) return;
    
    saveCaretPosition();
    content = event.currentTarget.innerHTML;
  }
  
  function handleKeyUp() {
    saveCaretPosition();
  }
  
  function handleMouseUp() {
    saveCaretPosition();
  }
  
  // 콘텐츠가 변경될 때 DOM을 업데이트하는 반응형 문
  $: if (editableElement && !isUpdating && editableElement.innerHTML !== content) {
    isUpdating = true;
    saveCaretPosition();
    editableElement.innerHTML = content;
    
    // DOM 업데이트 후 커서 복원
    setTimeout(() => {
      restoreCaretPosition();
      isUpdating = false;
    }, 0);
  }
</script>

<div
  bind:this={editableElement}
  contenteditable="true"
  on:input={handleInput}
  on:keyup={handleKeyUp}
  on:mouseup={handleMouseUp}
></div>
```

### 3. Store와 양방향 바인딩

상태 관리를 위해 Svelte store 사용:

```svelte
<script>
  import { writable } from 'svelte/store';
  
  let editableElement;
  let savedSelection = null;
  let isUpdating = false;
  
  // 콘텐츠용 store 생성
  export let contentStore = writable('');
  
  let content = '';
  
  // store 구독
  contentStore.subscribe(value => {
    content = value;
  });
  
  function saveCaretPosition() {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return;
    
    const range = selection.getRangeAt(0);
    
    const startRange = range.cloneRange();
    startRange.selectNodeContents(editableElement);
    startRange.setEnd(range.startContainer, range.startOffset);
    const startOffset = startRange.toString().length;
    
    const endRange = range.cloneRange();
    endRange.selectNodeContents(editableElement);
    endRange.setEnd(range.endContainer, range.endOffset);
    const endOffset = endRange.toString().length;
    
    savedSelection = {
      start: startOffset,
      end: endOffset,
      collapsed: range.collapsed,
    };
  }
  
  function restoreCaretPosition() {
    if (!savedSelection || !editableElement) return;
    
    const selection = window.getSelection();
    const range = document.createRange();
    
    let currentOffset = 0;
    const walker = document.createTreeWalker(
      editableElement,
      NodeFilter.SHOW_TEXT,
      null
    );
    
    let startNode = null;
    let startOffset = 0;
    let node;
    
    while (node = walker.nextNode()) {
      const nodeLength = node.textContent.length;
      
      if (currentOffset + nodeLength >= savedSelection.start) {
        startNode = node;
        startOffset = savedSelection.start - currentOffset;
        break;
      }
      
      currentOffset += nodeLength;
    }
    
    if (!startNode) return;
    
    range.setStart(startNode, startOffset);
    
    if (savedSelection.collapsed) {
      range.collapse(true);
    } else {
      currentOffset = 0;
      const walker = document.createTreeWalker(
        editableElement,
        NodeFilter.SHOW_TEXT,
        null
      );
      
      while (node = walker.nextNode()) {
        const nodeLength = node.textContent.length;
        
        if (currentOffset + nodeLength >= savedSelection.end) {
          const endNode = node;
          const endOffset = savedSelection.end - currentOffset;
          range.setEnd(endNode, endOffset);
          break;
        }
        
        currentOffset += nodeLength;
      }
    }
    
    selection.removeAllRanges();
    selection.addRange(range);
  }
  
  function handleInput(event) {
    if (isUpdating) return;
    
    saveCaretPosition();
    const newContent = event.currentTarget.innerHTML;
    contentStore.set(newContent);
  }
  
  // store가 변경될 때 DOM 업데이트
  $: if (editableElement && !isUpdating && editableElement.innerHTML !== content) {
    isUpdating = true;
    saveCaretPosition();
    editableElement.innerHTML = content;
    
    requestAnimationFrame(() => {
      restoreCaretPosition();
      isUpdating = false;
    });
  }
</script>

<div
  bind:this={editableElement}
  contenteditable="true"
  on:input={handleInput}
  on:keyup={saveCaretPosition}
  on:mouseup={saveCaretPosition}
></div>
```

### 4. Props와 이벤트가 있는 컴포넌트

적절한 이벤트 처리가 있는 재사용 가능한 컴포넌트:

```svelte
<script>
  export let value = '';
  export let disabled = false;
  
  let editableElement;
  let savedSelection = null;
  let isUpdating = false;
  
  function saveCaretPosition() {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return;
    
    const range = selection.getRangeAt(0);
    
    const startRange = range.cloneRange();
    startRange.selectNodeContents(editableElement);
    startRange.setEnd(range.startContainer, range.startOffset);
    const startOffset = startRange.toString().length;
    
    const endRange = range.cloneRange();
    endRange.selectNodeContents(editableElement);
    endRange.setEnd(range.endContainer, range.endOffset);
    const endOffset = endRange.toString().length;
    
    savedSelection = {
      start: startOffset,
      end: endOffset,
      collapsed: range.collapsed,
    };
  }
  
  function restoreCaretPosition() {
    if (!savedSelection || !editableElement) return;
    
    const selection = window.getSelection();
    const range = document.createRange();
    
    let currentOffset = 0;
    const walker = document.createTreeWalker(
      editableElement,
      NodeFilter.SHOW_TEXT,
      null
    );
    
    let startNode = null;
    let startOffset = 0;
    let node;
    
    while (node = walker.nextNode()) {
      const nodeLength = node.textContent.length;
      
      if (currentOffset + nodeLength >= savedSelection.start) {
        startNode = node;
        startOffset = savedSelection.start - currentOffset;
        break;
      }
      
      currentOffset += nodeLength;
    }
    
    if (!startNode) return;
    
    range.setStart(startNode, startOffset);
    
    if (savedSelection.collapsed) {
      range.collapse(true);
    } else {
      currentOffset = 0;
      const walker = document.createTreeWalker(
        editableElement,
        NodeFilter.SHOW_TEXT,
        null
      );
      
      while (node = walker.nextNode()) {
        const nodeLength = node.textContent.length;
        
        if (currentOffset + nodeLength >= savedSelection.end) {
          const endNode = node;
          const endOffset = savedSelection.end - currentOffset;
          range.setEnd(endNode, endOffset);
          break;
        }
        
        currentOffset += nodeLength;
      }
    }
    
    selection.removeAllRanges();
    selection.addRange(range);
  }
  
  function handleInput(event) {
    if (isUpdating || disabled) return;
    
    saveCaretPosition();
    const newValue = event.currentTarget.innerHTML;
    
    if (newValue !== value) {
      value = newValue;
      // 양방향 바인딩을 위한 사용자 정의 이벤트 디스패치
      const inputEvent = new CustomEvent('input', {
        detail: newValue,
        bubbles: true,
      });
      editableElement.dispatchEvent(inputEvent);
    }
  }
  
  function handleBlur() {
    // blur 이벤트 디스패치
    const blurEvent = new CustomEvent('blur', {
      bubbles: true,
    });
    editableElement.dispatchEvent(blurEvent);
  }
  
  // value prop이 변경될 때 DOM 업데이트
  $: if (editableElement && !isUpdating && editableElement.innerHTML !== value) {
    isUpdating = true;
    saveCaretPosition();
    editableElement.innerHTML = value;
    
    requestAnimationFrame(() => {
      restoreCaretPosition();
      isUpdating = false;
    });
  }
</script>

<div
  bind:this={editableElement}
  contenteditable={!disabled}
  class:disabled
  on:input={handleInput}
  on:blur={handleBlur}
  on:keyup={saveCaretPosition}
  on:mouseup={saveCaretPosition}
  role="textbox"
  aria-multiline="true"
></div>

<style>
  .disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
</style>

<!-- 사용법 -->
<!-- <ContentEditable bind:value={content} disabled={false} /> -->
```

### 5. Actions가 있는 고급 컴포넌트

더 나은 캡슐화를 위해 Svelte actions 사용:

```svelte
<script>
  export let value = '';
  export let disabled = false;
  
  let editableElement;
  let savedSelection = null;
  let isUpdating = false;
  
  function contenteditableAction(node) {
    editableElement = node;
    
    function saveCaretPosition() {
      const selection = window.getSelection();
      if (!selection || selection.rangeCount === 0) return;
      
      const range = selection.getRangeAt(0);
      
      const startRange = range.cloneRange();
      startRange.selectNodeContents(node);
      startRange.setEnd(range.startContainer, range.startOffset);
      const startOffset = startRange.toString().length;
      
      const endRange = range.cloneRange();
      endRange.selectNodeContents(node);
      endRange.setEnd(range.endContainer, range.endOffset);
      const endOffset = endRange.toString().length;
      
      savedSelection = {
        start: startOffset,
        end: endOffset,
        collapsed: range.collapsed,
      };
    }
    
    function restoreCaretPosition() {
      if (!savedSelection) return;
      
      const selection = window.getSelection();
      const range = document.createRange();
      
      let currentOffset = 0;
      const walker = document.createTreeWalker(
        node,
        NodeFilter.SHOW_TEXT,
        null
      );
      
      let startNode = null;
      let startOffset = 0;
      let node;
      
      while (node = walker.nextNode()) {
        const nodeLength = node.textContent.length;
        
        if (currentOffset + nodeLength >= savedSelection.start) {
          startNode = node;
          startOffset = savedSelection.start - currentOffset;
          break;
        }
        
        currentOffset += nodeLength;
      }
      
      if (!startNode) return;
      
      range.setStart(startNode, startOffset);
      
      if (savedSelection.collapsed) {
        range.collapse(true);
      } else {
        currentOffset = 0;
        const walker = document.createTreeWalker(
          node,
          NodeFilter.SHOW_TEXT,
          null
        );
        
        while (node = walker.nextNode()) {
          const nodeLength = node.textContent.length;
          
          if (currentOffset + nodeLength >= savedSelection.end) {
            const endNode = node;
            const endOffset = savedSelection.end - currentOffset;
            range.setEnd(endNode, endOffset);
            break;
          }
          
          currentOffset += nodeLength;
        }
      }
      
      selection.removeAllRanges();
      selection.addRange(range);
    }
    
    function handleInput(event) {
      if (isUpdating || disabled) return;
      
      saveCaretPosition();
      const newValue = event.currentTarget.innerHTML;
      
      if (newValue !== value) {
        value = newValue;
        node.dispatchEvent(new CustomEvent('input', {
          detail: newValue,
          bubbles: true,
        }));
      }
    }
    
    node.addEventListener('input', handleInput);
    node.addEventListener('keyup', saveCaretPosition);
    node.addEventListener('mouseup', saveCaretPosition);
    
    // 값이 변경될 때 DOM 업데이트
    const unsubscribe = () => {
      if (node && !isUpdating && node.innerHTML !== value) {
        isUpdating = true;
        saveCaretPosition();
        node.innerHTML = value;
        
        requestAnimationFrame(() => {
          restoreCaretPosition();
          isUpdating = false;
        });
      }
    };
    
    // 값 변경 감시
    $: if (node) {
      unsubscribe();
    }
    
    return {
      destroy() {
        node.removeEventListener('input', handleInput);
        node.removeEventListener('keyup', saveCaretPosition);
        node.removeEventListener('mouseup', saveCaretPosition);
      },
    };
  }
</script>

<div
  use:contenteditableAction
  contenteditable={!disabled}
  class:disabled
  role="textbox"
  aria-multiline="true"
></div>

<style>
  .disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
</style>
```

### 6. 디바운싱이 있는 완전한 Svelte 통합

디바운싱과 적절한 상태 관리가 있는 완전한 해결책:

```svelte
<script>
  import { debounce } from './utils';
  
  export let value = '';
  export let disabled = false;
  export let debounceMs = 100;
  
  let editableElement;
  let savedSelection = null;
  let isUpdating = false;
  let localValue = value;
  
  // 디바운스된 업데이트 함수
  const debouncedUpdate = debounce((newValue) => {
    if (newValue !== value) {
      value = newValue;
      editableElement?.dispatchEvent(new CustomEvent('input', {
        detail: newValue,
        bubbles: true,
      }));
    }
  }, debounceMs);
  
  function saveCaretPosition() {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return;
    
    const range = selection.getRangeAt(0);
    
    const startRange = range.cloneRange();
    startRange.selectNodeContents(editableElement);
    startRange.setEnd(range.startContainer, range.startOffset);
    const startOffset = startRange.toString().length;
    
    const endRange = range.cloneRange();
    endRange.selectNodeContents(editableElement);
    endRange.setEnd(range.endContainer, range.endOffset);
    const endOffset = endRange.toString().length;
    
    savedSelection = {
      start: startOffset,
      end: endOffset,
      collapsed: range.collapsed,
    };
  }
  
  function restoreCaretPosition() {
    if (!savedSelection || !editableElement) return;
    
    const selection = window.getSelection();
    const range = document.createRange();
    
    let currentOffset = 0;
    const walker = document.createTreeWalker(
      editableElement,
      NodeFilter.SHOW_TEXT,
      null
    );
    
    let startNode = null;
    let startOffset = 0;
    let node;
    
    while (node = walker.nextNode()) {
      const nodeLength = node.textContent.length;
      
      if (currentOffset + nodeLength >= savedSelection.start) {
        startNode = node;
        startOffset = savedSelection.start - currentOffset;
        break;
      }
      
      currentOffset += nodeLength;
    }
    
    if (!startNode) return;
    
    range.setStart(startNode, startOffset);
    
    if (savedSelection.collapsed) {
      range.collapse(true);
    } else {
      currentOffset = 0;
      const walker = document.createTreeWalker(
        editableElement,
        NodeFilter.SHOW_TEXT,
        null
      );
      
      while (node = walker.nextNode()) {
        const nodeLength = node.textContent.length;
        
        if (currentOffset + nodeLength >= savedSelection.end) {
          const endNode = node;
          const endOffset = savedSelection.end - currentOffset;
          range.setEnd(endNode, endOffset);
          break;
        }
        
        currentOffset += nodeLength;
      }
    }
    
    selection.removeAllRanges();
    selection.addRange(range);
  }
  
  function handleInput(event) {
    if (isUpdating || disabled) return;
    
    saveCaretPosition();
    localValue = event.currentTarget.innerHTML;
    debouncedUpdate(localValue);
  }
  
  function handleBlur() {
    // blur 시 최종 업데이트
    if (editableElement && editableElement.innerHTML !== value) {
      value = editableElement.innerHTML;
      editableElement.dispatchEvent(new CustomEvent('input', {
        detail: value,
        bubbles: true,
      }));
    }
    
    editableElement?.dispatchEvent(new CustomEvent('blur', {
      bubbles: true,
    }));
  }
  
  // value prop이 변경될 때 DOM 업데이트
  $: if (editableElement && !isUpdating && editableElement.innerHTML !== value) {
    isUpdating = true;
    saveCaretPosition();
    editableElement.innerHTML = value;
    localValue = value;
    
    requestAnimationFrame(() => {
      restoreCaretPosition();
      isUpdating = false;
    });
  }
</script>

<div
  bind:this={editableElement}
  contenteditable={!disabled}
  class:disabled
  on:input={handleInput}
  on:blur={handleBlur}
  on:keyup={saveCaretPosition}
  on:mouseup={saveCaretPosition}
  role="textbox"
  aria-multiline="true"
  aria-disabled={disabled}
></div>

<style>
  .disabled {
    opacity: 0.6;
    cursor: not-allowed;
    user-select: none;
  }
  
  [contenteditable="true"] {
    outline: none;
  }
  
  [contenteditable="true"]:focus {
    outline: 2px solid var(--accent-primary, #0066cc);
    outline-offset: 2px;
  }
</style>

<!-- utils.js -->
<!--
export function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}
-->
```

## 주의사항

- 무한 루프를 피하기 위해 반응형 문(`$:`)을 주의해서 사용
- DOM 업데이트 전에 항상 커서 위치 저장
- DOM 변경 후 커서 복원에 `requestAnimationFrame` 또는 `setTimeout` 사용
- 반응형 업데이트를 줄이기 위해 입력 이벤트 디바운싱
- 요소 참조를 얻기 위해 `bind:this` 사용
- `innerHTML`을 직접 바인딩하지 않음 - 대신 반응형 문 사용
- 다양한 시나리오에서 Svelte의 반응성으로 테스트
- 복잡한 상태 관리를 위해 stores 사용 고려

## 브라우저 호환성

- **Chrome/Edge**: Svelte와 잘 작동합니다
- **Firefox**: 좋은 지원이지만 커서 복원을 테스트하세요
- **Safari**: 작동하지만 반응형 업데이트에 주의하세요

## 관련 자료

- [시나리오: 프레임워크 상태 동기화](/scenarios/scenario-framework-state-sync)
- [Tip: 선택 처리 패턴](/tips/tip-017-selection-handling-pattern)
- [Tip: React 통합](/tips/tip-001-caret-preservation-react)
- [Tip: Vue 통합](/tips/tip-004-vue-state-sync)
