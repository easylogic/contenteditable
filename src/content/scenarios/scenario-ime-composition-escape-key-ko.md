---
id: scenario-ime-composition-escape-key-ko
title: "IME 조합 중 Escape 키"
description: "Escape는 보통 조합 취소나 후보 창 닫기에 쓰입니다. Edge·Firefox 등에서 DOM에 부분 문자가 남는지·타이밍이 다른지는 엔진마다 다르고, 한국어·아랍어 케이스에 교차 비교가 있습니다."
category: ime
tags:
  - ime
  - escape
  - composition
  - korean
  - arabic
  - edge
  - firefox
status: draft
locale: ko
---

**Escape**는 보통 IME 조합 **취소**나 후보 창 닫기에 쓰입니다. Edge·Firefox 등에서 **DOM에 부분 문자가 남는지**·**타이밍**이 다른지는 엔진마다 다르고, 한국어·아랍어 케이스에 교차 비교가 있습니다.

## 문제 개요

Escape로 명령 팔레트·모달을 닫는 에디터는 조합 중 키를 가로채지 않도록 조심해야 합니다.

## 관찰된 동작

- Edge + 한국어 IME: Escape 취소와 부수 효과(케이스 참고).
- Firefox + 아랍어 IME: 조합 취소.

## 영향

음절 잔여·삭제가 일관되지 않음; 앱 레벨 Escape와 충돌.

## 해결 방법

- `isComposing`이면 Escape를 IME에 먼저 맡기거나, 플랫폼 동작을 테스트 후 명시적으로 반영.

## 관련 케이스

- [ce-0190](ce-0190-korean-ime-escape-cancels-edge)
- [ce-0203](ce-0203-arabic-ime-escape-cancels-firefox)

## 참고 자료

- [UI Events](https://www.w3.org/TR/uievents/)
