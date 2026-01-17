---
id: tip-010-paste-link-preservation-ko
title: 링크 붙여넣기 시 구조 보존하기
description: "contenteditable 요소에 링크를 붙여넣을 때 링크 제목과 HTML 구조를 보존하는 방법, 특히 Safari에서"
category: paste
tags:
  - paste
  - link
  - clipboard
  - safari
  - url
  - html
difficulty: intermediate
relatedScenarios:
  - scenario-paste-link-behavior
relatedCases:
  - ce-0301-safari-paste-link-url-only-en
locale: ko
---

## 문제

`contenteditable` 요소에 링크를 붙여넣을 때, Safari는 URL만 일반 텍스트로 붙여넣어 링크의 제목과 HTML 구조를 잃어버립니다. 다른 브라우저(Chrome, Firefox, Edge)는 링크 제목과 URL을 모두 올바르게 보존합니다. 이 불일치는 컨텍스트 손실을 일으키며 사용자가 수동으로 제목이 있는 링크를 다시 만들어야 합니다.

## 해결 방법

### 1. 붙여넣기 이벤트 가로채서 링크 재구성

붙여넣기 이벤트를 사용하여 클립보드 데이터를 읽고 링크 요소를 수동으로 생성합니다:

```javascript
const editor = document.querySelector('div[contenteditable]');

editor.addEventListener('paste', async (e) => {
  e.preventDefault();
  
  const clipboardData = e.clipboardData || window.clipboardData;
  const pastedText = clipboardData.getData('text/plain');
  
  // 붙여넣은 텍스트가 URL인지 확인
  const urlPattern = /^https?:\/\/.+/;
  if (urlPattern.test(pastedText.trim())) {
    // 클립보드에서 링크 제목 가져오기 시도
    let linkTitle = pastedText;
    
    try {
      const htmlData = clipboardData.getData('text/html');
      if (htmlData) {
        const parser = new DOMParser();
        const doc = parser.parseFromString(htmlData, 'text/html');
        const link = doc.querySelector('a');
        if (link) {
          linkTitle = link.textContent || link.href;
        }
      }
    } catch (err) {
      // HTML 파싱 실패 시 URL 사용
    }
    
    // 링크 요소 생성 및 삽입
    const selection = window.getSelection();
    if (selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      range.deleteContents();
      
      const link = document.createElement('a');
      link.href = pastedText.trim();
      link.textContent = linkTitle;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      
      range.insertNode(link);
      range.collapse(false);
      
      selection.removeAllRanges();
      selection.addRange(range);
    }
  } else {
    // URL이 아니면 일반 텍스트로 붙여넣기
    const selection = window.getSelection();
    if (selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      range.deleteContents();
      const textNode = document.createTextNode(pastedText);
      range.insertNode(textNode);
      range.collapse(false);
      selection.removeAllRanges();
      selection.addRange(range);
    }
  }
});
```

### 2. 더 나은 제어를 위해 Clipboard API 사용

가능한 경우 최신 Clipboard API를 사용하여 더 안정적인 링크 데이터 추출:

```javascript
const editor = document.querySelector('div[contenteditable]');

editor.addEventListener('paste', async (e) => {
  e.preventDefault();
  
  let pastedText = '';
  let linkTitle = '';
  
  try {
    // 먼저 최신 Clipboard API 시도
    if (navigator.clipboard && navigator.clipboard.readText) {
      pastedText = await navigator.clipboard.readText();
    } else {
      // 붙여넣기 이벤트 데이터로 대체
      const clipboardData = e.clipboardData || window.clipboardData;
      pastedText = clipboardData.getData('text/plain');
    }
  } catch (err) {
    // 붙여넣기 이벤트 데이터로 대체
    const clipboardData = e.clipboardData || window.clipboardData;
    pastedText = clipboardData.getData('text/plain');
  }
  
  // 붙여넣은 텍스트가 URL인지 확인
  const urlPattern = /^https?:\/\/.+/;
  if (urlPattern.test(pastedText.trim())) {
    // HTML 클립보드 데이터에서 링크 제목 추출 시도
    try {
      const clipboardData = e.clipboardData || window.clipboardData;
      const htmlData = clipboardData.getData('text/html');
      
      if (htmlData) {
        const parser = new DOMParser();
        const doc = parser.parseFromString(htmlData, 'text/html');
        const link = doc.querySelector('a');
        if (link) {
          linkTitle = link.textContent || link.title || link.href;
        }
      }
    } catch (err) {
      // HTML 파싱 실패
    }
    
    // 제목을 찾지 못한 경우 URL을 제목으로 사용
    if (!linkTitle) {
      linkTitle = pastedText.trim();
    }
    
    // 링크 삽입
    insertLinkAtCursor(pastedText.trim(), linkTitle);
  } else {
    // URL이 아니면 일반 텍스트로 붙여넣기
    insertTextAtCursor(pastedText);
  }
});

function insertLinkAtCursor(url, title) {
  const selection = window.getSelection();
  if (selection.rangeCount === 0) return;
  
  const range = selection.getRangeAt(0);
  range.deleteContents();
  
  const link = document.createElement('a');
  link.href = url;
  link.textContent = title;
  link.target = '_blank';
  link.rel = 'noopener noreferrer';
  
  range.insertNode(link);
  range.collapse(false);
  
  selection.removeAllRanges();
  selection.addRange(range);
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

### 3. 일반 URL 붙여넣기 감지 및 변환

대체 방법으로, 일반 URL이 붙여넣어진 경우를 감지하여 자동으로 링크로 변환:

```javascript
const editor = document.querySelector('div[contenteditable]');

editor.addEventListener('paste', (e) => {
  const clipboardData = e.clipboardData || window.clipboardData;
  const pastedText = clipboardData.getData('text/plain');
  
  // 붙여넣은 텍스트가 URL인지 확인
  if (isUrl(pastedText.trim())) {
    e.preventDefault();
    
    const selection = window.getSelection();
    if (selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      range.deleteContents();
      
      const link = document.createElement('a');
      link.href = pastedText.trim();
      link.textContent = pastedText.trim();
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      
      range.insertNode(link);
      range.collapse(false);
      
      selection.removeAllRanges();
      selection.addRange(range);
    }
  }
  // URL이 아니면 기본 붙여넣기 동작 진행
});

function isUrl(text) {
  const urlPattern = /^https?:\/\/[^\s]+$/;
  return urlPattern.test(text.trim());
}
```

### 4. 포괄적인 링크 붙여넣기 핸들러

다양한 엣지 케이스를 처리하는 완전한 해결책:

```javascript
class LinkPasteHandler {
  constructor(element) {
    this.element = element;
    this.init();
  }
  
  init() {
    this.element.addEventListener('paste', this.handlePaste.bind(this));
  }
  
  async handlePaste(e) {
    const clipboardData = e.clipboardData || window.clipboardData;
    const pastedText = clipboardData.getData('text/plain');
    
    // 붙여넣은 텍스트가 URL인지 확인
    if (!this.isUrl(pastedText)) {
      return; // 기본 붙여넣기 동작 진행
    }
    
    e.preventDefault();
    
    // HTML 클립보드 데이터에서 링크 제목 가져오기 시도
    let linkTitle = pastedText.trim();
    try {
      const htmlData = clipboardData.getData('text/html');
      if (htmlData) {
        const title = this.extractLinkTitle(htmlData);
        if (title) {
          linkTitle = title;
        }
      }
    } catch (err) {
      // HTML 파싱 실패, URL을 제목으로 사용
    }
    
    // 커서 위치에 링크 삽입
    this.insertLink(pastedText.trim(), linkTitle);
  }
  
  isUrl(text) {
    const urlPattern = /^https?:\/\/[^\s]+$/;
    return urlPattern.test(text.trim());
  }
  
  extractLinkTitle(html) {
    try {
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, 'text/html');
      const link = doc.querySelector('a');
      if (link) {
        return link.textContent || link.title || link.href;
      }
    } catch (err) {
      // 파싱 실패
    }
    return null;
  }
  
  insertLink(url, title) {
    const selection = window.getSelection();
    if (selection.rangeCount === 0) return;
    
    const range = selection.getRangeAt(0);
    range.deleteContents();
    
    const link = document.createElement('a');
    link.href = url;
    link.textContent = title;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    
    range.insertNode(link);
    
    // 링크 뒤로 커서 이동
    range.setStartAfter(link);
    range.collapse(true);
    
    selection.removeAllRanges();
    selection.addRange(range);
  }
  
  dispose() {
    this.element.removeEventListener('paste', this.handlePaste);
  }
}

// 사용법
const editor = document.querySelector('div[contenteditable]');
const handler = new LinkPasteHandler(editor);
```

## 주의사항

- Safari가 이 문제의 주요 영향 브라우저이지만, 해결책은 모든 브라우저에서 작동합니다
- Clipboard API는 보안상 HTTPS 또는 localhost가 필요합니다
- 붙여넣기 이벤트를 수동으로 처리할 때는 항상 `e.preventDefault()`를 사용하여 기본 동작을 방지하세요
- 필요시 `title`, `rel` 또는 사용자 정의 데이터 속성과 같은 다른 링크 속성도 보존하는 것을 고려하세요
- 다양한 소스(우클릭 메뉴, 선택된 텍스트 등)에서 복사한 링크로 테스트하세요
- HTML 클립보드 데이터 형식은 브라우저마다 다를 수 있으므로 파싱이 견고해야 합니다
- 더 나은 UX를 위해 클립보드 데이터를 처리하는 동안 로딩 표시기를 표시하는 것을 고려하세요

## 관련 자료

- [시나리오: 링크 붙여넣기 동작](/scenarios/scenario-paste-link-behavior)
- [케이스: ce-0301](/cases/ce-0301-safari-paste-link-url-only-en)
