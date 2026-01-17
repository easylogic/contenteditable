---
id: ce-0191-japanese-ime-number-candidate-selection-chrome-ko
scenarioId: scenario-ime-composition-number-input
locale: ko
os: Windows
osVersion: "11"
device: Desktop or Laptop
deviceVersion: Any
browser: Chrome
browserVersion: "120.0"
keyboard: Japanese (IME)
caseTitle: 일본어 IME 숫자 키가 숫자 삽입 대신 후보를 선택함
description: "contenteditable 요소에서 일본어 IME를 사용할 때 한자 변환 중 숫자 키(1-9)를 누르면 변환 목록에서 후보를 선택하는 대신 숫자를 삽입합니다. 이것은 후보 목록이 활성화되어 있는 동안 사용자가 숫자를 삽입하는 것을 방지합니다."
tags:
  - composition
  - ime
  - number-input
  - candidate-selection
  - japanese
  - chrome
  - windows
status: draft
domSteps:
  - label: "Before"
    html: 'Hello <span style="text-decoration: underline; background: #fef08a;">かんじ</span>'
    description: "Japanese romaji input in progress, candidate list displayed (1. 漢字 2. 感じ 3. 幹事...)"
  - label: "After Number 5 (Bug)"
    html: 'Hello 幹事'
    description: "Number 5 key selects candidate, number insertion fails"
  - label: "✅ Expected"
    html: 'Hello かんじ5'
    description: "Expected: Number 5 inserted or Shift+5 can input number"
---

## 현상

`contenteditable` 요소에서 일본어 IME를 사용할 때 한자 변환 중 숫자 키(1-9)를 누르면 변환 목록에서 후보를 선택하는 대신 숫자를 삽입합니다. 이것은 후보 목록이 활성화되어 있는 동안 사용자가 숫자를 삽입하는 것을 방지합니다.

## 재현 예시

1. 편집 가능한 영역에 포커스를 둡니다.
2. 일본어 IME를 활성화합니다.
3. 로마자 텍스트를 입력합니다 (예: "kanji")하고 한자 변환을 트리거합니다 (후보 목록이 나타남).
4. 숫자 "5"를 삽입하기 위해 숫자 키(예: "5")를 누르려고 시도합니다.

## 관찰된 동작

- 숫자 키(1-9)가 숫자를 삽입하는 대신 변환 목록에서 후보를 선택합니다
- 사용자가 후보 목록이 활성화되어 있는 동안 숫자를 삽입할 수 없습니다
- 변환이 완료된 후 숫자 키가 정상적으로 작동합니다
- 동작이 숫자를 삽입할 수 있는 네이티브 입력 필드와 다릅니다

## 예상 동작

- 사용자가 후보 목록이 활성화되어 있어도 숫자를 삽입할 수 있어야 합니다
- 숫자 키가 숫자를 삽입하는 방법(예: Shift+Number 또는 다른 키 조합)을 가져야 합니다
- 동작이 네이티브 입력 필드와 일관되어야 합니다

## 브라우저 비교

- **Chrome**: 숫자 키가 후보 선택을 트리거함
- **Edge**: Chrome과 유사함
- **Firefox**: 다른 숫자 키 동작을 가질 수 있음
- **Safari**: Windows에서 적용되지 않음

## 참고 및 해결 방법 가능한 방향

- 숫자 키 기본 동작을 방지하고 수동으로 숫자 삽입
- 후보 선택 중 숫자 입력을 위한 대체 키 조합 사용
- 숫자 입력 제한에 대한 사용자 UI 피드백 제공
