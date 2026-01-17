---
id: ce-0077-contenteditable-with-web-components-ko
scenarioId: scenario-web-components-integration
locale: ko
os: Windows
osVersion: "11"
device: Desktop or Laptop
deviceVersion: Any
browser: Chrome
browserVersion: "120.0"
keyboard: US
caseTitle: Web Components 내부에서 contenteditable 동작이 다름
description: "contenteditable 요소가 Web Component(사용자 정의 요소) 내부에 있을 때 표준 HTML에 있을 때와 동작이 다를 수 있습니다. 이벤트 처리, 선택 및 포커스 관리가 Shadow DOM 격리로 인해 영향을 받을 수 있습니다."
tags:
  - web-components
  - custom-elements
  - chrome
  - windows
status: draft
---

## 현상

contenteditable 요소가 Web Component(사용자 정의 요소) 내부에 있을 때 표준 HTML에 있을 때와 동작이 다를 수 있습니다. 이벤트 처리, 선택 및 포커스 관리가 컴포넌트의 shadow DOM 또는 캡슐화로 인해 영향을 받을 수 있습니다.

## 재현 예시

1. 사용자 정의 Web Component를 만듭니다.
2. 컴포넌트 내부에 contenteditable div를 만듭니다.
3. contenteditable과 상호작용을 시도합니다 (입력, 선택 등).
4. 이벤트 처리 및 선택 동작을 관찰합니다.
5. 컴포넌트 외부의 contenteditable과 비교합니다.

## 관찰된 동작

- Windows의 Chrome에서 Web Components 내부의 contenteditable 동작이 다를 수 있습니다.
- 이벤트가 shadow DOM 경계를 통해 올바르게 버블링되지 않을 수 있습니다.
- 선택이 캡슐화로 인해 영향을 받을 수 있습니다.
- 포커스 관리가 일관되지 않을 수 있습니다.

## 예상 동작

- contenteditable은 Web Components 내부와 외부에서 동일하게 동작해야 합니다.
- 이벤트가 shadow DOM 경계를 넘어 올바르게 작동해야 합니다.
- 선택과 포커스가 일관되게 작동해야 합니다.
