---
id: ce-0111
scenarioId: scenario-empty-element-cleanup
locale: ko
os: Windows
osVersion: "11"
device: Desktop or Laptop
deviceVersion: Any
browser: Chrome
browserVersion: "120.0"
keyboard: US
caseTitle: 편집 중 빈 단락 및 span 요소가 누적됨
description: "편집 작업 중 빈 요소(빈 단락, div, 콘텐츠가 없는 span)가 DOM에 누적됩니다. 이러한 요소는 레이아웃 문제를 일으키고 HTML을 비대하게 만듭니다."
tags:
  - empty
  - cleanup
  - dom
  - chrome
status: draft
domSteps:
  - label: "Before"
    html: '<p>Hello <span style="font-weight: bold;">World</span></p>'
    description: "Formatted text"
  - label: "After Formatting Removal (Bug)"
    html: '<p>Hello <span></span>World</p>'
    description: "After formatting removal, empty span tags remain"
  - label: "✅ Expected"
    html: '<p>Hello World</p>'
    description: "Expected: Empty elements automatically cleaned up"
---

### 현상

편집 작업 중 빈 요소(빈 단락, div, 콘텐츠가 없는 span)가 DOM에 누적됩니다. 이러한 요소는 레이아웃 문제를 일으키고 HTML을 비대하게 만듭니다.

### 재현 예시

1. contenteditable에 콘텐츠를 만듭니다
2. 서식을 적용하고 제거합니다
3. 텍스트 콘텐츠를 삭제합니다
4. DOM 구조를 관찰합니다

### 관찰된 동작

- 빈 `<p>` 또는 `<div>` 요소가 남습니다
- 스타일 속성이 있는 빈 `<span>` 요소가 남습니다
- DOM이 빈 요소로 비대해집니다
- 레이아웃에 예상치 못한 간격이 있을 수 있습니다

### 예상 동작

- 빈 요소가 자동으로 정리되어야 합니다
- 또는 정리가 구현하기 쉬워야 합니다
- DOM이 깨끗하고 최소한으로 유지되어야 합니다
- 불필요한 빈 요소가 없어야 합니다

### 브라우저 비교

- **Chrome/Edge**: 빈 요소를 남김 (이 케이스)
- **Firefox**: 빈 요소를 남길 가능성이 더 높음
- **Safari**: 빈 요소를 누적할 가능성이 가장 높음

### 참고 및 해결 방법 가능한 방향

- 빈 요소를 제거하는 정리 로직 구현
- 입력 이벤트 후 정리 실행
- 커서 배치를 위해 최소한 하나의 빈 블록 보존
- 빈 span을 제거하지만 필요한 경우 구조 유지
- DOM 구조를 정기적으로 정규화
