---
id: ce-0143
scenarioId: scenario-nested-list-behavior
locale: ko
os: Windows
osVersion: "11"
device: Desktop or Laptop
deviceVersion: Any
browser: Firefox
browserVersion: "120.0"
keyboard: US
caseTitle: 중첩 목록 항목 시작 부분의 Backspace가 중첩 목록을 삭제함
description: "Firefox에서 중첩 목록 항목의 시작 부분에서 Backspace를 누르면 목록 항목을 들여쓰기 해제하는 대신 전체 중첩 목록 구조가 삭제될 수 있습니다. 이것은 목록 구조를 깨뜨립니다."
tags:
  - list
  - nested
  - backspace
  - firefox
status: draft
domSteps:
  - label: "Before"
    html: '<ul><li>Item 1<ul><li>Nested item</li></ul></li></ul>'
    description: "Nested list, cursor at start of 'Nested item'"
  - label: "After Backspace (Bug)"
    html: '<ul><li>Item 1</li></ul>'
    description: "Backspace deletes entire nested list"
  - label: "✅ Expected"
    html: '<ul><li>Item 1</li><li>Nested item</li></ul>'
    description: "Expected: Only nested item moves to parent level (indentation removed)"
---

## 현상

Firefox에서 중첩 목록 항목의 시작 부분에서 Backspace를 누르면 목록 항목을 들여쓰기 해제하는 대신 전체 중첩 목록 구조가 삭제될 수 있습니다. 이것은 목록 구조를 깨뜨립니다.

## 재현 예시

1. 중첩 목록을 만듭니다: `<ul><li>Item 1<ul><li>Nested item</li></ul></li></ul>`
2. "Nested item"의 시작 부분에 커서를 놓습니다
3. Backspace를 누릅니다

## 관찰된 동작

- 전체 중첩 목록이 삭제됩니다
- 또는 중첩 구조가 깨집니다
- 목록 항목이 단순히 들여쓰기 해제되지 않습니다
- 구조가 잘못 형성됩니다

## 예상 동작

- 목록 항목이 들여쓰기 해제되어야 합니다 (부모 목록으로 이동)
- 중첩 목록 구조가 보존되어야 합니다
- 특정 항목만 영향을 받아야 합니다
- 구조가 유효하게 유지되어야 합니다

## 브라우저 비교

- **Chrome/Edge**: 올바르게 들여쓰기 해제하거나 목록을 삭제할 수 있음
- **Firefox**: 중첩 목록을 삭제할 가능성이 더 높음 (이 케이스)
- **Safari**: 동작이 가장 일관되지 않음

## 참고 및 해결 방법 가능한 방향

- 중첩 목록 항목에서 Backspace 가로채기
- 사용자 정의 들여쓰기 해제 로직 구현
- 목록 항목을 부모 목록으로 이동
- 중첩 목록 구조 보존
