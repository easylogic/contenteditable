---
id: scenario-undo-with-composition-ko
title: "IME 컴포지션 중 실행 취소가 예상보다 더 많은 텍스트를 지움"
description: "`contenteditable` 요소에서 IME 컴포지션이 활성화되어 있을 때 실행 취소를 누르면 예상보다 더 많은 텍스트가 제거됩니다. 현재 컴포지션 전에 커밋된 문자를 포함하여 제거됩니다."
category: ime
tags:
  - undo
  - composition
  - ime
status: draft
locale: ko
---

`contenteditable` 요소에서 IME 컴포지션이 활성화되어 있을 때 실행 취소를 누르면 예상보다 더 많은 텍스트가 제거됩니다. 현재 컴포지션 전에 커밋된 문자를 포함하여 제거됩니다.

## 참고 자료

- [Chromium Editing Dev: Undo with IME is super-wonky](https://groups.google.com/a/chromium.org/g/editing-dev/c/Rf5cK48yY3Y) - Chromium Issue 787598
- [Ghostty Issue #8440: Korean IME character loss](https://github.com/ghostty-org/ghostty/issues/8440) - 문자 손실 이슈
- [Scintilla Bug #2137: IME state not cleared](https://sourceforge.net/p/scintilla/bugs/2137/) - IME 상태 관리
