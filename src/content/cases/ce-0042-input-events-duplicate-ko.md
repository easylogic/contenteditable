---
id: ce-0042
scenarioId: scenario-input-event-duplication
locale: ko
os: Windows
osVersion: "11"
device: Desktop or Laptop
deviceVersion: Any
browser: Edge
browserVersion: "120.0"
keyboard: US
caseTitle: 단일 키 입력에 대해 input 이벤트가 여러 번 발생함
description: "Windows의 Edge에서 단일 키 입력에 대해 input 이벤트가 여러 번 발생할 수 있어 이벤트 핸들러가 예상보다 더 많이 실행됩니다. 이로 인해 성능 문제와 잘못된 동작이 발생할 수 있습니다."
tags:
  - input
  - events
  - duplication
  - edge
status: draft
domSteps:
  - label: "Before"
    html: 'Hello'
    description: "기본 텍스트"
  - label: "After Typing 'W' (Bug)"
    html: 'HelloW'
    description: "단일 문자 입력이 input 이벤트를 2-3번 트리거함 (이중/삼중 처리)"
  - label: "✅ Expected"
    html: 'HelloW'
    description: "예상: 단일 문자 입력이 input 이벤트를 한 번만 트리거함"
---

### 현상

Windows의 Edge에서 단일 키 입력에 대해 `input` 이벤트가 여러 번 발생할 수 있어 이벤트 핸들러가 예상보다 더 많이 실행됩니다. 이로 인해 성능 문제와 잘못된 동작이 발생할 수 있습니다.

### 재현 예시

1. contenteditable div를 만듭니다.
2. `input` 이벤트에 대한 이벤트 리스너를 추가하여 각 이벤트를 로그로 기록합니다.
3. 단일 문자를 입력합니다.
4. `input` 이벤트가 몇 번 발생하는지 관찰합니다.

### 관찰된 동작

- Windows의 Edge에서 단일 키 입력에 대해 `input` 이벤트가 2-3번 발생할 수 있습니다.
- 이벤트 핸들러가 불필요하게 여러 번 실행됩니다.
- 이로 인해 성능 저하와 잘못된 애플리케이션 동작이 발생할 수 있습니다.

### 예상 동작

- `input` 이벤트는 사용자 입력 동작당 정확히 한 번 발생해야 합니다.
- 이벤트 중복이 발생하지 않아야 합니다.
- 이벤트가 실제 입력 변경을 정확히 나타내야 합니다.
