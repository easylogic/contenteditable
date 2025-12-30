---
id: ce-0068
scenarioId: scenario-spellcheck-interference
locale: ko
os: macOS
osVersion: "14.0"
device: Desktop or Laptop
deviceVersion: MacBook Pro
browser: Safari
browserVersion: "17.0"
keyboard: US
caseTitle: 맞춤법 검사 제안이 contenteditable 편집을 방해함
description: "contenteditable 요소에서 맞춤법 검사가 활성화되어 있을 때 브라우저 맞춤법 검사 제안이 편집을 방해할 수 있습니다. 맞춤법 검사 UI가 콘텐츠와 겹칠 수 있으며, 제안을 수락하면 예상치 못한 동작이 발생할 수 있습니다."
tags:
  - spellcheck
  - editing
  - safari
  - macos
status: draft
---

## 현상

contenteditable 요소에서 맞춤법 검사가 활성화되어 있을 때 브라우저 맞춤법 검사 제안이 편집을 방해할 수 있습니다. 맞춤법 검사 UI가 콘텐츠와 겹칠 수 있으며, 제안을 수락하면 예상치 못한 동작이 발생할 수 있습니다.

## 재현 예시

1. `spellcheck="true"`가 있는 contenteditable div를 만듭니다.
2. 의도적으로 철자가 틀린 텍스트를 입력합니다.
3. 나타나는 맞춤법 검사 제안을 관찰합니다.
4. 제안을 수락하거나 무시하려고 시도합니다.
5. 편집을 계속하고 방해를 관찰합니다.

## 관찰된 동작

- macOS의 Safari에서 맞춤법 검사 제안이 예상대로 나타납니다.
- 제안을 수락하면 캐럿이 예상치 못하게 점프할 수 있습니다.
- 맞춤법 검사 UI가 편집 중 콘텐츠와 겹칠 수 있습니다.
- 맞춤법 검사가 IME 컴포지션을 방해할 수 있습니다.

## 예상 동작

- 맞춤법 검사가 contenteditable과 원활하게 작동해야 합니다.
- 제안이 편집 흐름을 방해하지 않아야 합니다.
- 제안을 수락할 때 캐럿 위치가 안정적으로 유지되어야 합니다.
- 맞춤법 검사가 IME 컴포지션 중에 일시 중지되어야 합니다.
