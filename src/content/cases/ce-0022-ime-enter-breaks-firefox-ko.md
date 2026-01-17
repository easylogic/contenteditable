---
id: ce-0022-ime-enter-breaks-firefox-ko
scenarioId: scenario-ime-enter-breaks
locale: ko
os: Windows
osVersion: "11"
device: Desktop or Laptop
deviceVersion: Any
browser: Firefox
browserVersion: "120.0"
keyboard: Korean IME
caseTitle: contenteditable 내부에서 Enter 키 입력 시 컴포지션이 취소됨
description: "Windows의 Firefox에서 한국어 IME(Input Method Editor)를 사용할 때 컴포지션 중 Enter 키를 누르면 커밋하는 대신 컴포지션이 취소됩니다. 이는 예상되는 IME 워크플로우를 방해합니다."
tags:
  - ime
  - composition
  - enter
  - firefox
status: draft
domSteps:
  - label: "Before"
    html: 'Hello <span style="text-decoration: underline; background: #fef08a;">한</span>'
    description: "한국어 컴포지션 진행 중"
  - label: "After Enter (Bug)"
    html: 'Hello '
    description: "Enter 키가 컴포지션을 취소하고 컴포지션 텍스트가 손실됨"
  - label: "✅ Expected"
    html: 'Hello 한<br>'
    description: "예상: 컴포지션 커밋 후 줄바꿈"
---

## 현상

Windows의 Firefox에서 한국어 IME(Input Method Editor)를 사용할 때 컴포지션 중 Enter 키를 누르면 커밋하는 대신 컴포지션이 취소됩니다. 이는 예상되는 IME 워크플로우를 방해합니다.

## 재현 예시

1. contenteditable div를 만듭니다.
2. 한국어 IME로 전환합니다.
3. 한국어 문자 입력을 시작합니다 (예: "한글").
4. 컴포지션이 활성 상태일 때(문자가 아직 컴포지션 중일 때) Enter 키를 누릅니다.

## 관찰된 동작

- 한국어 IME가 있는 Windows의 Firefox에서 Enter 키를 누르면 컴포지션이 취소됩니다.
- 부분적으로 컴포지션된 문자가 손실됩니다.
- Enter 키가 예상대로 컴포지션을 커밋하지 않습니다.

## 예상 동작

- IME 컴포지션 중 Enter 키를 누르면 컴포지션된 문자가 커밋되어야 합니다.
- 컴포지션이 완료되고 문자가 contenteditable에 삽입되어야 합니다.
