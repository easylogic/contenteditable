---
id: ce-0183-japanese-ime-space-conversion-chrome-ko
scenarioId: scenario-space-during-composition
locale: ko
os: Windows
osVersion: "11"
device: Desktop or Laptop
deviceVersion: Any
browser: Chrome
browserVersion: "120.0"
keyboard: Japanese (IME)
caseTitle: 일본어 IME Space 키가 한자 변환과 충돌함
description: "contenteditable 요소에서 일본어 IME를 사용할 때 Space 키는 한자 변환에 사용되며 공백 문자 삽입과 충돌합니다. 조합 중 Space를 누르면 공백을 삽입하는 대신 변환이 트리거될 수 있거나 네이티브 텍스트 컨트롤과 비교하여 일관되지 않게 동작할 수 있습니다."
tags:
  - composition
  - ime
  - space
  - japanese
  - chrome
  - windows
status: draft
domSteps:
  - label: "Before"
    html: 'Hello <span style="text-decoration: underline; background: #fef08a;">かんじ</span>'
    description: "Japanese romaji input in progress (kanji → かんじ)"
  - label: "After Space (Bug)"
    html: 'Hello 漢字'
    description: "Space key converts to kanji, space insertion fails"
  - label: "✅ Expected"
    html: 'Hello 漢字 '
    description: "Expected: Space inserted after kanji conversion"
---

## 현상

`contenteditable` 요소에서 일본어 IME를 사용할 때 Space 키는 한자 변환에 사용되며 공백 문자 삽입과 충돌합니다. 조합 중 Space를 누르면 공백을 삽입하는 대신 변환이 트리거될 수 있거나 네이티브 텍스트 컨트롤과 비교하여 일관되지 않게 동작할 수 있습니다.

## 재현 예시

1. 편집 가능한 영역에 포커스를 둡니다.
2. 일본어 IME를 활성화합니다.
3. 로마자 텍스트를 입력합니다 (예: "kanji").
4. Space를 눌러 한자 변환을 트리거합니다.
5. 변환 후 공백 문자를 삽입하려고 시도합니다.

## 관찰된 동작

- Space 키가 공백 문자를 삽입하는 대신 한자 변환을 트리거합니다
- 변환 후 공백을 삽입하려면 여러 번 Space를 눌러야 할 수 있습니다
- 동작이 네이티브 텍스트 입력 컨트롤과 다를 수 있습니다
- 이벤트 순서(조합, 변환, 공백 삽입)가 일관되지 않을 수 있습니다

## 예상 동작

- Space 키 동작이 `contenteditable`과 네이티브 텍스트 입력 간에 일관되어야 합니다
- 사용자가 공백 문자를 안정적으로 삽입할 수 있어야 합니다
- 변환과 공백 삽입이 충돌하지 않아야 합니다

## 브라우저 비교

- **Chrome**: Space 키 동작이 변환과 충돌할 수 있음
- **Edge**: Chrome과 유사함
- **Firefox**: 다른 동작을 가질 수 있음
- **Safari**: Windows에서 적용되지 않음

## 참고 및 해결 방법 가능한 방향

- 변환 Space와 삽입 Space를 구분하기 위해 조합 및 변환 상태 모니터링
- 조합 중 공백 삽입을 위한 대체 방법 사용 고려
- 활성 조합 중 Space 키 이벤트를 주의 깊게 처리
