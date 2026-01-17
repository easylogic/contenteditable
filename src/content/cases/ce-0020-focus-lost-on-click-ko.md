---
id: ce-0020-focus-lost-on-click-ko
scenarioId: scenario-focus-management
locale: ko
os: Windows
osVersion: "11"
device: Desktop or Laptop
deviceVersion: Any
browser: Firefox
browserVersion: "120.0"
keyboard: US
caseTitle: contenteditable 내부의 특정 요소를 클릭할 때 포커스가 손실됨
description: "contenteditable 영역에 대화형 요소(버튼, 링크 등)가 포함되어 있을 때 이러한 요소를 클릭하면 contenteditable이 포커스를 잃습니다. 이는 편집 흐름을 방해하고 캐럿이 사라질 수 있습니다."
tags:
  - focus
  - click
  - firefox
status: draft
domSteps:
  - label: "Before"
    html: '<div contenteditable="true">Hello <button>Button</button> World|</div>'
    description: "contenteditable 내부의 버튼, 커서(|)가 'World' 뒤에 있음"
  - label: "After Click Button (Bug)"
    html: '<div contenteditable="true">Hello <button>Button</button> World</div>'
    description: "버튼 클릭 후 contenteditable 포커스 손실, 커서 사라짐"
  - label: "✅ Expected"
    html: '<div contenteditable="true">Hello <button>Button</button> World|</div>'
    description: "예상: 버튼 클릭 후 contenteditable 포커스 유지"
---

## 현상

contenteditable 영역에 대화형 요소(버튼, 링크 등)가 포함되어 있을 때 이러한 요소를 클릭하면 contenteditable이 포커스를 잃습니다. 이는 편집 흐름을 방해하고 캐럿이 사라질 수 있습니다.

## 재현 예시

1. contenteditable div를 만듭니다.
2. 그 안에 버튼이나 링크 요소를 추가합니다.
3. contenteditable에서 입력을 시작합니다.
4. 버튼이나 링크를 클릭합니다.
5. 포커스가 contenteditable에서 이동하는 것을 관찰합니다.

## 관찰된 동작

- Windows의 Firefox에서 대화형 요소를 클릭하면 contenteditable에서 포커스가 제거됩니다.
- 캐럿이 사라집니다.
- 더 이상 입력해도 contenteditable에 텍스트가 삽입되지 않습니다.
- 포커스를 수동으로 복원해야 합니다.

## 예상 동작

- contenteditable 내부의 대화형 요소는 부모의 포커스를 제거하지 않고 클릭 가능해야 합니다.
- 또는 중첩된 요소와 상호작용한 후 포커스를 쉽게 복원할 수 있어야 합니다.
- 편집 상태가 보존되어야 합니다.
