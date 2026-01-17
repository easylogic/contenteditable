---
id: scenario-devtools-inspection-ko
title: 개발자 도구 검사로 인한 포커스 및 선택 손실
description: "브라우저 개발자 도구로 contenteditable 요소를 검사할 때, 요소가 포커스를 잃어 blur 이벤트가 발생하고 툴팁이나 드롭다운 같은 UI 요소가 사라질 수 있습니다. 에디터가 포커스를 잃을 때 contenteditable 내부의 선택도 재설정될 수 있으며, 특히 Safari/WebKit 브라우저에서 그렇습니다."
category: other
tags:
  - devtools
  - debugging
  - focus
  - selection
  - safari
status: draft
locale: ko
---

브라우저 개발자 도구로 `contenteditable` 요소를 검사할 때, 요소가 포커스를 잃어 blur 이벤트가 발생하고 툴팁이나 드롭다운 같은 UI 요소가 사라질 수 있습니다. 에디터가 포커스를 잃을 때 contenteditable 내부의 선택도 재설정될 수 있습니다.

## 관찰된 동작

- **DevTools 클릭 시 포커스 손실**: DevTools를 클릭하면 blur 이벤트가 발생함
- **요소 사라짐**: blur 시 숨겨지는 UI 요소가 검사 전에 사라짐
- **선택 재설정**: Safari/WebKit에서 contenteditable 내부의 선택이 손실됨
- **document.activeElement 부정확**: 포커스 감지가 부정확할 수 있음
- **blur 후에도 타이핑 계속됨**: 일부 경우 blur 후에도 타이핑이 콘텐츠를 삽입함

## 브라우저 비교

- **Safari/WebKit**: 가장 많이 영향받음 - 에디터가 blur될 때 선택이 손실됨
- **Chrome**: 영향받지만 "포커스된 페이지 에뮬레이션" 기능 있음
- **Firefox**: 포커스 감지에서 유사한 문제
- **Edge**: Chrome과 유사

## 영향

- **디버깅 어려움**: blur 시 사라지는 요소를 검사할 수 없음
- **개발 오버헤드**: contenteditable 문제 디버깅을 어렵게 만듦
- **테스트 문제**: 포커스 관련 기능 테스트가 어려움
- **사용자 경험**: 유사한 문제가 실제 사용자에게도 영향을 줄 수 있음

## 해결 방법

### 1. "포커스된 페이지 에뮬레이션" 사용 (Chrome)

DevTools가 활성화된 상태에서 blur 이벤트 방지:

1. Chrome DevTools 열기
2. Rendering 패널로 이동 (또는 `:hov` 메뉴 사용)
3. "Emulate a focused page" 활성화
4. DevTools를 클릭해도 요소가 사라지지 않음

### 2. JavaScript 실행 일시 중지

검사가 필요한 순간에 UI 고정:

1. F8을 눌러 실행 일시 중지
2. 요소가 아직 숨겨지거나 제거되지 않음
3. 일시 중지된 상태에서 요소 검사

### 3. 이벤트 중단점 사용

blur가 발생하려 할 때 실행 중단:

```javascript
// DevTools 콘솔에서
debugger; // 중단점 설정
editableElement.addEventListener('blur', () => {
  debugger; // 여기서 일시 중지
});
```

### 4. DOM 중단점

서브트리 수정에 대한 중단점 설정:

1. Elements 패널에서 요소 우클릭
2. "Break on" → "Subtree modifications" 선택
3. 요소 제거 시 실행이 일시 중지됨

### 5. 임시 CSS 재정의

요소를 보이게 유지:

```css
/* DevTools Styles 패널에서 */
.tooltip,
.dropdown {
  display: block !important;
  visibility: visible !important;
  opacity: 1 !important;
}
```

### 6. 검사 중 Blur 방지

임시로 blur 핸들러 비활성화:

```javascript
// DevTools 콘솔에서
const originalBlur = editableElement.onblur;
editableElement.onblur = null;

// 요소 검사...

// 복원
editableElement.onblur = originalBlur;
```

## 참고 자료

- [Stack Overflow: blur 시 제거된 요소 검사](https://stackoverflow.com/questions/24287721/examine-element-that-is-removed-onblur) - 일반적인 디버깅 문제
- [ProseMirror Discuss: Safari에서 에디터가 blur될 때 선택 손실](https://discuss.prosemirror.net/t/selection-is-lost-on-safari-when-editor-is-blured/3001) - Safari 특정 문제
- [Chrome DevTools: 포커스된 페이지 에뮬레이션](https://developer.chrome.com/docs/devtools/rendering/apply-effects/) - 포커스 에뮬레이션 기능
- [jQuery Bug #12648: contenteditable에 대한 :focus 선택자 부정확](https://bugs.jquery.com/ticket/12648) - 포커스 감지 문제
- [Stack Overflow: Contenteditable이 포커스를 잃지만 여전히 작성됨](https://stackoverflow.com/questions/27111414/contenteditable-loose-focus-but-writes-anyway) - 포커스 동작 특이사항
- [Tutorial Pedia: 사라지는 요소 검사](https://www.tutorialpedia.org/blog/how-can-i-inspect-html-element-that-disappears-from-dom-on-lost-focus/) - 디버깅 기법
