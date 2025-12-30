---
id: ce-0180
scenarioId: scenario-ime-combining-characters-composition
locale: ko
os: Windows
osVersion: "11"
device: Desktop or Laptop
deviceVersion: Any
browser: Chrome
browserVersion: "120.0"
keyboard: Hindi (IME - Devanagari)
caseTitle: Chrome에서 힌디어 IME 데바나가리 결합 및 모음 기호 조합 문제
description: "Windows의 Chrome에서 데바나가리 문자로 힌디어 IME를 사용할 때 자음+모음 조합과 결합 문자가 올바르게 형성되지 않을 수 있습니다. 모음 기호(마트라)가 잘못 배치되거나 결합 문자가 올바르게 렌더링되지 않을 수 있습니다."
tags:
  - ime
  - composition
  - hindi
  - devanagari
  - indian-languages
  - conjuncts
  - chrome
  - windows
status: draft
domSteps:
  - label: "Before"
    html: 'Hello <span style="text-decoration: underline; background: #fef08a;">नम</span>'
    description: "Hindi Devanagari composition in progress (नम)"
  - label: "After (Bug)"
    html: 'Hello न म स् ते'
    description: "Conjunct formation failed, vowel sign position error"
  - label: "✅ Expected"
    html: 'Hello नमस्ते'
    description: "Expected: Conjuncts and vowel signs correctly formed"
---

## 현상

Windows의 Chrome에서 contenteditable 요소에서 데바나가리 IME로 힌디어 텍스트를 조합할 때 자음+모음 조합과 결합 문자(여러 자음이 결합되는 경우)가 올바르게 형성되지 않을 수 있습니다. 모음 기호(마트라)가 자음에 대해 잘못 배치되거나 결합 문자가 올바르게 렌더링되지 않아 잘못 형성된 데바나가리 텍스트가 발생할 수 있습니다.

## 재현 예시

1. contenteditable div를 만듭니다.
2. 데바나가리 문자로 힌디어 IME로 전환합니다.
3. 모음 기호와 결합 문자가 있는 힌디어 텍스트를 입력합니다 (예: "नमस्ते").
4. 모음 기호 위치와 결합 형성을 관찰합니다.
5. 텍스트 렌더링을 확인합니다.

## 관찰된 동작

- 모음 기호(마트라)가 자음에 대해 올바르게 위치하지 않을 수 있습니다
- 여러 자음이 결합 문자로 결합되지 않을 수 있습니다
- 문자 순서가 잘못될 수 있습니다
- 문자가 논리적으로는 올바르지만 시각적으로 잘못 렌더링될 수 있습니다
- Backspace가 복잡한 문자 조합에서 올바르게 작동하지 않을 수 있습니다

## 예상 동작

- 모음 기호가 자음에 대해 올바르게 위치해야 합니다
- 여러 자음이 올바르게 결합 문자로 결합되어야 합니다
- 문자 순서가 데바나가리 쓰기 규칙을 따라야 합니다
- 시각적 렌더링이 논리적 구조와 일치해야 합니다
- Backspace가 복잡한 문자 조합을 올바르게 처리해야 합니다

## 영향

- 힌디어/인도 언어 텍스트가 읽을 수 없거나 잘못될 수 있습니다
- 사용자가 올바른 텍스트를 안정적으로 입력할 수 없습니다
- 복잡한 문자 조합이 형성되지 않을 수 있습니다

## 브라우저 비교

- **Chrome**: 일반적으로 더 나은 지원이지만 결합 형성이 실패할 수 있음
- **Edge**: Chrome과 유사함
- **Firefox**: 결합 형성 문제가 더 많을 수 있음
- **Safari**: 데바나가리 렌더링이 일관되지 않을 수 있음, 특히 모바일에서

## 참고 및 해결 방법 가능한 방향

- 입력 후 데바나가리 문자 형성 검증
- 올바른 모음 기호 위치 확인
- 올바른 문자 조합을 보장하기 위해 텍스트 정규화(NFC) 사용
- 렌더링 문제 모니터링
- 데바나가리 문자에 대한 적절한 글꼴 지원 보장
- 복잡한 결합 형성을 주의 깊게 처리
