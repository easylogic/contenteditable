---
id: ce-0133
scenarioId: scenario-link-insertion
locale: ko
os: Windows
osVersion: "11"
device: Desktop or Laptop
deviceVersion: Any
browser: Firefox
browserVersion: "120.0"
keyboard: US
caseTitle: Firefox에서 링크 제거가 빈 앵커 태그를 남김
description: "Firefox에서 링크를 제거할 때(텍스트 유지) 빈 앵커 태그가 DOM에 남을 수 있습니다. 이러한 빈 <a> 요소는 레이아웃 문제를 일으키고 HTML을 비대하게 만듭니다."
tags:
  - link
  - anchor
  - empty
  - firefox
status: draft
domSteps:
  - label: "Before"
    html: '<a href="https://example.com">Link text</a>'
    description: "Link element"
  - label: "After Unlink (Bug)"
    html: '<a href="https://example.com"></a>Link text'
    description: "After link removal, empty anchor tag remains"
  - label: "✅ Expected"
    html: 'Link text'
    description: "Expected: After link removal, only text remains, no empty tags"
---

## 현상

Firefox에서 링크를 제거할 때(텍스트 유지) 빈 앵커 태그가 DOM에 남을 수 있습니다. 이러한 빈 `<a>` 요소는 레이아웃 문제를 일으키고 HTML을 비대하게 만듭니다.

## 재현 예시

1. 링크를 만듭니다: `<a href="url">Link text</a>`
2. 링크를 제거합니다 (언링크 작업)
3. DOM을 관찰합니다

## 관찰된 동작

- 빈 `<a></a>` 태그가 남을 수 있습니다
- 또는 공백만 있는 `<a>` 태그가 남을 수 있습니다
- DOM이 비대해집니다
- 레이아웃에 예상치 못한 간격이 있을 수 있습니다

## 예상 동작

- 링크가 깨끗하게 제거되어야 합니다
- 텍스트가 링크 래퍼 없이 남아야 합니다
- 빈 앵커 태그가 남지 않아야 합니다
- DOM이 깨끗해야 합니다

## 브라우저 비교

- **Chrome/Edge**: 빈 앵커를 남길 수 있음
- **Firefox**: 빈 앵커를 남길 가능성이 더 높음 (이 케이스)
- **Safari**: 빈 구조를 남길 가능성이 가장 높음

## 참고 및 해결 방법 가능한 방향

- 링크 제거 가로채기
- 빈 앵커 태그 정리
- 링크 언래핑 및 텍스트 콘텐츠 보존
- 링크 작업 후 DOM 정규화
