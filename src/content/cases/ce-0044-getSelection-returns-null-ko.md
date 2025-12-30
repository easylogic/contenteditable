---
id: ce-0044
scenarioId: scenario-selection-api-behavior
locale: ko
os: macOS
osVersion: "Ubuntu 22.04"
device: Desktop or Laptop
deviceVersion: Any
browser: Safari
browserVersion: "120.0"
keyboard: US
caseTitle: contenteditable이 포커스를 잃을 때 window.getSelection()이 null을 반환함
description: "contenteditable 영역이 포커스를 잃을 때 Safari에서 window.getSelection()이 null을 반환할 수 있으며, 포커스 손실 전에 유효한 선택이 있었더라도 그렇습니다. 이로 인해 선택 상태를 보존하거나 작업하기 어렵습니다."
tags:
  - selection
  - api
  - focus
  - safari
status: draft
---

## 현상

contenteditable 영역이 포커스를 잃을 때 Safari에서 `window.getSelection()`이 `null`을 반환할 수 있으며, 포커스 손실 전에 유효한 선택이 있었더라도 그렇습니다. 이로 인해 선택을 보존하거나 작업하기 어렵습니다.

## 재현 예시

1. contenteditable div를 만듭니다.
2. 그 안에서 일부 텍스트를 선택합니다.
3. contenteditable 외부를 클릭하여 포커스를 제거합니다.
4. `window.getSelection()`을 호출합니다.
5. 반환 값을 관찰합니다.

## 관찰된 동작

- macOS의 Safari에서 포커스 손실 후 `window.getSelection()`이 `null`을 반환합니다.
- 선택 정보가 손실됩니다.
- 이전 선택 상태를 검색할 방법이 없습니다.

## 예상 동작

- `window.getSelection()`은 포커스 손실 후에도 유효한 Selection 객체를 반환해야 합니다.
- 또는 포커스 손실 전에 선택 상태를 보존하는 방법이 있어야 합니다.
- 선택 정보는 필요할 때 접근 가능해야 합니다.
