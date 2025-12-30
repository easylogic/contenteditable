---
id: ce-0033
scenarioId: scenario-selection-range-accuracy
locale: ko
os: Windows
osVersion: "11"
device: Desktop or Laptop
deviceVersion: Any
browser: Edge
browserVersion: "120.0"
keyboard: US
caseTitle: 여러 요소에 걸쳐 선택할 때 선택 범위가 잘못됨
description: "contenteditable 영역에서 여러 HTML 요소(예: p, div, span)에 걸쳐 텍스트를 선택할 때 선택 범위가 시각적 선택을 정확히 반영하지 않을 수 있습니다. getSelection() API가 사용자가 보는 것과 일치하지 않는 범위를 반환할 수 있습니다."
tags:
  - selection
  - range
  - elements
  - edge
status: draft
domSteps:
  - label: "Before"
    html: '<p>First paragraph</p><p>Second paragraph</p>'
    description: "두 개의 단락, 첫 번째 단락 중간부터 두 번째 단락 중간까지 선택됨"
  - label: "Selection Range (Bug)"
    html: '<p>First paragraph</p><p>Second paragraph</p>'
    description: "getSelection()이 잘못된 범위를 반환, 시각적 선택과 일치하지 않음"
  - label: "✅ Expected"
    html: '<p>First paragraph</p><p>Second paragraph</p>'
    description: "예상: getSelection()이 시각적 선택과 일치하는 정확한 범위를 반환"
---

## 현상

contenteditable 영역에서 여러 HTML 요소(예: `<p>`, `<div>`, `<span>`)에 걸쳐 텍스트를 선택할 때 선택 범위가 시각적 선택을 정확히 반영하지 않을 수 있습니다. `Selection` 및 `Range` API가 잘못된 경계를 반환할 수 있습니다.

## 재현 예시

1. 중첩된 요소가 있는 contenteditable div를 만듭니다:
   ```html
   <div contenteditable>
     <p>First paragraph</p>
     <p>Second paragraph</p>
   </div>
   ```
2. 첫 번째 단락 중간부터 두 번째 단락 중간까지 텍스트를 선택합니다.
3. JavaScript를 사용하여 선택 범위를 검사합니다.
4. 보고된 시작 및 끝 위치를 관찰합니다.

## 관찰된 동작

- Windows의 Edge에서 선택 범위 경계가 시각적 선택과 일치하지 않을 수 있습니다.
- `Range.startOffset` 및 `Range.endOffset`이 잘못될 수 있습니다.
- 요소 경계에 걸쳐 선택하면 예상치 못한 결과가 발생할 수 있습니다.

## 예상 동작

- 선택 범위가 시각적 선택을 정확히 반영해야 합니다.
- 여러 요소에 걸쳐 있어도 경계가 올바르게 보고되어야 합니다.
- `Selection` 및 `Range` API가 일관되고 신뢰할 수 있는 데이터를 제공해야 합니다.
