---
id: scenario-clipboard-api
title: Clipboard API 붙여넣기가 contenteditable에서 작동하지 않음
description: "Clipboard API(navigator.clipboard.readText() 또는 navigator.clipboard.read())를 사용하여 contenteditable 영역에 프로그래밍 방식으로 콘텐츠를 붙여넣을 때 붙여넣기 작업이 실패하거나 예상대로 작동하지 않을 수 있습니다."
category: paste
tags:
  - clipboard
  - api
  - paste
  - chrome
status: draft
---

Clipboard API(`navigator.clipboard.readText()` 또는 `navigator.clipboard.read()`)를 사용하여 contenteditable 영역에 프로그래밍 방식으로 콘텐츠를 붙여넣을 때 붙여넣기 작업이 실패하거나 예상대로 작동하지 않을 수 있습니다.

이 시나리오는 유사한 동작으로 여러 환경에서 관찰되었습니다.
