---
id: ce-0085
scenarioId: scenario-file-api
locale: ko
os: macOS
osVersion: "14.0"
device: Desktop or Laptop
deviceVersion: MacBook Pro
browser: Safari
browserVersion: "17.0"
keyboard: US
caseTitle: File API 드래그 앤 드롭이 contenteditable에서 작동하지 않음
description: "contenteditable 요소에 파일을 드래그 앤 드롭하려고 할 때 File API가 예상대로 작동하지 않을 수 있습니다. 파일 드롭 이벤트가 작동하지 않거나 파일 콘텐츠에 접근할 수 없을 수 있습니다."
tags:
  - file-api
  - drag-drop
  - safari
  - macos
status: draft
---

## 현상

contenteditable 요소에 파일을 드래그 앤 드롭하려고 할 때 File API가 예상대로 작동하지 않을 수 있습니다. 파일 드롭 이벤트가 작동하지 않거나 파일 콘텐츠에 접근할 수 없을 수 있습니다.

## 재현 예시

1. contenteditable div를 만듭니다.
2. 파일 시스템에서 contenteditable로 파일을 드래그하려고 시도합니다.
3. 드롭 이벤트를 수신하고 파일 콘텐츠를 읽으려고 시도합니다.
4. 파일을 드롭하고 접근할 수 있는지 관찰합니다.

## 관찰된 동작

- macOS의 Safari에서 파일 드래그 앤 드롭이 contenteditable에서 작동하지 않을 수 있습니다.
- 파일에 대한 드롭 이벤트가 작동하지 않을 수 있습니다.
- 파일 콘텐츠에 접근할 수 없을 수 있습니다.
- 기본 붙여넣기 동작이 방해할 수 있습니다.

## 예상 동작

- 파일 드래그 앤 드롭이 contenteditable에서 작동해야 합니다.
- 드롭 이벤트가 올바르게 작동해야 합니다.
- 파일 콘텐츠가 File API를 통해 접근 가능해야 합니다.
