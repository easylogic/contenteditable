---
id: scenario-ime-composition-number-input-ko
title: "IME 후보 선택용 숫자 키 (일본어·중국어)"
description: "많은 IME는 1–9로 후보를 고릅니다. contenteditable에서는 IME가 먹거나 페이지 단축키에 가로채이거나 Safari에서 다르게 동작해 잘못 확정하거나 조합이 취소될 수 있습니다."
category: ime
tags:
  - ime
  - japanese
  - chinese
  - candidate
  - keyboard
  - safari
  - chrome
status: draft
locale: ko
---

많은 IME는 **1–9**로 후보를 고릅니다. `contenteditable`에서는 IME가 먹거나 페이지 단축키에 가로채이거나 **Safari**에서 다르게 동작해 잘못 확정하거나 조합이 취소될 수 있습니다.

## 문제 개요

에디터 단축키(목록·제목 등)가 숫자와 겹칠 수 있어, 조합 중에는 IME로 숫자가 먼저 가야 합니다.

## 관찰된 동작

- 일본어: Chrome에서 숫자로 한자 후보 선택; Safari는 동작이 다를 수 있음.
- 중국어: 병음 후보를 숫자로 고르는 Safari vs Chrome 차이.

## 영향

잘못된 문자 확정; `keydown`을 너무 일찍 막으면 조합 취소.

## 관련 케이스

- [ce-0191](ce-0191-japanese-ime-number-candidate-selection-chrome)
- [ce-0192](ce-0192-chinese-ime-number-candidate-selection-safari)

## 참고 자료

- [UI Events](https://www.w3.org/TR/uievents/)
