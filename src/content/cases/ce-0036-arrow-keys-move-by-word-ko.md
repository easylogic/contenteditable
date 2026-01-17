---
id: ce-0036-arrow-keys-move-by-word-ko
scenarioId: scenario-caret-movement-granularity
locale: ko
os: Windows
osVersion: "11"
device: Desktop or Laptop
deviceVersion: Any
browser: Chrome
browserVersion: "120.0"
keyboard: US
caseTitle: 수정자 키를 누르지 않았을 때 화살표 키가 문자 대신 단어로 이동함
description: "Windows의 Chrome에서 화살표 키가 수정자 키를 누르지 않았을 때도 문자 대신 단어로 캐럿을 이동할 수 있습니다. 이로 인해 정확한 커서 위치 지정이 어렵습니다."
tags:
  - arrow-keys
  - caret
  - navigation
  - chrome
status: draft
domSteps:
  - label: "Before"
    html: 'Hello| World Test'
    description: "텍스트, 커서(|)가 'Hello' 뒤에 있음"
  - label: "After Right Arrow (Bug)"
    html: 'Hello World| Test'
    description: "오른쪽 화살표가 단어로 이동 (예상: 한 번에 한 문자씩)"
  - label: "✅ Expected"
    html: 'Hello |World Test'
    description: "예상: 오른쪽 화살표가 한 번에 한 문자씩 이동"
---

## 현상

Windows의 Chrome에서 화살표 키가 수정자 키를 누르지 않았을 때도 문자 대신 단어로 캐럿을 이동할 수 있습니다. 이로 인해 정확한 커서 위치 지정이 어렵습니다.

## 재현 예시

1. contenteditable div를 만듭니다.
2. 여러 단어가 있는 텍스트를 입력합니다.
3. 좌우 화살표 키를 사용하여 캐럿을 이동합니다.
4. 캐럿 이동 세분성을 관찰합니다.

## 관찰된 동작

- Windows의 Chrome에서 화살표 키가 문자 대신 단어로 점프할 수 있습니다.
- 동작이 일관되지 않으며 텍스트 콘텐츠나 서식에 따라 달라질 수 있습니다.
- 문자별 정확한 탐색이 어렵습니다.

## 예상 동작

- 화살표 키는 기본적으로 한 번에 한 문자씩 캐럿을 이동해야 합니다.
- 단어 수준 이동은 수정자 키(예: Ctrl+Arrow)와 함께만 발생해야 합니다.
- 동작이 일관되고 예측 가능해야 합니다.
