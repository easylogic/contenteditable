---
id: ce-0586-firefox-android-nested-gettargetranges-parent-range-ko
scenarioId: scenario-gettargetranges-nested-wrong-scope
locale: ko
os: Android
osVersion: "13+"
device: Phone
deviceVersion: Any
browser: Firefox
browserVersion: "120+"
keyboard: Gboard / 기본
caseTitle: Firefox Android에서 중첩 안쪽 편집기 입력 시 beforeinput의 getTargetRanges가 바깥 호스트를 가리킬 수 있음
description: "바깥·안쪽 contenteditable이 있을 때 Fenix에서 사용자가 안쪽에 입력해도 getTargetRanges()가 바깥 호스트 범위를 돌려준다는 보고가 있다. targetRanges를 그대로 적용하는 커스텀 beforeinput 로직은 잘못된 서브트리를 변이한다."
tags:
  - firefox
  - android
  - fenix
  - getTargetRanges
  - nested
  - beforeinput
status: draft
domSteps:
  - label: "1단계: 중첩 편집기"
    html: '<div id="outer" contenteditable="true"><p>Outer text</p><div id="inner" contenteditable="true">Inner</div></div>'
    description: "바깥 호스트가 안쪽 contenteditable 단락을 감쌈."
  - label: "2단계: 안쪽 포커스 후 키 입력"
    html: '<div id="outer" contenteditable="true"><p>Outer text</p><div id="inner" contenteditable="true">Inner|</div></div>'
    description: "캐럿을 Inner 끝에 두고 문자 입력 또는 Backspace."
  - label: "3단계: 버그 — targetRanges가 바깥을 묘사"
    html: '<div id="outer" contenteditable="true"><p>Outer text</p><div id="inner" contenteditable="true">Innerx</div></div>'
    description: "문제 빌드에서 beforeinput의 getTargetRanges()[0] startContainer가 #outer 아래에 있으나 #inner 밖일 수 있어, 시각적 편집은 안쪽인데 range 내용 치환 로직이 바깥 구조를 망가뜨림."
  - label: "✅ 예상"
    html: '<div id="outer" contenteditable="true"><p>Outer text</p><div id="inner" contenteditable="true">Innerx</div></div>'
    description: "예상: targetRanges가 포커스를 가진 안쪽 호스트(및 그 하위) 안에만 있고 getSelection()과 일치."
---

## 현상

Firefox for Android(Fenix)에서는 `contenteditable`이 또 다른 `contenteditable` 안에 중첩된 경우, `beforeinput`의 `getTargetRanges()`가 **포커스된 안쪽** 편집기가 아니라 **바깥** 호스트에 고정된 `StaticRange`를 돌려준다는 커뮤니티 보고가 있다. 키보드는 사용자 관점에서 여전히 안쪽 표면을 편집하는 것처럼 동작할 수 있지만, `targetRanges[0]`을 신뢰해 `preventDefault()` 후 DOM을 직접 갱신하는 자바스크립트는 바깥 트리에 대해 실행되어 줄이 합쳐지거나 바깥 단락이 지워지거나 바깥 노드 옆에 삽입되는 식의 손상이 난다.

## 재현 단계

1. HTML: 바깥 `div contenteditable="true"` 안에 고정 텍스트와 안쪽 `div contenteditable="true"`를 둔다.
2. **Firefox for Android**에서 페이지를 연다.
3. 안쪽 에디터를 탭해 “Inner” 끝에 캐럿을 둔다.
4. `document` 또는 바깥 요소에 `beforeinput` 로거를 달아 `getTargetRanges()[0]`의 `startContainer` 체인과 `document.activeElement`를 비교한다.
5. 문자를 입력하거나 Backspace를 누른다.
6. 문제 버전에서는 `activeElement`가 안쪽 호스트인데 `startContainer`의 `closest('[contenteditable]')`가 바깥 호스트로 해석될 수 있다.

*(정확한 빌드는 변동 가능하므로 Fenix / Gecko 업데이트 후 재검증한다.)*

## 관찰된 동작

- **비어 있지 않지만 스코프가 틀림**: `targetRanges`가 빈 배열이 아니므로 `length === 0`일 때만 폴백하는 코드는 절대 폴백하지 않는다.
- **커스텀 에디터 손상**: ProseMirror, Lexical, 또는 수동 `beforeinput` 필터가 `StaticRange`를 `Range`로 풀어 내용을 바꾸면 바깥 문서가 망가진다.
- **selection과 targetRanges 불일치**: `window.getSelection()`은 안쪽을 가리키는데 `targetRanges`는 그렇지 않을 수 있다. “targetRanges 우선” 정책이 실패한다.

## 예상 동작

Input Events 취지상, 안쪽 호스트에 한정된 편집 연산의 `getTargetRanges()`는 경계 노드가 그 호스트(또는 그 하위) 안에 있어야 하며, 기본 동작을 받을 포커스 `contenteditable`과 일치해야 한다.

## 영향

- **바깥 영역 데이터 손실**: 사용자는 안쪽 캡션만 고치려 했는데 바깥 단락이 지워질 수 있다.
- **에디터 SDK**: 프레임워크는 비어 있지 않은 `targetRanges`를 권위 있다고 가정하는 경우가 많다. 모바일 Firefox 중첩은 그 가정을 깬다.

## 브라우저 비교

- **Firefox Android**: 중첩에서 잘못된 스코프 `targetRanges` 보고. 현재 릴리스에서 재확인한다.
- **Chrome Android / Safari iOS**: 별도 엔진·별도 중첩 버그 가능성. 따로 테스트한다.
- **데스크톱 Firefox**: 종종 정상 동작. 데스크톱 통과만으로 모바일을 일반화하지 않는다.

## 해결 방법

1. **포함 관계 검사** (영문 케이스의 `rangeInsideHost` 예시와 동일).
2. Fenix를 지원하면서 복잡한 가드를 쓰기 싫다면 제품에서 **중첩 contenteditable** 자체를 피한다.
3. [Fenix #27569](https://github.com/mozilla-mobile/fenix/issues/27569) 및 Gecko 이슈 상태를 추적한다.

## 참고

- [Mozilla Fenix #27569](https://github.com/mozilla-mobile/fenix/issues/27569)
- [시나리오: 중첩에서 getTargetRanges 잘못된 스코프](scenario-gettargetranges-nested-wrong-scope)
