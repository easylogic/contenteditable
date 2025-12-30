---
id: scenario-ime-backspace-granularity
title: "Backspace가 단일 문자 구성 요소 대신 전체 조합 단위를 제거함"
description: "contenteditable 요소에서 IME로 텍스트를 편집할 때 Backspace를 누르면 단일 구성 요소 대신 전체 조합 단위(음절, 문자 등)가 제거됩니다. 이것은 세밀한 수정을 어렵게 만들고 네이티브 입력 필드와 다릅니다. 이것은 한글, 일본어, 중국어 및 기타 언어를 포함하여 여러 언어에 영향을 줍니다."
category: ime
tags:
  - composition
  - ime
  - backspace
status: draft
locale: ko
---

`contenteditable` 요소에서 IME로 텍스트를 편집할 때 Backspace를 누르면 단일 구성 요소 대신 전체 조합 단위가 제거됩니다. 이것은 세밀한 수정을 어렵게 만들고 같은 플랫폼의 네이티브 입력 필드와 다릅니다.

## 언어별 표현

이 문제는 언어마다 다르게 나타납니다:

- **한글 IME**: 단일 자모(자모) 대신 전체 음절이 제거됨
- **일본어 IME**: 단일 문자 구성 요소 대신 전체 문자 또는 단어가 제거될 수 있음
- **중국어 IME**: 구성 요소 수준 편집을 허용하는 대신 전체 문자가 제거될 수 있음
- **기타 IME**: 조합을 사용하는 다른 언어에서도 유사한 문제가 발생할 수 있음

이 동작은 `contenteditable` 위에 구축된 텍스트 편집기의 커서 이동, 실행 취소 세밀도 및 diff 계산에 영향을 줄 수 있습니다.

이 시나리오는 다른 언어에 걸쳐 유사한 동작으로 여러 환경에서 관찰되었습니다.
