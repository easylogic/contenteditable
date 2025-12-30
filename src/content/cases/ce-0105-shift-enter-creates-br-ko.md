---
id: ce-0105
scenarioId: scenario-enter-vs-shift-enter
locale: ko
os: Windows
osVersion: "11"
device: Desktop or Laptop
deviceVersion: Any
browser: Chrome
browserVersion: "120.0"
keyboard: US
caseTitle: Shift+Enter가 줄바꿈을 위해 br 요소를 생성함
description: "contenteditable 요소에서 Shift+Enter를 누르면 새 단락 대신 <br> 줄바꿈 요소가 생성됩니다. 이 동작은 Chrome, Firefox 및 Safari에서 일관됩니다."
tags:
  - enter
  - line-break
  - br
  - all-browsers
status: draft
domSteps:
  - label: "Before"
    html: 'Hello'
    description: "Basic text"
  - label: "After Shift+Enter"
    html: 'Hello<br>'
    description: "Shift+Enter creates &lt;br&gt; element (normal behavior)"
  - label: "✅ Expected"
    html: 'Hello<br>'
    description: "Expected: Shift+Enter creates line break, Enter creates new paragraph (current behavior is correct)"
---

## 현상

contenteditable 요소에서 Shift+Enter를 누르면 새 단락 대신 `<br>` 줄바꿈 요소가 생성됩니다. 이 동작은 Chrome, Firefox 및 Safari에서 일관됩니다.

## 재현 예시

1. contenteditable 요소에 포커스합니다
2. 일부 텍스트를 입력합니다
3. Shift+Enter를 누릅니다

## 관찰된 동작

- `<br>` 요소가 삽입됩니다
- 텍스트가 새 블록 요소를 만들지 않고 다음 줄에 계속됩니다
- 이것은 모든 주요 브라우저에서 일관됩니다
- 단락 내 줄바꿈에 유용합니다

## 예상 동작

- Shift+Enter는 줄바꿈을 생성해야 합니다 (현재 동작이 올바름)
- Enter는 새 단락/블록을 생성해야 합니다
- 동작이 일관되어야 합니다 (현재 일관됨)

## 브라우저 비교

- **모든 브라우저**: Shift+Enter가 `<br>`을 일관되게 생성
- 이것은 예상되고 올바른 동작입니다

## 참고 및 해결 방법 가능한 방향

- 이 동작은 일반적으로 올바르고 예상됩니다
- 예상치 못한 컨텍스트에서 `<br>`이 있는 엣지 케이스를 처리해야 할 수 있음
- 필요한 경우 여러 `<br>` 요소 정규화 고려
- 줄바꿈을 위해 `<br>`이 올바르게 스타일링되도록 보장
