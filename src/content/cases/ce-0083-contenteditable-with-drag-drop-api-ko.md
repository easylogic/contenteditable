---
id: ce-0083
scenarioId: scenario-drag-drop-api
locale: ko
os: macOS
osVersion: "14.0"
device: Desktop or Laptop
deviceVersion: MacBook Pro
browser: Chrome
browserVersion: "120.0"
keyboard: US
caseTitle: Drag and Drop API 동작이 contenteditable에서 다름
description: "HTML5 Drag and Drop API를 contenteditable 요소와 함께 사용할 때 동작이 표준 요소와 다릅니다. contenteditable 내에서 텍스트를 드래그하는 것이 예상대로 작동하지 않을 수 있으며, 드롭 영역이 올바르게 인식되지 않을 수 있습니다."
tags:
  - drag-drop
  - api
  - chrome
  - macos
status: draft
---

## 현상

HTML5 Drag and Drop API를 contenteditable 요소와 함께 사용할 때 동작이 표준 요소와 다릅니다. contenteditable 내에서 텍스트를 드래그하는 것이 예상대로 작동하지 않을 수 있으며, 드롭 영역이 올바르게 인식되지 않을 수 있습니다.

## 재현 예시

1. 내부에 드래그 가능한 텍스트가 있는 contenteditable div를 만듭니다.
2. contenteditable 내에서 텍스트를 드래그하려고 시도합니다.
3. 외부에서 contenteditable로 텍스트를 드래그하려고 시도합니다.
4. 드래그 앤 드롭 이벤트 처리를 관찰합니다.

## 관찰된 동작

- macOS의 Chrome에서 contenteditable의 드래그 앤 드롭 동작이 일관되지 않습니다.
- contenteditable 내에서 텍스트를 드래그하는 것이 작동하지 않을 수 있습니다.
- 드롭 이벤트가 올바르게 작동하지 않을 수 있습니다.
- 기본 드래그 동작이 편집을 방해할 수 있습니다.

## 예상 동작

- 드래그 앤 드롭이 contenteditable에서 일관되게 작동해야 합니다.
- 이벤트가 올바르게 작동해야 합니다.
- 기본 동작이 편집을 방해하지 않아야 합니다.
