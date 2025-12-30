---
id: ce-0080
scenarioId: scenario-mutation-observer-interference
locale: ko
os: macOS
osVersion: "14.0"
device: Desktop or Laptop
deviceVersion: MacBook Pro
browser: Safari
browserVersion: "17.0"
keyboard: US
caseTitle: MutationObserver가 contenteditable 편집을 방해할 수 있음
description: "MutationObserver가 contenteditable 요소나 그 부모에 연결되어 있을 때 관찰자 콜백이 편집 성능을 방해할 수 있습니다. 입력 중 빈번한 DOM 변형이 많은 관찰자 콜백을 트리거하여 지연이나 버벅임을 일으킬 수 있습니다."
tags:
  - mutation-observer
  - performance
  - editing
  - safari
  - macos
status: draft
---

### 현상

MutationObserver가 contenteditable 요소나 그 부모에 연결되어 있을 때 관찰자 콜백이 편집 성능을 방해할 수 있습니다. 입력 중 빈번한 DOM 변형이 많은 관찰자 콜백을 트리거하여 지연이나 버벅임을 일으킬 수 있습니다.

### 재현 예시

1. contenteditable div를 만듭니다.
2. 모든 변형을 로그로 기록하는 MutationObserver를 연결합니다.
3. contenteditable에서 빠르게 텍스트를 입력합니다.
4. 성능과 지연을 관찰합니다.
5. 관찰자 없이 입력과 비교합니다.

### 관찰된 동작

- macOS의 Safari에서 MutationObserver 콜백이 성능 문제를 일으킬 수 있습니다.
- 빠른 입력이 많은 변형과 콜백을 트리거할 수 있습니다.
- UI가 지연되거나 반응하지 않을 수 있습니다.
- 복잡한 관찰자 로직으로 성능이 저하됩니다.

### 예상 동작

- MutationObserver가 편집 성능에 큰 영향을 주지 않아야 합니다.
- 또는 변형을 일괄 처리하는 방법이 있어야 합니다.
- 콜백이 contenteditable 사용 사례에 최적화되어야 합니다.
