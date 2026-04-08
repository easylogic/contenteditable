---
id: scenario-ime-pinyin-visible-safari-ko
title: "Safari에서 병음 버퍼 가시성 (중국어 IME)"
description: "Safari에서 중국어 병음을 칠 때 라틴 버퍼(밑줄 등)가 Chrome과 다르게 보이거나 표 셀과 겹치거나 잘리거나 밑줄이 빠져 한자 고르기 전에 무엇을 쓰는지 알기 어렵습니다."
category: ime
tags:
  - ime
  - chinese
  - pinyin
  - safari
  - ios
status: draft
locale: ko
---

**Safari**에서 **중국어 병음**을 칠 때 **라틴 버퍼**(밑줄 등)가 Chrome과 다르게 보이거나 표 셀과 **겹치거나** **잘리거나** 밑줄이 빠져 한자를 고르기 전에 무엇을 쓰는지 알기 어렵습니다.

## 문제 개요

조합 문자열의 **시각적 피드백**에 초점을 둡니다(후보 창 **위치**는 [scenario-ime-table-cell-pinyin-safari-ko](scenario-ime-table-cell-pinyin-safari-ko) 참고).

## 관찰된 동작

- 데스크톱 vs iOS Safari: 병음 줄 가시성 차이.
- `contenteditable` 스타일(배경·패딩)과의 상호작용.

## 영향

버퍼를 못 읽어 잘못 확정.

## 관련 케이스

- [ce-0234](ce-0234-chinese-ime-pinyin-table-safari-ko)
- [ce-0235](ce-0235-chinese-ime-pinyin-table-ios-safari-en)

## 참고 자료

- WebKit bug tracker: Pinyin + contenteditable 검색
