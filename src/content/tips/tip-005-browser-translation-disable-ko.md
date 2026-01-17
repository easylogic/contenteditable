---
id: tip-005-browser-translation-disable-ko
title: 브라우저 번역 기능 비활성화하기
description: "브라우저 번역 기능이 contenteditable 편집을 방해하지 않도록 하는 방법"
category: browser-feature
tags:
  - browser-translation
  - google-translate
  - dom-manipulation
  - prevention
difficulty: beginner
relatedScenarios:
  - scenario-browser-translation
relatedCases:
  - ce-0562-browser-translation-breaks-editing
locale: ko
---

## 문제

Google Translate 같은 브라우저 번역 기능이 활성화되면 DOM을 조작하여 contenteditable 기능을 깨뜨립니다.

## 해결 방법

### 1. translate="no" 속성 사용

contenteditable 요소에 번역을 비활성화하는 속성을 추가합니다.

```html
<div contenteditable="true" translate="no">
  번역되지 않아야 하는 편집 가능한 콘텐츠
</div>
```

### 2. notranslate 클래스 사용

Google Translate는 이 클래스를 존중합니다.

```html
<div contenteditable="true" class="notranslate">
  편집 가능한 콘텐츠
</div>
```

### 3. MutationObserver로 속성 재적용

번역 후 contenteditable 속성을 다시 적용합니다.

```javascript
const observer = new MutationObserver((mutations) => {
  for (const mutation of mutations) {
    if (mutation.type === 'attributes' && 
        mutation.attributeName === 'contenteditable') {
      // 제거된 경우 contenteditable 재적용
      if (!mutation.target.hasAttribute('contenteditable')) {
        mutation.target.setAttribute('contenteditable', 'true');
      }
    }
  }
});

observer.observe(editableElement, {
  attributes: true,
  attributeFilter: ['contenteditable']
});
```

### 4. 편집 중 번역 비활성화

편집 모드를 감지하고 편집 중에는 번역을 비활성화합니다.

```javascript
let isEditing = false;

editableElement.addEventListener('focus', () => {
  isEditing = true;
  document.documentElement.setAttribute('translate', 'no');
});

editableElement.addEventListener('blur', () => {
  isEditing = false;
  document.documentElement.removeAttribute('translate');
});
```

## 주의사항

- 모든 번역 도구가 속성을 존중하지는 않음
- MutationObserver는 성능 오버헤드가 있을 수 있음
- 사용자 경험을 고려하여 번역 비활성화 시점 결정

## 관련 자료

- [시나리오: 브라우저 번역](/scenarios/scenario-browser-translation)
- [케이스: ce-0562](/cases/ce-0562-browser-translation-breaks-editing)
