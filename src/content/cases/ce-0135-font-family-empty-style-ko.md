---
id: ce-0135
scenarioId: scenario-font-family-change
locale: ko
os: Windows
osVersion: "11"
device: Desktop or Laptop
deviceVersion: Any
browser: Chrome
browserVersion: "120.0"
keyboard: US
caseTitle: 글꼴 패밀리 제거가 빈 style 속성을 남김
description: "Chrome에서 글꼴 패밀리 서식을 제거할 때 빈 style 속성이 DOM에 남을 수 있습니다. 이러한 빈 style 속성은 HTML을 비대하게 만들고 목적이 없습니다."
tags:
  - font
  - style
  - empty
  - chrome
status: draft
domSteps:
  - label: "Before"
    html: '<span style="font-family: Arial;">Text</span>'
    description: "Text with Arial font applied"
  - label: "After Removing Font (Bug)"
    html: '<span style="">Text</span>'
    description: "After font removal, empty style attribute remains"
  - label: "✅ Expected"
    html: 'Text'
    description: "Expected: Empty style attribute and element removed"
---

### 현상

Chrome에서 글꼴 패밀리 서식을 제거할 때 빈 style 속성이 DOM에 남을 수 있습니다. 이러한 빈 style 속성은 HTML을 비대하게 만들고 목적이 없습니다.

### 재현 예시

1. 텍스트에 글꼴 패밀리를 적용합니다: `<span style="font-family: Arial">Text</span>`
2. 글꼴 패밀리 서식을 제거합니다
3. DOM을 관찰합니다

### 관찰된 동작

- 빈 style 속성이 남을 수 있습니다: `<span style="">Text</span>`
- 또는 빈 span 요소가 남을 수 있습니다: `<span></span>`
- DOM이 비대해집니다
- 불필요한 속성이 누적됩니다

### 예상 동작

- style 속성이 비어 있을 때 제거되어야 합니다
- 빈 요소가 정리되어야 합니다
- DOM이 최소한이어야 합니다
- 불필요한 속성이 없어야 합니다

### 브라우저 비교

- **Chrome/Edge**: 빈 스타일을 남길 수 있음 (이 케이스)
- **Firefox**: 빈 속성을 남길 가능성이 더 높음
- **Safari**: 빈 구조를 남길 가능성이 가장 높음

### 참고 및 해결 방법 가능한 방향

- 빈 style 속성 정리
- 비어 있으면 style 속성 제거
- 빈 스타일이 있는 요소 언래핑
- DOM 구조를 정기적으로 정규화
