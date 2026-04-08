---
id: scenario-ime-composition-focus-blur-ko
title: "IME 조합 중 blur·포커스 (CJK·일본어 Safari)"
description: "중·일·한 조합 중 편집기에서 포커스를 빼면 조합 취소·부분 확정·IME 후보 창과 DOM 불일치가 날 수 있습니다. 일본어는 Safari에서 특이한 동작이 잘 보이고, 중·한·크롬 케이스는 관련 케이스를 참고하세요."
category: ime
tags:
  - ime
  - composition
  - focus
  - blur
  - chinese
  - japanese
  - korean
  - safari
  - chrome
status: draft
locale: ko
---

중·일·한 **조합 중** 편집기에서 포커스를 빼면 조합 **취소**·**부분 확정**·IME 후보 창과 DOM **불일치**가 날 수 있습니다. **일본어**는 **Safari**에서 특이한 동작이 잘 보이고, 중·한·Chrome 케이스는 관련 케이스를 참고하세요.

## 문제 개요

[scenario-ime-composition-focus-change-ko](scenario-ime-composition-focus-change-ko)와 겹치지만, 여기서는 **언어별** blur 처리(일본어 Safari vs 중·한 Chrome 등)에 초점을 둡니다.

## 관찰된 동작

- Safari + 일본어 IME: blur 시 조합이 갑자기 끊김.
- Chrome + 중국어 IME: 병음 일부만 남거나 한꺼번에 확정.

## 영향

조합 범위 고아, 실행 취소 경계 불일치, 후보 UI와 DOM 텍스트 불일치.

## 관련 케이스

- [ce-0187](ce-0187-korean-ime-focus-blur-chrome-ko)
- [ce-0188](ce-0188-japanese-ime-focus-blur-safari)
- [ce-0201](ce-0201-chinese-ime-focus-blur-chrome)

## 참고 자료

- [UI Events](https://www.w3.org/TR/uievents/)
