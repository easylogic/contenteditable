---
id: ce-0099
scenarioId: scenario-nested-list-behavior
locale: ko
os: Windows
osVersion: "11"
device: Desktop or Laptop
deviceVersion: Any
browser: Chrome
browserVersion: "120.0"
keyboard: US
caseTitle: Chrome에서 중첩 목록의 Enter 키가 같은 레벨에 항목을 생성함
description: "Chrome에서 중첩 목록 항목에서 Enter를 누르면 같은 중첩 레벨에 새로운 목록 항목이 생성됩니다. 이 동작은 일반적으로 올바르지만 사용자 기대나 다른 브라우저와 다를 수 있습니다."
tags:
  - list
  - nested
  - enter
  - chrome
status: draft
domSteps:
  - label: "Before"
    html: '<ul><li>Item 1<ul><li>Nested item</li></ul></li></ul>'
    description: "Nested list, cursor inside 'Nested item'"
  - label: "After Enter"
    html: '<ul><li>Item 1<ul><li>Nested item</li><li></li></ul></li></ul>'
    description: "Enter creates new item at same nesting level (normal behavior)"
  - label: "✅ Expected"
    html: '<ul><li>Item 1<ul><li>Nested item</li><li></li></ul></li></ul>'
    description: "Expected: New item created at same nesting level (current behavior is correct)"
---

### 현상

Chrome에서 중첩 목록 항목에서 Enter를 누르면 같은 중첩 레벨에 새로운 목록 항목이 생성됩니다. 이 동작은 일반적으로 올바르지만 사용자 기대나 다른 브라우저와 다를 수 있습니다.

### 재현 예시

1. 중첩 목록을 만듭니다: `<ul><li>Item 1<ul><li>Nested item</li></ul></li></ul>`
2. "Nested item" 내부에 커서를 놓습니다
3. Enter를 누릅니다

### 관찰된 동작

- 같은 중첩 레벨(중첩된 `<ul>` 내부)에 새로운 목록 항목이 생성됩니다
- 목록 구조가 유지됩니다
- 커서가 끝에 있으면 새 항목이 뒤에 생성됩니다
- 커서가 중간에 있으면 텍스트가 분할됩니다

### 예상 동작

- 새로운 목록 항목이 같은 중첩 레벨에 생성되어야 합니다
- 목록 구조가 유지되어야 합니다
- 동작이 브라우저 간에 일관되어야 합니다

### 브라우저 비교

- **Chrome/Edge**: 같은 레벨에 항목 생성 (이 케이스)
- **Firefox**: 항목이나 단락을 생성할 수 있으며, 동작이 일관되지 않음
- **Safari**: 예상치 못한 중첩 레벨을 만들 수 있음

### 참고 및 해결 방법 가능한 방향

- 이 동작은 일반적으로 허용 가능합니다
- 목록 구조가 깨지는 엣지 케이스를 처리해야 할 수 있음
- 일관된 동작을 보장하기 위해 Enter를 가로채기 고려
- 작업 후 목록 구조 정규화
