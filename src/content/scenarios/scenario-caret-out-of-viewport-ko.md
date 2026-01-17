---
id: scenario-caret-out-of-viewport-ko
title: 커서 위치가 예상치 못하게 뷰포트 밖으로 이동함
description: "contenteditable 요소의 텍스트 커서(커서)가 편집 작업 중에 보이는 뷰포트 밖으로 이동할 수 있어 사용자가 어디에 입력하고 있는지 보기 어렵습니다. 이것은 붙여넣기 작업, 서식 변경 또는 프로그래밍 방식 콘텐츠 업데이트 중에 발생할 수 있습니다."
category: selection
tags:
  - caret
  - cursor
  - viewport
  - scroll
status: draft
locale: ko
---

contenteditable 요소의 텍스트 커서(커서)가 편집 작업 중에 보이는 뷰포트 밖으로 이동할 수 있어 사용자가 어디에 입력하고 있는지 보기 어렵습니다. 이것은 붙여넣기 작업, 서식 변경 또는 프로그래밍 방식 콘텐츠 업데이트 중에 발생할 수 있습니다.

## 관찰된 동작

### 시나리오 1: 큰 콘텐츠 붙여넣기
- **Chrome/Edge**: 커서가 뷰포트 밖에 있을 수 있음
- **Firefox**: 유사한 문제
- **Safari**: 커서 위치가 더 예측 불가능할 수 있음

### 시나리오 2: 서식 적용
- **Chrome/Edge**: 서식 후 커서가 뷰포트 밖으로 이동할 수 있음
- **Firefox**: 유사한 동작
- **Safari**: 커서 위치를 잃을 가능성이 더 높음

### 시나리오 3: 프로그래밍 방식 콘텐츠 업데이트
- **Chrome/Edge**: 커서 위치가 유지되지 않을 수 있음
- **Firefox**: 유사한 문제
- **Safari**: 커서 위치를 잃을 가능성이 가장 높음

### 시나리오 4: 실행 취소/다시 실행 작업
- **Chrome/Edge**: 커서가 예상치 못한 위치로 이동할 수 있음
- **Firefox**: 유사한 동작
- **Safari**: 커서 위치 복원이 일관되지 않음

## 영향

- 사용자가 입력 위치를 잃음
- 나쁜 사용자 경험
- 커서를 찾기 위해 수동으로 스크롤해야 함
- 안정적인 편집 기능 구현 어려움

## 브라우저 비교

- **Chrome/Edge**: 일반적으로 커서 가시성 유지에 더 좋음
- **Firefox**: 커서 위치를 잃을 가능성이 더 높음
- **Safari**: 가장 일관되지 않은 커서 위치 처리

## 해결 방법

커서가 뷰포트에 유지되도록 보장:

```javascript
function ensureCaretVisible(element, range) {
  const rect = range.getBoundingClientRect();
  const containerRect = element.getBoundingClientRect();
  
  // 커서가 뷰포트 밖에 있는지 확인
  const isOutside = 
    rect.top < containerRect.top ||
    rect.bottom > containerRect.bottom ||
    rect.left < containerRect.left ||
    rect.right > containerRect.right;
  
  if (isOutside) {
    // 커서를 보이게 스크롤
    range.getBoundingClientRect(); // 레이아웃 강제
    
    // 옵션과 함께 scrollIntoView 사용
    const startNode = range.startContainer;
    if (startNode.nodeType === Node.TEXT_NODE) {
      startNode.parentElement?.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'nearest'
      });
    } else {
      startNode.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'nearest'
      });
    }
  }
}

element.addEventListener('input', () => {
  const selection = window.getSelection();
  if (selection.rangeCount > 0) {
    const range = selection.getRangeAt(0);
    requestAnimationFrame(() => {
      ensureCaretVisible(element, range);
    });
  }
});

// 붙여넣기 후에도 확인
element.addEventListener('paste', () => {
  setTimeout(() => {
    const selection = window.getSelection();
    if (selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      ensureCaretVisible(element, range);
    }
  }, 0);
});
```

## 참고 자료

- [MDN: contenteditable global attribute](https://developer.mozilla.org/docs/Web/HTML/Reference/Global_attributes/contenteditable) - contenteditable documentation
- [W3C ContentEditable: Caret positioning](https://w3c.github.io/contentEditable/) - Caret specification
- [CKEditor Issue #9771: Scroll to top after paste](https://dev.ckeditor.com/ticket/9771) - Paste scroll issues
- [Chromium Code Review: Caret scroll into view](https://codereview.chromium.org/9969106/patch/1/5) - Chrome behavior
- [TipTap Issue #2629: iOS Safari caret visibility](https://github.com/ueberdosis/tiptap/issues/2629) - iOS scroll issues
- [GeeksforGeeks: Set cursor position in contenteditable](https://www.geeksforgeeks.org/how-to-set-cursor-position-in-content-editable-element-using-javascript/) - Caret positioning
- [GitHub Gist: caret.js utilities](https://gist.github.com/imolorhe/b6ec41233cf7756eeacbb1e38cd42856) - Caret position helpers
