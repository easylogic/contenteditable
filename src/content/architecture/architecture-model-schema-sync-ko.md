---
id: architecture-model-schema-sync
title: "현대적인 모델-스키마 동기화 전략"
description: "Reconciler 패턴을 사용하여 2025년 에디터에서 견고한 Source of Truth를 유지하는 방법."
category: "architecture"
tags: ["model", "schema", "reconciliation", "sourcetofocus", "immutability"]
status: "confirmed"
locale: "ko"
---

## 개요
ProseMirror, Lexical, Slate와 같은 현대적인 리치 텍스트 에디터에서 DOM은 더 이상 데이터의 원천(Source of Truth)이 아닙니다. 대신, 구조화된 **모델**(주로 불변 트리 또는 JSON)이 문서의 상태를 결정하며, **스키마**는 그 모델의 규칙을 정의합니다. 핵심 과제는 이 깔끔한 모델과 브라우저의 무질서한 `contenteditable` DOM 사이의 양방향 동기화를 완벽하게 관리하는 것입니다.

## Reconciler 패턴
가장 견고한 아키텍처는 React와 유사한 단방향 업데이트 루프를 사용합니다:

1.  **사용자 입력**: `beforeinput` 또는 `input` 이벤트가 발생합니다.
2.  **가로채기**: 에디터는 가능한 경우 브라우저의 기본 동작을 차단(preventDefault)합니다.
3.  **모델 업데이트**: 내부 모델에 트랜잭션(Transaction)이 적용됩니다.
4.  **조정(Reconcile)**: 에디터가 새로운 모델과 기존 DOM을 비교합니다.
5.  **렌더링**: DOM에서 변경된 특정 부분만 효율적으로 업데이트합니다.

## 스키마 모범 사례 (2025)

### 1. 세밀한 직렬화 (Granular Serialization)
문서 전체를 HTML로 자주 변환하는 것을 피하세요. 개별 "블록"이나 "노드" 단위로 직렬화/역직렬화할 수 있는 스키마를 사용하여 성능을 최적화해야 합니다.

### 2. 엄격한 정규화 (Strict Normalization)
모델은 유효한 구조를 강제해야 합니다 (예: "목록은 반드시 목록 아이템만 포함해야 함"). 사용자 붙여넣기나 갑작스러운 변이로 인해 이 규칙이 깨지면, 스키마는 `normalize` 함수를 통해 즉시 모델을 "치유"해야 합니다.

```javascript
/* 스키마 정규화 예시 */
{
  name: "ordered_list",
  content: "list_item+",
  normalize(node, transaction) {
    if (node.childCount === 0) {
      // 비어 있는 목록은 자동으로 제거
      transaction.remove(node); 
    }
  }
}
```

### 3. 선택 영역 인식 (Selection Awareness)
모델은 **선택 영역 상태(Selection State)**를 데이터의 일부로 포함해야 합니다. 그래야 복잡한 구조적 변화가 일어난 후에도 실행 취소(Undo/Redo) 시 커서 위치를 완벽하게 복구할 수 있습니다.

## 동기화 과정의 난제
- **IME 조합(Composition)**: 활발한 조합 세션 중에는 절대로 DOM을 다시 렌더링하는 방식으로 모델을 업데이트하지 마세요. 이는 브라우저의 IME 버퍼를 즉시 파괴합니다.
- **협업 편집 (OT/CRDT)**: 다른 사용자의 동시 업데이트를 처리하기 위해 운영 체제 변환(OT)이나 CRDT 알고리즘을 모델 레벨에서 구현해야 합니다.

## 참고 자료
- [ProseMirror: 문서 모델 가이드](https://prosemirror.net/docs/guide/#doc)
- [Lexical: 상태 관리 개념](https://lexical.dev/docs/concepts/editor-state)
- [Slate.js: 핵심 원칙](https://docs.slatejs.org/concepts/01-nodes)
---
id: architecture-model-schema-sync
title: "현대적인 모델-스키마 동기화 전략"
description: "Reconciler 패턴을 사용하여 2025년 에디터에서 견고한 Source of Truth를 유지하는 방법."
category: "architecture"
tags: ["model", "schema", "reconciliation", "sourcetofocus", "immutability"]
status: "confirmed"
locale: "ko"
---

## 개요
ProseMirror, Lexical, Slate와 같은 현대적인 리치 텍스트 에디터에서 DOM은 더 이상 데이터의 원천(Source of Truth)이 아닙니다. 대신, 구조화된 **모델**(주로 불변 트리 또는 JSON)이 문서의 상태를 결정하며, **스키마**는 그 모델의 규칙을 정의합니다. 핵심 과제는 이 깔끔한 모델과 브라우저의 무질서한 `contenteditable` DOM 사이의 양방향 동기화를 완벽하게 관리하는 것입니다.

## Reconciler 패턴
가장 견고한 아키텍처는 React와 유사한 단방향 업데이트 루프를 사용합니다:

1.  **사용자 입력**: `beforeinput` 또는 `input` 이벤트가 발생합니다.
2.  **가로채기**: 에디터는 가능한 경우 브라우저의 기본 동작을 차단(preventDefault)합니다.
3.  **모델 업데이트**: 내부 모델에 트랜잭션(Transaction)이 적용됩니다.
4.  **조정(Reconcile)**: 에디터가 새로운 모델과 기존 DOM을 비교합니다.
5.  **렌더링**: DOM에서 변경된 특정 부분만 효율적으로 업데이트합니다.

## 스키마 모범 사례 (2025)

### 1. 세밀한 직렬화 (Granular Serialization)
문서 전체를 HTML로 자주 변환하는 것을 피하세요. 개별 "블록"이나 "노드" 단위로 직렬화/역직렬화할 수 있는 스키마를 사용하여 성능을 최적화해야 합니다.

### 2. 엄격한 정규화 (Strict Normalization)
모델은 유효한 구조를 강제해야 합니다 (예: "목록은 반드시 목록 아이템만 포함해야 함"). 사용자 붙여넣기나 갑작스러운 변이로 인해 이 규칙이 깨지면, 스키마는 `normalize` 함수를 통해 즉시 모델을 "치유"해야 합니다.

```javascript
/* 스키마 정규화 예시 */
{
  name: "ordered_list",
  content: "list_item+",
  normalize(node, transaction) {
    if (node.childCount === 0) {
      // 비어 있는 목록은 자동으로 제거
      transaction.remove(node); 
    }
  }
}
```

### 3. 선택 영역 인식 (Selection Awareness)
모델은 **선택 영역 상태(Selection State)**를 데이터의 일부로 포함해야 합니다. 그래야 복잡한 구조적 변화가 일어난 후에도 실행 취소(Undo/Redo) 시 커서 위치를 완벽하게 복구할 수 있습니다.

## 동기화 과정의 난제
- **IME 조합(Composition)**: 활발한 조합 세션 중에는 절대로 DOM을 다시 렌더링하는 방식으로 모델을 업데이트하지 마세요. 이는 브라우저의 IME 버퍼를 즉시 파괴합니다.
- **협업 편집 (OT/CRDT)**: 다른 사용자의 동시 업데이트를 처리하기 위해 운영 체제 변환(OT)이나 CRDT 알고리즘을 모델 레벨에서 구현해야 합니다.

## 참고 자료
- [ProseMirror: 문서 모델 가이드](https://prosemirror.net/docs/guide/#doc)
- [Lexical: 상태 관리 개념](https://lexical.dev/docs/concepts/editor-state)
- [Slate.js: 핵심 원칙](https://docs.slatejs.org/concepts/01-nodes)
