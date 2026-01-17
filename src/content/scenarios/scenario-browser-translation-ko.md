---
id: scenario-browser-translation-ko
title: 브라우저 번역 기능이 contenteditable 편집을 깨뜨림
description: "브라우저 번역 기능(예: Google Translate)이 활성화되면 텍스트 콘텐츠를 교체하고 요소를 주입하여 DOM을 조작합니다. 이로 인해 contenteditable 기능이 깨지고, 커서 위치 문제, 이벤트 처리 문제, IME 컴포지션 실패가 발생할 수 있습니다."
category: other
tags:
  - browser-translation
  - google-translate
  - dom-manipulation
  - ime
  - composition
status: draft
locale: ko
---

브라우저 번역 기능(예: Google Translate)이 활성화되면 텍스트 콘텐츠를 교체하고 요소를 주입하여 DOM을 조작합니다. 이로 인해 `contenteditable` 기능이 깨지고, 커서 위치 문제, 이벤트 처리 문제, IME 컴포지션 실패가 발생할 수 있습니다.

## 관찰된 동작

- **DOM 조작**: 번역이 노드 텍스트 콘텐츠를 교체하고 `<span>` 또는 `<div>` 요소를 주입함
- **커서 위치**: 번역 후 커서가 이동하지 않거나 잘못된 위치에 나타남
- **입력 실패**: 붙여넣은 콘텐츠가 올바르게 삽입되지 않음, 키 이벤트가 잘못 작동함
- **IME 컴포지션**: 번역이 컴포지션 버퍼를 재설정하거나 방해함
- **이벤트 리스너**: DOM 조작 중 이벤트 구독이 분리될 수 있음
- **선택 문제**: 선택 및 커서 동작이 불안정해짐

## 브라우저 비교

- **Chrome**: Google Translate 통합으로 인해 문제가 가장 많이 발생
- **Edge**: 유사한 번역 기능으로 유사한 문제 발생
- **Firefox**: 덜 영향받지만 여전히 문제 있음
- **Safari**: 네이티브 번역 기능이 다른 문제를 일으킬 수 있음

## 영향

- **편집 불가능**: 사용자가 번역 후 콘텐츠를 편집할 수 없음
- **데이터 손실 위험**: 번역이 콘텐츠 구조를 손상시킬 수 있음
- **IME 실패**: 컴포지션 입력이 불안정해짐
- **사용자 경험 저하**: 사용자가 편집하려면 번역을 비활성화해야 함

## 해결 방법

### 1. 특정 요소에 대해 번역 비활성화

`translate="no"` 속성 사용:

```html
<div contenteditable="true" translate="no">
  번역되지 않아야 하는 편집 가능한 콘텐츠
</div>
```

### 2. "notranslate" 클래스 사용

Google Translate가 이 클래스를 존중합니다:

```html
<div contenteditable="true" class="notranslate">
  편집 가능한 콘텐츠
</div>
```

### 3. 번역 후 contenteditable 재적용

MutationObserver를 사용하여 속성 복원:

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

편집 모드를 감지하고 번역 비활성화:

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

### 5. 제어된 에디터 컴포넌트 사용

DOM 변형을 더 잘 처리하는 견고한 에디터 라이브러리 사용:

- **Quill**: DOM 변형을 더 견고하게 처리
- **ProseMirror**: 번역 변경을 더 잘 감지하고 처리
- **Slate**: 외부 DOM 조작에 더 강함

## 참고 자료

- [Stefan Judis: 번역되지 않는 HTML 요소](https://www.stefanjudis.com/blog/non-translatable-html-elements/) - translate 속성 사용법
- [Daddy Design: 특정 콘텐츠에 대해 Google Translate 비활성화](https://www.daddydesign.com/wordpress/how-to-disable-google-translate-from-translating-specific-words-or-content-blocks/) - notranslate 클래스
- [contenteditable.lab](https://contenteditable.realerror.com/) - IME 및 컴포지션 문제 참고
