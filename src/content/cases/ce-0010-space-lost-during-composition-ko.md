---
id: ce-0010-space-lost-during-composition-ko
scenarioId: scenario-space-during-composition
locale: ko
os: ["Windows", "macOS", "iOS", "Android"]
osVersion: "Any"
device: ["Desktop", "Mobile"]
deviceVersion: Any
browser: ["Chrome", "Edge", "Safari", "Firefox"]
browserVersion: "Latest"
keyboard: Korean (IME)
caseTitle: 컴포지션 중 Space 키가 무시되거나 일관되지 않게 커밋됨
description: "contenteditable 요소에서 한국어 IME로 텍스트를 컴포지션하는 동안 Space 키를 누르면 무시되거나 네이티브 텍스트 컨트롤과 비교하여 일관되지 않은 방식으로 컴포지션이 커밋됩니다."
tags: ["composition", "ime", "space", "korean"]
status: confirmed
domSteps:
  - label: "Before"
    html: 'Hello <span style="text-decoration: underline; background: #fef08a;">한</span>'
    description: "한국어 컴포지션 진행 중"
  - label: "After Space (Bug)"
    html: 'Hello 한'
    description: "Space 키가 무시되거나 컴포지션이 예상치 못하게 커밋됨 (공백 유실)"
  - label: "✅ Expected"
    html: 'Hello 한 '
    description: "예상: Space 키가 입력 중인 문자를 커밋하고 공백을 삽입함"
---

## 현상
`contenteditable` 요소에서 한국어 IME(또는 다른 조합형 IME)로 텍스트를 입력하는 도중 `Space` 키를 누르면, 입력 중이던 글자가 의도치 않게 사라지거나 공백이 삽입되지 않는 현상이 발생합니다. 특히 네이티브 `<input>`이나 `<textarea>` 요소와 비교했을 때 이벤트 발생 순서가 다르거나, 브라우저가 제공하는 기본 동작이 `contenteditable` 내부의 복잡한 돔(DOM) 구조와 충돌하면서 공백 문자가 무시되곤 합니다.

## 재현 단계
1. `contenteditable="true"` 속성이 적용된 `div`를 클릭하여 포커스를 줍니다.
2. 한국어 IME 상태에서 단어(예: "한")를 입력합니다. (글자 아래에 밑줄이 있는 컴포지션 상태)
3. 단어를 완성하지 않은 상태(엔터를 치지 않은 상태)에서 `Space` 바를 누릅니다.
4. "한" 뒤에 공백이 생기지 않거나, "한"이라는 글자 자체가 사라지는지 확인합니다.

## 관찰된 동작
- **이벤트 누락 (Event Drop)**: `compositionend` 이벤트가 발생하기 전에 `keydown` 이벤트에서 공백 입력을 처리하려고 시도하면, 브라우저가 현재 컴포지션 중인 텍스트와 공백을 결합하는 과정에서 공백 입력을 취소(Cancel)하거나 누락시키는 경우가 있습니다.
- **컴포지션 파편화**: 일부 브라우저에서는 `Space` 입력 시 컴포지션이 종료되지만, 실제 공백 문자는 `input` 이벤트로 전달되지 않아 텍스트만 커밋되고 공백은 무시되는 현상이 나타납니다.
- **커서 위치 오류**: 공백이 삽입되더라도 커서(Caret)가 공백 이전으로 되돌아가 후속 입력이 엉뚱한 위치에 삽입되기도 합니다.

## 예상되는 동작
- `Space` 키를 누르면 현재 컴포지션 중인 텍스트(예: "한")가 즉시 돔에 확정(Commit)되어야 합니다.
- 확정된 텍스트 바로 뒤에 정확히 한 개의 공백 문자(` `)가 삽입되어야 합니다.
- 이 과정은 일반적인 텍스트 필드(`input`, `textarea`)에서의 사용자 경험과 완전히 일치해야 합니다.

## 해결책 및 회피 방법
1. **isComposing 플래그 상태 관리**:
   - `keydown` 이벤트 핸들러에서 `event.isComposing`이 `true`일 때 `Space` 키가 눌리면, 브라우저의 기본 동작에만 의존하지 않고 수동으로 현재 선택 영역을 해제하거나 `compositionend`를 유도합니다.
2. **BeforeInput API 보정**:
   - `beforeinput` 이벤트에서 `inputType`이 `insertText`이고 삽입되는 데이터가 공백인 경우, 현재 상태가 IME 조합 중인지 판단하여 필요시 `preventDefault()` 후 수동으로 텍스트와 공백을 함께 삽입(insertHTML 등)합니다.
3. **인위적 포커스 트리거 (Blur/Focus)**:
   - 아주 드문 상황에서 컴포지션이 꼬인 경우, `Space` 입력 시 아주 짧은 순간 포커스를 뺐다가 다시 주는 방식으로 브라우저가 강제로 컴포지션을 종료하고 돔을 확정하도록 강제할 수 있습니다 (단, 이 방법은 UX상 스크롤 튐 등을 유발할 수 있으므로 주의가 필요합니다).
