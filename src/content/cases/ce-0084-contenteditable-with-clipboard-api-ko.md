---
id: ce-0084
scenarioId: scenario-clipboard-api
locale: ko
os: Windows
osVersion: "11"
device: Desktop or Laptop
deviceVersion: Any
browser: Firefox
browserVersion: "120.0"
keyboard: US
caseTitle: Clipboard API 읽기/쓰기가 contenteditable에서 일관되게 작동하지 않음
description: "Clipboard API(navigator.clipboard.readText/writeText)를 contenteditable 요소와 함께 사용할 때 동작이 일관되지 않을 수 있습니다. 붙여넣기 이벤트 중 클립보드 콘텐츠 읽기가 작동하지 않을 수 있으며, 클립보드에 쓰기가 서식을 보존하지 않을 수 있습니다."
tags:
  - clipboard-api
  - paste
  - firefox
  - windows
status: draft
---

### 현상

Clipboard API(navigator.clipboard.readText/writeText)를 contenteditable 요소와 함께 사용할 때 동작이 일관되지 않을 수 있습니다. 붙여넣기 이벤트 중 클립보드 콘텐츠 읽기가 작동하지 않을 수 있으며, 클립보드에 서식이 있는 콘텐츠를 쓰는 것이 서식을 보존하지 않을 수 있습니다.

### 재현 예시

1. contenteditable div를 만듭니다.
2. 붙여넣기 이벤트를 수신합니다.
3. Clipboard API를 사용하여 클립보드 콘텐츠를 읽으려고 시도합니다.
4. 서식이 있는 콘텐츠를 클립보드에 쓰려고 시도합니다.
5. 오류나 불일치를 관찰합니다.

### 관찰된 동작

- Windows의 Firefox에서 Clipboard API가 contenteditable과 올바르게 작동하지 않을 수 있습니다.
- 붙여넣기 중 클립보드 읽기가 사용자 제스처가 필요할 수 있습니다.
- 서식이 있는 콘텐츠 쓰기가 HTML을 보존하지 않을 수 있습니다.
- 권한이 일관되지 않게 필요할 수 있습니다.

### 예상 동작

- Clipboard API가 contenteditable과 원활하게 작동해야 합니다.
- 읽기가 붙여넣기 이벤트 중에 작동해야 합니다.
- 쓰기가 적절할 때 서식을 보존해야 합니다.
