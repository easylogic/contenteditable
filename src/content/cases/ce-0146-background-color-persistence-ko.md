---
id: ce-0146
scenarioId: scenario-background-color-change
locale: ko
os: Windows
osVersion: "11"
device: Desktop or Laptop
deviceVersion: Any
browser: Chrome
browserVersion: "120.0"
keyboard: US
caseTitle: 적용 후 입력 시 배경색이 유지되지 않음
description: "Chrome에서 선택한 텍스트에 배경색을 적용한 후 계속 입력하면 새 텍스트가 배경색을 상속하지 않습니다. 새로 입력된 문자에 대해 배경 서식이 손실됩니다."
tags:
  - color
  - background
  - persistence
  - chrome
status: draft
domSteps:
  - label: "Before"
    html: 'Hello World'
    description: "Basic text"
  - label: "After Background Color"
    html: 'Hello <span style="background-color: yellow;">World</span>'
    description: "Background color applied (yellow)"
  - label: "After Typing (Bug)"
    html: 'Hello <span style="background-color: yellow;">World</span> New'
    description: "Newly typed text does not have background color applied"
  - label: "✅ Expected"
    html: 'Hello <span style="background-color: yellow;">World New</span>'
    description: "Expected: Newly typed text also inherits background color"
---

### 현상

Chrome에서 선택한 텍스트에 배경색을 적용한 후 계속 입력하면 새 텍스트가 배경색을 상속하지 않습니다. 새로 입력된 문자에 대해 배경 서식이 손실됩니다.

### 재현 예시

1. contenteditable 요소에서 일부 텍스트를 선택합니다
2. 배경색을 적용합니다 (예: 노란색 하이라이트)
3. 하이라이트된 텍스트 뒤에 커서를 놓습니다
4. 새 텍스트를 입력합니다

### 관찰된 동작

- 새로 입력된 텍스트에 배경색이 없습니다
- 새 텍스트에 대해 배경 서식이 유지되지 않습니다
- 이것은 유지될 수 있는 텍스트 색상과 다릅니다
- 사용자가 각 새 텍스트 세그먼트에 대해 배경을 다시 적용해야 합니다

### 예상 동작

- 새로 입력된 텍스트가 배경색을 상속해야 합니다
- 또는 동작이 텍스트 색상과 일관되어야 합니다
- 배경 서식이 명시적으로 변경될 때까지 유지되어야 합니다
- 동작이 예측 가능해야 합니다

### 브라우저 비교

- **Chrome/Edge**: 배경이 유지되지 않음 (이 케이스)
- **Firefox**: 유사한 동작
- **Safari**: 배경 유지가 다양함

### 참고 및 해결 방법 가능한 방향

- 텍스트 삽입을 가로채고 배경색 적용
- 텍스트 삽입을 감지하기 위해 `beforeinput` 이벤트 사용
- 새로 삽입된 텍스트에 배경 스타일 적용
- 현재 입력 위치에 대한 배경색 상태 유지
