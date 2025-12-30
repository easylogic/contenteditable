---
id: ce-0100
scenarioId: scenario-link-insertion
locale: ko
os: Windows
osVersion: "11"
device: Desktop or Laptop
deviceVersion: Any
browser: Chrome
browserVersion: "120.0"
keyboard: US
caseTitle: 선택한 텍스트에서 링크 생성은 작동하지만 Chrome에서 중첩 링크를 만들 수 있음
description: "Chrome에서 선택한 텍스트에서 링크를 생성할 때 링크가 성공적으로 생성되지만, 선택이 이미 링크 내부에 있으면 중첩 링크가 생성될 수 있으며, 이는 유효하지 않은 HTML입니다."
tags:
  - link
  - anchor
  - nested
  - chrome
status: draft
domSteps:
  - label: "Before"
    html: '<a href="url1">Link text</a>'
    description: "Existing link"
  - label: "After New Link (Bug)"
    html: '<a href="url1"><a href="url2">Link text</a></a>'
    description: "Nested link created (invalid HTML)"
  - label: "✅ Expected"
    html: '<a href="url2">Link text</a>'
    description: "Expected: Existing link removed then new link created"
---

## 현상

Chrome에서 선택한 텍스트에서 링크를 생성할 때 링크가 성공적으로 생성되지만, 선택이 이미 링크 내부에 있으면 중첩 링크가 생성될 수 있으며, 이는 유효하지 않은 HTML입니다.

## 재현 예시

1. 링크를 만듭니다: `<a href="url1">Link text</a>`
2. "Link text"의 일부를 선택합니다
3. 새 링크를 만듭니다 (Ctrl+K 또는 프로그래밍 방식)

## 관찰된 동작

- 중첩 링크 구조가 생성될 수 있습니다: `<a href="url1"><a href="url2">Link text</a></a>`
- 이것은 유효하지 않은 HTML입니다 (링크는 중첩될 수 없음)
- 브라우저가 이를 잘못 렌더링할 수 있습니다
- DOM 구조가 잘못 형성됩니다

## 예상 동작

- 기존 링크가 먼저 제거되어야 합니다
- 새 링크가 이전 링크를 대체해야 합니다
- 중첩 링크가 생성되지 않아야 합니다
- HTML 구조가 유효하게 유지되어야 합니다

## 브라우저 비교

- **Chrome/Edge**: 중첩 링크를 만들 수 있음 (이 케이스)
- **Firefox**: 중첩 링크를 만들 가능성이 더 높음
- **Safari**: 예상치 못한 구조를 만들 수 있음

## 참고 및 해결 방법 가능한 방향

- 새 링크를 만들기 전에 선택이 기존 링크 내부에 있는지 확인
- 먼저 기존 링크 구조 제거
- 부모 링크를 찾기 위해 `closest('a')` 사용
- 새 링크를 만들기 전에 기존 링크 언래핑
