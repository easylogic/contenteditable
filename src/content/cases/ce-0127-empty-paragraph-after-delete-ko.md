---
id: ce-0127-empty-paragraph-after-delete-ko
scenarioId: scenario-empty-element-cleanup
locale: ko
os: Windows
osVersion: "11"
device: Desktop or Laptop
deviceVersion: Any
browser: Chrome
browserVersion: "120.0"
keyboard: US
caseTitle: 모든 텍스트 삭제 후 빈 단락이 누적됨
description: "Chrome에서 단락에서 모든 텍스트를 삭제할 때 <br> 태그만 있는 빈 단락 요소가 DOM에 누적됩니다. 이러한 빈 단락은 불필요한 간격을 일으키고 HTML을 비대하게 만듭니다."
tags:
  - empty
  - paragraph
  - cleanup
  - chrome
status: draft
domSteps:
  - label: "Before"
    html: '<p>Text 1</p><p>Text 2</p><p>Text 3</p>'
    description: "Text with multiple paragraphs"
  - label: "After Delete All (Bug)"
    html: '<p><br></p><p><br></p><p><br></p>'
    description: "After deleting all text, empty paragraphs (&lt;br&gt; included) accumulate"
  - label: "✅ Expected"
    html: '<p><br></p>'
    description: "Expected: Only one empty paragraph maintained for cursor placement"
---

## 현상

Chrome에서 단락에서 모든 텍스트를 삭제할 때 `<br>` 태그만 있는 빈 단락 요소가 DOM에 누적됩니다. 이러한 빈 단락은 불필요한 간격을 일으키고 HTML을 비대하게 만듭니다.

## 재현 예시

1. 텍스트가 있는 여러 단락을 만듭니다
2. 각 단락에서 모든 텍스트를 삭제합니다
3. DOM 구조를 관찰합니다

## 관찰된 동작

- 빈 `<p><br></p>` 요소가 남습니다
- 여러 빈 단락이 누적됩니다
- DOM이 비대해집니다
- 불필요한 간격이 나타납니다

## 예상 동작

- 빈 단락이 정리되어야 합니다
- 또는 커서를 위해 최소한 하나의 빈 단락이 남아야 합니다
- DOM이 최소한이어야 합니다
- 불필요한 간격이 없어야 합니다

## 브라우저 비교

- **Chrome/Edge**: 빈 단락을 남김 (이 케이스)
- **Firefox**: 빈 요소를 남길 가능성이 더 높음
- **Safari**: 빈 요소를 누적할 가능성이 가장 높음

## 참고 및 해결 방법 가능한 방향

- 삭제 후 빈 단락 정리
- 커서 배치를 위해 하나의 빈 단락만 유지
- 필요하지 않은 빈 단락 제거
- DOM 구조를 정기적으로 정규화
