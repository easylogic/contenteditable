---
id: scenario-space-during-composition-ko
title: IME 조합 중 스페이스 키 동작
description: "IME 조합이 활성일 때 스페이스는 세그먼트 확정, 리터럴 공백 삽입, 무시, 조합 취소 등으로 동작하며, 언어·IME·브라우저에 따라 다릅니다. 스페이스가 항상 U+0020을 넣는다고 가정하면 문자를 잃거나 조합 상태가 깨질 수 있습니다."
category: ime
tags:
  - ime
  - composition
  - space
  - thai
  - japanese
  - arabic
  - hindi
status: draft
locale: ko
---

IME 조합이 활성일 때 스페이스는 세그먼트 확정, 리터럴 공백 삽입, 무시, 조합 취소 등으로 동작하며, 언어·IME·브라우저에 따라 다릅니다. 스페이스가 항상 U+0020을 넣는다고 가정하면 문자를 잃거나 조합 상태가 깨질 수 있습니다.

## 문제 개요

스페이스는 “첫 후보 선택”, “단어 구분”, “확정 후 공백” 등 여러 의미로 겹칩니다. CJK·태국·인도·RTL 스크립트마다 처리가 다르고 `beforeinput`/`input` 순서도 다릅니다.

## 관찰된 동작

- 조합이 끝날 때까지 스페이스가 삼켜지거나 무시됨.
- 스페이스가 너무 일찍 확정되어 음절이 깨짐.
- 에디터 단축키와 IME 기대가 충돌.

## 영향

문자 유실·중복, 실행 취소 경계 깨짐, 데스크톱과 모바일 키보드 간 차이.

## 브라우저 비교

Chromium·WebKit·Gecko는 각각 다른 IME 파이프라인을 쓰고, Linux IBus/Fcitx는 또 한 겹입니다.

## 해결 방법

- `isComposing`일 때 언어별 이유 없이 스페이스를 전역 가로채지 않기.
- 스페이스 동작을 예측하기보다 `input`으로 확정된 텍스트를 읽기.
- 한·중만이 아니라 태국·일본·아랍·힌디 IME를 따로 검증.

## 모범 사례

- `compositionstart`/`compositionend`를 존중하고, 조합 범위를 나누는 DOM 변경을 피하기.

## 관련 케이스

- [ce-0010](ce-0010-space-lost-during-composition)
- [ce-0183](ce-0183-japanese-ime-space-conversion-chrome)
- [ce-0184](ce-0184-thai-ime-space-ignored-firefox)
- [ce-0197](ce-0197-arabic-ime-space-ignored-chrome)
- [ce-0198](ce-0198-hindi-ime-space-ignored-firefox)

## 참고 자료

- [UI Events](https://www.w3.org/TR/uievents/)
- MDN: [CompositionEvent](https://developer.mozilla.org/en-US/docs/Web/API/CompositionEvent)
