---
id: scenario-ime-start-delay-android-ko
title: Android에서 IME 조합 시작 지연
description: "Android Chrome·WebView 등에서는 데스크톱보다 입력 시작 후 compositionstart·첫 compositionupdate가 늦게 올 수 있습니다. 일본어·중국어·한국어 IME에서 특히 그렇습니다. isComposing이 즉시 true라고 가정하면 첫 키 입력을 잘못 처리할 수 있습니다."
category: ime
tags:
  - android
  - ime
  - composition
  - delay
  - chrome
status: draft
locale: ko
---

Android Chrome·WebView 등에서는 데스크톱보다 입력 시작 후 `compositionstart`·첫 `compositionupdate`가 늦게 올 수 있습니다. 일본어·중국어·한국어 IME에서 특히 그렇습니다. `isComposing`이 즉시 `true`라고 가정하면 첫 키 입력을 잘못 처리할 수 있습니다.

## 문제 개요

모바일 키보드는 입력을 묶어 보내고, 키 이벤트에서 조합 이벤트까지 지연이 크며 `beforeinput`/`input`과의 순서도 데스크톱과 다를 수 있습니다.

## 관찰된 동작

- 조합 상태가 켜지기 전에 라틴 또는 부분 입력이 잠깐 보임.
- 너무 일찍 정규화하면 문자 중복·누락.

## 영향

프레임워크 에디터에서 레이스; 데스크톱만 테스트하면 놓치기 쉬움.

## 브라우저 비교

Chrome·WebView·Samsung Internet 간 차이; 인앱 브라우저는 Chrome과 다를 수 있음.

## 해결 방법

- 가능하면 구조적 DOM 변경은 `compositionend` 이후로.
- Android IME에는 `keydown`만으로 판단하지 말고 조합 이벤트와 병행.
- Gboard + 언어 팩으로 실기기 테스트.

## 관련 케이스

- [ce-0240](ce-0240-ime-start-delay-android-ko)
- [ce-0241](ce-0241-ime-start-delay-android-ja-en)
- [ce-0242](ce-0242-ime-start-delay-android-ja)
- [ce-0243](ce-0243-ime-start-delay-android-zh)

## 참고 자료

- [UI Events — Composition events](https://www.w3.org/TR/uievents/)
