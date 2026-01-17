---
id: ce-0051-contenteditable-in-shadow-dom-ko
scenarioId: scenario-contenteditable-shadow-dom
locale: ko
os: macOS
osVersion: "Ubuntu 22.04"
device: Desktop or Laptop
deviceVersion: Any
browser: Chrome
browserVersion: "120.0"
keyboard: US
caseTitle: Shadow DOM 내부에서 contenteditable이 올바르게 작동하지 않음
description: "contenteditable 영역이 Shadow DOM 내부에 있을 때 동작이 손상되거나 일관되지 않을 수 있습니다. 선택, 포커스 및 편집이 예상대로 작동하지 않을 수 있습니다."
tags:
  - shadow-dom
  - contenteditable
  - isolation
  - chrome
status: draft
---

## 현상

contenteditable 영역이 Shadow DOM 내부에 있을 때 동작이 손상되거나 일관되지 않을 수 있습니다. 선택, 포커스 및 편집이 예상대로 작동하지 않을 수 있습니다.

## 재현 예시

1. Shadow DOM이 있는 사용자 정의 요소를 만듭니다.
2. Shadow DOM 내부에 contenteditable div를 만듭니다.
3. contenteditable과 상호작용을 시도합니다 (입력, 선택 등).
4. 동작을 관찰합니다.

## 관찰된 동작

- macOS의 Chrome에서 contenteditable이 Shadow DOM 내부에서 올바르게 작동하지 않을 수 있습니다.
- 선택이 손상될 수 있습니다.
- 포커스가 작동하지 않을 수 있습니다.
- 이벤트가 올바르게 발생하지 않을 수 있습니다.

## 예상 동작

- contenteditable은 Shadow DOM 내부에서 올바르게 작동해야 합니다.
- 선택과 포커스가 예상대로 작동해야 합니다.
- 이벤트가 올바르게 발생하고 버블링되어야 합니다.
