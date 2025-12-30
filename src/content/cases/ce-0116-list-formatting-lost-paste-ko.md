---
id: ce-0116
scenarioId: scenario-list-formatting-persistence
locale: ko
os: Windows
osVersion: "11"
device: Desktop or Laptop
deviceVersion: Any
browser: Chrome
browserVersion: "120.0"
keyboard: US
caseTitle: 서식이 있는 콘텐츠를 붙여넣을 때 목록 구조가 손실됨
description: "목록 항목에 서식이 있는 콘텐츠(굵게, 기울임꼴 등)를 붙여넣을 때 목록 구조가 깨지고 목록 항목이 단락으로 변환될 수 있습니다. 서식은 보존되지만 목록 구조가 손실됩니다."
tags:
  - list
  - formatting
  - paste
  - chrome
status: draft
domSteps:
  - label: "Before"
    html: '<ul><li>Item 1</li><li>Item 2</li></ul>'
    description: "List structure"
  - label: "Clipboard"
    html: '<strong>Bold Text</strong>'
    description: "Copied formatted text"
  - label: "❌ After Paste"
    html: '<p>Item 1</p><p><strong>Bold Text</strong></p><p>Item 2</p>'
    description: "List structure lost, &lt;li&gt; converted to &lt;p&gt;"
  - label: "✅ Expected"
    html: '<ul><li>Item 1</li><li><strong>Bold Text</strong></li><li>Item 2</li></ul>'
    description: "List structure maintained, formatting applied"
---

## 현상

목록 항목에 서식이 있는 콘텐츠(굵게, 기울임꼴 등)를 붙여넣을 때 목록 구조가 깨지고 목록 항목이 단락으로 변환될 수 있습니다. 서식은 보존되지만 목록 구조가 손실됩니다.

## 재현 예시

1. 목록을 만듭니다: `<ul><li>Item 1</li><li>Item 2</li></ul>`
2. 다른 곳에서 서식이 있는 텍스트를 복사합니다 (예: 굵은 텍스트)
3. 목록 항목에 붙여넣습니다

## 관찰된 동작

- 목록 항목이 단락으로 변환될 수 있습니다
- 목록 구조가 깨집니다
- 서식은 보존되지만 목록이 손실됩니다
- DOM 구조가 목록 대신 `<p>Item 1</p><p>Item 2</p>`가 됩니다

## 예상 동작

- 목록 구조가 유지되어야 합니다
- 서식이 목록 항목 내에 적용되어야 합니다
- 목록 항목이 `<li>` 요소로 유지되어야 합니다
- 구조가 깨지지 않아야 합니다

## 브라우저 비교

- **Chrome/Edge**: 목록 구조를 깨뜨릴 수 있음 (이 케이스)
- **Firefox**: 구조를 깨뜨릴 가능성이 더 높음
- **Safari**: 구조를 깨뜨릴 가능성이 가장 높음

## 참고 및 해결 방법 가능한 방향

- 목록 컨텍스트에서 붙여넣기 이벤트 가로채기
- 붙여넣은 콘텐츠에서 블록 레벨 요소 제거
- 목록 구조 보존
- 목록 항목 내에서만 서식 적용
