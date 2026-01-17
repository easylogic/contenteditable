---
id: tip-011-link-insertion-editing-ko
title: 브라우저 간 일관된 링크 삽입 및 편집
description: "모든 브라우저에서 일관된 동작으로 contenteditable 요소에 링크를 생성, 편집, 제거하는 방법"
category: formatting
tags:
  - link
  - anchor
  - href
  - formatting
  - browser-compatibility
  - nested-links
difficulty: intermediate
relatedScenarios:
  - scenario-link-insertion
relatedCases:
  - ce-0100-link-insertion-chrome
  - ce-0133-link-removal-leaves-empty-ko
locale: ko
---

## 문제

`contenteditable` 요소에서 링크를 삽입하거나 편집할 때 브라우저 동작이 크게 다릅니다. 선택한 텍스트에서 링크 생성, 링크 텍스트 편집, 링크 제거는 예상치 못한 DOM 구조, 중첩된 링크(유효하지 않은 HTML), 또는 손실된 포맷팅을 초래할 수 있습니다. Firefox는 중첩된 링크를 생성할 가능성이 더 높고, Safari는 가장 일관되지 않은 동작을 보입니다.

## 해결 방법

### 1. 사용자 정의 링크 생성 핸들러

`formatCreateLink` 입력 타입을 가로채서 안전하게 링크를 생성합니다:

```javascript
const editor = document.querySelector('div[contenteditable]');

editor.addEventListener('beforeinput', (e) => {
  if (e.inputType === 'formatCreateLink') {
    e.preventDefault();
    
    const selection = window.getSelection();
    if (selection.rangeCount === 0) return;
    
    const range = selection.getRangeAt(0);
    const selectedText = range.toString();
    
    if (!selectedText) {
      // 선택 없음, URL 입력받아 링크 생성
      const url = prompt('URL 입력:');
      if (url) {
        insertLinkAtCursor(url, url);
      }
      return;
    }
    
    // 사용자로부터 URL 받기
    const url = prompt('URL 입력:', 'https://');
    if (url) {
      createLinkSafely(range, url, selectedText);
    }
  }
});

function createLinkSafely(range, url, text) {
  // 선택이 이미 링크 내부에 있는지 확인
  let ancestor = range.commonAncestorContainer;
  if (ancestor.nodeType === Node.TEXT_NODE) {
    ancestor = ancestor.parentNode;
  }
  
  const existingLink = ancestor.closest('a');
  if (existingLink) {
    // 중첩을 피하기 위해 먼저 기존 링크 제거
    unwrapLink(existingLink);
    // 언래핑 후 범위 재계산
    const selection = window.getSelection();
    if (selection.rangeCount > 0) {
      range = selection.getRangeAt(0);
    }
  }
  
  // 선택된 내용 추출
  const contents = range.extractContents();
  
  // 새 링크 생성
  const link = document.createElement('a');
  link.href = url;
  link.textContent = text || url;
  link.target = '_blank';
  link.rel = 'noopener noreferrer';
  
  // 링크 삽입
  range.insertNode(link);
  
  // 링크 뒤로 커서 이동
  const newRange = document.createRange();
  newRange.setStartAfter(link);
  newRange.collapse(true);
  
  const selection = window.getSelection();
  selection.removeAllRanges();
  selection.addRange(newRange);
}

function unwrapLink(link) {
  const parent = link.parentNode;
  while (link.firstChild) {
    parent.insertBefore(link.firstChild, link);
  }
  parent.removeChild(link);
}
```

### 2. 안전한 링크 편집

링크 내부의 텍스트 편집을 처리하여 구조 손상을 방지합니다:

```javascript
const editor = document.querySelector('div[contenteditable]');

editor.addEventListener('input', (e) => {
  // 입력이 링크 내부에서 발생했는지 확인
  const selection = window.getSelection();
  if (selection.rangeCount === 0) return;
  
  const range = selection.getRangeAt(0);
  let container = range.commonAncestorContainer;
  
  if (container.nodeType === Node.TEXT_NODE) {
    container = container.parentNode;
  }
  
  const link = container.closest('a');
  if (!link) return;
  
  // 링크가 비어있거나 공백만 있는지 확인
  const linkText = link.textContent.trim();
  if (!linkText) {
    // 빈 링크 제거
    unwrapLink(link);
  } else {
    // 링크가 여전히 href를 가지고 있는지 확인
    if (!link.href || link.href === '') {
      link.href = linkText; // 텍스트를 URL 대체로 사용
    }
  }
});
```

### 3. 링크 제거 핸들러

텍스트를 보존하면서 안전하게 링크를 제거합니다:

```javascript
function removeLink() {
  const selection = window.getSelection();
  if (selection.rangeCount === 0) return;
  
  const range = selection.getRangeAt(0);
  let container = range.commonAncestorContainer;
  
  if (container.nodeType === Node.TEXT_NODE) {
    container = container.parentNode;
  }
  
  const link = container.closest('a');
  if (link) {
    unwrapLink(link);
    
    // 커서 위치 복원
    const newRange = document.createRange();
    newRange.setStart(link.parentNode, 0);
    newRange.collapse(true);
    
    selection.removeAllRanges();
    selection.addRange(newRange);
  }
}

// 키보드 단축키에 바인딩 (예: Ctrl+K 또는 사용자 정의 명령)
editor.addEventListener('keydown', (e) => {
  if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
    e.preventDefault();
    removeLink();
  }
});
```

### 4. 포괄적인 링크 관리자

모든 링크 작업을 처리하는 완전한 해결책:

```javascript
class LinkManager {
  constructor(editor) {
    this.editor = editor;
    this.init();
  }
  
  init() {
    this.editor.addEventListener('beforeinput', this.handleBeforeInput.bind(this));
    this.editor.addEventListener('input', this.handleInput.bind(this));
    this.editor.addEventListener('keydown', this.handleKeyDown.bind(this));
  }
  
  handleBeforeInput(e) {
    if (e.inputType === 'formatCreateLink') {
      e.preventDefault();
      this.createLink();
    }
  }
  
  handleInput(e) {
    // 빈 링크 정리
    this.cleanupEmptyLinks();
    // 중첩된 링크 방지
    this.preventNestedLinks();
  }
  
  handleKeyDown(e) {
    // Ctrl+K로 링크 제거 (또는 사용자 정의 단축키)
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
      e.preventDefault();
      this.removeLink();
    }
  }
  
  createLink() {
    const selection = window.getSelection();
    if (selection.rangeCount === 0) return;
    
    const range = selection.getRangeAt(0);
    const selectedText = range.toString();
    
    if (!selectedText) {
      const url = prompt('URL 입력:');
      if (url) {
        this.insertLinkAtCursor(url, url);
      }
      return;
    }
    
    const url = prompt('URL 입력:', 'https://');
    if (url) {
      this.createLinkSafely(range, url, selectedText);
    }
  }
  
  createLinkSafely(range, url, text) {
    // 선택 범위 내의 기존 링크 제거
    this.removeLinksInRange(range);
    
    // 내용 추출
    const contents = range.extractContents();
    
    // 링크 생성
    const link = document.createElement('a');
    link.href = url;
    link.textContent = text || url;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    
    // 링크 삽입
    range.insertNode(link);
    
    // 링크 뒤로 커서 이동
    this.setCursorAfter(link);
  }
  
  insertLinkAtCursor(url, text) {
    const selection = window.getSelection();
    if (selection.rangeCount === 0) return;
    
    const range = selection.getRangeAt(0);
    range.deleteContents();
    
    const link = document.createElement('a');
    link.href = url;
    link.textContent = text || url;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    
    range.insertNode(link);
    this.setCursorAfter(link);
  }
  
  removeLink() {
    const selection = window.getSelection();
    if (selection.rangeCount === 0) return;
    
    const range = selection.getRangeAt(0);
    const link = this.getLinkInRange(range);
    
    if (link) {
      this.unwrapLink(link);
    }
  }
  
  removeLinksInRange(range) {
    // 범위 내의 모든 링크를 찾아 언래핑
    const contents = range.cloneContents();
    const links = contents.querySelectorAll('a');
    
    links.forEach(link => {
      const actualLink = this.editor.querySelector(`a[href="${link.href}"]`);
      if (actualLink) {
        this.unwrapLink(actualLink);
      }
    });
  }
  
  unwrapLink(link) {
    const parent = link.parentNode;
    const nextSibling = link.nextSibling;
    
    while (link.firstChild) {
      parent.insertBefore(link.firstChild, nextSibling);
    }
    
    parent.removeChild(link);
  }
  
  getLinkInRange(range) {
    let container = range.commonAncestorContainer;
    if (container.nodeType === Node.TEXT_NODE) {
      container = container.parentNode;
    }
    return container.closest('a');
  }
  
  cleanupEmptyLinks() {
    const links = this.editor.querySelectorAll('a');
    links.forEach(link => {
      const text = link.textContent.trim();
      if (!text) {
        this.unwrapLink(link);
      }
    });
  }
  
  preventNestedLinks() {
    const links = this.editor.querySelectorAll('a a');
    links.forEach(nestedLink => {
      // 내부 링크 언래핑
      this.unwrapLink(nestedLink);
    });
  }
  
  setCursorAfter(node) {
    const range = document.createRange();
    range.setStartAfter(node);
    range.collapse(true);
    
    const selection = window.getSelection();
    selection.removeAllRanges();
    selection.addRange(range);
  }
  
  dispose() {
    this.editor.removeEventListener('beforeinput', this.handleBeforeInput);
    this.editor.removeEventListener('input', this.handleInput);
    this.editor.removeEventListener('keydown', this.handleKeyDown);
  }
}

// 사용법
const editor = document.querySelector('div[contenteditable]');
const linkManager = new LinkManager(editor);
```

## 주의사항

- 중첩된 링크(`<a><a></a></a>`)는 유효하지 않은 HTML이므로 항상 방지해야 합니다
- Firefox는 중첩된 링크를 생성할 가능성이 더 높으므로 추가 주의가 필요합니다
- Safari는 가장 일관되지 않은 동작을 보이므로 포괄적인 처리가 필수입니다
- 새 링크를 생성하기 전에 선택이 이미 링크 내부에 있는지 항상 확인하세요
- 빈 링크는 DOM을 깨끗하게 유지하기 위해 제거해야 합니다
- 언래핑할 때 `title`, `rel` 또는 사용자 정의 데이터 속성과 같은 링크 속성을 보존하는 것을 고려하세요
- 모든 주요 브라우저에서 링크 작업을 테스트하여 일관성을 보장하세요
- `formatCreateLink` 입력 타입은 브라우저의 네이티브 링크 생성(일부 에디터에서 Ctrl+K)에 의해 트리거됩니다

## 관련 자료

- [시나리오: 링크 삽입 및 편집](/scenarios/scenario-link-insertion)
- [케이스: ce-0100](/cases/ce-0100-link-insertion-chrome)
- [케이스: ce-0133](/cases/ce-0133-link-removal-leaves-empty-ko)
