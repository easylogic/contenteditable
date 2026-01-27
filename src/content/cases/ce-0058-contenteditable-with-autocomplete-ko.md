---
id: ce-0058-contenteditable-with-autocomplete-ko
scenarioId: scenario-ime-interaction-patterns
locale: ko
os: macOS
osVersion: "Ubuntu 22.04"
device: Desktop or Laptop
deviceVersion: Any
browser: Chrome
browserVersion: "120.0"
keyboard: US
caseTitle: contenteditable에 대해 자동 완성 제안이 나타나지 않음
description: "브라우저 자동 완성 제안(양식, 주소 등)은 적절한 autocomplete 속성이 설정되어 있어도 contenteditable 영역에서 입력할 때 나타나지 않습니다. 이는 양식과 같은 입력에 대한 contenteditable의 유용성을 제한합니다."
tags:
  - autocomplete
  - suggestions
  - chrome
status: draft
---

## 현상

브라우저 자동 완성 제안(양식, 주소 등)은 적절한 `autocomplete` 속성이 설정되어 있어도 contenteditable 영역에서 입력할 때 나타나지 않습니다. 이는 양식과 같은 입력에 대한 contenteditable의 유용성을 제한합니다.

## 재현 예시

1. `autocomplete="name"`이 있는 contenteditable div를 만듭니다.
2. 이전에 양식에 입력한 이름을 입력하기 시작합니다.
3. 자동 완성 제안이 나타나는지 관찰합니다.

## 관찰된 동작

- macOS의 Chrome에서 contenteditable에 대해 자동 완성 제안이 나타나지 않습니다.
- `autocomplete` 속성이 무시됩니다.
- 사용자가 브라우저 자동 완성 기능의 이점을 얻을 수 없습니다.

## 예상 동작

- 적절한 속성이 설정되어 있을 때 contenteditable에 대해 자동 완성 제안이 나타나야 합니다.
- 동작이 표준 입력 요소와 일치해야 합니다.
- 양식과 같은 contenteditable 영역은 자동 완성을 지원해야 합니다.
