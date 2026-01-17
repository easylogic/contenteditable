---
id: tip-001-caret-preservation-react-ko
title: React에서 contenteditable 캐럿 위치 보존하기
description: "React에서 contenteditable을 사용할 때 re-render로 인한 캐럿 위치 이동 문제를 해결하는 방법"
category: framework
tags:
  - react
  - caret
  - rerender
  - framework
  - hooks
difficulty: intermediate
relatedScenarios:
  - scenario-react-caret-jumps-on-rerender
  - scenario-framework-state-sync
relatedCases:
  - ce-0316-react-caret-jumps-on-rerender
  - ce-0560-framework-state-sync-vue
locale: ko
---

## 문제

React에서 `contentEditable` 요소를 사용할 때, 컴포넌트가 re-render되면 캐럿 위치가 요소의 처음으로 이동합니다.

이 문제는 React의 reconciliation 과정에서 DOM 노드가 교체되면서 브라우저가 캐럿 위치를 추적하지 못하기 때문에 발생합니다. Safari와 Firefox에서 더 자주 발생합니다.

## 해결 방법

### 1. 비제어 컴포넌트 패턴 사용

ref를 사용하여 DOM을 직접 관리하고, 상태 업데이트를 최소화합니다.

```jsx
import React, { useRef } from 'react';

function ContentEditable() {
  const contentRef = useRef(null);
  
  const handleInput = (e) => {
    // 상태 업데이트를 blur 시에만 수행
    const content = e.currentTarget.textContent;
    // 필요시에만 상태 업데이트
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

### 2. 캐럿 위치 저장 및 복원

업데이트 전에 캐럿 위치를 저장하고, 업데이트 후 복원합니다.

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
      onInput={(e) => {
        saveCaretPosition();
        onChange(e.currentTarget.textContent);
      }}
      suppressContentEditableWarning
    />
  );
}
```

### 3. use-editable 라이브러리 사용

캐럿 관리가 자동으로 처리되는 라이브러리를 사용합니다.

```jsx
import { useEditable } from '@use-editable/core';

function ContentEditable({ value, onChange }) {
  const { editableRef } = useEditable({
    value,
    onChange,
  });
  
  return (
    <div
      ref={editableRef}
      contentEditable
      suppressContentEditableWarning
    />
  );
}
```

## 단계별 가이드

### Step 1: 문제 확인
1. React 컴포넌트에 contentEditable 요소 추가
2. 상태를 바인딩하여 제어 컴포넌트로 만들기
3. 텍스트 입력 후 중간에 커서 배치
4. 상태 업데이트 트리거
5. 캐럿이 처음으로 이동하는지 확인

### Step 2: 해결 방법 선택
- **간단한 편집**: 비제어 컴포넌트 패턴 (방법 1)
- **상태 동기화 필요**: 캐럿 저장/복원 (방법 2)
- **빠른 구현**: use-editable 라이브러리 (방법 3)

### Step 3: 테스트
- Safari와 Firefox에서 테스트 필수
- 긴 텍스트에서도 캐럿 위치가 유지되는지 확인
- 여러 번의 re-render 후에도 정상 작동하는지 확인

## 주의사항

- Safari와 Firefox에서 더 자주 발생하므로 이 브라우저에서 테스트 필수
- 상태 업데이트를 디바운스하거나 스로틀하여 re-render 빈도 감소
- React.memo를 사용하여 불필요한 re-render 방지
- 복잡한 DOM 구조에서는 캐럿 복원이 실패할 수 있음

## 대안 방법

### React.memo로 최적화
```jsx
const ContentEditable = React.memo(({ value, onChange }) => {
  // 컴포넌트 구현
}, (prevProps, nextProps) => {
  // 값이 실제로 변경된 경우에만 re-render
  return prevProps.value === nextProps.value;
});
```

### useMemo로 값 메모이제이션
```jsx
const memoizedValue = useMemo(() => value, [value]);
```

## 관련 자료

- [시나리오: React re-render 캐럿 이동](/scenarios/scenario-react-caret-jumps-on-rerender)
- [시나리오: 프레임워크 상태 동기화](/scenarios/scenario-framework-state-sync)
- [케이스: ce-0316](/cases/ce-0316-react-caret-jumps-on-rerender)
- [케이스: ce-0560](/cases/ce-0560-framework-state-sync-vue)
