---
id: tip-019-paste-handler-pattern-ko
title: 붙여넣기 이벤트 처리 및 정화
description: "contenteditable에서 붙여넣기 이벤트를 가로채고 처리하며, HTML 콘텐츠를 정화하고 붙여넣을 내용을 제어하는 방법"
category: common-patterns
tags:
  - paste
  - clipboard
  - sanitization
  - html
  - security
  - pattern
difficulty: intermediate
relatedScenarios: []
relatedCases: []
locale: ko
---

## 이 Tip을 사용할 때

다음과 같은 경우에 이 패턴을 사용하세요:
- 붙여넣기 작업 가로채기
- 붙여넣은 HTML 콘텐츠 정화
- 원하지 않는 포맷팅 또는 스타일 제거
- 붙여넣은 콘텐츠를 일반 텍스트로 변환
- 허용할 HTML 요소 제어
- 다양한 소스(Word, Google Docs 등)에서 붙여넣기 처리

## 문제

contenteditable의 붙여넣기 작업은 다음을 포함할 수 있습니다:
- 외부 소스의 원하지 않는 HTML
- 디자인을 깨는 인라인 스타일
- 스크립트 또는 안전하지 않은 콘텐츠
- 원하지 않는 포맷팅 보존
- 일관되지 않은 DOM 구조 생성

## 해결 방법

### 1. 기본 붙여넣기 핸들러

간단한 붙여넣기 가로채기 및 정화:

```javascript
class PasteHandler {
  constructor(editor, options = {}) {
    this.editor = editor;
    this.options = {
      allowedTags: options.allowedTags || ['p', 'br', 'strong', 'em', 'u', 'a', 'ul', 'ol', 'li'],
      allowedAttributes: options.allowedAttributes || ['href', 'title'],
      stripStyles: options.stripStyles !== false,
      convertToPlainText: options.convertToPlainText || false,
      ...options,
    };
    this.init();
  }
  
  init() {
    this.editor.addEventListener('paste', (e) => {
      e.preventDefault();
      this.handlePaste(e);
    });
  }
  
  handlePaste(e) {
    const clipboardData = e.clipboardData || window.clipboardData;
    if (!clipboardData) return;
    
    const html = clipboardData.getData('text/html');
    const text = clipboardData.getData('text/plain');
    
    const selection = window.getSelection();
    if (selection.rangeCount === 0) return;
    
    const range = selection.getRangeAt(0);
    
    // 선택된 내용 삭제
    if (!range.collapsed) {
      range.deleteContents();
    }
    
    // 콘텐츠 처리
    let content;
    if (this.options.convertToPlainText) {
      content = this.createTextNode(text || html);
    } else if (html) {
      content = this.sanitizeHTML(html);
    } else if (text) {
      content = this.createTextNode(text);
    } else {
      return;
    }
    
    // 콘텐츠 삽입
    if (content.nodeType === Node.DOCUMENT_FRAGMENT_NODE) {
      range.insertNode(content);
      // 삽입된 콘텐츠 뒤로 커서 이동
      range.setStartAfter(content.lastChild || content);
    } else {
      range.insertNode(content);
      range.setStartAfter(content);
    }
    
    range.collapse(true);
    
    selection.removeAllRanges();
    selection.addRange(range);
    
    // input 이벤트 트리거
    this.editor.dispatchEvent(new Event('input', { bubbles: true }));
  }
  
  sanitizeHTML(html) {
    // 임시 컨테이너 생성
    const temp = document.createElement('div');
    temp.innerHTML = html;
    
    // 정화
    this.sanitizeElement(temp);
    
    // 정화된 콘텐츠 추출
    const fragment = document.createDocumentFragment();
    while (temp.firstChild) {
      fragment.appendChild(temp.firstChild);
    }
    
    return fragment;
  }
  
  sanitizeElement(element) {
    // 허용되지 않은 속성 제거
    Array.from(element.attributes || []).forEach(attr => {
      if (!this.options.allowedAttributes.includes(attr.name)) {
        element.removeAttribute(attr.name);
      }
    });
    
    // 필요한 경우 스타일 제거
    if (this.options.stripStyles) {
      element.removeAttribute('style');
      element.removeAttribute('class');
    }
    
    // 자식 노드 처리
    const children = Array.from(element.childNodes);
    children.forEach(child => {
      if (child.nodeType === Node.ELEMENT_NODE) {
        const tagName = child.tagName.toLowerCase();
        
        // 허용되지 않은 태그 제거
        if (!this.options.allowedTags.includes(tagName)) {
          // 언래핑: 자식을 부모로 이동
          const parent = child.parentNode;
          while (child.firstChild) {
            parent.insertBefore(child.firstChild, child);
          }
          parent.removeChild(child);
        } else {
          // 허용된 태그를 재귀적으로 정화
          this.sanitizeElement(child);
        }
      } else if (child.nodeType === Node.TEXT_NODE) {
        // 텍스트 노드 유지
      } else {
        // 다른 노드 타입 제거
        child.remove();
      }
    });
  }
  
  createTextNode(text) {
    // HTML 엔티티 및 줄바꿈 변환
    const div = document.createElement('div');
    div.textContent = text;
    const processedText = div.innerHTML
      .replace(/\n/g, '<br>')
      .replace(/&nbsp;/g, ' ');
    
    const temp = document.createElement('div');
    temp.innerHTML = processedText;
    
    const fragment = document.createDocumentFragment();
    while (temp.firstChild) {
      fragment.appendChild(temp.firstChild);
    }
    
    return fragment;
  }
}

// 사용법
const editor = document.querySelector('div[contenteditable]');
const pasteHandler = new PasteHandler(editor, {
  allowedTags: ['p', 'br', 'strong', 'em', 'a'],
  stripStyles: true,
});
```

### 2. DOMPurify를 사용한 고급 붙여넣기 핸들러

강력한 정화를 위해 DOMPurify 라이브러리 사용:

```javascript
import DOMPurify from 'dompurify';

class SecurePasteHandler {
  constructor(editor, options = {}) {
    this.editor = editor;
    this.options = {
      allowedTags: options.allowedTags || ['p', 'br', 'strong', 'em', 'u', 'a', 'ul', 'ol', 'li'],
      allowedAttributes: options.allowedAttributes || { a: ['href', 'title'] },
      ...options,
    };
    this.init();
  }
  
  init() {
    this.editor.addEventListener('paste', (e) => {
      e.preventDefault();
      this.handlePaste(e);
    });
  }
  
  handlePaste(e) {
    const clipboardData = e.clipboardData || window.clipboardData;
    if (!clipboardData) return;
    
    const html = clipboardData.getData('text/html');
    const text = clipboardData.getData('text/plain');
    
    const selection = window.getSelection();
    if (selection.rangeCount === 0) return;
    
    const range = selection.getRangeAt(0);
    
    if (!range.collapsed) {
      range.deleteContents();
    }
    
    let content;
    if (html) {
      content = this.sanitizeWithDOMPurify(html);
    } else if (text) {
      content = this.createTextContent(text);
    } else {
      return;
    }
    
    this.insertContent(range, content);
    
    // input 이벤트 트리거
    this.editor.dispatchEvent(new Event('input', { bubbles: true }));
  }
  
  sanitizeWithDOMPurify(html) {
    const config = {
      ALLOWED_TAGS: this.options.allowedTags,
      ALLOWED_ATTR: this.options.allowedAttributes,
      ALLOW_DATA_ATTR: false,
    };
    
    const sanitized = DOMPurify.sanitize(html, config);
    
    // 프래그먼트로 변환
    const temp = document.createElement('div');
    temp.innerHTML = sanitized;
    
    const fragment = document.createDocumentFragment();
    while (temp.firstChild) {
      fragment.appendChild(temp.firstChild);
    }
    
    return fragment;
  }
  
  createTextContent(text) {
    // 줄바꿈을 <br>로 변환
    const lines = text.split('\n');
    const fragment = document.createDocumentFragment();
    
    lines.forEach((line, index) => {
      if (line.trim()) {
        const textNode = document.createTextNode(line);
        fragment.appendChild(textNode);
      }
      
      if (index < lines.length - 1) {
        fragment.appendChild(document.createElement('br'));
      }
    });
    
    return fragment;
  }
  
  insertContent(range, content) {
    if (content.nodeType === Node.DOCUMENT_FRAGMENT_NODE) {
      range.insertNode(content);
      if (content.lastChild) {
        range.setStartAfter(content.lastChild);
      }
    } else {
      range.insertNode(content);
      range.setStartAfter(content);
    }
    
    range.collapse(true);
    
    const selection = window.getSelection();
    selection.removeAllRanges();
    selection.addRange(range);
  }
}

// 사용법
const editor = document.querySelector('div[contenteditable]');
const pasteHandler = new SecurePasteHandler(editor);
```

### 3. 포맷 변환이 있는 붙여넣기 핸들러

붙여넣은 콘텐츠를 에디터의 포맷에 맞게 변환:

```javascript
class FormatConvertingPasteHandler {
  constructor(editor) {
    this.editor = editor;
    this.init();
  }
  
  init() {
    this.editor.addEventListener('paste', (e) => {
      e.preventDefault();
      this.handlePaste(e);
    });
  }
  
  handlePaste(e) {
    const clipboardData = e.clipboardData || window.clipboardData;
    if (!clipboardData) return;
    
    const html = clipboardData.getData('text/html');
    const text = clipboardData.getData('text/plain');
    
    const selection = window.getSelection();
    if (selection.rangeCount === 0) return;
    
    const range = selection.getRangeAt(0);
    
    if (!range.collapsed) {
      range.deleteContents();
    }
    
    let content;
    if (html) {
      content = this.convertHTML(html);
    } else if (text) {
      content = this.convertText(text);
    } else {
      return;
    }
    
    this.insertContent(range, content);
    
    this.editor.dispatchEvent(new Event('input', { bubbles: true }));
  }
  
  convertHTML(html) {
    const temp = document.createElement('div');
    temp.innerHTML = html;
    
    // 일반적인 포맷팅 변환
    this.convertElement(temp);
    
    const fragment = document.createDocumentFragment();
    while (temp.firstChild) {
      fragment.appendChild(temp.firstChild);
    }
    
    return fragment;
  }
  
  convertElement(element) {
    // <b>를 <strong>으로 변환
    element.querySelectorAll('b').forEach(b => {
      const strong = document.createElement('strong');
      strong.innerHTML = b.innerHTML;
      b.parentNode.replaceChild(strong, b);
    });
    
    // <i>를 <em>으로 변환
    element.querySelectorAll('i').forEach(i => {
      const em = document.createElement('em');
      em.innerHTML = i.innerHTML;
      i.parentNode.replaceChild(em, i);
    });
    
    // 인라인 스타일 제거
    element.querySelectorAll('[style]').forEach(el => {
      el.removeAttribute('style');
    });
    
    // 클래스 제거
    element.querySelectorAll('[class]').forEach(el => {
      el.removeAttribute('class');
    });
    
    // 단락을 위해 <div>를 <p>로 변환
    element.querySelectorAll('div').forEach(div => {
      if (!div.querySelector('p, ul, ol, h1, h2, h3, h4, h5, h6')) {
        const p = document.createElement('p');
        p.innerHTML = div.innerHTML;
        div.parentNode.replaceChild(p, div);
      }
    });
    
    // 자식을 재귀적으로 처리
    Array.from(element.children).forEach(child => {
      this.convertElement(child);
    });
  }
  
  convertText(text) {
    // 줄바꿈을 <br> 또는 <p>로 변환
    const lines = text.split('\n');
    const fragment = document.createDocumentFragment();
    
    lines.forEach((line, index) => {
      if (line.trim()) {
        const p = document.createElement('p');
        p.textContent = line.trim();
        fragment.appendChild(p);
      } else if (index < lines.length - 1) {
        // 빈 줄 - <br> 추가
        fragment.appendChild(document.createElement('br'));
      }
    });
    
    return fragment;
  }
  
  insertContent(range, content) {
    if (content.nodeType === Node.DOCUMENT_FRAGMENT_NODE) {
      range.insertNode(content);
      if (content.lastChild) {
        range.setStartAfter(content.lastChild);
      }
    } else {
      range.insertNode(content);
      range.setStartAfter(content);
    }
    
    range.collapse(true);
    
    const selection = window.getSelection();
    selection.removeAllRanges();
    selection.addRange(range);
  }
}

// 사용법
const editor = document.querySelector('div[contenteditable]');
const pasteHandler = new FormatConvertingPasteHandler(editor);
```

### 4. 옵션이 있는 완전한 붙여넣기 핸들러

여러 옵션을 제공하는 포괄적인 해결책:

```javascript
class CompletePasteHandler {
  constructor(editor, options = {}) {
    this.editor = editor;
    this.options = {
      // 정화
      allowedTags: options.allowedTags || ['p', 'br', 'strong', 'em', 'u', 'a', 'ul', 'ol', 'li', 'h1', 'h2', 'h3'],
      allowedAttributes: options.allowedAttributes || ['href', 'title'],
      stripStyles: options.stripStyles !== false,
      stripClasses: options.stripClasses !== false,
      
      // 변환
      convertToPlainText: options.convertToPlainText || false,
      convertBoldToStrong: options.convertBoldToStrong !== false,
      convertItalicToEm: options.convertItalicToEm !== false,
      convertDivToP: options.convertDivToP !== false,
      
      // 동작
      preserveLineBreaks: options.preserveLineBreaks !== false,
      mergeAdjacentText: options.mergeAdjacentText !== false,
      
      // 콜백
      onPaste: options.onPaste || null,
      onSanitize: options.onSanitize || null,
      
      ...options,
    };
    this.init();
  }
  
  init() {
    this.editor.addEventListener('paste', (e) => {
      e.preventDefault();
      this.handlePaste(e);
    });
  }
  
  handlePaste(e) {
    const clipboardData = e.clipboardData || window.clipboardData;
    if (!clipboardData) return;
    
    const html = clipboardData.getData('text/html');
    const text = clipboardData.getData('text/plain');
    const files = Array.from(clipboardData.files || []);
    
    const selection = window.getSelection();
    if (selection.rangeCount === 0) return;
    
    const range = selection.getRangeAt(0);
    
    if (!range.collapsed) {
      range.deleteContents();
    }
    
    // 파일 처리 (이미지 등)
    if (files.length > 0) {
      this.handleFiles(range, files);
      return;
    }
    
    // 텍스트/HTML 처리
    let content;
    if (this.options.convertToPlainText) {
      content = this.createPlainText(text || html);
    } else if (html) {
      content = this.processHTML(html);
    } else if (text) {
      content = this.processText(text);
    } else {
      return;
    }
    
    // 콜백
    if (this.options.onPaste) {
      content = this.options.onPaste(content, { html, text, files }) || content;
    }
    
    this.insertContent(range, content);
    
    this.editor.dispatchEvent(new Event('input', { bubbles: true }));
  }
  
  processHTML(html) {
    const temp = document.createElement('div');
    temp.innerHTML = html;
    
    // 포맷팅 변환
    if (this.options.convertBoldToStrong) {
      temp.querySelectorAll('b').forEach(b => {
        const strong = document.createElement('strong');
        strong.innerHTML = b.innerHTML;
        b.parentNode.replaceChild(strong, b);
      });
    }
    
    if (this.options.convertItalicToEm) {
      temp.querySelectorAll('i').forEach(i => {
        const em = document.createElement('em');
        em.innerHTML = i.innerHTML;
        i.parentNode.replaceChild(em, i);
      });
    }
    
    if (this.options.convertDivToP) {
      temp.querySelectorAll('div').forEach(div => {
        if (!div.querySelector('p, ul, ol, h1, h2, h3, h4, h5, h6, table')) {
          const p = document.createElement('p');
          p.innerHTML = div.innerHTML;
          div.parentNode.replaceChild(p, div);
        }
      });
    }
    
    // 정화
    this.sanitizeElement(temp);
    
    // 인접한 텍스트 노드 병합
    if (this.options.mergeAdjacentText) {
      this.mergeTextNodes(temp);
    }
    
    const fragment = document.createDocumentFragment();
    while (temp.firstChild) {
      fragment.appendChild(temp.firstChild);
    }
    
    return fragment;
  }
  
  processText(text) {
    if (this.options.preserveLineBreaks) {
      const lines = text.split('\n');
      const fragment = document.createDocumentFragment();
      
      lines.forEach((line, index) => {
        if (line.trim()) {
          const p = document.createElement('p');
          p.textContent = line.trim();
          fragment.appendChild(p);
        } else if (index < lines.length - 1) {
          fragment.appendChild(document.createElement('br'));
        }
      });
      
      return fragment;
    } else {
      const textNode = document.createTextNode(text);
      return textNode;
    }
  }
  
  createPlainText(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return document.createTextNode(div.textContent);
  }
  
  sanitizeElement(element) {
    // 허용되지 않은 속성 제거
    Array.from(element.attributes || []).forEach(attr => {
      if (!this.options.allowedAttributes.includes(attr.name)) {
        element.removeAttribute(attr.name);
      }
    });
    
    if (this.options.stripStyles) {
      element.removeAttribute('style');
    }
    
    if (this.options.stripClasses) {
      element.removeAttribute('class');
    }
    
    // 자식 처리
    const children = Array.from(element.childNodes);
    children.forEach(child => {
      if (child.nodeType === Node.ELEMENT_NODE) {
        const tagName = child.tagName.toLowerCase();
        
        if (!this.options.allowedTags.includes(tagName)) {
          // 허용되지 않은 태그 언래핑
          const parent = child.parentNode;
          while (child.firstChild) {
            parent.insertBefore(child.firstChild, child);
          }
          parent.removeChild(child);
        } else {
          this.sanitizeElement(child);
        }
      } else if (child.nodeType === Node.TEXT_NODE) {
        // 텍스트 노드 유지
      } else {
        child.remove();
      }
    });
  }
  
  mergeTextNodes(element) {
    const walker = document.createTreeWalker(
      element,
      NodeFilter.SHOW_TEXT,
      null
    );
    
    let prevNode = null;
    let node;
    
    while (node = walker.nextNode()) {
      if (prevNode && prevNode.parentNode === node.parentNode) {
        prevNode.textContent += node.textContent;
        node.remove();
      } else {
        prevNode = node;
      }
    }
  }
  
  handleFiles(range, files) {
    files.forEach(file => {
      if (file.type.startsWith('image/')) {
        this.handleImageFile(range, file);
      }
    });
  }
  
  handleImageFile(range, file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = document.createElement('img');
      img.src = e.target.result;
      img.style.maxWidth = '100%';
      
      range.insertNode(img);
      range.setStartAfter(img);
      range.collapse(true);
      
      const selection = window.getSelection();
      selection.removeAllRanges();
      selection.addRange(range);
      
      this.editor.dispatchEvent(new Event('input', { bubbles: true }));
    };
    reader.readAsDataURL(file);
  }
  
  insertContent(range, content) {
    if (content.nodeType === Node.DOCUMENT_FRAGMENT_NODE) {
      range.insertNode(content);
      if (content.lastChild) {
        range.setStartAfter(content.lastChild);
      }
    } else if (content.nodeType === Node.TEXT_NODE) {
      range.insertNode(content);
      range.setStartAfter(content);
    } else {
      range.insertNode(content);
      range.setStartAfter(content);
    }
    
    range.collapse(true);
    
    const selection = window.getSelection();
    selection.removeAllRanges();
    selection.addRange(range);
  }
}

// 사용법
const editor = document.querySelector('div[contenteditable]');
const pasteHandler = new CompletePasteHandler(editor, {
  allowedTags: ['p', 'br', 'strong', 'em', 'a'],
  stripStyles: true,
  convertBoldToStrong: true,
  onPaste: (content) => {
    console.log('붙여넣은 콘텐츠:', content);
    return content;
  },
});
```

## 주의사항

- 완전한 제어를 위해 항상 기본 붙여넣기 동작 방지
- XSS 공격을 방지하기 위해 HTML 정화
- 프로덕션급 정화를 위해 DOMPurify 라이브러리 사용
- 일관성을 위해 포맷팅 태그 변환 고려 (b→strong, i→em)
- 클립보드에서 HTML과 일반 텍스트 모두 처리
- 필요에 따라 줄바꿈 보존 또는 변환
- Word, Google Docs 및 기타 리치 텍스트 소스의 콘텐츠로 테스트
- 에디터가 지원하는 경우 이미지 파일 처리
- 프레임워크 호환성을 위해 붙여넣기 후 `input` 이벤트 트리거

## 브라우저 호환성

- **Chrome/Edge**: 클립보드 API 완전 지원
- **Firefox**: 좋은 지원이지만 다양한 붙여넣기 소스로 테스트
- **Safari**: 잘 작동하지만 리치 콘텐츠에 일부 엣지 케이스가 있습니다

## 관련 자료

- [실용 패턴: 붙여넣기 핸들러](/docs/practical-patterns#paste-handler-with-sanitization)
- [Tip: 붙여넣기 링크 보존](/tips/tip-010-paste-link-preservation)
