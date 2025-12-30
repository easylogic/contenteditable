---
id: scenario-double-line-break
title: contenteditable에서 Enter를 누르면 두 개의 줄바꿈이 삽입됨
description: 일반 `contenteditable` 요소에서 Enter를 누르면 하나 대신 두 개의 보이는 줄바꿈이 삽입됩니다.
category: other
tags:
  - enter
  - newline
status: draft
---

일반 `contenteditable` 요소에서 Enter를 누르면 하나 대신 두 개의 보이는 줄바꿈이 삽입됩니다.
결과 DOM에는 추가 빈 줄로 렌더링되는 중첩된 `<div>` 또는 `<br>` 요소가 포함됩니다.

이 시나리오는 유사한 동작으로 여러 환경에서 관찰되었습니다.
