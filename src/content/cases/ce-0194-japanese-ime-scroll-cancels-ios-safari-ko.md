---
id: ce-0194-japanese-ime-scroll-cancels-ios-safari-ko
scenarioId: scenario-ime-composition-scroll
locale: ko
os: iOS
osVersion: "17.0"
device: iPhone or iPad
deviceVersion: Any
browser: Safari
browserVersion: "17.0"
keyboard: Japanese (IME)
caseTitle: iOS Safari에서 일본어 IME 조합이 스크롤로 취소됨
description: "iOS Safari의 contenteditable 요소에서 IME로 일본어 텍스트를 조합할 때 스크롤(터치 스크롤)이 활성 조합을 취소하고 불완전한 한자 변환을 손실합니다. 이것은 텍스트 입력 중 스크롤이 흔한 모바일 기기에서 특히 문제가 됩니다."
tags:
  - composition
  - ime
  - scroll
  - mobile
  - japanese
  - ios
  - safari
status: draft
domSteps:
  - label: "Before"
    html: 'Hello <span style="text-decoration: underline; background: #fef08a;">かんじ</span>'
    description: "Japanese romaji input in progress, candidate list displayed"
  - label: "After Scroll (Bug)"
    html: 'Hello '
    description: "Scroll cancels composition, incomplete character conversion lost"
  - label: "✅ Expected"
    html: 'Hello かんじ'
    description: "Expected: Composition preserved during scroll or handled gracefully"
---

## 현상

iOS Safari의 `contenteditable` 요소에서 IME로 일본어 텍스트를 조합할 때 스크롤(터치 스크롤)이 활성 조합을 취소하고 불완전한 한자 변환을 손실합니다. 이것은 텍스트 입력 중 스크롤이 흔한 모바일 기기에서 특히 문제가 됩니다.

## 재현 예시

1. iOS 기기에서 편집 가능한 영역에 포커스를 둡니다.
2. 일본어 IME를 활성화합니다.
3. 로마자 텍스트를 입력합니다 (예: "kanji")하고 한자 변환을 시작합니다.
4. 변환을 완료하기 전에 페이지를 스크롤합니다 (터치 스크롤).

## 관찰된 동작

- compositionend 이벤트가 불완전한 데이터로 발생합니다
- 불완전한 한자 변환이 손실됩니다
- 스크롤이 조합을 취소합니다
- 후보 목록이 사라집니다
- 손실된 조합에 대한 복구 메커니즘이 없습니다

## 예상 동작

- 스크롤 중 조합이 보존되어야 합니다
- 불완전한 변환이 손실되지 않아야 합니다
- 스크롤이 조합을 방해하지 않아야 합니다
- 스크롤 후 IME UI가 올바르게 재배치되어야 합니다

## 브라우저 비교

- **iOS Safari**: 스크롤이 조합을 취소함
- **iOS의 Chrome**: 다른 스크롤 동작을 가질 수 있음
- **데스크톱 브라우저**: 다른 동작을 가질 수 있음

## 참고 및 해결 방법 가능한 방향

- 활성 조합 중 스크롤 방지 (UX를 저하시킬 수 있음)
- 스크롤 이벤트를 모니터링하고 조합 상태 보존
- 조합 중 터치 스크롤 이벤트를 주의 깊게 처리
- 모바일 입력을 위한 대체 UI 패턴 고려
