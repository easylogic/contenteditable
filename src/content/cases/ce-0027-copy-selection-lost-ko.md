---
id: ce-0027-copy-selection-lost-ko
scenarioId: scenario-copy-selection-behavior
locale: ko
os: macOS
osVersion: "Ubuntu 22.04"
device: Desktop or Laptop
deviceVersion: Any
browser: Safari
browserVersion: "120.0"
keyboard: US
caseTitle: contenteditable에서 콘텐츠 복사 후 선택이 손실됨
description: "Cmd+C를 사용하여 contenteditable 영역에서 선택한 텍스트를 복사한 후 Safari에서 선택이 손실됩니다. 사용자는 추가 작업을 수행하기 위해 텍스트를 다시 선택해야 합니다."
tags:
  - copy
  - selection
  - safari
status: draft
domSteps:
  - label: "Before Copy"
    html: 'Hello <span style="background: #bfdbfe;">World</span> Test'
    description: "텍스트 선택됨 (World 강조 표시)"
  - label: "After Copy (Bug)"
    html: 'Hello World| Test'
    description: "복사 후 선택이 지워지고 커서로 축소됨"
  - label: "✅ Expected"
    html: 'Hello <span style="background: #bfdbfe;">World</span> Test'
    description: "예상: 복사 후 선택 상태 유지"
---

## 현상

Cmd+C를 사용하여 contenteditable 영역에서 선택한 텍스트를 복사한 후 Safari에서 선택이 손실됩니다. 사용자는 추가 작업을 수행하기 위해 텍스트를 다시 선택해야 합니다.

## 재현 예시

1. 일부 텍스트가 있는 contenteditable div를 만듭니다.
2. 텍스트의 일부를 선택합니다.
3. 선택을 복사합니다 (Cmd+C).
4. 선택이 유지되는지 관찰합니다.

## 관찰된 동작

- macOS의 Safari에서 복사 후 선택이 손실됩니다.
- 캐럿이 예상치 못한 위치로 이동할 수 있습니다.
- 사용자가 편집을 계속하려면 수동으로 텍스트를 다시 선택해야 합니다.

## 예상 동작

- 복사 후 선택이 유지되어야 합니다.
- 사용자가 선택한 텍스트로 계속 작업할 수 있어야 합니다.
- 또는 복사 작업 후 캐럿이 예측 가능한 위치에 배치되어야 합니다.
