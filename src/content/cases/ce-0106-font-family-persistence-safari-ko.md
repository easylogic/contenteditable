---
id: ce-0106
scenarioId: scenario-font-family-change
locale: ko
os: macOS
osVersion: "14.0"
device: Desktop or Laptop
deviceVersion: Any
browser: Safari
browserVersion: "17.0"
keyboard: US
caseTitle: Safari에서 적용 후 입력 시 글꼴 패밀리가 유지되지 않음
description: "Safari에서 선택한 텍스트에 글꼴 패밀리를 적용한 후 계속 입력하면 새 텍스트가 글꼴 패밀리를 상속하지 않습니다. 새로 입력된 문자에 대해 글꼴 서식이 손실됩니다."
tags:
  - font
  - typography
  - safari
status: draft
domSteps:
  - label: "Before"
    html: '<span style="font-family: Arial;">Hello</span>|'
    description: "Text with Arial font applied, cursor (|) at the end"
  - label: "After Typing (Bug)"
    html: '<span style="font-family: Arial;">Hello</span>World'
    description: "Newly typed text uses default font (Arial not inherited)"
  - label: "✅ Expected"
    html: '<span style="font-family: Arial;">HelloWorld</span>'
    description: "Expected: Newly typed text also inherits Arial font"
---

### 현상

Safari에서 선택한 텍스트에 글꼴 패밀리를 적용한 후 계속 입력하면 새 텍스트가 글꼴 패밀리를 상속하지 않습니다. 새로 입력된 문자에 대해 글꼴 서식이 손실됩니다.

### 재현 예시

1. contenteditable 요소에서 일부 텍스트를 선택합니다
2. 글꼴 패밀리를 적용합니다 (예: "Arial")
3. 서식이 지정된 텍스트 뒤에 커서를 놓습니다
4. 새 텍스트를 입력합니다

### 관찰된 동작

- 새로 입력된 텍스트가 적용된 글꼴이 아닌 기본 글꼴을 사용합니다
- 새 텍스트에 대해 글꼴 서식이 유지되지 않습니다
- 글꼴이 유지되는 Chrome/Edge와 다릅니다
- 사용자가 각 새 텍스트 세그먼트에 대해 글꼴을 다시 적용해야 합니다

### 예상 동작

- 새로 입력된 텍스트가 글꼴 패밀리를 상속해야 합니다
- 글꼴 서식이 명시적으로 변경될 때까지 유지되어야 합니다
- 동작이 Chrome/Edge와 일관되어야 합니다

### 브라우저 비교

- **Chrome/Edge**: 새 텍스트에 대해 글꼴 패밀리가 유지됨
- **Firefox**: 글꼴 유지가 덜 안정적일 수 있음
- **Safari**: 글꼴이 유지되지 않음 (이 케이스)

### 참고 및 해결 방법 가능한 방향

- 텍스트 삽입을 가로채고 글꼴 서식 적용
- 텍스트 삽입을 감지하기 위해 `beforeinput` 이벤트 사용
- 새로 삽입된 텍스트에 글꼴 스타일 적용
- 현재 입력 위치에 대한 글꼴 상태 유지
