---
id: ce-0142
scenarioId: scenario-link-click-editing
locale: ko
os: Windows
osVersion: "11"
device: Desktop or Laptop
deviceVersion: Any
browser: Chrome
browserVersion: "120.0"
keyboard: US
caseTitle: 링크 더블 클릭이 텍스트를 선택하지만 여전히 탐색할 수 있음
description: "Chrome에서 contenteditable 요소의 링크를 더블 클릭할 때 링크 텍스트가 편집을 위해 선택되지만 더블 클릭이 너무 빠르거나 타이밍이 맞지 않으면 링크가 여전히 탐색할 수 있습니다."
tags:
  - link
  - click
  - double-click
  - navigation
  - chrome
status: draft
domSteps:
  - label: "Before"
    html: '<a href="https://example.com">Link text</a>'
    description: "Link element"
  - label: "After Double-Click (Bug)"
    html: '[Navigated to https://example.com]'
    description: "Double click selects text but also triggers navigation"
  - label: "✅ Expected"
    html: '<a href="https://example.com">Link text</a>'
    description: "Expected: Double click only selects text, no navigation"
---

## 현상

Chrome에서 contenteditable 요소의 링크를 더블 클릭할 때 링크 텍스트가 편집을 위해 선택되지만 더블 클릭이 너무 빠르거나 타이밍이 맞지 않으면 링크가 여전히 탐색할 수 있습니다.

## 재현 예시

1. 링크를 만듭니다: `<a href="https://example.com">Link text</a>`
2. 링크 텍스트를 빠르게 더블 클릭합니다

## 관찰된 동작

- 링크 텍스트가 선택됩니다
- 하지만 탐색이 여전히 발생할 수 있습니다
- 타이밍이 중요합니다
- 동작이 일관되지 않습니다

## 예상 동작

- 더블 클릭은 탐색 없이 텍스트를 선택해야 합니다
- 편집 중 탐색이 방지되어야 합니다
- 동작이 일관되어야 합니다
- 사용자가 링크 텍스트를 쉽게 편집할 수 있어야 합니다

## 브라우저 비교

- **Chrome/Edge**: 더블 클릭 시 탐색할 수 있음 (이 케이스)
- **Firefox**: 탐색할 가능성이 더 높음
- **Safari**: 탐색 동작이 일관되지 않음

## 참고 및 해결 방법 가능한 방향

- 모든 클릭에서 기본 링크 동작 방지
- 더블 클릭을 명시적으로 처리
- 탐색 없이 텍스트 선택 허용
- 명시적 활성화에서만 탐색
