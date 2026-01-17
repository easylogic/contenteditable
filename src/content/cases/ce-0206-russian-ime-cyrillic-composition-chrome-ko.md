---
id: ce-0206-russian-ime-cyrillic-composition-chrome-ko
scenarioId: scenario-ime-combining-characters-composition
locale: ko
os: Windows
osVersion: "11"
device: Desktop or Laptop
deviceVersion: Any
browser: Chrome
browserVersion: "120.0"
keyboard: Russian (IME - Cyrillic)
caseTitle: 러시아어 IME 키릴 문자 조합 문제
description: "contenteditable 요소에서 키릴 IME로 러시아어 텍스트를 조합할 때 일부 키릴 문자가 올바르게 조합되지 않거나 키보드 레이아웃 전환이 예상치 못한 문자 삽입을 일으킬 수 있습니다."
tags:
  - ime
  - composition
  - russian
  - cyrillic
  - chrome
  - windows
status: draft
domSteps:
  - label: "Before"
    html: 'Hello <span style="text-decoration: underline; background: #fef08a;">Прив</span>'
    description: "Russian Cyrillic character input in progress (Прив)"
  - label: "After (Bug)"
    html: 'Hello Прив'
    description: "Character composition error or keyboard layout switch issue"
  - label: "✅ Expected"
    html: 'Hello Привет'
    description: "Expected: Cyrillic characters correctly composed"
---

## 현상

`contenteditable` 요소에서 키릴 IME로 러시아어 텍스트를 조합할 때 일부 키릴 문자가 올바르게 조합되지 않거나 키보드 레이아웃 전환이 예상치 못한 문자 삽입을 일으킬 수 있습니다.

## 재현 예시

1. 편집 가능한 영역에 포커스를 둡니다.
2. 러시아어 키릴 IME를 활성화하거나 키보드 레이아웃을 러시아어로 전환합니다.
3. 러시아어 텍스트를 입력합니다 (예: "Привет").
4. 문자 조합과 키보드 레이아웃 동작을 관찰합니다.

## 관찰된 동작

- 일부 키릴 문자가 올바르게 조합되지 않을 수 있습니다
- 키보드 레이아웃 전환이 예상치 못한 문자 삽입을 일으킬 수 있습니다
- 문자 인코딩 문제가 발생할 수 있습니다
- 동작이 네이티브 입력 필드와 다를 수 있습니다

## 예상 동작

- 키릴 문자가 올바르게 조합되어야 합니다
- 키보드 레이아웃 전환이 부드럽게 작동해야 합니다
- 문자 인코딩이 일관되어야 합니다
- 동작이 네이티브 입력 필드와 일치해야 합니다

## 브라우저 비교

- **Chrome**: 일반적으로 키릴에 대한 좋은 지원
- **Edge**: Chrome과 유사함
- **Firefox**: 다른 동작을 가질 수 있음
- **Safari**: Windows에서 적용되지 않음

## 참고 및 해결 방법 가능한 방향

- 키보드 레이아웃 변경 모니터링
- 문자 인코딩을 주의 깊게 처리
- 키릴 문자 조합 검증
