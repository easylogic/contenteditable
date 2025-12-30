---
id: ce-0204
scenarioId: scenario-ime-composition-paste
locale: ko
os: Windows
osVersion: "11"
device: Desktop or Laptop
deviceVersion: Any
browser: Chrome
browserVersion: "120.0"
keyboard: Hindi (IME - Devanagari)
caseTitle: Chrome에서 힌디어 IME 조합이 붙여넣기 작업으로 취소됨
description: "contenteditable 요소에서 데바나가리 IME로 힌디어 텍스트를 조합할 때 콘텐츠를 붙여넣으면(Ctrl+V) 활성 조합이 취소되고 모음 기호와 결합 문자를 포함한 조합된 텍스트가 손실됩니다. 붙여넣은 콘텐츠도 예상치 못한 위치에 삽입될 수 있습니다."
tags:
  - composition
  - ime
  - paste
  - hindi
  - devanagari
  - chrome
  - windows
status: draft
domSteps:
  - label: "Before"
    html: 'Hello <span style="text-decoration: underline; background: #fef08a;">नम</span>'
    description: "Hindi Devanagari composition in progress (नम), includes vowel signs and combining characters"
  - label: "After Paste (Bug)"
    html: 'Hello World'
    description: "Paste cancels composition, composition text lost, only pasted content remains"
  - label: "✅ Expected"
    html: 'Hello नमस्तेWorld'
    description: "Expected: Paste after composition completes or composition text preserved"
---

## 현상

`contenteditable` 요소에서 데바나가리 IME로 힌디어 텍스트를 조합할 때 콘텐츠를 붙여넣으면(Ctrl+V) 활성 조합이 취소되고 모음 기호와 결합 문자를 포함한 조합된 텍스트가 손실됩니다. 붙여넣은 콘텐츠도 예상치 못한 위치에 삽입될 수 있습니다.

## 재현 예시

1. 편집 가능한 영역에 포커스를 둡니다.
2. 데바나가리 문자로 힌디어 IME로 전환합니다.
3. 모음 기호와 결합 문자가 있는 힌디어 텍스트 조합을 시작합니다 (예: "नमस्ते").
4. 조합을 완료하기 전에 Ctrl+V를 눌러 콘텐츠를 붙여넣습니다.

## 관찰된 동작

- compositionend 이벤트가 불완전한 데이터로 발생합니다
- 결합 문자를 포함한 조합된 텍스트가 손실됩니다
- 붙여넣은 콘텐츠가 삽입되며, 잘못된 위치에 있을 수 있습니다
- `paste`, `compositionend`, `input` 이벤트의 순서가 일관되지 않을 수 있습니다

## 예상 동작

- 붙여넣기가 발생하기 전에 조합이 완료되거나 붙여넣기가 대기되어야 합니다
- 모든 결합 문자가 보존되어야 합니다
- 붙여넣은 콘텐츠가 올바른 위치에 삽입되어야 합니다
- 이벤트 순서가 예측 가능하고 일관되어야 합니다

## 브라우저 비교

- **Chrome**: 붙여넣기가 조합을 취소할 수 있음
- **Edge**: Chrome과 유사함
- **Firefox**: 조합 중 다른 붙여넣기 동작을 가질 수 있음
- **Safari**: Windows에서 적용되지 않음

## 참고 및 해결 방법 가능한 방향

- 활성 조합 중 붙여넣기 방지
- 조합이 완료될 때까지 대기한 후 붙여넣기 허용
- 특히 복잡한 문자 조합이 있는 조합 중 붙여넣기 이벤트를 주의 깊게 처리
