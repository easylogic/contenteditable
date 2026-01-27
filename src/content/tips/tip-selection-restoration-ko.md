---
id: tip-selection-restoration
title: "DOM 동기화 후 완벽한 선택 영역 복구 방법"
category: "ux"
tags: ["selection", "caret", "rendering", "ux"]
status: "confirmed"
locale: "ko"
---

## 요약
DOM 업데이트 후 캐럿(커서) 위치를 정확히 복구하는 것은 에디터 개발에서 가장 어려운 부분 중 하나입니다. 이 팁은 커서 점프와 선택 영역 소실을 방지하는 전략을 제공합니다.

## 문제 상황
내부 모델로부터 `contenteditable` 요소를 다시 렌더링하면 브라우저는 현재의 `Selection`을 잃어버립니다. 업데이트 직후 단순히 `selection.addRange()`를 호출하면, 특히 크롬에서 커서가 줄 맨 앞으로 튀거나 시각적으로 깜빡이는 현상이 발생할 수 있습니다.

## 모범 사례: 논리적 경로 매핑 (Logical Path Mapping)
절대적인 오프셋(offset)에 의존하는 대신, 렌더링 후 올바른 DOM 타겟을 찾기 위해 **논리적 경로**(예: "인덱스 2번 노드, 텍스트 오프셋 5")를 사용하세요.

### 1. 업데이트 전: 경로 저장
DOM이 수정되기 전, 모델 내에서 커서의 논리적 위치를 찾아 기록합니다.

### 2. 업데이트 후: DOM으로 다시 매핑
렌더링이 완료된 후, 해당 논리적 경로를 대표하는 새로운 DOM 노드를 찾아 수동으로 Range를 설정합니다.

```javascript
function restoreSelection(editor, logicalPath) {
    const { node, offset } = findTargetDom(editor, logicalPath);
    
    const range = document.createRange();
    range.setStart(node, offset);
    range.collapse(true);
    
    const selection = window.getSelection();
    selection.removeAllRanges();
    selection.addRange(range);
}
```

## 주의 사항
- **인라인 위젯**: `contenteditable="false"`인 아이콘이나 위젯이 있는 경우, 경로 매핑 로직이 이를 고려하도록 작성해야 합니다.
- **안드로이드**: 안드로이드의 Selection API는 입력 중일 때 매우 불안정합니다. `requestAnimationFrame` 이후로 복구 시점을 늦추는 것을 고려하세요.

## 관련 링크
- [MDN: Selection API](https://developer.mozilla.org/en-US/docs/Web/API/Selection)
- [W3C: Input Events 및 선택 영역 관리](https://www.w3.org/TR/input-events-2/#selection)
---
id: tip-selection-restoration
title: "DOM 동기화 후 완벽한 선택 영역 복구 방법"
category: "ux"
tags: ["selection", "caret", "rendering", "ux"]
status: "confirmed"
locale: "ko"
---

## 요약
DOM 업데이트 후 캐럿(커서) 위치를 정확히 복구하는 것은 에디터 개발에서 가장 어려운 부분 중 하나입니다. 이 팁은 커서 점프와 선택 영역 소실을 방지하는 전략을 제공합니다.

## 문제 상황
내부 모델로부터 `contenteditable` 요소를 다시 렌더링하면 브라우저는 현재의 `Selection`을 잃어버립니다. 업데이트 직후 단순히 `selection.addRange()`를 호출하면, 특히 크롬에서 커서가 줄 맨 앞으로 튀거나 시각적으로 깜빡이는 현상이 발생할 수 있습니다.

## 모범 사례: 논리적 경로 매핑 (Logical Path Mapping)
절대적인 오프셋(offset)에 의존하는 대신, 렌더링 후 올바른 DOM 타겟을 찾기 위해 **논리적 경로**(예: "인덱스 2번 노드, 텍스트 오프셋 5")를 사용하세요.

### 1. 업데이트 전: 경로 저장
DOM이 수정되기 전, 모델 내에서 커서의 논리적 위치를 찾아 기록합니다.

### 2. 업데이트 후: DOM으로 다시 매핑
렌더링이 완료된 후, 해당 논리적 경로를 대표하는 새로운 DOM 노드를 찾아 수동으로 Range를 설정합니다.

```javascript
function restoreSelection(editor, logicalPath) {
    const { node, offset } = findTargetDom(editor, logicalPath);
    
    const range = document.createRange();
    range.setStart(node, offset);
    range.collapse(true);
    
    const selection = window.getSelection();
    selection.removeAllRanges();
    selection.addRange(range);
}
```

## 주의 사항
- **인라인 위젯**: `contenteditable="false"`인 아이콘이나 위젯이 있는 경우, 경로 매핑 로직이 이를 고려하도록 작성해야 합니다.
- **안드로이드**: 안드로이드의 Selection API는 입력 중일 때 매우 불안정합니다. `requestAnimationFrame` 이후로 복구 시점을 늦추는 것을 고려하세요.

## 관련 링크
- [MDN: Selection API](https://developer.mozilla.org/en-US/docs/Web/API/Selection)
- [W3C: Input Events 및 선택 영역 관리](https://www.w3.org/TR/input-events-2/#selection)
