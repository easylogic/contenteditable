---
id: ce-0156
scenarioId: scenario-blockquote-behavior
locale: ko
os: Windows
osVersion: "11"
device: Desktop or Laptop
deviceVersion: Any
browser: Safari
browserVersion: "17.0"
keyboard: US
caseTitle: Safari에서 blockquote 콘텐츠 붙여넣기가 중첩 blockquote를 만듦
description: "Safari에서 기존 blockquote에 blockquote 요소가 포함된 콘텐츠를 붙여넣을 때 중첩 blockquote 구조가 생성됩니다. 이것은 유효하지 않거나 혼란스러운 HTML 구조를 만듭니다."
tags:
  - blockquote
  - nested
  - paste
  - safari
status: draft
domSteps:
  - label: "Before"
    html: '<blockquote><p>Quoted text</p></blockquote>'
    description: "Existing blockquote"
  - label: "Clipboard"
    html: '<blockquote><p>Another quote</p></blockquote>'
    description: "Content including copied blockquote"
  - label: "After Paste (Bug)"
    html: '<blockquote><p>Quoted text</p><blockquote><p>Another quote</p></blockquote></blockquote>'
    description: "Nested blockquote created (incorrect structure)"
  - label: "✅ Expected"
    html: '<blockquote><p>Quoted text</p><p>Another quote</p></blockquote>'
    description: "Expected: Blockquote tags removed, only inner content inserted"
---

## 현상

Safari에서 기존 blockquote에 blockquote 요소가 포함된 콘텐츠를 붙여넣을 때 중첩 blockquote 구조가 생성됩니다. 이것은 유효하지 않거나 혼란스러운 HTML 구조를 만듭니다.

## 재현 예시

1. blockquote를 만듭니다: `<blockquote><p>Quoted text</p></blockquote>`
2. blockquote가 포함된 콘텐츠를 복사합니다
3. 기존 blockquote에 붙여넣습니다

## 관찰된 동작

- 중첩 blockquote가 생성됩니다: `<blockquote><p>Text</p><blockquote>...</blockquote></blockquote>`
- 구조가 혼란스러워집니다
- 시각적 모양이 예상치 못할 수 있습니다
- HTML 구조가 불필요하게 중첩됩니다

## 예상 동작

- 붙여넣은 콘텐츠에서 blockquote 태그가 제거되어야 합니다
- 또는 붙여넣은 콘텐츠가 blockquote 래퍼 없이 삽입되어야 합니다
- 중첩 blockquote가 생성되지 않아야 합니다
- 구조가 깨끗하게 유지되어야 합니다

## 브라우저 비교

- **Chrome/Edge**: 중첩 blockquote를 만들 수 있음
- **Firefox**: 중첩 구조를 만들 가능성이 더 높음
- **Safari**: 중첩 blockquote를 만들 가능성이 가장 높음 (이 케이스)

## 참고 및 해결 방법 가능한 방향

- blockquote 컨텍스트에서 붙여넣기 가로채기
- 붙여넣은 콘텐츠에서 blockquote 태그 제거
- blockquote 구조 보존
- 붙여넣기 후 구조 정규화
