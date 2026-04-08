---
id: scenario-chrome-caret-jumps-to-end-dom-manipulation-ko
title: "Chrome에서 DOM 조작 후 캐럿이 끝으로 점프"
description: "Chromium에서 입력 중 프로그래밍 방식 DOM 변경(정규화·래핑·React 재조정)이 끼어 들면 캐럿이 contenteditable 끝이나 예기치 않은 경계로 옮겨갈 수 있습니다."
category: input
tags:
  - chrome
  - caret
  - dom
  - react
  - contenteditable
status: draft
locale: ko
---

**Chromium**에서 입력 중 프로그래밍 방식 **DOM 변경**(정규화·래핑·React 재조정)이 끼어 들면 **캐럿**이 `contenteditable` **끝**이나 예기치 않은 **경계**로 옮겨갈 수 있습니다.

## 관련 케이스

- [ce-0317](ce-0317-chrome-caret-jumps-to-end-dom-manipulation)

## 참고 자료

- [scenario-react-caret-jumps-on-rerender-ko](scenario-react-caret-jumps-on-rerender-ko)
