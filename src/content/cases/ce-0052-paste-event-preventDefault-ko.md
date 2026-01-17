---
id: ce-0052-paste-event-preventDefault-ko
scenarioId: scenario-paste-event-handling
locale: ko
os: Windows
osVersion: "11"
device: Desktop or Laptop
deviceVersion: Any
browser: Chrome
browserVersion: "120.0"
keyboard: US
caseTitle: paste 이벤트에서 preventDefault가 기본 붙여넣기 동작을 방지하지 않음
description: "Windows의 Chrome에서 paste 이벤트에서 preventDefault()를 호출해도 항상 기본 붙여넣기 동작을 방지하지 않습니다. 방지에도 불구하고 콘텐츠가 여전히 붙여넣어질 수 있습니다."
tags:
  - paste
  - events
  - preventDefault
  - chrome
status: draft
---

## 현상

Windows의 Chrome에서 `paste` 이벤트에서 `preventDefault()`를 호출해도 항상 기본 붙여넣기 동작을 방지하지 않습니다. 방지에도 불구하고 콘텐츠가 여전히 붙여넣어질 수 있습니다.

## 재현 예시

1. contenteditable div를 만듭니다.
2. `event.preventDefault()`를 호출하는 `paste` 이벤트 리스너를 추가합니다.
3. 일부 텍스트를 복사합니다.
4. contenteditable에 붙여넣습니다.
5. 붙여넣기가 방지되는지 관찰합니다.

## 관찰된 동작

- Windows의 Chrome에서 `paste`에 대한 `preventDefault()`가 작동하지 않을 수 있습니다.
- 콘텐츠가 여전히 붙여넣어질 수 있습니다.
- 기본 동작이 일관되게 방지되지 않습니다.

## 예상 동작

- `paste`에 대한 `preventDefault()`는 기본 붙여넣기 동작을 방지해야 합니다.
- 방지되었을 때 콘텐츠가 붙여넣어지지 않아야 합니다.
- 동작이 일관되고 신뢰할 수 있어야 합니다.
