---
id: ce-0089
scenarioId: scenario-css-contain
locale: ko
os: Windows
osVersion: "11"
device: Desktop or Laptop
deviceVersion: Any
browser: Chrome
browserVersion: "120.0"
keyboard: US
caseTitle: CSS contain 속성이 contenteditable 선택에 영향을 줄 수 있음
description: "contenteditable 요소나 그 부모에 CSS contain 속성이 있을 때 선택 동작이 영향을 받을 수 있습니다. 선택이 포함된 요소를 넘어 확장되지 않을 수 있으며, 캐럿 이동이 제한될 수 있습니다."
tags:
  - css-contain
  - selection
  - chrome
  - windows
status: draft
---

### 현상

contenteditable 요소나 그 부모에 CSS `contain` 속성이 있을 때 선택 동작이 영향을 받을 수 있습니다. 선택이 포함된 요소를 넘어 확장되지 않을 수 있으며, 캐럿 이동이 제한될 수 있습니다.

### 재현 예시

1. `contain: layout style paint`가 있는 contenteditable div를 만듭니다.
2. 요소 경계를 넘어서는 텍스트를 선택하려고 시도합니다.
3. 요소 외부로 캐럿을 이동하려고 시도합니다.
4. 선택 및 캐럿 동작을 관찰합니다.

### 관찰된 동작

- Windows의 Chrome에서 CSS contain이 선택을 제한할 수 있습니다.
- 선택이 포함된 경계를 넘어 확장되지 않을 수 있습니다.
- 캐럿 이동이 제한될 수 있습니다.
- 선택 범위가 무효화될 수 있습니다.

### 예상 동작

- CSS contain이 contenteditable 선택에 영향을 주지 않아야 합니다.
- 또는 동작이 명확하게 문서화되어야 합니다.
- 선택이 포함된 요소 내에서 정상적으로 작동해야 합니다.
