---
id: scenario-browser-extension-interference-ko
title: 브라우저 확장 프로그램이 contenteditable 편집을 방해함
description: "브라우저 확장 프로그램, 특히 문법 검사기, 맞춤법 검사기, 언어 도구가 DOM 노드를 주입하거나 키보드 이벤트를 가로채거나 스타일을 수정하여 contenteditable 요소를 방해할 수 있습니다. 이로 인해 커서 위치 문제, DOM 손상, 성능 문제가 발생합니다."
category: other
tags:
  - browser-extension
  - grammarly
  - spell-checker
  - dom-injection
  - performance
status: draft
locale: ko
---

브라우저 확장 프로그램, 특히 문법 검사기, 맞춤법 검사기, 언어 도구가 DOM 노드를 주입하거나 키보드 이벤트를 가로채거나 스타일을 수정하여 `contenteditable` 요소를 방해할 수 있습니다. 이로 인해 커서 위치 문제, DOM 손상, 성능 문제가 발생합니다.

## 관찰된 동작

- **DOM 주입**: 확장 프로그램이 편집 가능한 영역 내부에 추가 HTML 마크업(밑줄, 오버레이, 팝업)을 주입함
- **커서/선택 문제**: 확장 프로그램 수정 후 커서가 사라지거나 잘못된 위치에 나타남
- **키 이벤트 가로채기**: 확장 프로그램이 키보드 이벤트(keydown, beforeinput, input)를 재정의하거나 지연시킴
- **스타일/레이아웃 변경**: 확장 프로그램이 CSS/폰트를 로드하거나 레이아웃을 수정하여 깜빡임 발생
- **Undo/redo 방해**: 확장 프로그램의 DOM 조작이 브라우저의 네이티브 undo 기록을 손상시킴
- **성능 저하**: 모든 키 입력에 대한 무거운 처리로 입력 지연 발생

## 문제를 일으키는 일반적인 확장 프로그램

- **Grammarly**: 에디터를 방해하여 텍스트가 사라지고 레이아웃이 이동한다는 보고가 많음
- **언어 도구**: 다양한 언어 학습 및 번역 확장 프로그램
- **비밀번호 관리자**: 폼과 유사한 contenteditable 요소를 방해할 수 있음
- **맞춤법 검사기**: 브라우저 맞춤법 검사 확장 프로그램

## 브라우저 비교

- **Chrome**: 확장 프로그램 생태계로 인해 가장 많이 영향받음
- **Edge**: Chrome과 유사
- **Firefox**: 영향받지만 다른 확장 프로그램 모델
- **Safari**: 더 엄격한 확장 프로그램 권한으로 인해 덜 영향받음

## 영향

- **사용자 경험 저하**: 편집이 불안정하고 좌절감을 줌
- **DOM 손상**: 예상치 못한 마크업이 에디터 기능을 깨뜨림
- **성능 문제**: 입력 지연으로 타이핑이 느리게 느껴짐
- **데이터 손실 위험**: Undo/redo 스택 손상으로 데이터 손실 가능

## 해결 방법

### 1. 특정 요소에 대해 확장 프로그램 비활성화

일부 확장 프로그램은 data 속성을 존중합니다:

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

### 2. MutationObserver를 사용하여 정리

주입된 마크업을 감지하고 제거:

```javascript
const observer = new MutationObserver((mutations) => {
  for (const mutation of mutations) {
    for (const node of mutation.addedNodes) {
      // 확장 프로그램이 주입한 노드 감지
      if (node.classList?.contains('grammarly-extension') ||
          node.getAttribute('data-gramm')) {
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

### 3. EditContext API 사용 (Chrome/Edge)

더 많은 제어를 제공하는 새로운 API:

```javascript
const editContext = new EditContext();
editContext.addEventListener('textupdate', (e) => {
  // DOM 조작 없이 텍스트 업데이트 처리
});
```

### 4. 편집 가능한 UI와 비편집 가능한 UI 분리

contenteditable 내부에 대화형 UI를 중첩하지 않기:

```html
<div class="editor-container">
  <div contenteditable="true" id="editor"></div>
  <div class="toolbar" contenteditable="false">
    <!-- 툴바 버튼 -->
  </div>
</div>
```

### 5. 사용자에게 경고

확장 프로그램 존재를 감지하고 사용자에게 경고:

```javascript
function detectGrammarly() {
  return document.querySelector('[data-gramm]') !== null ||
         window.grammarly !== undefined;
}

if (detectGrammarly()) {
  console.warn('Grammarly 확장 프로그램이 에디터를 방해할 수 있습니다');
  // 사용자 알림 표시
}
```

## 참고 자료

- [Medium: Grammarly와의 결별 이유](https://medium.com/kayako-engineering/why-we-parted-ways-with-grammarly-and-you-should-too-dea483bef823) - Grammarly 간섭 문제
- [Stack Overflow: contenteditable에서 Grammarly 같은 확장 프로그램 중지](https://stackoverflow.com/questions/37444906/how-to-stop-extensions-add-ons-like-grammarly-on-contenteditable-editors) - 예방 방법
- [ProseMirror Discuss: Firefox contenteditable false 커서 버그](https://discuss.prosemirror.net/t/firefox-contenteditable-false-cursor-bug/5016) - 확장 프로그램 관련 커서 문제
- [Chrome: EditContext API 소개](https://developer.chrome.com/blog/introducing-editcontext-api) - 더 나은 제어를 위한 대체 API
- [Reddit: Grammarly 확장 프로그램이 Inter 폰트를 일으킴](https://www.reddit.com/r/Grammarly/comments/1hkdom5/bug_report_grammarly_extension_causes_inter_font) - 레이아웃 이동 문제
- [Grammarly: 텍스트 입력 지연 감소](https://www.grammarly.com/blog/engineering/reducing-text-input-lag) - 성능 최적화 노력
