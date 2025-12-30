---
id: ce-0034
scenarioId: scenario-composition-events
locale: ko
os: macOS
osVersion: "Ubuntu 22.04"
device: Desktop or Laptop
deviceVersion: Any
browser: Safari
browserVersion: "120.0"
keyboard: Chinese IME
caseTitle: 모든 IME에 대해 컴포지션 이벤트가 일관되게 발생하지 않음
description: "Safari에서 중국어 IME와 같은 특정 IME(Input Method Editor)를 사용할 때 컴포지션 이벤트(compositionstart, compositionupdate, compositionend)가 일관되게 발생하지 않거나 예상치 못한 순서로 발생할 수 있습니다."
tags:
  - ime
  - composition
  - events
  - safari
status: draft
---

### 현상

Safari에서 중국어 IME와 같은 특정 IME(Input Method Editor)를 사용할 때 컴포지션 이벤트(`compositionstart`, `compositionupdate`, `compositionend`)가 일관되게 발생하지 않거나 예상치 못한 순서로 발생할 수 있습니다.

### 재현 예시

1. contenteditable div를 만듭니다.
2. `compositionstart`, `compositionupdate`, `compositionend`에 대한 이벤트 리스너를 추가합니다.
3. 중국어 IME로 전환합니다.
4. 중국어 문자 입력을 시작합니다.
5. 어떤 이벤트가 발생하고 어떤 순서로 발생하는지 관찰합니다.

### 관찰된 동작

- 중국어 IME가 있는 macOS의 Safari에서 컴포지션 이벤트가 모든 키 입력에 대해 발생하지 않을 수 있습니다.
- 이벤트 순서가 일관되지 않을 수 있습니다.
- 일부 컴포지션 작업이 `compositionend`를 발생시키지 않고 완료될 수 있습니다.

### 예상 동작

- 컴포지션 이벤트가 모든 IME에 대해 일관되게 발생해야 합니다.
- 이벤트 순서는 예측 가능해야 합니다: `compositionstart` → `compositionupdate` (여러 번) → `compositionend`.
- 모든 컴포지션 작업이 완료를 제대로 신호해야 합니다.
