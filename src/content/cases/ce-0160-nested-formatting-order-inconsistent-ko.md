---
id: ce-0160
scenarioId: scenario-nested-formatting
locale: ko
os: Windows
osVersion: "11"
device: Desktop or Laptop
deviceVersion: Any
browser: Safari
browserVersion: "17.0"
keyboard: US
caseTitle: Safari에서 중첩 서식 요소 순서가 일관되지 않음
description: "Safari에서 여러 서식 작업을 적용할 때 요소의 중첩 순서가 일관되지 않게 다양합니다. 같은 서식이 적용 순서에 따라 <b><i>text</i></b> 또는 <i><b>text</b></i>가 될 수 있습니다."
tags:
  - formatting
  - nested
  - order
  - safari
status: draft
domSteps:
  - label: "Before"
    html: 'Hello World'
    description: "Basic text"
  - label: "After Bold then Italic"
    html: 'Hello <b><i>World</i></b>'
    description: "Bold first, italic later"
  - label: "After Italic then Bold (Bug)"
    html: 'Hello <i><b>World</b></i>'
    description: "Italic first, bold later - different nesting order"
  - label: "✅ Expected"
    html: 'Hello <b><i>World</i></b>'
    description: "Expected: Consistent nesting order (always b > i)"
---

## 현상

Safari에서 여러 서식 작업을 적용할 때 요소의 중첩 순서가 일관되지 않게 다양합니다. 같은 서식이 적용 순서에 따라 `<b><i>text</i></b>` 또는 `<i><b>text</b></i>`가 될 수 있습니다.

## 재현 예시

1. 일부 텍스트를 선택합니다
2. 굵게를 적용한 다음 기울임꼴을 적용합니다
3. 중첩을 관찰합니다: `<b><i>text</i></b>`
4. 서식을 제거하고 역순으로 다시 적용합니다 (기울임꼴, 그 다음 굵게)
5. 중첩을 관찰합니다: `<i><b>text</b></i>`

## 관찰된 동작

- 중첩 순서가 적용 순서에 따라 다릅니다
- 같은 시각적 결과가 다른 DOM 구조를 가집니다
- 일관되지 않은 구조로 관리가 어렵습니다
- 서식 상태를 쿼리하는 것이 복잡합니다

## 예상 동작

- 중첩 순서가 일관되어야 합니다
- 또는 순서가 예측 가능해야 합니다
- 같은 서식이 같은 구조를 가져야 합니다
- 구조가 정규화되어야 합니다

## 브라우저 비교

- **Chrome/Edge**: 중첩 순서가 더 일관됨
- **Firefox**: 유사한 중첩 동작
- **Safari**: 중첩 순서가 가장 일관되지 않음 (이 케이스)

## 참고 및 해결 방법 가능한 방향

- 작업 후 서식 구조 정규화
- 일관된 중첩 순서 사용 (예: 항상 b > i > u)
- 중첩 요소 병합 또는 재정렬
- 예상 중첩 순서 문서화
