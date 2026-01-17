---
id: scenario-sandbox-iframe-ko
title: sandbox된 iframe 내부에서 contenteditable 동작이 제한됨
description: "sandbox 속성이 있는 iframe 내부에 contenteditable 요소가 있을 때, 활성화된 sandbox 토큰에 따라 동작이 제한되거나 깨질 수 있습니다. allow-scripts나 allow-same-origin 없이는 많은 contenteditable 기능(리치 텍스트 편집, 클립보드 접근, 이벤트 처리 등)이 제대로 작동하지 않을 수 있습니다."
category: other
tags:
  - sandbox
  - iframe
  - security
  - restrictions
  - scripting
status: draft
locale: ko
---

`sandbox` 속성이 있는 iframe 내부에 `contenteditable` 요소가 있을 때, 활성화된 sandbox 토큰에 따라 동작이 제한되거나 깨질 수 있습니다. `allow-scripts`나 `allow-same-origin` 없이는 많은 contenteditable 기능이 제대로 작동하지 않을 수 있습니다.

## 관찰된 동작

- **기본 편집 작동**: 스크립트 없이도 간단한 타이핑과 삭제는 작동할 수 있음
- **스크립트 기반 기능 실패**: `allow-scripts` 없이는 리치 텍스트 에디터, 포맷팅 툴바, 붙여넣기 핸들러가 작동하지 않음
- **출처 격리**: `allow-same-origin` 없이는 스크립트가 스토리지에 접근하거나 부모와 통신할 수 없음
- **이벤트 처리 제한**: 고급 이벤트 처리가 제한될 수 있음
- **클립보드 접근 차단**: 적절한 권한 없이는 클립보드 API가 작동하지 않을 수 있음

## Sandbox 토큰 효과

| Sandbox 설정 | contenteditable 동작 |
|---------------|-------------------------|
| `sandbox` (토큰 없음) | 기본 편집 작동하지만 스크립트나 출처 접근 없음 |
| `sandbox="allow-scripts"` | 편집 작동하지만 출처 격리로 기능 제한 |
| `sandbox="allow-same-origin"` | 출처 접근 가능하지만 스크립트 비활성화 |
| `sandbox="allow-scripts allow-same-origin"` | 전체 기능 작동하지만 보안 위험 |

## 영향

- **기능 제한**: 리치 텍스트 편집 기능이 작동하지 않음
- **보안 vs 기능 트레이드오프**: 더 많은 보안은 더 적은 기능을 의미함
- **개발 복잡성**: sandbox 제한을 고려한 설계 필요
- **사용자 경험**: 사용자가 깨지거나 제한된 편집을 경험할 수 있음

## 해결 방법

### 1. 필요한 Sandbox 토큰 활성화

최소한의 필요한 권한 부여:

```html
<iframe 
  sandbox="allow-scripts allow-same-origin allow-forms"
  src="editor.html"
></iframe>
```

### 2. 통신을 위해 postMessage 사용

same-origin이 차단된 경우:

```javascript
// 부모 창
iframe.contentWindow.postMessage({
  type: 'updateContent',
  content: '...'
}, '*');

// Iframe
window.addEventListener('message', (e) => {
  if (e.data.type === 'updateContent') {
    editableElement.textContent = e.data.content;
  }
});
```

### 3. 별도 도메인에서 Iframe 제공

same-origin과 함께 더 나은 보안:

```html
<iframe 
  sandbox="allow-scripts allow-same-origin"
  src="https://editor.example.com"
></iframe>
```

### 4. 콘텐츠 정리

sandbox된 iframe 내부의 콘텐츠 항상 정리:

```javascript
function sanitizeContent(html) {
  const div = document.createElement('div');
  div.innerHTML = html;
  
  // script 태그 제거
  div.querySelectorAll('script').forEach(s => s.remove());
  
  // 이벤트 핸들러 제거
  div.querySelectorAll('*').forEach(el => {
    Array.from(el.attributes).forEach(attr => {
      if (attr.name.startsWith('on')) {
        el.removeAttribute(attr.name);
      }
    });
  });
  
  return div.innerHTML;
}
```

### 5. Sandbox 탈출 방지

iframe이 sandbox 속성을 수정하지 않도록 방지:

```javascript
// 이렇게 하지 마세요
iframe.contentWindow.document.querySelector('iframe').removeAttribute('sandbox');
```

## 보안 고려사항

- **Sandbox 탈출 위험**: `allow-same-origin`과 `allow-scripts`가 모두 설정되면 iframe이 잠재적으로 sandbox를 탈출할 수 있음
- **XSS 위험**: 스크립트가 활성화된 신뢰할 수 없는 콘텐츠가 악성 코드를 실행할 수 있음
- **콘텐츠 주입**: 적절한 정리가 중요함
- **CSP 통합**: sandbox와 함께 Content Security Policy 사용

## 참고 자료

- [MDN: iframe sandbox 속성](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Attributes/sandbox) - Sandbox 문서
- [GeeksforGeeks: HTML iframe sandbox 속성](https://www.geeksforgeeks.org/html/html-iframe-sandbox-attribute/) - Sandbox 토큰 설명
- [W3C: iframe sandbox 보안](https://www.w3.org/TR/2013/CR-html5-20130806/embedded-content-0.html) - Sandbox 탈출 경고
- [PHP.cn: iframe sandbox contenteditable](https://m.php.cn/en/faq/1796887913.html) - Sandbox 제한
