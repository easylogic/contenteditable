---
id: scenario-undo-with-composition-ko
title: IME 조합 중 실행 취소/다시 실행
description: "IME 조합이 활성일 때 실행 취소/다시 실행을 누르면 조합이 취소되거나 음절이 깨지거나 실행 취소 스택이 손상될 수 있습니다. 브라우저마다 다르고, 네이티브 실행 취소와 커스텀 히스토리 레이어에 따라도 달라집니다."
category: ime
tags:
  - ime
  - undo
  - redo
  - composition
  - history
status: draft
locale: ko
---

IME 조합이 활성일 때 실행 취소/다시 실행을 누르면 조합이 취소되거나 음절이 깨지거나 실행 취소 스택이 손상될 수 있습니다. 브라우저마다 다르고, 네이티브 실행 취소와 커스텀 히스토리 레이어에 따라도 달라집니다.

## 문제 개요

조합은 일시적 상태이고, 실행 취소는 이산 트랜잭션을 가정합니다. 둘이 섞이면 HTML 편집 영역에서 상호작용이 명세로 잘 정의되어 있지 않습니다.

## 관찰된 동작

- 실행 취소가 조합 중 텍스트만 지우거나 세션 전체를 예측하기 어렵게 되돌림.
- 다시 실행이 IME 상태와 맞지 않는 문자열을 복원.

## 영향

입력 유실, 한·일·중 입력 워크플로에서 재현 어려운 버그.

## 브라우저 비교

Chromium·WebKit·Gecko가 다르고, 모바일 키보드가 변인을 더함.

## 해결 방법

- `isComposing`일 때 실행 취소/다시 실행 단축키를 막거나 `compositionend`까지 큐잉.
- 문서 모델 에디터는 가능하면 조합 경계에서만 실행 취소 스텝을 기록.

## 관련 케이스

- [ce-0007](ce-0007-undo-breaks-composition)
- [ce-0208](ce-0208-korean-ime-undo-composition-chrome)
- [ce-0209](ce-0209-japanese-ime-undo-composition-safari)

## 참고 자료

- [Input Events](https://www.w3.org/TR/input-events/)
