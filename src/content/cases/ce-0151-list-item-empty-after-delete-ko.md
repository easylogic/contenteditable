---
id: ce-0151-list-item-empty-after-delete-ko
scenarioId: scenario-list-item-deletion
locale: ko
os: Windows
osVersion: "11"
device: Desktop or Laptop
deviceVersion: Any
browser: Safari
browserVersion: "17.0"
keyboard: US
caseTitle: Safari에서 모든 텍스트 삭제 후 빈 목록 항목이 남음
description: "Safari에서 목록 항목에서 모든 텍스트를 삭제할 때 빈 목록 항목이 DOM에 남을 수 있습니다. 이러한 빈 <li> 요소는 레이아웃 문제를 일으키고 목록 구조를 혼란스럽게 만듭니다."
tags:
  - list
  - empty
  - deletion
  - safari
status: draft
domSteps:
  - label: "Before"
    html: '<ul><li>Item 1</li><li>Item 2</li></ul>'
    description: "List structure"
  - label: "After Delete (Bug)"
    html: '<ul><li>Item 1</li><li></li></ul>'
    description: "After deleting Item 2 text, empty &lt;li&gt; element remains"
  - label: "✅ Expected"
    html: '<ul><li>Item 1</li></ul>'
    description: "Expected: Empty list item removed, clean list structure"
---

## 현상

Safari에서 목록 항목에서 모든 텍스트를 삭제할 때 빈 목록 항목이 DOM에 남을 수 있습니다. 이러한 빈 `<li>` 요소는 레이아웃 문제를 일으키고 목록 구조를 혼란스럽게 만듭니다.

## 재현 예시

1. 목록을 만듭니다: `<ul><li>Item 1</li><li>Item 2</li></ul>`
2. "Item 2"에서 모든 텍스트를 삭제합니다
3. DOM을 관찰합니다

## 관찰된 동작

- 빈 `<li></li>` 또는 `<li><br></li>` 요소가 남습니다
- 목록 구조에 빈 항목이 포함됩니다
- 레이아웃에 예상치 못한 간격이 있습니다
- 빈 항목이 보입니다

## 예상 동작

- 빈 목록 항목이 제거되어야 합니다
- 또는 커서를 위해 최소한 하나의 빈 항목이 남아야 합니다
- 목록 구조가 깨끗해야 합니다
- 불필요한 빈 항목이 없어야 합니다

## 브라우저 비교

- **Chrome/Edge**: 빈 항목을 제거하거나 하나를 남길 수 있음
- **Firefox**: 빈 항목을 남길 가능성이 더 높음
- **Safari**: 빈 항목을 남길 가능성이 가장 높음 (이 케이스)

## 참고 및 해결 방법 가능한 방향

- 삭제 후 빈 목록 항목 정리
- 빈 항목을 제거하지만 목록 구조 보존
- 필요한 경우 커서를 위해 하나의 빈 항목 유지
- 목록 구조를 정기적으로 정규화
