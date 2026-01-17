---
id: ce-0177-thai-ime-tone-mark-positioning-firefox-ko
scenarioId: scenario-ime-combining-characters-composition
locale: ko
os: Windows
osVersion: "11"
device: Desktop or Laptop
deviceVersion: Any
browser: Firefox
browserVersion: "120.0"
keyboard: Thai (IME)
caseTitle: Firefox에서 태국어 IME 성조 표시 및 모음 위치 오류
description: "Windows의 Firefox에서 태국어 IME를 사용할 때 성조 표시와 모음 표시가 기본 자음에 대해 올바르게 위치하지 않을 수 있습니다. 결합 문자가 올바르게 렌더링되지 않아 잘못 표시된 태국어 텍스트가 발생할 수 있습니다."
tags:
  - ime
  - composition
  - thai
  - combining-characters
  - tone-marks
  - firefox
  - windows
status: draft
domSteps:
  - label: "Before"
    html: 'Hello <span style="text-decoration: underline; background: #fef08a;">สวัส</span>'
    description: "Thai composition in progress (สวัส)"
  - label: "After (Bug)"
    html: 'Hello สวัส'
    description: "Tone mark position error or combining characters separated"
  - label: "✅ Expected"
    html: 'Hello สวัสดี'
    description: "Expected: Tone marks and vowel marks correctly combined"
---

## 현상

Windows의 Firefox에서 contenteditable 요소에서 IME로 태국어 텍스트를 조합할 때 성조 표시(ไม้เอก, ไม้โท 등)와 모음 표시가 기본 자음에 대해 올바르게 위치하지 않을 수 있습니다. 결합 문자가 올바르게 렌더링되지 않아 읽기 어렵거나 불가능한 태국어 텍스트가 발생할 수 있습니다.

## 재현 예시

1. contenteditable div를 만듭니다.
2. 태국어 IME로 전환합니다.
3. 성조 표시와 모음 표시가 있는 태국어 텍스트를 입력합니다 (예: "สวัสดี").
4. 성조 표시와 모음 표시의 위치를 관찰합니다.
5. 다른 브라우저에서 텍스트 렌더링을 확인합니다.

## 관찰된 동작

- 성조 표시가 잘못된 문자 위나 아래에 나타날 수 있습니다
- 모음 표시가 자음과 올바르게 결합되지 않을 수 있습니다
- 문자 순서가 잘못될 수 있습니다
- 텍스트가 DOM에서는 올바르게 보이지만 시각적으로 잘못 렌더링될 수 있습니다
- Backspace가 결합 문자를 올바르게 삭제하지 않을 수 있습니다

## 예상 동작

- 성조 표시가 기본 자음에 대해 올바르게 위치해야 합니다
- 모음 표시가 자음과 올바르게 결합되어야 합니다
- 문자 순서가 태국어 쓰기 규칙을 따라야 합니다
- 시각적 렌더링이 논리적 구조와 일치해야 합니다
- Backspace가 결합 문자를 올바르게 처리해야 합니다

## 영향

- 태국어 텍스트가 읽을 수 없거나 읽기 어려울 수 있습니다
- 사용자가 올바른 태국어 텍스트를 안정적으로 입력할 수 없습니다
- 텍스트가 한 브라우저에서는 올바르게 보이지만 다른 브라우저에서는 잘못 보일 수 있습니다

## 브라우저 비교

- **Firefox**: 결합 문자 위치 문제가 더 많음
- **Chrome**: 일반적으로 태국어 조합에 대한 더 나은 지원
- **Safari**: 렌더링이 일관되지 않을 수 있음

## 참고 및 해결 방법 가능한 방향

- 입력 후 태국어 문자 조합 검증
- 올바른 결합 문자 순서 확인
- 시각적 렌더링 문제 모니터링
- 태국어 문자에 대한 적절한 글꼴 지원 보장
- 결합 문자 문제를 수정하기 위해 텍스트 정규화(NFC) 고려
