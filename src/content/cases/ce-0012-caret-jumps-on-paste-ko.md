---
id: ce-0012
scenarioId: scenario-caret-position-after-paste
locale: ko
os: Windows
osVersion: "11"
device: Desktop or Laptop
deviceVersion: Any
browser: Firefox
browserVersion: "120.0"
keyboard: US
caseTitle: 콘텐츠 붙여넣기 후 캐럿 위치가 예상치 못하게 점프함
description: "contenteditable 영역에 콘텐츠를 붙여넣은 후 캐럿 위치가 예상 위치에 도달하지 않으며, 때로는 붙여넣은 콘텐츠의 시작 부분이나 예상치 못한 위치로 점프합니다."
tags:
  - paste
  - caret
  - position
  - firefox
status: draft
domSteps:
  - label: "Before"
    html: 'Hello| World'
    description: "텍스트, 커서(|)가 중간 위치에 있음"
  - label: "After Paste (Bug)"
    html: 'Hello New Text| World'
    description: "붙여넣기 후 커서가 붙여넣은 콘텐츠의 시작 부분으로 이동"
  - label: "✅ Expected"
    html: 'Hello New Text| World'
    description: "예상: 커서가 붙여넣은 콘텐츠 끝에 위치"
---

### 현상

contenteditable 영역에 콘텐츠를 붙여넣은 후 캐럿 위치가 예상 위치에 도달하지 않으며, 때로는 붙여넣은 콘텐츠의 시작 부분이나 예상치 못한 위치로 점프합니다.

### 재현 예시

1. 기존 텍스트가 있는 contenteditable div를 만듭니다.
2. 텍스트 중간에 캐럿을 배치합니다.
3. 콘텐츠를 붙여넣습니다 (Ctrl+V 또는 Cmd+V).
4. 최종 캐럿 위치를 관찰합니다.

### 관찰된 동작

- Windows의 Firefox에서 캐럿이 때로는 붙여넣은 콘텐츠 뒤가 아닌 시작 부분에 위치합니다.
- 붙여넣기 후 선택 범위가 일관되지 않습니다.

### 예상 동작

- 캐럿이 붙여넣은 콘텐츠 바로 뒤에 위치해야 합니다.
