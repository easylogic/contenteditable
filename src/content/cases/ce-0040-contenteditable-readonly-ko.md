---
id: ce-0040
scenarioId: scenario-contenteditable-readonly
locale: ko
os: Any
osVersion: "Ubuntu 22.04"
device: Desktop or Laptop
deviceVersion: Any
browser: Chrome
browserVersion: "120.0"
keyboard: US
caseTitle: 자식 요소의 contenteditable="false"가 일관되게 존중되지 않음
description: "contenteditable 영역에 contenteditable=\"false\"가 있는 자식 요소가 포함되어 있을 때 동작이 일관되지 않습니다. 일부 브라우저는 이러한 요소 내에서 편집을 허용하는 반면, 다른 브라우저는 올바르게 편집을 방지합니다."
tags:
  - readonly
  - nested
  - contenteditable
  - chrome
status: draft
---

## 현상

contenteditable 영역에 `contenteditable="false"`가 있는 자식 요소가 포함되어 있을 때 동작이 일관되지 않습니다. 일부 브라우저는 이러한 요소 내에서 편집을 허용하는 반면, 다른 브라우저는 올바르게 편집을 방지합니다.

## 재현 예시

1. contenteditable div를 만듭니다.
2. 그 안에 `contenteditable="false"`가 있는 자식 요소를 추가합니다:
   ```html
   <div contenteditable="true">
     <p>Editable text</p>
     <p contenteditable="false">This should not be editable</p>
   </div>
   ```
3. `contenteditable="false"`가 있는 자식 요소의 텍스트를 편집하려고 시도합니다.
4. 편집이 방지되는지 관찰합니다.

## 관찰된 동작

- Chrome에서 `contenteditable="false"`가 있는 자식 요소가 여전히 편집 가능할 수 있습니다.
- 속성이 일관되게 존중되지 않습니다.
- 읽기 전용이어야 하는 요소 내에서 선택 및 편집이 작동할 수 있습니다.

## 예상 동작

- `contenteditable="false"`가 있는 요소는 편집 가능하지 않아야 합니다.
- 부모 요소 상태에 관계없이 속성이 존중되어야 합니다.
- 읽기 전용 요소 내에서 선택은 허용되어야 하지만 편집은 방지되어야 합니다.
