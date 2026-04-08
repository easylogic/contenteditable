---
id: scenario-ime-rtl-and-character-joining-ko
title: "RTL·아랍·히브리 IME 조합과 자모 결합"
description: "아랍어·히브리어는 RTL과 문맥형 자모 형태를 씁니다. 조합 중 결합 규칙·양방향 격리·Safari vs Firefox가 어긋나 캐럿과 시각 순서가 다르게 느껴질 수 있습니다."
category: ime
tags:
  - ime
  - rtl
  - arabic
  - hebrew
  - bidi
  - safari
  - firefox
status: draft
locale: ko
---

**아랍어**·**히브리어**는 **RTL**과 문맥형 **자모 형태**를 씁니다. 조합 중 **결합** 규칙·**양방향** 격리·**Safari vs Firefox**가 어긋나 캐럿과 시각 순서가 다르게 느껴질 수 있습니다.

## 문제 개요

`dir="rtl"`과 LTR이 섞인 `contenteditable`은 라틴·CJK 위주로 테스트된 IME 파이프라인과 충돌할 수 있습니다.

## 관찰된 동작

- Safari + 아랍어: 조합 중 자모 결합(케이스 참고).
- Firefox + 히브리: RTL 조합 이슈.

## 영향

캐럿 위치·글자 순서·선택이 사용자 기대와 불일치.

## 관련 케이스

- [ce-0179](ce-0179-arabic-ime-character-joining-safari)
- [ce-0207](ce-0207-hebrew-ime-rtl-composition-firefox)

## 참고 자료

- [W3C: Structural markup and RTL](https://www.w3.org/International/questions/qa-html-dir)
- [scenario-rtl-text-direction-inconsistent-ko](scenario-rtl-text-direction-inconsistent-ko)
