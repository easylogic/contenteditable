---
id: tip-002-browser-extension-prevention-ko
title: 브라우저 확장 프로그램 간섭 방지하기
description: "Grammarly 같은 브라우저 확장 프로그램이 contenteditable 편집을 방해하는 것을 방지하는 방법"
category: browser-feature
tags:
  - browser-extension
  - grammarly
  - dom-injection
  - prevention
difficulty: beginner
relatedScenarios:
  - scenario-browser-extension-interference
relatedCases:
  - ce-0561-browser-extension-grammarly-interference
locale: ko
---

## 문제

Grammarly 같은 브라우저 확장 프로그램이 contenteditable 요소에 DOM 노드를 주입하고 스타일을 수정하여 편집을 방해합니다.

## 해결 방법

### 1. data 속성으로 확장 프로그램 비활성화

일부 확장 프로그램은 특정 data 속성을 존중합니다.

```html
<div 
  contenteditable="true"
  data-gramm="false"
  data-gramm_editor="false"
  data-enable-grammarly="false"
>
  편집 가능한 콘텐츠
</div>
```

### 2. MutationObserver로 주입된 마크업 제거

확장 프로그램이 주입한 마크업을 감지하고 제거합니다.

```javascript
const observer = new MutationObserver((mutations) => {
  for (const mutation of mutations) {
    for (const node of mutation.addedNodes) {
      // 확장 프로그램이 주입한 노드 감지
      if (node.classList?.contains('grammarly-extension') ||
          node.getAttribute('data-gramm') ||
          node.querySelector?.('[data-gramm]')) {
        node.remove();
      }
    }
  }
});

observer.observe(editableElement, {
  subtree: true,
  childList: true,
  attributes: true
});
```

### 3. 사용자에게 경고

확장 프로그램 존재를 감지하고 사용자에게 알립니다.

```javascript
function detectGrammarly() {
  return document.querySelector('[data-gramm]') !== null ||
         window.grammarly !== undefined ||
         document.querySelector('.grammarly-extension') !== null;
}

if (detectGrammarly()) {
  console.warn('Grammarly 확장 프로그램이 에디터를 방해할 수 있습니다');
  // 사용자 알림 표시
  showNotification('브라우저 확장 프로그램이 편집을 방해할 수 있습니다.');
}
```

### 4. EditContext API 사용 (Chrome/Edge)

더 나은 제어를 제공하는 새로운 API를 사용합니다.

```javascript
const editContext = new EditContext();
editContext.addEventListener('textupdate', (e) => {
  // DOM 조작 없이 텍스트 업데이트 처리
  const text = e.text;
  // 처리 로직
});
```

## 주의사항

- 모든 확장 프로그램이 data 속성을 존중하지는 않음
- MutationObserver는 성능 오버헤드가 있을 수 있음
- EditContext API는 아직 실험적이며 브라우저 지원이 제한적
- 사용자에게 확장 프로그램 비활성화를 요청하는 것도 고려

## 관련 자료

- [시나리오: 브라우저 확장 프로그램 간섭](/scenarios/scenario-browser-extension-interference)
- [케이스: ce-0561](/cases/ce-0561-browser-extension-grammarly-interference)
