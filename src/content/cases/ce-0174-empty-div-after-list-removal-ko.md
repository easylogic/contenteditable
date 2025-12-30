---
id: ce-0174
scenarioId: scenario-empty-element-cleanup
locale: ko
os: Windows
osVersion: "11"
device: Desktop or Laptop
deviceVersion: Any
browser: Chrome
browserVersion: "120.0"
keyboard: US
caseTitle: 목록 제거 후 빈 div 요소가 남음
description: "Chrome에서 목록을 제거할 때(목록 항목을 단락으로 변환) 빈 래퍼 div 요소가 DOM에 남을 수 있습니다. 이러한 빈 div는 레이아웃 문제를 일으키고 HTML을 비대하게 만듭니다."
tags:
  - empty
  - list
  - div
  - cleanup
  - chrome
status: draft
domSteps:
  - label: "Before"
    html: '<ul><li>Item 1</li></ul>'
    description: "List structure"
  - label: "After List Removal (Bug)"
    html: '<div></div><p>Item 1</p>'
    description: "After list removal, empty &lt;div&gt; element remains"
  - label: "✅ Expected"
    html: '<p>Item 1</p>'
    description: "Expected: Empty div removed, clean DOM"
---

### 현상

Chrome에서 목록을 제거할 때(목록 항목을 단락으로 변환) 빈 래퍼 div 요소가 DOM에 남을 수 있습니다. 이러한 빈 div는 레이아웃 문제를 일으키고 HTML을 비대하게 만듭니다.

### 재현 예시

1. 목록을 만듭니다: `<ul><li>Item 1</li></ul>`
2. 목록을 제거합니다 (단락으로 변환)
3. DOM 구조를 관찰합니다

### 관찰된 동작

- 빈 `<div></div>` 요소가 남을 수 있습니다
- 또는 공백만 있는 div가 남습니다
- DOM이 비대해집니다
- 레이아웃에 예상치 못한 간격이 있습니다

### 예상 동작

- 빈 div 요소가 제거되어야 합니다
- DOM이 깨끗해야 합니다
- 불필요한 요소가 남지 않아야 합니다
- 구조가 정규화되어야 합니다

### 브라우저 비교

- **Chrome/Edge**: 빈 div를 남길 수 있음 (이 케이스)
- **Firefox**: 빈 요소를 남길 가능성이 더 높음
- **Safari**: 빈 요소를 누적할 가능성이 가장 높음

### 참고 및 해결 방법 가능한 방향

- 목록 제거 후 빈 div 요소 정리
- 빈 경우 래퍼 요소 제거
- DOM 구조를 정기적으로 정규화
- 불필요한 컨테이너 제거
