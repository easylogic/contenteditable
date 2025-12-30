---
id: ce-0107
scenarioId: scenario-blockquote-behavior
locale: ko
os: macOS
osVersion: "14.0"
device: Desktop or Laptop
deviceVersion: Any
browser: Safari
browserVersion: "17.0"
keyboard: US
caseTitle: Safari에서 blockquote에서 Enter를 누르면 중첩 blockquote가 생성될 수 있음
description: "Safari에서 blockquote 요소 내부에서 Enter를 누르면 예상치 못하게 중첩 blockquote 구조가 생성될 수 있습니다. 이것은 의도된 인용 구조를 깨고 유효하지 않거나 혼란스러운 HTML을 만듭니다."
tags:
  - blockquote
  - nested
  - enter
  - safari
status: draft
domSteps:
  - label: "Before"
    html: '<blockquote><p>Quoted text</p></blockquote>'
    description: "blockquote element, cursor inside text"
  - label: "After Enter (Bug)"
    html: '<blockquote><p>Quoted text</p><blockquote><p></p></blockquote></blockquote>'
    description: "Enter creates nested blockquote (incorrect structure)"
  - label: "✅ Expected"
    html: '<blockquote><p>Quoted text</p><p></p></blockquote>'
    description: "Expected: New paragraph created within same blockquote"
---

## 현상

Safari에서 blockquote 요소 내부에서 Enter를 누르면 예상치 못하게 중첩 blockquote 구조가 생성될 수 있습니다. 이것은 의도된 인용 구조를 깨고 유효하지 않거나 혼란스러운 HTML을 만듭니다.

## 재현 예시

1. blockquote를 만듭니다: `<blockquote><p>Quoted text</p></blockquote>`
2. blockquote 텍스트 내부에 커서를 놓습니다
3. Enter를 누릅니다

## 관찰된 동작

- 중첩 blockquote가 생성될 수 있습니다: `<blockquote><p>Text</p><blockquote><p></p></blockquote></blockquote>`
- 또는 blockquote 구조가 깨질 수 있습니다
- DOM 구조가 잘못 형성됩니다
- 시각적 모양이 예상치 못할 수 있습니다

## 예상 동작

- 같은 blockquote 내에 새 단락이 생성되어야 합니다
- 중첩 blockquote가 생성되지 않아야 합니다
- blockquote 구조가 유지되어야 합니다
- 동작이 Chrome/Edge와 일관되어야 합니다

## 브라우저 비교

- **Chrome/Edge**: blockquote 내에 단락 생성 (올바름)
- **Firefox**: blockquote 구조를 깨뜨릴 수 있음
- **Safari**: 중첩 blockquote를 만들 수 있음 (이 케이스)

## 참고 및 해결 방법 가능한 방향

- blockquote 컨텍스트에서 Enter 키 가로채기
- 기본 동작 방지
- blockquote 내에 수동으로 단락 생성
- 작업 후 blockquote 구조 정규화
