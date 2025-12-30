---
id: ce-0002
scenarioId: scenario-ime-enter-breaks
locale: ko
os: Windows
osVersion: "11"
device: Desktop or Laptop
deviceVersion: Any
browser: Chrome
browserVersion: "120.0"
keyboard: Korean (IME)
caseTitle: contenteditable 내부에서 Enter 키 입력 시 컴포지션이 취소됨
description: "contenteditable 요소에서 IME로 한국어 텍스트를 컴포지션할 때 Enter 키를 누르면 컴포지션이 취소되고 때로는 부분적인 음절만 커밋됩니다. 일부 브라우저와 IME 조합에서 캐럿은 다음 줄로 이동하지만 마지막으로 컴포지션된 문자가 손실됩니다."
tags:
  - composition
  - ime
  - enter
status: draft
domSteps:
  - label: "Before"
    html: 'Hello <span style="text-decoration: underline; background: #fef08a;">한</span>'
    description: "한국어 컴포지션 진행 중"
  - label: "❌ After (Bug)"
    html: 'Hello 하'
    description: "종성 'ㄴ' 손실"
  - label: "✅ Expected"
    html: 'Hello 한'
    description: "예상: '한' 보존됨"
---

### 현상

`contenteditable` 요소에서 IME로 한국어 텍스트를 컴포지션할 때 Enter 키를 누르면 컴포지션이 취소되고 때로는 부분적인 음절만 커밋됩니다. 일부 브라우저와 IME 조합에서 캐럿은 다음 줄로 이동하지만 마지막으로 컴포지션된 문자가 손실됩니다.

### 재현 예시

1. 편집 가능한 영역에 포커스합니다.
2. 한국어 IME를 활성화합니다.
3. 여러 음절을 입력하지만 컴포지션을 완료하지 않습니다.
4. Enter 키를 눌러 새 줄을 삽입합니다.

### 관찰된 동작

- compositionend 이벤트가 불완전한 데이터로 발생합니다.
- 캐럿이 다음 줄로 이동합니다.
- 마지막으로 컴포지션된 음절이 DOM 텍스트 콘텐츠에서 누락됩니다.

### 예상 동작

- IME가 줄바꿈을 삽입하기 전에 현재 컴포지션을 완료해야 합니다.
- 마지막으로 컴포지션된 음절이 DOM 텍스트 콘텐츠에 남아 있어야 합니다.

### 참고사항 및 가능한 해결 방향

- 플레이그라운드에서 `beforeinput`, `compositionend`, `input` 이벤트의 시퀀스를 관찰합니다.
- 브라우저가 `compositionend` 전후에 `inputType = 'insertParagraph'`를 가진 `beforeinput` 이벤트를 발생시키는지 확인합니다.
- 가능한 해결 방법은 `keydown`에서 Enter를 가로채고 컴포지션이 완료될 때까지 기본 동작을 방지하는 것이지만, 이는 네이티브 편집 동작을 변경하므로 제품별로 신중하게 평가해야 합니다.
