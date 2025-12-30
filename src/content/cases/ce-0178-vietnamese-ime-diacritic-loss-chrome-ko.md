---
id: ce-0178
scenarioId: scenario-ime-combining-characters-composition
locale: ko
os: Windows
osVersion: "11"
device: Desktop or Laptop
deviceVersion: Any
browser: Chrome
browserVersion: "120.0"
keyboard: Vietnamese (IME)
caseTitle: Chrome에서 베트남어 IME 분음 기호 표시가 조합 중 손실됨
description: "Windows의 Chrome에서 베트남어 IME를 사용할 때 분음 기호 표시(악센트)가 조합 또는 편집 작업 중에 손실될 수 있습니다. 기본 문자와 분음 기호가 올바르게 결합되지 않거나 분음 기호가 잘못된 기본 문자와 결합될 수 있습니다."
tags:
  - ime
  - composition
  - vietnamese
  - diacritics
  - accents
  - chrome
  - windows
status: draft
domSteps:
  - label: "Before"
    html: 'Hello <span style="text-decoration: underline; background: #fef08a;">xin chao</span>'
    description: "Vietnamese input in progress (xin chao)"
  - label: "After (Bug)"
    html: 'Hello xin chao'
    description: "Accent marks lost (chào → chao)"
  - label: "✅ Expected"
    html: 'Hello xin chào'
    description: "Expected: Accent marks preserved (chào)"
---

## 현상

Windows의 Chrome에서 contenteditable 요소에서 IME로 베트남어 텍스트를 조합할 때 분음 기호 표시(ă, â, ê, ô, ơ, ư 및 그들의 성조 표시)가 조합 중에 또는 backspace/delete를 사용할 때 손실될 수 있습니다. 분음 기호가 잘못된 기본 문자와 결합되거나 기본 문자와 분음 기호가 잘못된 순서로 삽입될 수도 있습니다.

## 재현 예시

1. contenteditable div를 만듭니다.
2. 베트남어 IME로 전환합니다 (Telex 또는 VNI 입력 방법).
3. 분음 기호가 있는 베트남어 텍스트를 입력합니다 (예: "xin chào").
4. backspace를 사용하여 문자를 삭제합니다.
5. 분음 기호가 올바르게 보존되는지 관찰합니다.

## 관찰된 동작

- 분음 기호 표시가 조합 중에 손실될 수 있습니다
- 분음 기호가 잘못된 기본 문자와 결합될 수 있습니다
- 기본 문자와 분음 기호가 잘못된 순서로 삽입될 수 있습니다
- Backspace가 기본 문자와 분음 기호를 올바르게 제거하지 않을 수 있습니다
- 여러 분음 기호가 올바르게 결합되지 않을 수 있습니다

## 예상 동작

- 분음 기호 표시가 조합 중에 보존되어야 합니다
- 분음 기호가 기본 문자와 올바르게 결합되어야 합니다
- 기본 문자와 분음 기호가 올바른 순서로 삽입되어야 합니다
- Backspace가 기본+분음 기호 조합을 올바르게 처리해야 합니다
- 여러 분음 기호가 올바르게 결합되어야 합니다

## 영향

- 베트남어 텍스트가 철자가 잘못되었거나 읽을 수 없을 수 있습니다
- 사용자가 분음 기호를 자주 수동으로 수정해야 합니다
- 텍스트가 올바르게 보이지만 의미적으로 잘못될 수 있습니다

## 브라우저 비교

- **Chrome**: 일반적으로 좋은 지원이지만 분음 기호 손실이 발생할 수 있음
- **Edge**: Chrome과 유사함
- **Firefox**: 분음 기호 위치 문제가 더 많을 수 있음
- **Safari**: 분음 기호 조합이 일관되지 않을 수 있음

## 참고 및 해결 방법 가능한 방향

- 분음 기호 형성을 감지하기 위해 조합 이벤트 모니터링
- 입력 후 베트남어 문자 형성 검증
- 올바른 문자 조합을 보장하기 위해 텍스트 정규화(NFC) 사용
- 분음 기호를 보존하기 위해 backspace를 주의 깊게 처리
- 베트남어 문자에 대한 올바른 Unicode 정규화 확인
