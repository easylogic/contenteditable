---
id: scenario-ime-candidate-list-and-conversion-issues-ko
title: "IME 후보·변환 지연·불일치 (한자·간체)"
description: "일본어 한자 변환·중국어 글자 선택은 IME 후보 창에 의존합니다. 지연·순서 오류·Safari 특유의 렉으로 잘못 확정하거나 버퍼와 맞지 않는 후보가 보일 수 있고, 복잡한 레이아웃·부하 시 더해집니다."
category: ime
tags:
  - ime
  - japanese
  - chinese
  - conversion
  - candidate
  - safari
  - chrome
status: draft
locale: ko
---

일본어 **한자 변환**·중국어 **글자 선택**은 IME **후보 창**에 의존합니다. 지연·순서 오류·**Safari** 특유의 렉으로 잘못 확정하거나 버퍼와 맞지 않는 후보가 보일 수 있고, 복잡한 레이아웃·부하 시 더해집니다.

## 문제 개요

변환은 브라우저만의 문제가 아니라 **IME 소프트웨어** 영향도 크지만, 에디터가 동기 레이아웃·무거운 `input` 처리로 **지연**을 키울 수 있습니다.

## 관찰된 동작

- Safari: 같은 입력 방식에서도 Chrome보다 변환이 느리게 느껴질 수 있음.
- 빠른 입력: 후보 목록이 버퍼 갱신보다 늦게 따라옴.

## 영향

잘못된 문자 확정; 숙련 사용자가 “변환이 끈적이다”고 느낌.

## 관련 케이스

- [ce-0175](ce-0175-japanese-ime-kanji-conversion-chrome)
- [ce-0176](ce-0176-chinese-ime-conversion-delay-safari)

## 참고 자료

- [WhatWG HTML](https://html.spec.whatwg.org/) (편집 맥락)
