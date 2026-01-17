---
id: ce-0166-font-size-persistence-edge-ko
scenarioId: scenario-font-size-change
locale: ko
os: Windows
osVersion: "11"
device: Desktop or Laptop
deviceVersion: Any
browser: Edge
browserVersion: "120.0"
keyboard: US
caseTitle: Edge에서 적용 후 입력 시 글꼴 크기가 올바르게 유지됨
description: "Edge에서 선택한 텍스트에 글꼴 크기를 적용한 후 계속 입력하면 새 텍스트가 글꼴 크기를 상속합니다. 이것은 예상되는 동작이며 Edge에서 올바르게 작동합니다."
tags:
  - font
  - size
  - persistence
  - edge
status: draft
domSteps:
  - label: "Before"
    html: 'Hello World'
    description: "Basic text"
  - label: "After Font Size"
    html: 'Hello <span style="font-size: 18px;">World</span>'
    description: "18px font size applied"
  - label: "After Typing"
    html: 'Hello <span style="font-size: 18px;">World New</span>'
    description: "Newly typed text also inherits font size (normal behavior)"
  - label: "✅ Expected"
    html: 'Hello <span style="font-size: 18px;">World New</span>'
    description: "Expected: Newly typed text also inherits font size (current behavior is correct)"
---

## 현상

Edge에서 선택한 텍스트에 글꼴 크기를 적용한 후 계속 입력하면 새 텍스트가 글꼴 크기를 상속합니다. 이것은 예상되는 동작이며 Edge에서 올바르게 작동합니다.

## 재현 예시

1. contenteditable 요소에서 일부 텍스트를 선택합니다
2. 글꼴 크기를 적용합니다 (예: 18px)
3. 서식이 적용된 텍스트 뒤에 커서를 놓습니다
4. 새 텍스트를 입력합니다

## 관찰된 동작

- 새로 입력된 텍스트가 적용된 글꼴 크기를 상속합니다
- 글꼴 크기 서식이 새 텍스트에 대해 유지됩니다
- 이것은 올바르고 예상되는 동작입니다
- Edge/Chrome에서 일관되게 작동합니다

## 예상 동작

- 새로 입력된 텍스트가 글꼴 크기를 상속해야 합니다 (현재 동작이 올바름)
- 글꼴 크기 서식이 명시적으로 변경될 때까지 유지되어야 합니다
- 동작이 일관되어야 합니다 (Edge/Chrome에서 그렇습니다)

## 브라우저 비교

- **Chrome/Edge**: 글꼴 크기가 올바르게 유지됨 (이 케이스 - 올바른 동작)
- **Firefox**: 크기 유지가 덜 안정적일 수 있음
- **Safari**: 글꼴 크기가 유지되지 않음

## 참고 및 해결 방법 가능한 방향

- 이 동작은 올바르고 예상되는 것입니다
- 크기 제거를 명시적으로 처리해야 할 수 있음
- 단락에 걸쳐 크기가 유지되어야 하는지 고려
- 사용자에게 예상 동작 문서화
