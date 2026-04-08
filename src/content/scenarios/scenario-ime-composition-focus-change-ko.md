---
id: scenario-ime-composition-focus-change-ko
title: "포커스 이동 시 IME 조합 (한국어 등)"
description: "한국어 등 IME 조합 중에 다른 필드·버튼·중첩 contenteditable로 포커스가 옮겨가면 조합이 확정·취소·불완전 상태로 남는 등 브라우저마다 다릅니다. Chrome·Safari·Firefox가 일치하지 않고 모바일은 변인이 더 큽니다."
category: ime
tags:
  - ime
  - composition
  - focus
  - blur
  - korean
  - chrome
  - safari
  - firefox
status: draft
locale: ko
---

한국어 등 IME 조합 중에 다른 필드·버튼·중첩 `contenteditable`로 **포커스**가 옮겨가면 조합이 **확정**·**취소**·**불완전** 상태로 남는 등 브라우저마다 다릅니다. Chrome·Safari·Firefox가 일치하지 않고 모바일은 변인이 더 큽니다.

## 문제 개요

조합 중 `blur`가 어떤 경로에서는 `compositionend`를 부르고 어떤 경로에서는 아니게 되어, 같은 제스처도 엔진마다 DOM 결과가 달라질 수 있습니다.

## 관찰된 동작

- 툴바로 포커스 이동: 입력 중 한글이 편집기에 확정되거나 사라짐.
- 중첩 편집 영역: 조합 주기 없이 포커스만 바뀌는 경우.

## 영향

입력 유실, 다시 포커스 시 중복·에디터 상태와 IME 상태 불일치.

## 브라우저 비교

**ce-0229 / ce-0230 / ce-0231**(Chrome·Firefox·Safari) 한국어 포커스/블러 케이스를 나란히 보면 재현 단계 차이를 비교할 수 있습니다.

## 해결 방법

- `blur` 시 `isComposing`이면 플랫폼별로 명시적 확정/취소가 가능한지 검증(항상 가능한 것은 아님).
- 조합 활성일 때 가능하면 프로그래밍 방식 포커스 이동을 피함.

## 관련 케이스

- [ce-0229](ce-0229-korean-ime-focus-blur-chrome)
- [ce-0230](ce-0230-korean-ime-focus-blur-firefox)
- [ce-0231](ce-0231-korean-ime-focus-blur-safari)

## 참고 자료

- [UI Events — Composition events](https://www.w3.org/TR/uievents/)
