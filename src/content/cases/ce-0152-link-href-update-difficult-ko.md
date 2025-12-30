---
id: ce-0152
scenarioId: scenario-link-insertion
locale: ko
os: Windows
osVersion: "11"
device: Desktop or Laptop
deviceVersion: Any
browser: Chrome
browserVersion: "120.0"
keyboard: US
caseTitle: 사용자 정의 구현 없이는 링크 href 업데이트가 어려움
description: "contenteditable에 링크가 이미 존재할 때 href 속성을 업데이트하는 것이 어렵습니다. URL을 편집하는 네이티브 방법이 없으며, 프로그래밍 방식 업데이트가 DOM에 즉시 반영되지 않을 수 있습니다."
tags:
  - link
  - href
  - update
  - chrome
status: draft
domSteps:
  - label: "Before"
    html: '<a href="url1">Link text</a>'
    description: "Existing link"
  - label: "After Programmatic Update (Bug)"
    html: '<a href="url1">Link text</a>'
    description: "Attempting to update href programmatically, not reflected in DOM"
  - label: "✅ Expected"
    html: '<a href="url2">Link text</a>'
    description: "Expected: href update immediately reflected in DOM"
---

## 현상

contenteditable에 링크가 이미 존재할 때 href 속성을 업데이트하는 것이 어렵습니다. URL을 편집하는 네이티브 방법이 없으며, 프로그래밍 방식 업데이트가 DOM에 즉시 반영되지 않을 수 있습니다.

## 재현 예시

1. 링크를 만듭니다: `<a href="url1">Link text</a>`
2. href를 다른 URL로 업데이트하려고 시도합니다
3. DOM을 관찰합니다

## 관찰된 동작

- href를 편집하는 네이티브 방법이 없습니다
- 프로그래밍 방식 업데이트가 작동하지 않을 수 있습니다
- 또는 업데이트가 반영되지 않을 수 있습니다
- 기존 링크를 수정하기 어렵습니다

## 예상 동작

- 링크 URL을 쉽게 편집할 수 있어야 합니다
- 또는 프로그래밍 방식 업데이트가 안정적으로 작동해야 합니다
- 변경이 즉시 반영되어야 합니다
- 링크 편집이 직관적이어야 합니다

## 브라우저 비교

- **모든 브라우저**: 네이티브 href 편집 없음
- 링크 편집을 위한 사용자 정의 구현 필요

## 참고 및 해결 방법 가능한 방향

- 링크 href 편집을 위한 UI 제공
- 링크 클릭을 가로채서 편집 대화상자 표시
- 프로그래밍 방식으로 href 업데이트
- 변경이 DOM에 반영되도록 보장
