---
id: ce-0097
scenarioId: scenario-list-item-deletion
locale: ko
os: Windows
osVersion: "11"
device: Desktop or Laptop
deviceVersion: Any
browser: Chrome
browserVersion: "120.0"
keyboard: US
caseTitle: Chrome에서 목록 항목 시작 부분의 Backspace가 단락으로 변환됨
description: "Chrome에서 첫 번째 목록 항목의 시작 부분에서 Backspace를 누르면 목록 항목이 삭제되고 단락 요소로 변환됩니다. 이 동작은 전체 목록을 삭제하거나 예상치 못한 구조를 만들 수 있는 Firefox 및 Safari와 다릅니다."
tags:
  - list
  - deletion
  - backspace
  - chrome
status: draft
domSteps:
  - label: "Before"
    html: '<ul><li>Item 1</li><li>Item 2</li></ul>'
    description: "List, cursor at start of first item"
  - label: "After Backspace (Bug)"
    html: '<p>Item 1</p><ul><li>Item 2</li></ul>'
    description: "Backspace removes first item from list and converts to paragraph"
  - label: "✅ Expected"
    html: '<ul><li>Item 2</li></ul>'
    description: "Expected: Only first item deleted, list structure maintained"
---

## 현상

Chrome에서 첫 번째 목록 항목의 시작 부분에서 Backspace를 누르면 목록 항목이 삭제되고 단락 요소로 변환됩니다. 이 동작은 전체 목록을 삭제하거나 예상치 못한 구조를 만들 수 있는 Firefox 및 Safari와 다릅니다.

## 재현 예시

1. 최소한 하나의 항목이 있는 목록을 만듭니다: `<ul><li>Item 1</li><li>Item 2</li></ul>`
2. "Item 1"의 맨 처음(텍스트 앞)에 커서를 놓습니다
3. Backspace를 누릅니다

## 관찰된 동작

- 첫 번째 목록 항목이 목록에서 제거됩니다
- 목록 항목 콘텐츠가 `<p>` 단락 요소로 변환됩니다
- 나머지 목록 항목은 목록 구조에 유지됩니다
- 유일한 항목이었다면 목록이 완전히 제거될 수 있습니다

## 예상 동작

- 목록 항목이 삭제되고 이전 콘텐츠(있는 경우)와 병합되어야 합니다
- 또는 목록 항목이 목록 구조를 유지하면서 제거되어야 합니다
- 동작이 브라우저 간에 일관되어야 합니다

## 브라우저 비교

- **Chrome/Edge**: 목록 항목을 단락으로 변환
- **Firefox**: 전체 목록을 삭제하거나 중첩 구조를 만들 수 있음
- **Safari**: 빈 목록 항목이나 예상치 못한 구조를 만들 수 있음

## 참고 및 해결 방법 가능한 방향

- `inputType: 'deleteContentBackward'`가 있는 `beforeinput` 이벤트를 가로채기
- 커서가 목록 항목의 시작 부분에 있는지 확인
- 예상 동작을 유지하는 사용자 정의 삭제 로직 구현
- 병합할 이전 콘텐츠가 있는 경우에만 단락으로 변환 고려
