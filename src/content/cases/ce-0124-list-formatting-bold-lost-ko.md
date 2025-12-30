---
id: ce-0124
scenarioId: scenario-list-formatting-persistence
locale: ko
os: Windows
osVersion: "11"
device: Desktop or Laptop
deviceVersion: Any
browser: Firefox
browserVersion: "120.0"
keyboard: US
caseTitle: Firefox에서 목록 항목에서 Enter를 누르면 굵게 서식이 손실됨
description: "목록 항목의 텍스트에 굵게 서식을 적용한 후 Enter를 눌러 새 목록 항목을 만들 때 굵게 서식이 손실됩니다. 새 목록 항목에 굵게 서식이 적용되지 않습니다."
tags:
  - list
  - formatting
  - bold
  - enter
  - firefox
status: draft
domSteps:
  - label: "Before"
    html: '<ul><li><b>Bold item</b></li></ul>'
    description: "List item with bold text, cursor at end"
  - label: "After Enter (Bug)"
    html: '<ul><li><b>Bold item</b></li><li></li></ul>'
    description: "Enter creates new item, bold formatting not applied to new item"
  - label: "✅ Expected"
    html: '<ul><li><b>Bold item</b></li><li><b></b></li></ul>'
    description: "Expected: New item also inherits bold formatting"
---

### 현상

목록 항목의 텍스트에 굵게 서식을 적용한 후 Enter를 눌러 새 목록 항목을 만들 때 굵게 서식이 손실됩니다. 새 목록 항목에 굵게 서식이 적용되지 않습니다.

### 재현 예시

1. 목록을 만듭니다: `<ul><li><b>Bold item</b></li></ul>`
2. "Bold item"의 끝에 커서를 놓습니다
3. Enter를 누릅니다

### 관찰된 동작

- 새 목록 항목이 생성됩니다
- 새 항목에 굵게 서식이 적용되지 않습니다
- 서식이 손실됩니다
- 사용자가 서식을 다시 적용해야 합니다

### 예상 동작

- 새 목록 항목에서 굵게 서식이 유지되어야 합니다
- 또는 서식이 명시적으로 지워져야 합니다
- 동작이 일관되어야 합니다
- 사용자가 서식이 유지되는 시점을 이해해야 합니다

### 브라우저 비교

- **Chrome/Edge**: 서식이 유지되거나 일관되지 않게 손실될 수 있음
- **Firefox**: 서식이 손실됨 (이 케이스)
- **Safari**: 서식 동작이 가장 일관되지 않음

### 참고 및 해결 방법 가능한 방향

- 목록 항목에서 Enter 키 가로채기
- 새 항목을 만들 때 서식 보존
- 또는 원하는 경우 서식을 명시적으로 지우기
- 서식 유지 동작 문서화
