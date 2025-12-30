---
id: ce-0043
scenarioId: scenario-beforeinput-support
locale: ko
os: macOS
osVersion: "Ubuntu 22.04"
device: Desktop or Laptop
deviceVersion: Any
browser: Safari
browserVersion: "120.0"
keyboard: US
caseTitle: Safari에서 beforeinput 이벤트가 지원되지 않음
description: "DOM에 커밋되기 전에 입력을 가로채고 수정하는 데 중요한 beforeinput 이벤트가 Safari에서 지원되지 않습니다. 이로 인해 사용자 정의 입력 처리를 구현하기 어렵습니다."
tags:
  - beforeinput
  - events
  - safari
  - compatibility
status: draft
---

### 현상

DOM에 커밋되기 전에 입력을 가로채고 수정하는 데 중요한 `beforeinput` 이벤트가 Safari에서 지원되지 않습니다. 이로 인해 모든 브라우저에서 작동하는 사용자 정의 입력 처리를 구현하기 어렵습니다.

### 재현 예시

1. contenteditable div를 만듭니다.
2. `beforeinput` 이벤트에 대한 이벤트 리스너를 추가합니다.
3. 일부 텍스트를 입력합니다.
4. `beforeinput` 이벤트가 발생하는지 관찰합니다.

### 관찰된 동작

- macOS의 Safari에서 `beforeinput` 이벤트가 발생하지 않습니다.
- `beforeinput`에 대한 이벤트 리스너가 호출되지 않습니다.
- 대안 접근법을 사용해야 하지만 덜 신뢰할 수 있습니다.

### 예상 동작

- `beforeinput` 이벤트가 모든 최신 브라우저에서 지원되어야 합니다.
- 이벤트가 입력이 DOM에 커밋되기 전에 발생해야 합니다.
- 기본 입력 동작을 방지하거나 수정하는 방법을 제공해야 합니다.
