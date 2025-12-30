---
id: ce-0129
scenarioId: scenario-undo-redo-stack
locale: ko
os: Windows
osVersion: "11"
device: Desktop or Laptop
deviceVersion: Any
browser: Chrome
browserVersion: "120.0"
keyboard: US
caseTitle: 포커스 변경 시 실행 취소 스택이 예상치 못하게 지워짐
description: "contenteditable 요소가 포커스를 잃고 다시 얻을 때 실행 취소 스택이 예상치 못하게 지워질 수 있습니다. 사용자는 포커스 변경 전에 수행된 작업을 실행 취소할 수 없습니다."
tags:
  - undo
  - redo
  - focus
  - chrome
status: draft
domSteps:
  - label: "Before Blur"
    html: 'Hello World Test'
    description: "Multiple editing operations completed"
  - label: "After Blur and Focus"
    html: 'Hello World Test'
    description: "After focus change, undo stack initialized"
  - label: "After Undo (Bug)"
    html: 'Hello World Test'
    description: "Undo not possible, cannot cancel previous operations"
  - label: "✅ Expected"
    html: 'Hello World'
    description: "Expected: Previous operations can be cancelled with Undo"
---

### 현상

contenteditable 요소가 포커스를 잃고 다시 얻을 때 실행 취소 스택이 예상치 못하게 지워질 수 있습니다. 사용자는 포커스 변경 전에 수행된 작업을 실행 취소할 수 없습니다.

### 재현 예시

1. contenteditable에서 여러 편집을 수행합니다
2. 외부를 클릭하여 요소를 블러합니다
3. 다시 클릭하여 요소에 포커스합니다
4. 실행 취소를 위해 Ctrl+Z를 누릅니다

### 관찰된 동작

- 실행 취소 스택이 지워집니다
- 이전 작업을 실행 취소할 수 없습니다
- 실행 취소 기록이 손실됩니다
- 사용자가 실행 취소 능력을 잃습니다

### 예상 동작

- 실행 취소 스택이 포커스 변경을 통해 보존되어야 합니다
- 또는 동작이 예측 가능해야 합니다
- 사용자가 이전 작업을 실행 취소할 수 있어야 합니다
- 기록이 유지되어야 합니다

### 브라우저 비교

- **Chrome/Edge**: 스택이 지워질 수 있음 (이 케이스)
- **Firefox**: 유사한 스택 지우기 동작
- **Safari**: 스택 지우기가 가장 예측 불가능함

### 참고 및 해결 방법 가능한 방향

- 포커스에 걸쳐 지속되는 사용자 정의 실행 취소/다시 실행 구현
- 메모리에 실행 취소 스택 저장
- 요소가 포커스를 다시 얻을 때 스택 복원
- 사용자에게 실행 취소 스택 동작 문서화
