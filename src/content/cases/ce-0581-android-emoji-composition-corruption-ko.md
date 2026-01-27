---
id: ce-0581-ko
scenarioId: scenario-ime-interaction-patterns
locale: ko
os: Android
osVersion: "14.0 / 15.0"
device: 스마트폰
deviceVersion: Any
browser: Chrome
browserVersion: "131.0+"
keyboard: Gboard (이모지 키보드)
caseTitle: "안드로이드 Chrome: 이모지 삽입 시 조합 중인 텍스트 증발 현상"
description: "IME 조합 세션이 활성화된 상태에서 이모지를 삽입할 때, 이전에 버퍼링된 글자들에 대해 'insertText' 이벤트를 발생시키지 않고 세션을 강제 종료하여 데이터가 손실되는 현상입니다."
tags: ["android", "chrome-131", "emoji", "composition", "data-loss"]
status: confirmed
domSteps:
  - label: "1. 활발한 조합 중"
    html: '<div contenteditable="true">한글<span>ㄱ</span>|</div>'
    description: "사용자가 한국어 음절(예: 'ㄱ')을 조합 중입니다."
  - label: "2. 이모지 삽입"
    html: '<!-- 사용자가 Gboard에서 😊 클릭 -->'
    description: "사용자가 이모지 패널로 전환하여 아이콘을 삽입합니다."
  - label: "3. 결과 (버그)"
    html: '<div contenteditable="true">한글😊|</div>'
    description: "이모지는 삽입되지만, 조합 중이던 'ㄱ'이 확정(Commit)되지 않고 DOM에서 삭제됩니다."
  - label: "✅ 예상 결과"
    html: '<div contenteditable="true">한글ㄱ😊|</div>'
    description: "예상: 브라우저는 이모지를 삽입하기 전에 현재 조합 버퍼('ㄱ')를 먼저 밀어내어 확정시켜야 합니다."
---

## 현상
안드로이드용 최신 Chromium(131+) 버전에서 복잡한 IME 조합과 이모지 입력을 혼용할 때 데이터 손실 버그가 발생하고 있습니다. 사용자가 글자를 입력하는 도중에(특히 한중일 언어 또는 태국어) 이모지 키보드로 전환하여 아이콘을 선택하면, 브라우저가 `data: ""` 또는 null 값을 가진 `compositionend` 이벤트를 트리거합니다. 이는 현재 조합 중인 글자를 확정하지 않고 그대로 지워버리는 결과를 초래합니다.

## 재현 단계
1. 안드로이드 기기에서 `contenteditable` 에디터를 엽니다.
2. 한국어 Gboard 등 CJK IME를 사용합니다.
3. 밑줄이 보이는 상태(활성 조합 상태)로 글자 하나를 입력합니다.
4. 공백이나 엔터를 누르지 않은 상태에서 즉시 이모지 메뉴를 열고 이모지를 선택합니다.
5. DOM에 조합 중이던 글자가 남아 있는지 확인합니다.

## 관찰된 동작
- **버퍼 증발**: `compositionupdate`로 보여지던 텍스트가 DOM에서 사라집니다.
- **이벤트 누락**: 브라우저가 유령 글자에 대해 `insertReplacementText`나 `insertText` 이벤트를 보내지 않습니다.
- **불완전한 beforeinput**: 이모지에 대한 `beforeinput`은 발생하지만, 이전 세션을 "정리"하는 이벤트는 발생하지 않습니다.

## 영향
- **정보 손실**: 문장 끝에 이모지로 마침표를 찍으려던 사용자는 마지막 음절을 잃게 됩니다.
- **사용자 경험 저하**: 사용자는 다시 키보드를 전환하여 사라진 글자를 입력한 후, 다시 이모지를 추가해야 하는 번거로움을 겪습니다.

## 브라우저 비교
- **안드로이드용 Chrome (131+)**: 회귀 버그 확인됨.
- **iOS Safari**: 이모지 삽입 전 조합 버퍼를 정확히 밀어내어 확정시킵니다.
- **안드로이드용 Firefox**: 대체로 안정적이며 키보드 전환을 올바르게 처리합니다.

## 참고 및 해결 방법
### 해결책: 수동 플러시(Manual Flush)
개발자는 키보드 타입 변경(감지 가능한 경우)을 모니터링하거나 마지막 `compositionupdate` 값을 수동으로 캐싱해야 합니다. `isComposing`이 true인 상태에서 포커스 변동이나 입력 모드 변경이 발생하면 캐싱된 텍스트를 강제로 삽입하는 로직이 필요합니다.

- [Chromium 이슈 #381254331: 이모지 선택기가 조합을 취소함](https://issues.chromium.org/issues/381254331)
