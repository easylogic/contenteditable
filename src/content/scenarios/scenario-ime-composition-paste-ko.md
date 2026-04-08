---
id: scenario-ime-composition-paste-ko
title: "IME 조합 중 붙여넣기"
description: "클립보드 붙여넣기는 조합 세션을 취소하거나 잘못된 범위를 바꾸거나 붙여넣은 텍스트와 미완성 음절을 섞을 수 있습니다. 한국어+Firefox, 힌디+Chrome 등에서 차이가 납니다."
category: ime
tags:
  - ime
  - paste
  - composition
  - korean
  - hindi
  - firefox
  - chrome
status: draft
locale: ko
---

클립보드 **붙여넣기**는 조합 세션을 **취소**하거나 잘못된 범위를 **바꾸거나** 붙여넣은 텍스트와 미완성 음절을 **섞을** 수 있습니다. **Firefox**와 **Chrome**은 한국어·힌디 IME 경로에서 다르게 나옵니다.

## 문제 개요

붙여넣기는 `insertFromPaste` 등으로 오고, 조합이 아직 활성(`isComposing`)이면 `compositionend`와의 순서가 불명확할 수 있습니다.

## 관찰된 동작

- 한국어 IME + Firefox: 붙여넣기가 조합 취소(케이스 참고).
- 힌디 IME + Chrome: 데바나가리 조합 방해.

## 영향

조합 중 텍스트 손실, 스크립트 혼합, 조각 중복.

## 해결 방법

- 가능하면 `compositionend`까지 클립보드 기반 구조 변경을 미룸.
- IME 활성 직후 붙여넣기면 선택 범위를 재검증.

## 관련 케이스

- [ce-0193](ce-0193-korean-ime-paste-cancels-firefox)
- [ce-0204](ce-0204-hindi-ime-paste-cancels-chrome)

## 참고 자료

- [Input Events](https://www.w3.org/TR/input-events/)
