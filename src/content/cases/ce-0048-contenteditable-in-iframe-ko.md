---
id: ce-0048
scenarioId: scenario-contenteditable-iframe
locale: ko
os: Windows
osVersion: "11"
device: Desktop or Laptop
deviceVersion: Any
browser: Edge
browserVersion: "120.0"
keyboard: US
caseTitle: iframe 내부에서 contenteditable 동작이 다름
description: "contenteditable 영역이 iframe 내부에 있을 때 메인 문서에 있을 때와 동작이 다를 수 있습니다. 선택, 포커스 및 이벤트 처리가 일관되지 않을 수 있습니다."
tags:
  - iframe
  - contenteditable
  - isolation
  - edge
status: draft
---

## 현상

contenteditable 영역이 iframe 내부에 있을 때 메인 문서에 있을 때와 동작이 다를 수 있습니다. 선택, 포커스 및 이벤트 처리가 일관되지 않을 수 있습니다.

## 재현 예시

1. iframe을 만듭니다.
2. iframe 내부에 contenteditable div를 만듭니다.
3. contenteditable과 상호작용을 시도합니다 (입력, 선택 등).
4. 메인 문서의 contenteditable과 동작을 비교합니다.

## 관찰된 동작

- Windows의 Edge에서 iframe 내부의 contenteditable 동작이 다릅니다.
- 선택이 올바르게 작동하지 않을 수 있습니다.
- 포커스 처리가 일관되지 않을 수 있습니다.
- 이벤트가 올바르게 버블링되지 않을 수 있습니다.

## 예상 동작

- contenteditable은 메인 문서에 있든 iframe에 있든 동일하게 동작해야 합니다.
- 선택과 포커스가 일관되게 작동해야 합니다.
- 이벤트가 예상대로 동작해야 합니다.
