---
id: ce-0031
scenarioId: scenario-formatting-persistence
locale: ko
os: Linux
osVersion: "Ubuntu 22.04"
device: Desktop or Laptop
deviceVersion: Any
browser: Firefox
browserVersion: "120.0"
keyboard: US
caseTitle: 밑줄 서식을 적용한 후 입력 시 밑줄 서식이 손실됨
description: "선택한 텍스트에 밑줄 서식을 적용한 후 계속 입력하면 Linux의 Firefox에서 새로 입력한 문자에 밑줄 서식이 유지되지 않습니다."
tags:
  - formatting
  - underline
  - firefox
status: draft
domSteps:
  - label: "Before"
    html: '<u>Hello</u>|'
    description: "밑줄이 있는 텍스트, 커서(|)가 끝에 있음"
  - label: "After Typing (Bug)"
    html: '<u>Hello</u>World'
    description: "새로 입력한 텍스트에 밑줄이 없음"
  - label: "✅ Expected"
    html: '<u>HelloWorld</u>'
    description: "예상: 새로 입력한 텍스트도 밑줄을 상속받음"
---

## 현상

선택한 텍스트에 밑줄 서식을 적용한 후 계속 입력하면 Linux의 Firefox에서 새로 입력한 문자에 밑줄 서식이 유지되지 않습니다.

## 재현 예시

1. contenteditable div를 만듭니다.
2. 일부 텍스트를 입력합니다.
3. 텍스트를 선택하고 밑줄 서식을 적용합니다 (Ctrl+U 또는 execCommand를 통해).
4. 밑줄이 있는 텍스트 끝에 캐럿을 배치합니다.
5. 계속 입력합니다.

## 관찰된 동작

- Linux의 Firefox에서 밑줄이 있는 텍스트 뒤에 새로 입력한 문자가 밑줄이 없습니다.
- 캐럿이 이동할 때 서식 상태가 손실된 것으로 보입니다.

## 예상 동작

- 캐럿이 서식이 있는 텍스트 내부 또는 바로 뒤에 있을 때 새로 입력한 문자가 앞선 텍스트의 서식을 상속받아야 합니다.
