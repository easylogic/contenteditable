---
id: ce-0175
scenarioId: scenario-ime-candidate-list-and-conversion-issues
locale: ko
os: Windows
osVersion: "11"
device: Desktop or Laptop
deviceVersion: Any
browser: Chrome
browserVersion: "120.0"
keyboard: Japanese (IME)
caseTitle: Chrome에서 일본어 IME 한자 변환 후보 목록 위치 문제
description: "Windows의 Chrome에서 일본어 IME를 사용할 때 contenteditable 요소에 대한 한자 변환 후보 목록이 잘못된 위치에 나타나거나 후보 내에서 화살표 키 탐색이 후보를 탐색하는 대신 캐럿을 이동시킬 수 있습니다."
tags:
  - ime
  - composition
  - japanese
  - kanji
  - candidate-list
  - chrome
  - windows
status: draft
domSteps:
  - label: "Before"
    html: 'Hello <span style="text-decoration: underline; background: #fef08a;">かんじ</span>'
    description: "Japanese romaji input in progress (kanji → かんじ), candidate list displayed"
  - label: "After Arrow Keys (Bug)"
    html: 'Hello かんじ|'
    description: "Arrow key attempts candidate navigation, cursor moves causing candidate navigation to fail"
  - label: "✅ Expected"
    html: 'Hello <span style="text-decoration: underline; background: #fef08a;">かんじ</span>'
    description: "Expected: Arrow key navigates candidates, cursor maintained"
---

## 현상

Windows의 Chrome에서 contenteditable 요소에서 IME로 일본어 텍스트를 조합할 때 로마자를 한자로 변환하는 것은 후보 목록을 표시하는 것을 포함합니다. 후보 목록이 잘못된 위치에 나타나거나 후보를 탐색하는 데 사용되는 화살표 키가 후보 목록을 탐색하는 대신 contenteditable에서 캐럿을 이동시킬 수 있습니다.

## 재현 예시

1. contenteditable div를 만듭니다.
2. 일본어 IME로 전환합니다 (Microsoft IME 또는 Google Japanese Input).
3. 로마자 텍스트를 입력합니다 (예: "kanji").
4. Space 또는 Enter를 눌러 한자 변환을 트리거합니다.
5. 후보 목록 위치를 관찰하고 화살표 키로 탐색을 시도합니다.

## 관찰된 동작

- 후보 목록이 입력 위치에서 멀리 나타날 수 있습니다
- 화살표 키(위/아래)가 후보를 탐색하는 대신 캐럿을 이동시킬 수 있습니다
- 다른 곳을 클릭하면 후보 목록이 사라질 수 있습니다
- 선택한 한자가 올바르게 삽입되지 않을 수 있습니다

## 예상 동작

- 후보 목록이 입력 위치 근처에 나타나야 합니다
- 화살표 키가 캐럿을 이동하지 않고 후보를 탐색해야 합니다
- 후보 선택이 안정적으로 작동해야 합니다
- 선택한 한자가 올바르게 삽입되어야 합니다

## 영향

- 사용자가 로마자를 한자로 안정적으로 변환할 수 없습니다
- 후보 선택이 실패할 때 워크플로가 중단됩니다
- 일관되지 않은 동작이 혼란을 만듭니다

## 브라우저 비교

- **Chrome**: 후보 목록 위치가 일관되지 않을 수 있음
- **Edge**: Chrome과 유사함
- **Firefox**: 다른 후보 목록 동작을 가질 수 있음
- **Safari**: Windows에서 적용되지 않음

## 참고 및 해결 방법 가능한 방향

- 후보 목록이 활성화된 시기를 감지하기 위해 조합 이벤트 모니터링
- 후보 탐색 중 기본 화살표 키 동작 방지
- 사용 가능한 경우 IME별 API를 사용하여 후보 목록 상태 감지
- 더 나은 제어를 위해 사용자 정의 후보 목록 UI 사용 고려
