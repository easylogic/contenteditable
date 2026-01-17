---
id: ce-0164-link-text-editing-navigates-ko
scenarioId: scenario-link-click-editing
locale: ko
os: macOS
osVersion: "14.0"
device: Desktop or Laptop
deviceVersion: Any
browser: Safari
browserVersion: "17.0"
keyboard: US
caseTitle: Safari에서 링크 텍스트 편집이 탐색을 트리거함
description: "Safari에서 링크 텍스트를 편집하려고 할 때 텍스트를 클릭하거나 선택하면 링크 URL로 탐색이 트리거될 수 있습니다. 실수로 탐색하지 않고 링크 텍스트를 편집하기가 매우 어렵습니다."
tags:
  - link
  - click
  - navigation
  - editing
  - safari
status: draft
domSteps:
  - label: "Before"
    html: '<a href="https://example.com">Link text</a>'
    description: "Link element"
  - label: "After Click (Bug)"
    html: '[Navigated to https://example.com]'
    description: "Click immediately triggers navigation, text editing not possible"
  - label: "✅ Expected"
    html: '<a href="https://example.com">Link text</a>'
    description: "Expected: Click can select text, enter edit mode"
---

## 현상

Safari에서 링크 텍스트를 편집하려고 할 때 텍스트를 클릭하거나 선택하면 링크 URL로 탐색이 트리거될 수 있습니다. 실수로 탐색하지 않고 링크 텍스트를 편집하기가 매우 어렵습니다.

## 재현 예시

1. 링크를 만듭니다: `<a href="https://example.com">Link text</a>`
2. 편집을 위해 텍스트를 클릭하고 선택하려고 시도합니다

## 관찰된 동작

- 클릭하면 즉시 탐색이 트리거됩니다
- 텍스트 선택이 중단됩니다
- 링크 텍스트를 쉽게 편집할 수 없습니다
- 편집이 발생하기 전에 탐색이 발생합니다

## 예상 동작

- 클릭하면 텍스트 선택이 허용되어야 합니다
- 편집 중 탐색이 방지되어야 합니다
- 사용자가 링크 텍스트를 편집할 수 있어야 합니다
- 명시적 활성화에서만 탐색이 발생해야 합니다

## 브라우저 비교

- **Chrome/Edge**: 탐색할 수 있지만 일반적으로 선택을 허용함
- **Firefox**: 즉시 탐색할 가능성이 더 높음
- **Safari**: 클릭 시 탐색할 가능성이 가장 높음 (이 케이스)

## 참고 및 해결 방법 가능한 방향

- 모든 클릭에서 기본 링크 동작 방지
- 탐색 없이 텍스트 선택 허용
- 명시적 활성화에서만 탐색 (예: Ctrl+Click)
- 링크를 위한 편집 모드 제공
