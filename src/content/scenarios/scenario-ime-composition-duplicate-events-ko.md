---
id: scenario-ime-composition-duplicate-events-ko
title: "IME 조합 중 중복 beforeinput/input"
description: "일부 브라우저·키보드는 조합과 관련해 input·beforeinput을 중복으로 쏩니다. 특히 iOS Safari 디테이션 경로와 일부 Android 키보드에서 그렇고, input마다 삽입하는 핸들러는 글자가 두 번 들어가거나 상태가 깨질 수 있습니다."
category: ime
tags:
  - ime
  - composition
  - beforeinput
  - input
  - ios
  - safari
  - android
status: draft
locale: ko
---

일부 브라우저·키보드는 조합과 관련해 **`input`·`beforeinput`을 중복**으로 쏩니다. 특히 **iOS Safari** 디테이션 경로와 일부 **Android** 키보드에서 그렇고, `input`마다 삽입하는 핸들러는 **글자가 두 번** 들어가거나 상태가 깨질 수 있습니다.

## 문제 개요

프레임워크는 사용자 의도당 `input` 한 번을 가정하는 경우가 많습니다. IME·음성 파이프라인은 이벤트를 나누거나 재생할 수 있습니다.

## 관찰된 동작

- iOS Safari: 디테이션 또는 조합 종료 뒤 추가 `input`.
- Android: 예측 입력 켜짐 시 첫 단어 중복.

## 영향

중복 텍스트, 실행 취소 깨짐, React 제어 에디터에서 모델–DOM 불일치.

## 해결 방법

- 짧은 시간 창에서 `(inputType, data, selection 위치)` 해시로 중복 제거, 또는 트랜잭션 진행 중 `input` 무시.
- 삽입을 완전히 제어할 때는 `beforeinput` 취소 경로 선호.

## 관련 케이스

- [ce-0096](ce-0096-ime-composition-duplicate-events-ios-safari)
- [ce-0577](ce-0577-android-first-word-duplication)

## 참고 자료

- [scenario-ios-safari-contenteditable-do-not-force-rerender-or-change-selection-during-input-ko](scenario-ios-safari-contenteditable-do-not-force-rerender-or-change-selection-during-input-ko)
