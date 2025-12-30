---
id: ce-0141
scenarioId: scenario-undo-redo-stack
locale: ko
os: Windows
osVersion: "11"
device: Desktop or Laptop
deviceVersion: Any
browser: Chrome
browserVersion: "120.0"
keyboard: US
caseTitle: 실행 취소가 한 번에 여러 작업을 실행 취소할 수 있음
description: "Chrome에서 Ctrl+Z를 눌러 실행 취소할 때 한 번에 하나의 작업 대신 여러 작업이 한 번에 실행 취소될 수 있습니다. 이것은 특정 지점으로 실행 취소하기 어렵게 만듭니다."
tags:
  - undo
  - redo
  - granularity
  - chrome
status: draft
domSteps:
  - label: "Before"
    html: 'Hello'
    description: "Initial text"
  - label: "After Multiple Operations"
    html: 'Hello <strong>World</strong> Test'
    description: "Multiple operations performed (text input, formatting applied, additional input)"
  - label: "After Single Undo (Bug)"
    html: 'Hello'
    description: "Single Ctrl+Z cancels multiple operations at once"
  - label: "✅ Expected"
    html: 'Hello <strong>World</strong> '
    description: "Expected: Single Ctrl+Z cancels only one operation (only last 'Test' cancelled)"
---

### 현상

Chrome에서 Ctrl+Z를 눌러 실행 취소할 때 한 번에 하나의 작업 대신 여러 작업이 한 번에 실행 취소될 수 있습니다. 이것은 특정 지점으로 실행 취소하기 어렵게 만듭니다.

### 재현 예시

1. 여러 문자를 입력합니다
2. 서식을 적용합니다
3. 더 많은 문자를 입력합니다
4. Ctrl+Z를 여러 번 누릅니다

### 관찰된 동작

- 단일 Ctrl+Z가 여러 작업을 실행 취소할 수 있습니다
- 실행 취소 세분성이 일관되지 않습니다
- 특정 지점으로 쉽게 실행 취소할 수 없습니다
- 일부 작업이 함께 그룹화됩니다

### 예상 동작

- 각 Ctrl+Z는 하나의 작업을 실행 취소해야 합니다
- 실행 취소 세분성이 일관되어야 합니다
- 사용자가 정확하게 실행 취소할 수 있어야 합니다
- 작업이 개별적으로 실행 취소 가능해야 합니다

### 브라우저 비교

- **Chrome/Edge**: 여러 작업을 실행 취소할 수 있음 (이 케이스)
- **Firefox**: 유사한 그룹화 동작
- **Safari**: 실행 취소 세분성이 가장 일관되지 않음

### 참고 및 해결 방법 가능한 방향

- 세밀한 세분성이 있는 사용자 정의 실행 취소/다시 실행 구현
- 각 작업 후 상태 저장
- 필요한 경우 작업을 명시적으로 그룹화
- 실행 취소 세분성에 대한 제어 제공
