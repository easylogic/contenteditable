---
id: scenario-react-caret-jumps-on-rerender-ko
title: React에서 re-render 시 캐럿 위치가 처음으로 이동함
description: "React에서 contentEditable 요소를 사용할 때, 컴포넌트가 re-render될 때마다 캐럿(커서) 위치가 요소의 처음으로 이동합니다. React의 reconciliation 과정에서 DOM 노드가 교체되면서 브라우저가 캐럿 위치를 추적하지 못하기 때문입니다. Safari와 Firefox에서 더 자주 발생합니다."
category: other
tags:
  - react
  - framework
  - caret
  - rerender
  - safari
  - firefox
status: draft
locale: ko
---

React에서 `contentEditable` 요소를 사용할 때, 컴포넌트가 re-render될 때마다 캐럿(커서) 위치가 요소의 처음으로 이동합니다. React의 reconciliation 과정에서 DOM 노드가 교체되면서 브라우저가 캐럿 위치를 추적하지 못하기 때문입니다.

## 관찰된 동작

- **캐럿이 처음으로 이동**: re-render될 때마다 캐럿 위치가 요소의 처음으로 되돌아감
- **Safari/Firefox**: DOM 업데이트 처리 방식 때문에 Safari와 Firefox에서 더 자주 발생
- **DOM 교체**: React가 re-render 중에 DOM 노드를 교체하면서 캐럿 위치를 잃음
- **상태 업데이트**: re-render를 유발하는 모든 상태 변경이 이 문제를 일으킴
- **사용자 경험**: 타이핑 흐름과 편집 경험을 심각하게 방해함

## 근본 원인

React의 reconciliation 알고리즘이 상태 변경 시 DOM 노드를 교체할 수 있어, 브라우저가 캐럿 위치를 추적하지 못하게 됩니다. Safari와 Firefox는 Chrome과 다르게 DOM 업데이트를 처리하여 이 문제에 더 취약합니다.

## 브라우저 비교

- **Safari**: 가장 많이 영향받음 - re-render 시 캐럿이 자주 이동
- **Firefox**: Safari와 유사하게 영향받음
- **Chrome**: 덜 영향받지만 일부 경우에 여전히 발생
- **Edge**: Chrome과 유사

## 영향

- **사용자 경험 저하**: 사용자가 중단 없이 연속적으로 타이핑할 수 없음
- **데이터 손실 위험**: 사용자가 타이핑 위치와 맥락을 잃을 수 있음
- **프레임워크 제한**: React와 contenteditable 통합을 어렵게 만듦
- **개발 오버헤드**: 캐럿 위치를 보존하기 위한 추가 코드 필요

## 해결 방법

### 1. Refs를 사용한 비제어 컴포넌트 사용

제어 컴포넌트를 피하고 ref를 사용하여 콘텐츠 관리:

```jsx
import React, { useRef } from 'react';

function ContentEditable() {
  const contentRef = useRef(null);
  
  const handleInput = (e) => {
    // re-render를 유발하지 않고 입력 처리
    const content = e.currentTarget.textContent;
    // 필요할 때만 상태 업데이트 (예: blur 시)
  };
  
  return (
    <div
      contentEditable
      ref={contentRef}
      onInput={handleInput}
      suppressContentEditableWarning
    />
  );
}
```

### 2. 캐럿 위치 보존 및 복원

업데이트 전에 캐럿 위치를 저장하고 이후 복원:

```jsx
import React, { useRef, useEffect } from 'react';

function ContentEditable({ value, onChange }) {
  const editableRef = useRef(null);
  const caretPositionRef = useRef(null);
  
  const saveCaretPosition = () => {
    const selection = window.getSelection();
    if (selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      caretPositionRef.current = {
        startContainer: range.startContainer,
        startOffset: range.startOffset,
        endContainer: range.endContainer,
        endOffset: range.endOffset
      };
    }
  };
  
  const restoreCaretPosition = () => {
    if (!caretPositionRef.current) return;
    const selection = window.getSelection();
    const range = document.createRange();
    range.setStart(
      caretPositionRef.current.startContainer,
      caretPositionRef.current.startOffset
    );
    range.setEnd(
      caretPositionRef.current.endContainer,
      caretPositionRef.current.endOffset
    );
    selection.removeAllRanges();
    selection.addRange(range);
  };
  
  useEffect(() => {
    if (editableRef.current && value !== editableRef.current.textContent) {
      saveCaretPosition();
      editableRef.current.textContent = value;
      restoreCaretPosition();
    }
  }, [value]);
  
  return (
    <div
      contentEditable
      ref={editableRef}
      onInput={(e) => onChange(e.currentTarget.textContent)}
      suppressContentEditableWarning
    />
  );
}
```

### 3. 전문 라이브러리 사용

캐럿 관리가 자동으로 처리되는 라이브러리:

- **use-editable**: 캐럿 보존 기능이 있는 React hook
- **react-contenteditable**: 캐럿 위치를 처리하는 래퍼 컴포넌트
- **slate-react**: React용으로 구축된 리치 텍스트 에디터 프레임워크

### 4. Re-render 최소화

React.memo, useMemo, useCallback을 사용하여 불필요한 re-render 방지:

```jsx
const ContentEditable = React.memo(({ value, onChange }) => {
  // 컴포넌트 구현
}, (prevProps, nextProps) => {
  // 값이 실제로 변경된 경우에만 re-render
  return prevProps.value === nextProps.value;
});
```

## 참고 자료

- [Stack Overflow: Re-render 시 캐럿 위치가 처음으로 되돌아감](https://stackoverflow.com/questions/40537746/caret-position-reverts-to-start-of-contenteditable-span-on-re-render-in-react-in) - 일반적인 문제와 해결 방법
- [dtang.dev: React에서 contentEditable 사용하기](https://dtang.dev/using-content-editable-in-react/) - 모범 사례와 패턴
- [GitHub: FormidableLabs use-editable](https://github.com/FormidableLabs/use-editable) - contentEditable용 React hook
- [Stack Overflow: React contentEditable 제어 컴포넌트](https://stackoverflow.com/questions/22677931/react-flow-contenteditable-change-events) - 제어 vs 비제어 패턴
- [React Issue: contentEditable 캐럿 위치](https://github.com/facebook/react/issues/955) - React GitHub 이슈 토론
- [Medium: React contentEditable 모범 사례](https://medium.com/@david.gilbertson/react-contenteditable-the-good-the-bad-and-the-ugly-8c8a0b0c0c4) - 종합 가이드
