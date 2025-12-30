---
id: ce-0030
scenarioId: scenario-ime-backspace-granularity
locale: ko
os: macOS
osVersion: "Ubuntu 22.04"
device: Desktop or Laptop
deviceVersion: Any
browser: Chrome
browserVersion: "120.0"
keyboard: Japanese IME
caseTitle: Backspace가 단일 문자 대신 전체 컴포지션된 음절을 제거함
description: "macOS의 Chrome에서 일본어 IME를 사용할 때 컴포지션 중 Backspace를 누르면 한 번에 한 문자씩 제거하는 대신 전체 컴포지션된 음절(히라가나/가타카나)이 제거됩니다."
tags:
  - ime
  - backspace
  - composition
  - chrome
status: draft
domSteps:
  - label: "Before"
    html: 'Hello <span style="text-decoration: underline; background: #fef08a;">こんに</span>'
    description: "일본어 컴포지션 진행 중 (こんに), 히라가나 음절 컴포지션"
  - label: "After Backspace (Bug)"
    html: 'Hello '
    description: "Backspace가 전체 음절 'こんに' 삭제 (단일 Backspace)"
  - label: "✅ Expected"
    html: 'Hello こん'
    description: "예상: 한 번에 한 문자씩 삭제 (첫 번째 Backspace는 'に'만 삭제)"
---

## 현상

macOS의 Chrome에서 일본어 IME를 사용할 때 컴포지션 중 Backspace를 누르면 한 번에 한 문자씩 제거하는 대신 전체 컴포지션된 음절(히라가나/가타카나)이 제거됩니다.

## 재현 예시

1. contenteditable div를 만듭니다.
2. 일본어 IME로 전환합니다.
3. 일본어 문자 입력을 시작합니다 (예: "こんにちは").
4. 컴포지션이 활성 상태일 때 Backspace를 누릅니다.

## 관찰된 동작

- 일본어 IME가 있는 macOS의 Chrome에서 Backspace가 전체 컴포지션된 음절을 제거합니다.
- 음절 내의 개별 문자를 한 번에 하나씩 삭제할 수 없습니다.
- 삭제 세분성이 예상보다 거칠습니다.

## 예상 동작

- Backspace는 컴포지션 중에도 한 번에 한 문자씩 제거해야 합니다.
- 또는 삭제 세분성이 일관되고 예측 가능해야 합니다.
- 사용자가 텍스트 삭제를 세밀하게 제어할 수 있어야 합니다.
