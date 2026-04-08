---
id: scenario-ime-composition-tab-key-ko
title: "IME 조합 중 Tab 키"
description: "Tab은 기본적으로 포커스를 옮깁니다. 조합 중에는 후보 순환·조합 취소·에디터 들여쓰기에 가로채이기도 하며, 중국어·태국어·Safari와 Firefox에서 다릅니다."
category: ime
tags:
  - ime
  - tab
  - composition
  - chinese
  - thai
  - safari
  - firefox
status: draft
locale: ko
---

**Tab**은 기본적으로 포커스를 옮깁니다. IME 조합 중에는 **조합 취소**·**후보 순환**·에디터 **들여쓰기**에 가로채이기도 하며, 중국어·태국어·**Safari와 Firefox**에서 다릅니다.

## 문제 개요

리치 에디터는 목록 등에서 Tab에 `preventDefault`를 걸기 쉬운데, `isComposing`일 때 IME를 끊을 수 있습니다.

## 관찰된 동작

- Firefox + 중국어 IME: Tab이 조합 취소(케이스 참고).
- Safari + 태국어 IME: Tab이 조합 취소 또는 포커스 이동.

## 영향

입력 중 문자열 손실; 사용자는 Tab을 “먹었다”고 느낌.

## 해결 방법

- `isComposing`일 때는 들여쓰기용 Tab 처리를 피하거나, 플랫폼 IME 관례를 의도적으로 맞춤.

## 관련 케이스

- [ce-0189](ce-0189-chinese-ime-tab-cancels-firefox)
- [ce-0202](ce-0202-thai-ime-tab-cancels-safari)

## 참고 자료

- [UI Events](https://www.w3.org/TR/uievents/)
