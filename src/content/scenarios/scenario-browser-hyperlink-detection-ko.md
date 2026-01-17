---
id: scenario-browser-hyperlink-detection-ko
title: 브라우저가 contenteditable에서 URL과 이메일을 자동으로 링크로 변환함
description: "브라우저, 특히 Internet Explorer와 레거시 Edge는 contenteditable 요소에서 URL, 이메일 주소, 전화번호를 자동으로 감지하여 클릭 가능한 링크로 변환합니다. 이 자동 링크 생성 동작이 편집을 방해하고, 커서 위치 문제를 일으키며, 원하지 않는 마크업을 생성할 수 있습니다."
category: formatting
tags:
  - hyperlink
  - auto-link
  - url-detection
  - email-detection
  - internet-explorer
status: draft
locale: ko
---

브라우저, 특히 Internet Explorer와 레거시 Edge는 `contenteditable` 요소에서 URL, 이메일 주소, 전화번호를 자동으로 감지하여 클릭 가능한 링크로 변환합니다. 이 자동 링크 생성 동작이 편집을 방해하고, 커서 위치 문제를 일으키며, 원하지 않는 마크업을 생성할 수 있습니다.

## 관찰된 동작

- **자동 링크 생성**: URL, 이메일, 전화번호가 자동으로 `<a>` 태그로 감싸짐
- **커서 위치 문제**: 링크 마크업이 삽입될 때 커서가 이동함
- **비편집 가능한 링크**: 텍스트 일부가 편집 불가능하거나 다르게 동작함
- **Undo/redo 방해**: 자동 링크 생성이 암시적 편집을 생성하여 undo 기록을 손상시킴
- **커스텀 스타일 손실**: 링크 내부의 커스텀 스타일이 손실되거나 재정의될 수 있음

## 브라우저 비교

- **Internet Explorer**: `AutoUrlDetect` 명령을 통한 가장 공격적인 자동 링크 생성
- **레거시 Edge**: IE와 유사, `AutoUrlDetect` 지원
- **Chrome/Firefox/Safari**: 일반적으로 기본적으로 자동 링크 생성하지 않지만 일부 에디터는 함
- **모바일 Safari**: 전화번호 및 날짜에 데이터 감지기 사용

## 영향

- **원하지 않는 링크**: 링크가 생성되어서는 안 되는 경우(날짜, ID 등)에 생성됨
- **편집 방해**: 자동 링크 생성이 타이핑 및 편집 흐름을 방해함
- **DOM 손상**: 예상치 못한 마크업이 에디터 기능을 깨뜨림
- **사용자 좌절**: 사용자가 원하지 않는 링크를 수동으로 제거해야 함

## 해결 방법

### 1. AutoUrlDetect 비활성화 (IE/레거시 Edge)

execCommand를 사용하여 비활성화:

```javascript
if (document.execCommand) {
  document.execCommand("AutoUrlDetect", false, false);
}
```

### 2. contenteditable="plaintext-only" 사용

모든 리치 텍스트 동작 비활성화:

```html
<div contenteditable="plaintext-only">
  일반 텍스트만, 자동 링크 생성 없음
</div>
```

참고: Firefox 지원이 제한적임.

### 3. 가로채고 링크 제거

자동 생성된 링크 모니터링 및 제거:

```javascript
const observer = new MutationObserver((mutations) => {
  mutations.forEach((mutation) => {
    mutation.addedNodes.forEach((node) => {
      if (node.tagName === 'A' && node.href) {
        // 링크가 자동 생성되었는지 확인
        const text = node.textContent;
        if (text.match(/^(https?:\/\/|www\.|[\w.-]+@[\w.-]+)/)) {
          // 링크를 일반 텍스트로 교체
          const textNode = document.createTextNode(text);
          node.parentNode.replaceChild(textNode, node);
        }
      }
    });
  });
});

observer.observe(editableElement, {
  childList: true,
  subtree: true
});
```

### 4. iOS 데이터 감지기 비활성화

모바일 Safari용:

```html
<head>
  <meta name="format-detection" content="telephone=no">
</head>

<div contenteditable="true" x-apple-data-detectors="false">
  자동 링크 생성 없는 콘텐츠
</div>
```

### 5. 저장 전 후처리

제출 전 링크 정리:

```javascript
function removeAutoLinks(element) {
  const links = element.querySelectorAll('a');
  links.forEach(link => {
    const text = document.createTextNode(link.textContent);
    link.parentNode.replaceChild(text, link);
  });
}

// 저장/제출 전
removeAutoLinks(editableElement);
```

### 6. pointer-events: none 사용

편집 중 링크 상호작용 비활성화:

```css
[contenteditable="true"] a {
  pointer-events: none;
  text-decoration: none;
  color: inherit;
}
```

## 참고 자료

- [Exchange Tuts: IE에서 AutoUrlDetect 비활성화](https://exchangetuts.com/index.php/disable-automatic-url-detection-for-elements-with-contenteditable-flag-in-ie-1641015003766163) - IE AutoUrlDetect 명령
- [MDN: contenteditable plaintext-only](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/contenteditable) - plaintext-only 모드
- [Stack Overflow: contenteditable에서 자동 URL 감지 비활성화](https://stackoverflow.com/questions/12346158/ckeditor-disable-default-linking-of-email-ids) - execCommand 해결책
- [Matheus Mello: iOS Safari에서 전화번호 링크 비활성화](https://www.matheusmello.io/posts/iphone-how-to-disable-phone-number-linking-in-mobile-safari) - iOS 데이터 감지기
- [Froala: 자동 링크 감지 비활성화](https://froala.com/blog/general/how-to-disable-automatic-link-detection-in-a-visual-html-editor/) - 에디터별 해결책
- [MDN: interactivity CSS 속성](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/interactivity) - 상호작용 비활성화를 위한 새로운 CSS 기능
