---
id: ce-0050-delete-key-behavior-ko
scenarioId: scenario-delete-key-behavior
locale: ko
os: Linux
osVersion: "Ubuntu 22.04"
device: Desktop or Laptop
deviceVersion: Any
browser: Firefox
browserVersion: "120.0"
keyboard: US
caseTitle: Delete 키 동작이 Backspace와 일관되지 않음
description: "Linux의 Firefox에서 Delete 키가 Backspace와 일관되지 않은 방식으로 다르게 동작합니다. Delete가 다른 양의 텍스트를 제거하거나 Backspace와 비교하여 예상치 못하게 동작할 수 있습니다."
tags:
  - delete
  - backspace
  - consistency
  - firefox
status: draft
domSteps:
  - label: "Before"
    html: 'Hello|World'
    description: "텍스트, 커서(|)가 'Hello'와 'World' 사이에 있음"
  - label: "After Backspace"
    html: 'Hell|World'
    description: "Backspace가 'o' 삭제 (뒤로 삭제)"
  - label: "After Delete (Bug)"
    html: 'Hello|orld'
    description: "Delete가 'W' 삭제 (앞으로 삭제), 하지만 일관되지 않음"
  - label: "✅ Expected"
    html: 'Hello|orld'
    description: "예상: Delete가 'W' 삭제, Backspace와 일관된 동작"
---

## 현상

Linux의 Firefox에서 Delete 키가 Backspace와 일관되지 않은 방식으로 다르게 동작합니다. Delete가 다른 양의 텍스트를 제거하거나 Backspace와 비교하여 예상치 못하게 동작할 수 있습니다.

## 재현 예시

1. contenteditable div를 만듭니다.
2. 일부 텍스트를 입력합니다.
3. 텍스트 중간에 캐럿을 배치합니다.
4. Backspace를 누르고 무엇이 삭제되는지 관찰합니다.
5. Delete를 누르고 무엇이 삭제되는지 관찰합니다.
6. 동작을 비교합니다.

## 관찰된 동작

- Linux의 Firefox에서 Delete와 Backspace가 다른 양의 텍스트를 삭제할 수 있습니다.
- 삭제 세분성이 일관되지 않을 수 있습니다.
- Delete가 특정 컨텍스트에서 예상치 못하게 동작할 수 있습니다.

## 예상 동작

- Delete는 캐럿 뒤의 문자를 제거해야 합니다 (앞으로 삭제).
- Backspace는 캐럿 앞의 문자를 제거해야 합니다 (뒤로 삭제).
- 둘 다 일관되고 예측 가능한 동작을 가져야 합니다.
