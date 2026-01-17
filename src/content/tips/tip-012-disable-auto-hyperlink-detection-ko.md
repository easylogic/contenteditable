---
id: tip-012-disable-auto-hyperlink-detection-ko
title: contenteditable에서 자동 하이퍼링크 감지 비활성화하기
description: "contenteditable 요소에서 브라우저가 URL, 이메일, 전화번호를 자동으로 클릭 가능한 링크로 변환하는 것을 방지하는 방법"
category: browser-feature
tags:
  - hyperlink
  - auto-link
  - url-detection
  - email-detection
  - internet-explorer
  - data-detectors
  - mobile
difficulty: beginner
relatedScenarios:
  - scenario-browser-hyperlink-detection
relatedCases: []
locale: ko
---

## 문제

브라우저, 특히 Internet Explorer와 레거시 Edge는 `contenteditable` 요소에서 URL, 이메일 주소, 전화번호를 자동으로 감지하여 클릭 가능한 링크로 변환합니다. 이 자동 링크 생성 동작은 편집을 방해하고, 커서 위치 문제를 일으키며, 원하지 않는 마크업을 생성하고, undo/redo 기능을 방해할 수 있습니다. 모바일 Safari는 전화번호와 날짜에 대해 데이터 감지기를 사용합니다.

## 해결 방법

### 1. AutoUrlDetect 비활성화 (IE/레거시 Edge)

`execCommand`를 사용하여 Internet Explorer와 레거시 Edge에서 자동 URL 감지를 비활성화합니다:

```javascript
// 페이지 로드 시 자동 링크 생성 비활성화
if (document.execCommand) {
  document.execCommand("AutoUrlDetect", false, false);
}

// 또는 특정 요소에 대해 비활성화
const editor = document.querySelector('div[contenteditable]');
editor.addEventListener('focus', () => {
  if (document.execCommand) {
    document.execCommand("AutoUrlDetect", false, false);
  }
});
```

### 2. contenteditable="plaintext-only" 사용

`plaintext-only` 모드를 사용하여 자동 링크 생성을 포함한 모든 리치 텍스트 동작을 비활성화합니다:

```html
<div contenteditable="plaintext-only">
  일반 텍스트만, 자동 링크 생성 없음
</div>
```

**참고**: Firefox의 `plaintext-only` 지원은 제한적입니다. Chrome, Safari, Edge에서 가장 잘 작동합니다.

### 3. 자동 생성된 링크 모니터링 및 제거

MutationObserver를 사용하여 자동으로 생성된 링크를 감지하고 제거합니다:

```javascript
const editor = document.querySelector('div[contenteditable]');

const observer = new MutationObserver((mutations) => {
  mutations.forEach((mutation) => {
    mutation.addedNodes.forEach((node) => {
      if (node.nodeType === Node.ELEMENT_NODE) {
        // 노드 자체가 링크인지 확인
        if (node.tagName === 'A' && node.href) {
          const text = node.textContent;
          if (this.isAutoLink(text, node.href)) {
            this.unwrapLink(node);
          }
        }
        
        // 노드 내부의 링크 확인
        const links = node.querySelectorAll?.('a');
        if (links) {
          links.forEach(link => {
            const text = link.textContent;
            if (this.isAutoLink(text, link.href)) {
              this.unwrapLink(link);
            }
          });
        }
      }
    });
  });
});

observer.observe(editor, {
  childList: true,
  subtree: true
});

function isAutoLink(text, href) {
  // 일반적인 자동 링크 패턴 확인
  const urlPattern = /^https?:\/\/.+/;
  const emailPattern = /^[\w.-]+@[\w.-]+$/;
  const phonePattern = /^[\d\s\-+()]+$/;
  
  return (urlPattern.test(text) || emailPattern.test(text) || phonePattern.test(text)) &&
         text === href.replace(/^mailto:/, '').replace(/^tel:/, '');
}

function unwrapLink(link) {
  const parent = link.parentNode;
  const text = document.createTextNode(link.textContent);
  parent.replaceChild(text, link);
}
```

### 4. iOS 데이터 감지기 비활성화 (모바일 Safari)

모바일 Safari의 경우 메타 태그와 속성을 사용하여 데이터 감지기를 비활성화합니다:

```html
<head>
  <meta name="format-detection" content="telephone=no, email=no, address=no">
</head>

<div contenteditable="true" x-apple-data-detectors="false">
  자동 링크 생성 없는 콘텐츠
</div>
```

또는 JavaScript로:

```javascript
const editor = document.querySelector('div[contenteditable]');
editor.setAttribute('x-apple-data-detectors', 'false');

// 메타 태그가 아직 없는 경우 설정
if (!document.querySelector('meta[name="format-detection"]')) {
  const meta = document.createElement('meta');
  meta.name = 'format-detection';
  meta.content = 'telephone=no, email=no, address=no';
  document.head.appendChild(meta);
}
```

### 5. 저장 전 후처리

콘텐츠를 저장하거나 제출하기 전에 자동 생성된 링크를 정리합니다:

```javascript
function removeAutoLinks(element) {
  const links = element.querySelectorAll('a');
  links.forEach(link => {
    const text = link.textContent;
    const href = link.href;
    
    // 이것이 자동 생성된 링크처럼 보이는지 확인
    if (isAutoLink(text, href)) {
      const textNode = document.createTextNode(text);
      link.parentNode.replaceChild(textNode, link);
    }
  });
}

function isAutoLink(text, href) {
  // URL 패턴
  if (text.match(/^https?:\/\/.+/)) {
    return text === href || text === href.replace(/\/$/, '');
  }
  
  // 이메일 패턴
  if (text.match(/^[\w.-]+@[\w.-]+$/)) {
    return href === `mailto:${text}`;
  }
  
  // 전화번호 패턴
  if (text.match(/^[\d\s\-+()]+$/)) {
    return href === `tel:${text.replace(/\s/g, '')}`;
  }
  
  return false;
}

// 저장/제출 전
removeAutoLinks(editableElement);
```

### 6. 편집 중 링크 상호작용 비활성화

CSS를 사용하여 편집을 허용하면서 링크 상호작용을 비활성화합니다:

```css
[contenteditable="true"] a {
  pointer-events: none;
  text-decoration: none;
  color: inherit;
  cursor: text;
}

[contenteditable="true"] a:hover {
  text-decoration: none;
}
```

이렇게 하면 편집 중에는 링크를 클릭할 수 없지만 DOM에는 남아 있습니다.

### 7. 포괄적인 자동 링크 방지

모든 경우를 처리하는 완전한 해결책:

```javascript
class AutoLinkPreventer {
  constructor(editor) {
    this.editor = editor;
    this.init();
  }
  
  init() {
    // IE/레거시 Edge용 AutoUrlDetect 비활성화
    if (document.execCommand) {
      document.execCommand("AutoUrlDetect", false, false);
    }
    
    // iOS 데이터 감지기 비활성화
    this.disableIOSDataDetectors();
    
    // 자동 생성된 링크 모니터링
    this.observeAutoLinks();
    
    // 입력 시 링크 생성 방지
    this.editor.addEventListener('input', this.handleInput.bind(this));
  }
  
  disableIOSDataDetectors() {
    this.editor.setAttribute('x-apple-data-detectors', 'false');
    
    if (!document.querySelector('meta[name="format-detection"]')) {
      const meta = document.createElement('meta');
      meta.name = 'format-detection';
      meta.content = 'telephone=no, email=no, address=no';
      document.head.appendChild(meta);
    }
  }
  
  observeAutoLinks() {
    this.observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === Node.ELEMENT_NODE) {
            if (node.tagName === 'A') {
              this.checkAndRemoveLink(node);
            }
            
            const links = node.querySelectorAll?.('a');
            if (links) {
              links.forEach(link => this.checkAndRemoveLink(link));
            }
          }
        });
      });
    });
    
    this.observer.observe(this.editor, {
      childList: true,
      subtree: true
    });
  }
  
  checkAndRemoveLink(link) {
    const text = link.textContent.trim();
    const href = link.getAttribute('href');
    
    if (this.isAutoLink(text, href)) {
      this.unwrapLink(link);
    }
  }
  
  isAutoLink(text, href) {
    if (!href) return false;
    
    // URL 패턴
    if (/^https?:\/\/.+/.test(text)) {
      return text === href || text === href.replace(/\/$/, '');
    }
    
    // 이메일 패턴
    if (/^[\w.-]+@[\w.-]+$/.test(text)) {
      return href === `mailto:${text}`;
    }
    
    // 전화번호 패턴
    if (/^[\d\s\-+()]+$/.test(text)) {
      const normalizedPhone = text.replace(/\s/g, '');
      return href === `tel:${normalizedPhone}`;
    }
    
    return false;
  }
  
  unwrapLink(link) {
    const parent = link.parentNode;
    const text = document.createTextNode(link.textContent);
    parent.replaceChild(text, link);
  }
  
  handleInput(e) {
    // 생성되었을 수 있는 링크 정리
    setTimeout(() => {
      const links = this.editor.querySelectorAll('a');
      links.forEach(link => {
        if (this.isAutoLink(link.textContent.trim(), link.href)) {
          this.unwrapLink(link);
        }
      });
    }, 0);
  }
  
  dispose() {
    if (this.observer) {
      this.observer.disconnect();
    }
    this.editor.removeEventListener('input', this.handleInput);
  }
}

// 사용법
const editor = document.querySelector('div[contenteditable]');
const preventer = new AutoLinkPreventer(editor);
```

## 주의사항

- Internet Explorer와 레거시 Edge가 자동 링크 생성이 가장 공격적입니다
- 최신 브라우저(Chrome, Firefox, Safari)는 일반적으로 기본적으로 자동 링크를 생성하지 않지만, 일부 에디터나 확장 프로그램이 생성할 수 있습니다
- 모바일 Safari는 메타 태그로 비활성화할 수 있는 데이터 감지기를 사용합니다
- `plaintext-only` 모드는 가장 간단한 해결책이지만 리치 텍스트 편집 기능을 제한합니다
- MutationObserver 접근법은 작은 성능 오버헤드가 있지만 가장 많은 제어를 제공합니다
- 의도적으로 생성된 링크를 제거하지 않도록 주의하세요 - 자동 감지된 것만 제거하세요
- 다양한 URL 형식, 이메일 주소, 전화번호 형식으로 테스트하세요
- 사용자 기대를 고려하세요 - 일부 사용자는 자동 링크 생성 동작을 기대할 수 있습니다

## 관련 자료

- [시나리오: 브라우저 하이퍼링크 감지](/scenarios/scenario-browser-hyperlink-detection)
