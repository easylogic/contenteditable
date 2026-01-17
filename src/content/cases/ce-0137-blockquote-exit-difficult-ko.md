---
id: ce-0137-blockquote-exit-difficult-ko
scenarioId: scenario-blockquote-behavior
locale: ko
os: Windows
osVersion: "11"
device: Desktop or Laptop
deviceVersion: Any
browser: Chrome
browserVersion: "120.0"
keyboard: US
caseTitle: blockquote 종료에 여러 Enter 키 입력이 필요함
description: "Chrome에서 blockquote 내부에서 텍스트를 편집할 때 blockquote를 종료하여 일반 단락을 만들려면 여러 Enter 키 입력이나 수동 조작이 필요합니다. 인용 컨텍스트를 종료하기 어렵습니다."
tags:
  - blockquote
  - exit
  - enter
  - chrome
status: draft
domSteps:
  - label: "Before"
    html: '<blockquote><p>Quoted text</p></blockquote>'
    description: "blockquote element, cursor at end of text"
  - label: "After First Enter (Bug)"
    html: '<blockquote><p>Quoted text</p><p></p></blockquote>'
    description: "First Enter creates new paragraph inside blockquote"
  - label: "After Multiple Enters (Bug)"
    html: '<blockquote><p>Quoted text</p><p></p><p></p></blockquote>'
    description: "Difficult to exit blockquote even after multiple Enter presses"
  - label: "✅ Expected"
    html: '<blockquote><p>Quoted text</p></blockquote><p></p>'
    description: "Expected: Single Enter creates new paragraph outside blockquote"
---

## 현상

Chrome에서 blockquote 내부에서 텍스트를 편집할 때 blockquote를 종료하여 일반 단락을 만들려면 여러 Enter 키 입력이나 수동 조작이 필요합니다. 인용 컨텍스트를 종료하기 어렵습니다.

## 재현 예시

1. blockquote를 만듭니다: `<blockquote><p>Quoted text</p></blockquote>`
2. 텍스트 끝에 커서를 놓습니다
3. Enter를 여러 번 누릅니다

## 관찰된 동작

- 첫 번째 Enter가 blockquote 내에 단락을 만듭니다
- 종료하려면 여러 Enter가 필요할 수 있습니다
- 또는 blockquote를 쉽게 종료할 수 없습니다
- 사용자가 DOM을 수동으로 조작해야 합니다

## 예상 동작

- blockquote를 쉽게 종료할 수 있어야 합니다
- 또는 동작이 예측 가능해야 합니다
- 사용자가 종료 방법을 이해해야 합니다
- 종료가 직관적이어야 합니다

## 브라우저 비교

- **Chrome/Edge**: 종료에 여러 Enter가 필요할 수 있음 (이 케이스)
- **Firefox**: 유사한 종료 어려움
- **Safari**: 종료 동작이 가장 일관되지 않음

## 참고 및 해결 방법 가능한 방향

- blockquote 끝에서 Enter 가로채기
- blockquote 외부에 단락 생성
- 명확한 종료 메커니즘 제공
- blockquote 종료 동작 문서화
