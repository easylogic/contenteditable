---
id: ce-0079
scenarioId: scenario-contenteditable-inheritance
locale: ko
os: Windows
osVersion: "11"
device: Desktop or Laptop
deviceVersion: Any
browser: Firefox
browserVersion: "120.0"
keyboard: US
caseTitle: contenteditable 상속 동작이 일관되지 않음
description: "부모 요소에 contenteditable=\"true\"가 있고 자식 요소에 contenteditable=\"false\"가 있을 때 브라우저 간 상속 동작이 일관되지 않습니다. 일부 브라우저는 자식 요소에서 편집을 허용하는 반면 다른 브라우저는 올바르게 방지합니다."
tags:
  - inheritance
  - nested
  - firefox
  - windows
status: draft
---

## 현상

부모 요소에 `contenteditable="true"`가 있고 자식 요소에 `contenteditable="false"`가 있을 때 브라우저 간 상속 동작이 일관되지 않습니다. 일부 브라우저는 자식에서 편집을 허용하는 반면 다른 브라우저는 올바르게 방지합니다. 자식에 `contenteditable="inherit"`가 있거나 contenteditable 속성이 없을 때도 동작이 다를 수 있습니다.

## 재현 예시

1. `contenteditable="true"`가 있는 부모 div를 만듭니다.
2. `contenteditable="false"`가 있는 자식 요소를 추가합니다.
3. `contenteditable="inherit"`가 있는 다른 자식을 추가합니다.
4. contenteditable 속성이 없는 다른 자식을 추가합니다.
5. 각 자식을 편집하려고 시도하고 동작을 관찰합니다.

## 관찰된 동작

- Windows의 Firefox에서 상속 동작이 일관되지 않습니다.
- `contenteditable="false"`가 있는 자식이 여전히 편집 가능할 수 있습니다.
- `contenteditable="inherit"`가 있는 자식이 올바르게 상속하지 않을 수 있습니다.
- 속성이 없는 자식이 편집 가능할 수도 있고 그렇지 않을 수도 있습니다.

## 예상 동작

- `contenteditable="false"`는 항상 편집을 방지해야 합니다.
- `contenteditable="inherit"`는 부모로부터 상속해야 합니다.
- 속성이 없는 자식은 부모로부터 상속해야 합니다.
- 동작이 브라우저 간에 일관되어야 합니다.
