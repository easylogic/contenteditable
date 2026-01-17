---
id: ce-0011-bold-formatting-lost-ko
scenarioId: scenario-formatting-persistence
locale: ko
os: macOS
osVersion: "14.0"
device: Desktop or Laptop
deviceVersion: Any
browser: Safari
browserVersion: "17.0"
keyboard: US
caseTitle: 굵게 서식을 적용한 후 입력 시 굵게 서식이 손실됨
description: "선택한 텍스트에 굵게 서식을 적용한 후 계속 입력하면 Safari에서 새로 입력한 문자에 굵게 서식이 유지되지 않습니다."
tags:
  - formatting
  - bold
  - safari
status: draft
domSteps:
  - label: "Before"
    html: 'Hello World'
    description: "기본 텍스트"
  - label: "After Bold"
    html: 'Hello <strong>World</strong>'
    description: "굵게 서식 적용됨"
  - label: "After Typing (Bug)"
    html: 'Hello <strong>World</strong> New'
    description: "새로 입력한 텍스트에 굵게 서식이 적용되지 않음"
  - label: "✅ Expected"
    html: 'Hello <strong>World New</strong>'
    description: "예상: 새로 입력한 텍스트도 굵게 서식을 상속받음"
---

## 현상

선택한 텍스트에 굵게 서식을 적용한 후 계속 입력하면 Safari에서 새로 입력한 문자에 굵게 서식이 유지되지 않습니다.

## 재현 예시

1. contenteditable div를 만듭니다.
2. 일부 텍스트를 입력합니다.
3. 텍스트를 선택하고 굵게 서식을 적용합니다 (Cmd+B 또는 execCommand를 통해).
4. 굵은 텍스트 끝에 캐럿을 배치합니다.
5. 계속 입력합니다.

## 관찰된 동작

- Safari에서 굵은 텍스트 뒤에 새로 입력한 문자가 굵지 않습니다.
- 캐럿이 이동할 때 서식 상태가 손실된 것으로 보입니다.

## 예상 동작

- 캐럿이 서식이 있는 텍스트 내부 또는 바로 뒤에 있을 때 새로 입력한 문자가 앞선 텍스트의 서식을 상속받아야 합니다.
