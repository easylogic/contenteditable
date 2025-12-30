---
id: ce-0101
scenarioId: scenario-link-click-editing
locale: ko
os: Windows
osVersion: "11"
device: Desktop or Laptop
deviceVersion: Any
browser: Chrome
browserVersion: "120.0"
keyboard: US
caseTitle: Chrome에서 링크의 단일 클릭이 텍스트 선택을 허용하는 대신 탐색함
description: "Chrome에서 contenteditable 요소 내부의 링크를 클릭할 때 단일 클릭이 편집을 위한 텍스트 선택을 허용하는 대신 링크 URL로 탐색할 수 있습니다. 이것은 링크 텍스트 편집을 어렵게 만듭니다."
tags:
  - link
  - click
  - navigation
  - chrome
status: draft
domSteps:
  - label: "Before"
    html: '<a href="https://example.com">Link text</a>'
    description: "Link element, before click"
  - label: "After Single Click (Bug)"
    html: '<a href="https://example.com">Link text</a>'
    description: "Single click navigates to link URL (text selection not possible)"
  - label: "✅ Expected"
    html: '<a href="https://example.com">Link text</a>'
    description: "Expected: Single click can select text, editing possible"
---

## 현상

Chrome에서 contenteditable 요소 내부의 링크를 클릭할 때 단일 클릭이 편집을 위한 텍스트 선택을 허용하는 대신 링크 URL로 탐색할 수 있습니다. 이것은 링크 텍스트 편집을 어렵게 만듭니다.

## 재현 예시

1. contenteditable에 링크를 만듭니다: `<a href="https://example.com">Link text</a>`
2. 링크 텍스트를 단일 클릭합니다

## 관찰된 동작

- 브라우저가 링크 URL로 탐색할 수 있습니다
- 또는 텍스트 선택이 허용될 수 있습니다 (동작이 일관되지 않음)
- 더블 클릭은 일반적으로 편집을 위한 텍스트를 선택합니다
- 우클릭은 컨텍스트 메뉴를 표시합니다

## 예상 동작

- 단일 클릭은 텍스트를 선택해야 합니다 (탐색하지 않음)
- 탐색은 명시적 링크 활성화에서만 발생해야 합니다
- 동작이 일관되어야 합니다
- 사용자가 링크 텍스트를 쉽게 편집할 수 있어야 합니다

## 브라우저 비교

- **Chrome/Edge**: 단일 클릭 시 탐색할 수 있음 (이 케이스)
- **Firefox**: 즉시 탐색할 가능성이 더 높음
- **Safari**: 동작이 일관되지 않음

## 참고 및 해결 방법 가능한 방향

- 클릭 시 기본 링크 동작 방지
- 클릭 핸들러에서 `e.preventDefault()` 사용
- 단일 클릭에서 텍스트 선택 허용
- 명시적 활성화(예: Ctrl+Click 또는 전용 버튼)에서만 탐색
