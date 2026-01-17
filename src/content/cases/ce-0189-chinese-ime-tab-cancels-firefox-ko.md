---
id: ce-0189-chinese-ime-tab-cancels-firefox-ko
scenarioId: scenario-ime-composition-tab-key
locale: ko
os: Windows
osVersion: "11"
device: Desktop or Laptop
deviceVersion: Any
browser: Firefox
browserVersion: "120.0"
keyboard: Chinese (IME - Pinyin)
caseTitle: Firefox에서 중국어 IME 조합이 Tab 키로 취소됨
description: "contenteditable 요소에서 병음 IME로 중국어 텍스트를 조합할 때 Tab을 누르면 조합이 취소되고 포커스가 다음 요소로 이동합니다. 조합된 텍스트가 손실되거나 부분적으로 커밋될 수 있습니다."
tags:
  - composition
  - ime
  - tab
  - navigation
  - chinese
  - firefox
  - windows
status: draft
domSteps:
  - label: "Before"
    html: 'Hello <span style="text-decoration: underline; background: #fef08a;">nihao</span>'
    description: "Chinese Pinyin input in progress (nihao)"
  - label: "After Tab (Bug)"
    html: 'Hello '
    description: "Tab key cancels composition, focus moves, composition text lost"
  - label: "✅ Expected"
    html: 'Hello 你好'
    description: "Expected: Tab navigation after composition completes or composition text preserved"
---

## 현상

`contenteditable` 요소에서 병음 IME로 중국어 텍스트를 조합할 때 Tab을 누르면 조합이 취소되고 포커스가 다음 요소로 이동합니다. 조합된 텍스트가 손실되거나 탐색이 발생하기 전에 부분적으로 커밋될 수 있습니다.

## 재현 예시

1. 편집 가능한 영역에 포커스를 둡니다 (예: 폼이나 테이블에서).
2. 중국어 병음 IME를 활성화합니다.
3. 병음 텍스트를 입력합니다 (예: "nihao")하고 문자 변환을 시작합니다.
4. 다음 요소로 이동하기 위해 Tab을 누릅니다.

## 관찰된 동작

- compositionend 이벤트가 불완전한 데이터로 발생합니다
- 포커스가 다음 요소로 이동합니다
- 조합된 텍스트가 손실되거나 부분적으로 커밋될 수 있습니다
- Tab 키 동작이 조합 처리와 충돌합니다

## 예상 동작

- Tab 탐색이 발생하기 전에 조합이 완료되어야 합니다
- 조합된 텍스트가 손실되지 않아야 합니다
- Tab 탐색이 활성 조합이 있든 없든 일관되게 작동해야 합니다

## 브라우저 비교

- **Firefox**: Tab이 조합을 취소하고 포커스를 이동시킬 수 있음
- **Chrome**: 조합 중 다른 Tab 키 동작을 가질 수 있음
- **Edge**: Chrome과 유사함
- **Safari**: Windows에서 적용되지 않음

## 참고 및 해결 방법 가능한 방향

- 활성 조합 중 Tab 방지
- Tab 탐색을 허용하기 전에 조합 완료 대기
- 조합 중 Tab 키 이벤트를 주의 깊게 처리
