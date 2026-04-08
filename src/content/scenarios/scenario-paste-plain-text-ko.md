---
id: scenario-paste-plain-text-ko
title: "일반 텍스트 붙여넣기와 plaintext-only"
description: "contenteditable에 리치 붙여넣기는 원치 않는 HTML을 끌고 옵니다. 일반 텍스트로 붙이거나 plaintext-only를 기대하지만, 브라우저·클립보드 API·NBSP 처리가 달라 공백만 일반 공백이라고 가정하면 레이아웃이 깨질 수 있습니다."
category: clipboard
tags:
  - paste
  - plain-text
  - clipboard
  - contenteditable
  - nbsp
status: draft
locale: ko
---

`contenteditable`에 **리치 붙여넣기**는 원치 않는 HTML을 끌고 옵니다. **일반 텍스트**로 붙이거나 **`plaintext-only`**를 기대하지만, 브라우저·클립보드 API·**NBSP** 처리가 달라 “일반”이 U+0020만 의미한다고 가정하면 레이아웃이 깨질 수 있습니다.

## 문제 개요

`plaintext-only`는 지원 범위가 제한적이고, `text/plain`으로 가로채도 공백 정규화가 필요합니다.

## 관찰된 동작

- Safari·Word 등: 가로채지 않으면 스타일 HTML이 그대로 들어옴.
- `plaintext-only` + NBSP: 줄바꿈·레이아웃 이상(관련 케이스 참고).

## 영향

“단순” 필드에 굵게·색 들어감; 줄 간격·너비 등 미묘한 레이아웃 버그.

## 관련 케이스

- [ce-0019](ce-0019-paste-plain-text-only)
- [ce-0572](ce-0572-plaintext-only-nbsp-layout-broken)

## 참고 자료

- MDN: [ClipboardEvent](https://developer.mozilla.org/en-US/docs/Web/API/ClipboardEvent)
- [scenario-paste-formatting-loss-ko](scenario-paste-formatting-loss-ko)
