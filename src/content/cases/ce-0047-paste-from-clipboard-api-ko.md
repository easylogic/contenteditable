---
id: ce-0047-paste-from-clipboard-api-ko
scenarioId: scenario-clipboard-api
locale: ko
os: macOS
osVersion: "Ubuntu 22.04"
device: Desktop or Laptop
deviceVersion: Any
browser: Chrome
browserVersion: "120.0"
keyboard: US
caseTitle: Clipboard API 붙여넣기가 contenteditable에서 작동하지 않음
description: "Clipboard API(navigator.clipboard.readText() 또는 navigator.clipboard.read())를 사용하여 contenteditable 영역에 프로그래밍 방식으로 콘텐츠를 붙여넣을 때 붙여넣기 작업이 실패하거나 paste 이벤트를 트리거하지 않을 수 있습니다."
tags:
  - clipboard
  - api
  - paste
  - chrome
status: draft
---

## 현상

Clipboard API(`navigator.clipboard.readText()` 또는 `navigator.clipboard.read()`)를 사용하여 contenteditable 영역에 프로그래밍 방식으로 콘텐츠를 붙여넣을 때 붙여넣기 작업이 실패하거나 예상대로 작동하지 않을 수 있습니다.

## 재현 예시

1. contenteditable div를 만듭니다.
2. 클립보드에 일부 텍스트를 복사합니다.
3. JavaScript를 사용하여 클립보드에서 읽습니다: `await navigator.clipboard.readText()`.
4. 텍스트를 contenteditable에 삽입하려고 시도합니다.
5. 붙여넣기가 올바르게 작동하는지 관찰합니다.

## 관찰된 동작

- macOS의 Chrome에서 Clipboard API 작업이 contenteditable 컨텍스트에서 실패할 수 있습니다.
- 권한 오류가 발생할 수 있습니다.
- 붙여넣기가 예상 이벤트나 동작을 트리거하지 않을 수 있습니다.

## 예상 동작

- Clipboard API는 contenteditable 컨텍스트에서 안정적으로 작동해야 합니다.
- 권한이 올바르게 처리되어야 합니다.
- 붙여넣기 작업이 적절한 이벤트를 트리거해야 합니다.
