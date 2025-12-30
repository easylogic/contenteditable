---
id: ce-0181
scenarioId: scenario-ime-enter-breaks
locale: ko
os: Windows
osVersion: "11"
device: Desktop or Laptop
deviceVersion: Any
browser: Chrome
browserVersion: "120.0"
keyboard: Japanese (IME)
caseTitle: 일본어 IME 조합이 Enter 키를 누르면 취소됨
description: "contenteditable 요소에서 IME로 일본어 텍스트를 조합할 때 Enter를 누르면 조합이 취소되고 부분 로마자 또는 불완전한 한자 변환만 커밋될 수 있습니다. 캐럿이 다음 줄로 이동하지만 마지막 조합 문자가 손실될 수 있습니다."
tags:
  - composition
  - ime
  - enter
  - japanese
  - chrome
  - windows
status: draft
domSteps:
  - label: "Before"
    html: 'Hello <span style="text-decoration: underline; background: #fef08a;">かんじ</span>'
    description: "Japanese romaji input in progress (kanji → かんじ)"
  - label: "After Enter (Bug)"
    html: 'Hello かん<br>'
    description: "Enter key cancels composition, only partial romaji remains"
  - label: "✅ Expected"
    html: 'Hello かんじ<br>'
    description: "Expected: Line break after composition completes"
---

## 현상

`contenteditable` 요소에서 IME로 일본어 텍스트를 조합할 때 Enter를 누르면 조합이 취소되고 부분 로마자 또는 불완전한 한자 변환이 커밋될 수 있습니다. 일부 브라우저와 IME 조합에서 캐럿이 다음 줄로 이동하지만 마지막 조합 문자 또는 변환이 손실될 수 있습니다.

## 재현 예시

1. 편집 가능한 영역에 포커스를 둡니다.
2. 일본어 IME를 활성화합니다.
3. 로마자 텍스트를 입력합니다 (예: "kanji")하고 한자 변환을 시작합니다.
4. 변환을 완료하기 전에 Enter를 눌러 새 줄을 삽입합니다.

## 관찰된 동작

- compositionend 이벤트가 불완전한 데이터로 발생합니다.
- 캐럿이 다음 줄로 이동합니다.
- 부분 로마자 또는 불완전한 한자 변환이 손실될 수 있습니다.
- 변환 후보 목록이 선택을 커밋하지 않고 사라질 수 있습니다.

## 예상 동작

- IME가 줄바꿈을 삽입하기 전에 현재 조합을 완료해야 합니다.
- 마지막 조합 문자 또는 변환이 DOM 텍스트 콘텐츠에 남아 있어야 합니다.
- 후보 목록이 활성화되어 있으면 적절하게 처리되어야 합니다.

## 브라우저 비교

- **Chrome**: Enter를 누르면 조합이 취소될 수 있음
- **Edge**: Chrome과 유사함
- **Firefox**: 다른 동작을 가질 수 있음
- **Safari**: Windows에서 적용되지 않음

## 참고 및 해결 방법 가능한 방향

- `beforeinput`, `compositionend`, `input` 이벤트의 순서를 관찰합니다.
- 브라우저가 `compositionend` 전 또는 후에 `inputType = 'insertParagraph'`가 있는 `beforeinput` 이벤트를 발생시키는지 확인합니다.
- 가능한 해결 방법은 `keydown`에서 Enter를 가로채고 조합이 완료될 때까지 기본 동작을 방지하는 것입니다.
