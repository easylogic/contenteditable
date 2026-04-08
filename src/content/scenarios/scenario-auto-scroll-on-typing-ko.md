---
id: scenario-auto-scroll-on-typing-ko
title: 입력 중 자동 스크롤(contenteditable)
description: "브라우저는 캐럿이 보이도록 편집 컨테이너나 페이지를 스크롤합니다. 빠른 입력—특히 아래나 오른쪽 가장자리 근처—에서는 스크롤 갱신이 밀리거나 뭉쳐서, 캐럿이 잠시 뷰포트 밖으로 나가거나 화면이 튀는 느낌이 날 수 있습니다."
category: performance
tags:
  - scroll
  - caret
  - typing
  - contenteditable
  - chrome
  - safari
status: draft
locale: ko
---

브라우저는 캐럿이 보이도록 편집 컨테이너나 페이지를 스크롤합니다. 빠른 입력—특히 아래나 오른쪽 가장자리 근처—에서는 스크롤 갱신이 밀리거나 뭉쳐서, 캐럿이 잠시 뷰포트 밖으로 나가거나 화면이 튀는 느낌이 날 수 있습니다.

## 문제 개요

리치 에디터는 활성 선택에 대해 브라우저 기본 “보이게 스크롤” 동작에 의존하는 경우가 많습니다. `contenteditable`에 대해 그 동작은 엔진마다 세부가 다르고, 레이아웃 측정·가상화와 겹치면 같은 스크롤 로직과 충돌해 끊김이 커질 수 있습니다.

## 관찰된 동작

- **지연**: 스크롤이 키 입력 여러 번 뒤에 따라옴; 캐럿이 잠시 화면 밖.
- **거친 점프**: 입력이 한꺼번에 들어온 뒤 큰 스크롤 보정.
- **성능**: 중첩 스크롤·무거운 레이아웃 안에서 비용이 큼.

## 영향

사용자가 삽입 지점을 놓치기 쉽고, 접근성 측면에서 보이는 내용과 보조 공지가 어긋날 수 있습니다. “캐럿은 항상 보인다”는 가정을 두는 에디터는 내부 상태와 DOM 선택이 어긋날 수 있습니다.

## 브라우저 비교

Blink는 가장 가까운 스크롤 가능 조상을 스크롤하는 경향이 있고, WebKit은 교체 요소·줄바꿈 근처에서 다를 수 있습니다. Gecko는 스크롤 앵커링·실행 취소와 상호작용합니다.

## 해결 방법

- 키 입력마다 동기 레이아웃 읽기 줄이기.
- 커스텀 스크롤 컨테이너에서는 레이아웃 후 `requestAnimationFrame`에 맞춰 `scrollIntoView` 등으로 조정.
- `overflow-anchor` 등 스크롤 앵커링과 높이 변화를 함께 고려.

## 모범 사례

- `input` 핫패스에서 매번 `getBoundingClientRect` 호출 지양.
- `max-height` 안의 긴 `contenteditable` 하단에서 빠른 입력 테스트.

## 관련 케이스

- [ce-0122](ce-0122-auto-scroll-jarring) — 입력 중 거친 스크롤
- [ce-0131](ce-0131-auto-scroll-lag-rapid-typing) — 가장자리 근처 빠른 입력 시 지연
- [ce-0161](ce-0161-auto-scroll-performance) — 스크롤 성능 비용

## 참고 자료

- [CSS Overflow Module](https://www.w3.org/TR/css-overflow-3/)
- [Selection API](https://www.w3.org/TR/selection-api/)
