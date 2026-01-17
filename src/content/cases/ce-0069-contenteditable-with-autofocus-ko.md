---
id: ce-0069-contenteditable-with-autofocus-ko
scenarioId: scenario-autofocus-behavior
locale: ko
os: Windows
osVersion: "11"
device: Desktop or Laptop
deviceVersion: Any
browser: Chrome
browserVersion: "120.0"
keyboard: US
caseTitle: contenteditable에서 autofocus 속성이 작동하지 않음
description: "페이지 로드 시 양식 입력을 자동으로 포커스하는 autofocus 속성이 contenteditable 요소에서 작동하지 않습니다. 페이지 로드 시 contenteditable 영역을 자동으로 포커스하는 내장 방법이 없습니다."
tags:
  - autofocus
  - focus
  - chrome
  - windows
status: draft
---

## 현상

페이지 로드 시 양식 입력을 자동으로 포커스하는 `autofocus` 속성이 contenteditable 요소에서 작동하지 않습니다. 페이지 로드 시 contenteditable 영역을 자동으로 포커스하는 내장 방법이 없습니다.

## 재현 예시

1. `autofocus` 속성이 있는 contenteditable div를 만듭니다.
2. 페이지를 로드합니다.
3. contenteditable이 자동으로 포커스를 받는지 관찰합니다.

## 관찰된 동작

- Windows의 Chrome에서 contenteditable의 `autofocus` 속성이 무시됩니다.
- contenteditable이 자동으로 포커스를 받지 않습니다.
- 수동 JavaScript focus() 호출이 필요합니다.

## 예상 동작

- `autofocus` 속성이 contenteditable에서 작동해야 합니다.
- 또는 contenteditable 영역을 자동 포커스하는 표준 방법이 있어야 합니다.
- 포커스가 양식 입력과 일관되게 처리되어야 합니다.
