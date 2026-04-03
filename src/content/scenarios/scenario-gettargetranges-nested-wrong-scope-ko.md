---
id: scenario-gettargetranges-nested-wrong-scope
title: 중첩 contenteditable에서 getTargetRanges()가 잘못된 편집 루트를 가리킬 수 있음
description: "일부 엔진(특히 Firefox for Android / Fenix)에서 beforeinput의 getTargetRanges()가 포커스된 안쪽 편집기가 아니라 바깥쪽 contenteditable 호스트 범위를 반환할 수 있다. targetRanges만 신뢰하면 부모 영역에 삽입·삭제가 일어난다."
category: input
tags:
  - getTargetRanges
  - beforeinput
  - nested
  - contenteditable
  - firefox
  - android
  - mobile
status: draft
locale: ko
---

바깥 `contenteditable="true"` 셸과 안쪽 `contenteditable="true"`(캡션, 댓글, 임베드 위젯)가 겹치는 레이아웃은 취약하다. 포커스와 보이는 캐럿이 안쪽 호스트에 있어도 `InputEvent.getTargetRanges()`가 **바깥** 편집 루트를 가리키는 `StaticRange`를 돌려주는 빌드가 있다. 이는 “빈 targetRanges”와 다른 실패 모드다. 배열은 비어 있지 않지만 **의미가 틀려** selection 폴백과 targetRanges 신뢰 전략이 서로 다른 방식으로 깨진다.

## 문제 개요

Input Events는 `getTargetRanges()`가 들어오는 편집이 실제로 건드릴 DOM 범위를 반영한다고 가정한다. 중첩 편집기에서는 엔진이 현재 편집 세션의 소유 호스트를 구분해야 한다. 엔진이 범위를 바깥 호스트에 붙이면 `preventDefault()` 후 `targetRanges[0]`으로 직접 변이를 적용하는 `beforeinput` 리스너가 바깥 문서를 망가뜨린다. 일부 단계에서는 키 입력이 여전히 안쪽 필드와 시각적으로 연결된 것처럼 보일 수 있어 디버깅이 어렵다.

## 관찰된 동작

- **Fenix (Firefox for Android)**: 안쪽 `contenteditable`에 키 입력이 들어가도 `getTargetRanges()`가 부모 범위를 가리킨다는 보고가 있다. 에디터 기대와 다른 트리 위치에 텍스트가 적용될 수 있다.
- **데스크톱 Firefox / Chrome**: 단순 중첩에서는 올바른 경우가 많으나 Shadow DOM, `contenteditable="plaintext-only"`, 커스텀 래퍼는 여전히 검증이 필요하다.

```javascript
outer.addEventListener('beforeinput', (e) => {
  const tr = e.getTargetRanges?.() ?? [];
  if (tr.length) {
    const { startContainer } = tr[0];
    console.log('range root editable:', startContainer.parentElement?.closest('[contenteditable]'));
  }
});
```

## 영향

- **잘못된 삭제/삽입 범위**: `deleteContentBackward`가 안쪽 필드가 아니라 부모 내용을 지운다.
- **협업/OT 버그**: 잘못된 범위를 키로 쓰면 문자가 중복되거나 사라진다.
- **UX**: 사용자는 안쪽에만 입력 중이라고 생각하는데 바깥 셸이 변한다.

## 브라우저 비교

- **Firefox Android (Fenix)**: 중첩 편집기에서 부모 스코프 `getTargetRanges()` 보고. 수정 전까지 고위험으로 본다.
- **Blink / WebKit(일반 데스크톱)**: 단순 중첩에서는 대체로 정상. 모바일 WebKit도 테스트한다.
- **빈 배열 vs 잘못된 범위**: [scenario-gettargetranges-empty](scenario-gettargetranges-empty)는 배열이 비어 selection 폴백이 필요한 경우와 대비된다.

## 해결 방법

1. **포커스 노드로 Range 검증**: `targetRanges[0]`을 적용하기 전에 `focusedEditable.contains(startContainer)`를 요구한다. `focusedEditable`은 `document.activeElement`(또는 shadow-aware 활성 요소)와 일치하는 가장 안쪽 `contenteditable="true"`다.

2. **활성 편집 호스트 우선**: `targetRanges`와 `getSelection()`이 다르면, `commonAncestorContainer`가 `document.activeElement`와 같은 호스트에 포함되는 쪽을 선호한다.

3. **중첩 contenteditable 회피**: 가능하면 단일 바깥 호스트와 `contenteditable="false"` 섬만 쓰거나, iframe으로 필드를 분리한다(트레이드오프 있음).

4. **잘못된 결합 탐지**: Firefox Android에서 한 키 입력에 대해 `activeElement`, `getSelection()`, `getTargetRanges()`를 로깅하는 일회성 하네스로 “중첩에서 targetRanges 비신뢰” 플래그를 UA별로 캐시한다.

## 모범 사례

- 여러 편집기가 중첩일 때 비어 있지 않은 `targetRanges`를 자동으로 옳다고 보지 않는다.
- 모바일 Firefox 이슈를 볼 때 **selection과 targetRanges를 함께** 로깅한다.
- 업스트림 수정을 추적해 우회 범위를 줄인다.

## 관련 케이스

- [ce-0586-firefox-android-nested-gettargetranges-parent-range](ce-0586-firefox-android-nested-gettargetranges-parent-range) – Fenix 스타일 중첩 editable 잘못된 스코프(draft)

## 관련 시나리오

- [scenario-gettargetranges-empty](scenario-gettargetranges-empty) – 빈 `targetRanges`와 폴백

## 참고

- [Mozilla Fenix #27569](https://github.com/mozilla-mobile/fenix/issues/27569)
- [MDN: InputEvent.getTargetRanges()](https://developer.mozilla.org/en-US/docs/Web/API/InputEvent/getTargetRanges)
- [W3C Input Events](https://www.w3.org/TR/input-events-2/)
