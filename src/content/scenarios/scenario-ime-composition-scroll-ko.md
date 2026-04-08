---
id: scenario-ime-composition-scroll-ko
title: "스크롤이 IME 조합을 취소·흔드는 경우"
description: "IME 후보 창이 떠 있는 동안 페이지나 편집기 스크롤을 움직이면 조합이 취소되거나 캐럿과 후보 UI가 어긋날 수 있습니다. iOS Safari+일본어, Android Chrome+중국어 등에서 보고됩니다."
category: ime
tags:
  - ime
  - scroll
  - composition
  - japanese
  - chinese
  - ios
  - android
status: draft
locale: ko
---

IME 후보 창이 떠 있는 동안 **페이지나 편집기 스크롤**을 움직이면 조합이 **취소**되거나 캐럿과 후보 UI가 **어긋날** 수 있습니다. **iOS Safari**+일본어, **Android Chrome**+중국어 등에서 보고됩니다.

## 문제 개요

IME UI는 캐럿에 고정되는데, 스크롤은 키보드로 캐럿을 옮길 때와 같은 이벤트 순서를 보장하지 않습니다.

## 관찰된 동작

- 일본어 + iOS Safari: 조합 중 스크롤 시 취소(케이스 참고).
- 중국어 + Android Chrome: 취소 또는 후보 정렬 붕괴.

## 영향

음절 중간에 조합이 끊김; 긴 페이지·중첩 스크롤에서 불만.

## 해결 방법

- `isComposing`일 때 사용자와 싸우는 프로그래밍 스크롤을 피함.
- 활성 편집기 주변 스크롤 컨테이너를 안정화.

## 관련 케이스

- [ce-0194](ce-0194-japanese-ime-scroll-cancels-ios-safari)
- [ce-0205](ce-0205-chinese-ime-scroll-cancels-android-chrome)

## 참고 자료

- [UI Events](https://www.w3.org/TR/uievents/)
