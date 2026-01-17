---
id: ce-0098-list-item-deletion-firefox-ko
scenarioId: scenario-list-item-deletion
locale: ko
os: Windows
osVersion: "11"
device: Desktop or Laptop
deviceVersion: Any
browser: Firefox
browserVersion: "120.0"
keyboard: US
caseTitle: Firefox에서 목록 항목 시작 부분의 Backspace가 전체 목록을 삭제할 수 있음
description: "Firefox에서 목록 항목의 시작 부분에서 Backspace를 누르면 전체 목록이 삭제되거나 예상치 못한 중첩 구조가 생성될 수 있습니다. 이 동작은 목록 항목을 단락으로 변환하는 Chrome과 다릅니다."
tags:
  - list
  - deletion
  - backspace
  - firefox
status: draft
domSteps:
  - label: "Before"
    html: '<ul><li>Item 1</li><li>Item 2</li></ul>'
    description: "List structure, cursor at start of first item"
  - label: "After Backspace (Bug)"
    html: ''
    description: "Backspace deletes entire list"
  - label: "✅ Expected"
    html: '<ul><li>Item 2</li></ul>'
    description: "Expected: Only first item deleted, list structure maintained"
---

## 현상

Firefox에서 목록 항목의 시작 부분에서 Backspace를 누르면 전체 목록이 삭제되거나 예상치 못한 중첩 구조가 생성될 수 있습니다. 이 동작은 목록 항목을 단락으로 변환하는 Chrome과 다릅니다.

## 재현 예시

1. 항목이 있는 목록을 만듭니다: `<ul><li>Item 1</li><li>Item 2</li></ul>`
2. 첫 번째 목록 항목의 맨 처음에 커서를 놓습니다
3. Backspace를 누릅니다

## 관찰된 동작

- 전체 목록이 삭제될 수 있습니다
- 또는 예상치 못한 중첩 목록 구조가 생성될 수 있습니다
- 목록 항목이 일관되지 않은 방식으로 단락으로 변환될 수 있습니다
- DOM 구조가 잘못 형성될 수 있습니다

## 예상 동작

- 목록 항목이 목록 구조를 유지하면서 삭제되어야 합니다
- 나머지 목록 항목은 목록에 유지되어야 합니다
- 동작이 Chrome과 일관되어야 합니다

## 브라우저 비교

- **Chrome/Edge**: 목록 항목을 단락으로 변환 (더 예측 가능)
- **Firefox**: 전체 목록을 삭제할 수 있음 (이 케이스)
- **Safari**: 빈 목록 항목을 만들 수 있음

## 참고 및 해결 방법 가능한 방향

- 기본 동작을 방지하기 위해 `beforeinput` 이벤트를 가로채기
- 목록 구조를 유지하는 사용자 정의 삭제 구현
- 삭제를 허용하기 전에 목록 컨텍스트 확인
- 삭제 작업 후 DOM 구조 정규화
