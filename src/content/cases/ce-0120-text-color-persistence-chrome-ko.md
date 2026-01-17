---
id: ce-0120-text-color-persistence-chrome-ko
scenarioId: scenario-text-color-change
locale: ko
os: Windows
osVersion: "11"
device: Desktop or Laptop
deviceVersion: Any
browser: Chrome
browserVersion: "120.0"
keyboard: US
caseTitle: Chrome에서 적용 후 입력 시 텍스트 색상이 유지됨
description: "Chrome에서 선택한 텍스트에 텍스트 색상을 적용한 후 계속 입력하면 새 텍스트가 색상을 상속합니다. 이것은 예상되는 동작이며 Chrome/Edge에서 올바르게 작동합니다."
tags:
  - color
  - text
  - chrome
status: draft
domSteps:
  - label: "Before"
    html: '<span style="color: red;">Hello</span>|'
    description: "Red text, cursor (|) at the end"
  - label: "After Typing"
    html: '<span style="color: red;">HelloWorld</span>'
    description: "Newly typed text also inherits red color (normal behavior)"
  - label: "✅ Expected"
    html: '<span style="color: red;">HelloWorld</span>'
    description: "Expected: Newly typed text also inherits color (current behavior is correct)"
---

## 현상

Chrome에서 선택한 텍스트에 텍스트 색상을 적용한 후 계속 입력하면 새 텍스트가 색상을 상속합니다. 이것은 예상되는 동작이며 Chrome/Edge에서 올바르게 작동합니다.

## 재현 예시

1. contenteditable 요소에서 일부 텍스트를 선택합니다
2. 텍스트 색상을 적용합니다 (예: 빨간색)
3. 색상이 있는 텍스트 뒤에 커서를 놓습니다
4. 새 텍스트를 입력합니다

## 관찰된 동작

- 새로 입력된 텍스트가 적용된 색상을 상속합니다
- 새 텍스트에 대해 색상 서식이 유지됩니다
- 이것은 올바르고 예상되는 동작입니다
- Chrome/Edge에서 일관되게 작동합니다

## 예상 동작

- 새로 입력된 텍스트가 색상을 상속해야 합니다 (현재 동작이 올바름)
- 색상 서식이 명시적으로 변경될 때까지 유지되어야 합니다
- 동작이 일관되어야 합니다 (Chrome/Edge에서 일관됨)

## 브라우저 비교

- **Chrome/Edge**: 색상이 올바르게 유지됨 (이 케이스 - 올바른 동작)
- **Firefox**: 색상 유지가 덜 안정적일 수 있음
- **Safari**: 색상이 유지되지 않을 수 있음

## 참고 및 해결 방법 가능한 방향

- 이 동작은 올바르고 예상됩니다
- 색상 제거를 명시적으로 처리해야 할 수 있음
- 색상이 단락 간에 유지되어야 하는지 고려
- 사용자에게 예상 동작 문서화
