---
id: ce-0004-ime-backspace-removes-whole-syllable-ko
scenarioId: scenario-ime-interaction-patterns
locale: ko
os: Windows
osVersion: "11"
device: Desktop or Laptop
deviceVersion: Any
browser: Chrome
browserVersion: "120.0"
keyboard: Korean (IME)
caseTitle: Backspace가 단일 자모 대신 전체 컴포지션된 음절을 제거함
description: "contenteditable 요소에서 한국어 텍스트를 편집할 때 Backspace 키를 누르면 단일 자모 대신 전체 컴포지션된 음절이 제거됩니다. 이로 인해 세밀한 수정이 어렵고 예상 동작과 다릅니다."
tags:
  - composition
  - ime
  - backspace
status: draft
domSteps:
  - label: "Before"
    html: 'Hello 한글'
    description: "한국어 텍스트 입력 완료"
  - label: "After Backspace (Bug)"
    html: 'Hello '
    description: "전체 음절 '한글' 삭제됨 (단일 Backspace)"
  - label: "✅ Expected"
    html: 'Hello 한'
    description: "예상: 한 번에 한 문자씩 삭제 (첫 번째 Backspace는 '글'만 삭제)"
---

## 현상

`contenteditable` 요소에서 한국어 텍스트를 편집할 때 Backspace 키를 누르면 단일 자모 대신 전체 컴포지션된 음절이 제거됩니다. 이로 인해 세밀한 수정이 어렵고 동일한 플랫폼의 네이티브 입력 필드와 다릅니다.

## 재현 예시

1. 편집 가능한 영역에 포커스합니다.
2. 한국어 IME를 활성화합니다.
3. 하나의 컴포지션된 음절을 입력합니다 (예: 음절을 형성하는 세 개의 자모 문자).
4. Backspace 키를 한 번 누릅니다.

## 관찰된 동작

- 단일 Backspace 키 입력으로 전체 음절이 제거됩니다.
- 이벤트 로그는 삭제에 대해 하나의 `beforeinput` / `input` 쌍만 표시합니다.

## 예상 동작

- 각 Backspace 키 입력은 동일한 OS, 브라우저, IME 구성에서 네이티브 입력이 동작하는 방식과 일치하도록 단일 자모를 제거해야 합니다.

## 참고사항

- 동일한 환경에서 일반 `<input>` 요소의 동작과 비교하여 차이를 확인합니다.
- 이 동작은 `contenteditable` 위에 구축된 텍스트 편집기의 커서 이동, undo 세분성, diff 계산에 영향을 줄 수 있습니다.
