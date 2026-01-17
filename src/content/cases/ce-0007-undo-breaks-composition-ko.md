---
id: ce-0007-undo-breaks-composition-ko
scenarioId: scenario-undo-with-composition
locale: ko
os: Windows
osVersion: "11"
device: Desktop or Laptop
deviceVersion: Any
browser: Chrome
browserVersion: "120.0"
keyboard: Korean (IME)
caseTitle: IME 컴포지션 중 Undo가 예상보다 더 많은 텍스트를 지움
description: "contenteditable 요소에서 IME 컴포지션이 활성 상태일 때 Undo를 누르면 예상보다 더 많은 텍스트가 제거되며, 현재 컴포지션 이전에 커밋된 문자도 포함됩니다."
tags:
  - undo
  - composition
  - ime
status: draft
domSteps:
  - label: "Before"
    html: 'Hello 한 <span style="text-decoration: underline; background: #fef08a;">글</span>'
    description: "이미 커밋된 '한'과 컴포지션 중인 '글'"
  - label: "After Undo (Bug)"
    html: 'Hello '
    description: "Undo가 '한'과 '글' 모두 삭제"
  - label: "✅ Expected"
    html: 'Hello '
    description: "예상: 컴포지션 중인 '글'만 취소, '한'은 보존되어야 함"
---

## 현상

`contenteditable` 요소에서 IME 컴포지션이 활성 상태일 때 Undo를 누르면 예상보다 더 많은 텍스트가 제거되며, 현재 컴포지션 이전에 커밋된 문자도 포함됩니다.

## 재현 예시

1. 편집 가능한 영역에 포커스합니다.
2. 짧은 단어를 입력하고 완료합니다.
3. 한국어 IME를 활성화하고 다른 단어 컴포지션을 시작하지만 완료하지 않습니다.
4. Ctrl+Z(또는 플랫폼별 Undo 단축키)를 누릅니다.

## 관찰된 동작

- 활성 컴포지션과 이전에 커밋된 문자가 모두 제거됩니다.
- 이벤트 로그는 사용자 의도와 명확하게 매핑되지 않는 `beforeinput` / `input` 이벤트 시퀀스를 표시합니다.

## 예상 동작

- Undo는 마지막으로 커밋된 편집 단계만 되돌리거나, 최소한 동일한 환경에서 네이티브 컨트롤과 동일한 방식으로 동작해야 합니다.

## 참고사항

- 이 동작은 `contenteditable` 위에 자체 모델을 구축하는 제품에서 예측 가능한 텍스트 편집 및 undo/redo 스택을 방해할 수 있습니다.
