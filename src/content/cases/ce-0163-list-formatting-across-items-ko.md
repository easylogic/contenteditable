---
id: ce-0163
scenarioId: scenario-list-formatting-persistence
locale: ko
os: Windows
osVersion: "11"
device: Desktop or Laptop
deviceVersion: Any
browser: Chrome
browserVersion: "120.0"
keyboard: US
caseTitle: 여러 목록 항목에 걸쳐 서식 적용 시 목록 구조가 깨짐
description: "Chrome에서 여러 목록 항목에 걸쳐 텍스트를 선택하고 서식을 적용할 때 목록 구조가 깨질 수 있습니다. 목록 항목이 단락으로 변환되거나 목록이 완전히 제거될 수 있습니다."
tags:
  - list
  - formatting
  - multi-select
  - chrome
status: draft
domSteps:
  - label: "Before"
    html: '<ul><li>Item 1</li><li>Item 2</li><li>Item 3</li></ul>'
    description: "List structure, text selected from Item 1 and Item 2"
  - label: "After Bold (Bug)"
    html: '<p><b>Item 1</b></p><p><b>Item 2</b></p>'
    description: "After formatting applied, list structure damaged, &lt;li&gt; converted to &lt;p&gt;"
  - label: "✅ Expected"
    html: '<ul><li><b>Item 1</b></li><li><b>Item 2</b></li><li>Item 3</li></ul>'
    description: "Expected: List structure maintained, formatting applied inside each item"
---

## 현상

Chrome에서 여러 목록 항목에 걸쳐 텍스트를 선택하고 서식을 적용할 때 목록 구조가 깨질 수 있습니다. 목록 항목이 단락으로 변환되거나 목록이 완전히 제거될 수 있습니다.

## 재현 예시

1. 목록을 만듭니다: `<ul><li>Item 1</li><li>Item 2</li><li>Item 3</li></ul>`
2. "Item 1"과 "Item 2"에 걸쳐 텍스트를 선택합니다
3. 굵게 서식을 적용합니다

## 관찰된 동작

- 목록 항목이 단락으로 변환될 수 있습니다
- 목록 구조가 깨집니다
- 서식이 적용되지만 목록이 손실됩니다
- DOM 구조가 다음과 같이 됩니다: `<p><b>Item 1</b></p><p><b>Item 2</b></p>`

## 예상 동작

- 목록 구조가 유지되어야 합니다
- 서식이 목록 항목 내에 적용되어야 합니다
- 목록 항목이 `<li>` 요소로 유지되어야 합니다
- 구조가 깨지지 않아야 합니다

## 브라우저 비교

- **Chrome/Edge**: 구조를 깨뜨릴 수 있음 (이 케이스)
- **Firefox**: 구조를 깨뜨릴 가능성이 더 높음
- **Safari**: 구조를 깨뜨릴 가능성이 가장 높음

## 참고 및 해결 방법 가능한 방향

- 목록 항목에 걸친 서식 가로채기
- 각 목록 항목 내에서 서식을 별도로 적용
- 목록 구조 보존
- 서식 후 구조 정규화
