---
id: ce-0140
scenarioId: scenario-empty-element-cleanup
locale: ko
os: Windows
osVersion: "11"
device: Desktop or Laptop
deviceVersion: Any
browser: Chrome
browserVersion: "120.0"
keyboard: US
caseTitle: style 속성이 있는 빈 span 요소가 누적됨
description: "Chrome에서 서식(굵게, 기울임꼴, 색상 등)을 제거할 때 빈 또는 불필요한 style 속성이 있는 빈 span 요소가 DOM에 누적됩니다. 이러한 요소는 HTML을 비대하게 만들고 목적이 없습니다."
tags:
  - empty
  - span
  - style
  - cleanup
  - chrome
status: draft
domSteps:
  - label: "Before"
    html: 'Hello <span style="color: red; font-weight: bold;">World</span>'
    description: "Text with multiple formatting applied"
  - label: "After Removing Formats (Bug)"
    html: 'Hello <span style=""></span>World'
    description: "After formatting removal, &lt;span&gt; element with empty style attribute remains"
  - label: "✅ Expected"
    html: 'Hello World'
    description: "Expected: Empty span element and style attribute removed, clean DOM"
---

## 현상

Chrome에서 서식(굵게, 기울임꼴, 색상 등)을 제거할 때 빈 또는 불필요한 style 속성이 있는 빈 span 요소가 DOM에 누적됩니다. 이러한 요소는 HTML을 비대하게 만들고 목적이 없습니다.

## 재현 예시

1. 텍스트에 여러 서식을 적용합니다
2. 서식을 하나씩 제거합니다
3. DOM 구조를 관찰합니다

## 관찰된 동작

- 빈 `<span style="">` 요소가 남습니다
- 또는 공백만 있는 `<span>` 요소가 남습니다
- style 속성이 비어 있지만 여전히 존재할 수 있습니다
- DOM이 빈 span으로 비대해집니다

## 예상 동작

- 빈 span 요소가 제거되어야 합니다
- style 속성이 비어 있을 때 제거되어야 합니다
- DOM이 깨끗하고 최소한이어야 합니다
- 불필요한 요소가 남지 않아야 합니다

## 브라우저 비교

- **Chrome/Edge**: 빈 span을 남김 (이 케이스)
- **Firefox**: 빈 요소를 남길 가능성이 더 높음
- **Safari**: 빈 요소를 누적할 가능성이 가장 높음

## 참고 및 해결 방법 가능한 방향

- 서식 제거 후 빈 span 요소 정리
- 비어 있으면 style 속성 제거
- 공백만 포함하는 span 언래핑
- DOM 구조를 정기적으로 정규화
