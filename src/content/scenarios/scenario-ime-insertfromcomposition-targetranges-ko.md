---
id: scenario-ime-insertfromcomposition-targetranges-ko
title: "insertFromComposition과 getTargetRanges()"
description: "조합이 끝날 때 beforeinput의 inputType은 insertFromComposition 또는 insertCompositionText일 수 있습니다. getTargetRanges()가 바꿀 범위를 알려줘야 하는데, Safari(특히 iOS)나 일부 IME에서는 범위가 비어 있거나 틀리거나 데스크톱 Safari와 다를 수 있어 target range에 의존하는 트랜잭션이 깨집니다."
category: ime
tags:
  - ime
  - beforeinput
  - getTargetRanges
  - insertFromComposition
  - safari
  - ios
status: draft
locale: ko
---

조합이 끝날 때 `beforeinput`의 `inputType`은 **`insertFromComposition`** 또는 **`insertCompositionText`**일 수 있습니다. `getTargetRanges()`가 바꿀 범위를 알려줘야 하는데, **Safari(특히 iOS)**나 일부 IME에서는 범위가 비어 있거나 틀리거나 데스크톱 Safari와 다를 수 있어 target range에 의존하는 트랜잭션이 깨집니다.

## 문제 개요

Input Events는 DOM에 무엇이 바뀔지 알기 위해 `getTargetRanges()` 사용을 권장하지만, IME 확정 경로는 엔진마다 가장 들쭉날쭉합니다.

## 관찰된 동작

- 데스크톱 Safari vs iOS Safari: 한·일 입력에서 Chrome 대비 범위가 다르거나 누락될 수 있음.
- `insertFromComposition`과 `compositionend` 순서가 스택마다 다름.

## 영향

잘못된 위치 치환, 캐럿 점프, ProseMirror/Slate 트랜잭션 오적용.

## 브라우저 비교

WebKit 모바일·데스크톱; 같은 IME에서도 Chromium과 대비해 볼 것.

## 해결 방법

- `getTargetRanges()`가 비면 `getSelection()`으로 폴백하고 편집기 안인지 검증.
- 범위가 불안정하면 `compositionend` 이후로 구조 변경을 미룸.

## 관련 케이스

- [ce-0214](ce-0214-ime-insertfromcomposition-targetranges-desktop-safari-korean)
- [ce-0215](ce-0215-ime-insertfromcomposition-targetranges-ios-safari-japanese)
- [ce-0216](ce-0216-ime-insertfromcomposition-missing-ios-safari-korean)

## 참고 자료

- [Input Events Level 2](https://www.w3.org/TR/input-events-2/)
- [scenario-gettargetranges-empty-ko](scenario-gettargetranges-empty-ko)
