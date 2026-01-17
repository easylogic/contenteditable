---
id: ce-0198-hindi-ime-space-ignored-firefox-ko
scenarioId: scenario-space-during-composition
locale: ko
os: Windows
osVersion: "11"
device: Desktop or Laptop
deviceVersion: Any
browser: Firefox
browserVersion: "120.0"
keyboard: Hindi (IME - Devanagari)
caseTitle: 힌디어 IME 조합 중 Space 키가 무시됨
description: "contenteditable 요소에서 데바나가리 IME로 힌디어 텍스트를 조합하는 동안 Space 키를 누르면 무시되거나 조합이 예상치 못하게 커밋될 수 있습니다. 이 동작은 네이티브 텍스트 컨트롤과 다르며 단어 경계 감지에 영향을 줄 수 있습니다."
tags:
  - composition
  - ime
  - space
  - hindi
  - devanagari
  - firefox
  - windows
status: draft
domSteps:
  - label: "Before"
    html: 'Hello <span style="text-decoration: underline; background: #fef08a;">नम</span>'
    description: "Hindi Devanagari composition in progress (नम), includes vowel signs and combining characters"
  - label: "After Space (Bug)"
    html: 'Hello नम'
    description: "Space key ignored or composition unexpectedly committed"
  - label: "✅ Expected"
    html: 'Hello नम '
    description: "Expected: Space key inserts space or commits composition"
---

## 현상

`contenteditable` 요소에서 데바나가리 IME로 힌디어 텍스트를 조합하는 동안 Space 키를 누르면 무시되거나 조합이 예상치 못하게 커밋될 수 있습니다. 이 동작은 네이티브 텍스트 컨트롤과 다르며 단어 경계 감지에 영향을 줄 수 있습니다.

## 재현 예시

1. 편집 가능한 영역에 포커스를 둡니다.
2. 데바나가리 문자로 힌디어 IME로 전환합니다.
3. 모음 기호와 결합 문자가 있는 힌디어 텍스트 조합을 시작합니다 (예: "नमस्ते").
4. 조합 중에 Space를 한 번 이상 누릅니다.

## 관찰된 동작

- Space 키가 때때로 보이는 공백을 삽입하지 않습니다
- 일부 시퀀스에서 조합이 커밋되고 공백이 삽입되지만 이벤트 순서가 네이티브 컨트롤과 다릅니다
- 모음 기호나 결합 문자가 Space 키 입력에 영향을 받을 수 있습니다
- 단어 경계가 올바르게 감지되지 않을 수 있습니다

## 예상 동작

- Space가 `contenteditable`과 네이티브 텍스트 입력 간에 일관되게 동작해야 합니다
- Space가 조합 중 또는 후에 안정적으로 삽입되어야 합니다
- 단어 경계가 올바르게 감지되어야 합니다

## 브라우저 비교

- **Firefox**: 데바나가리 조합 중 Space 키에 더 많은 문제가 있을 수 있음
- **Chrome**: 일반적으로 더 나은 지원
- **Edge**: Chrome과 유사함
- **Safari**: Windows에서 적용되지 않음

## 참고 및 해결 방법 가능한 방향

- Space 키를 적절하게 처리하기 위해 조합 상태 모니터링
- 단어 경계를 처리할 때 복잡한 문자 조합 고려
- 결합 문자가 있는 활성 조합 중 Space 키 이벤트를 주의 깊게 처리
