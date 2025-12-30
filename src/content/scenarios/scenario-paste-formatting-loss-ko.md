---
id: scenario-paste-formatting-loss
title: "contenteditable에 리치 텍스트를 붙여넣으면 마크업이 예상치 못하게 제거됨"
description: "리치 텍스트 소스(워드 프로세서나 웹 페이지 등)에서 contenteditable 요소로 콘텐츠를 붙여넣을 때 결과 DOM이 소스에 있던 제목, 리스트 또는 인라인 포맷팅을 손실합니다."
category: paste
tags:
  - paste
  - clipboard
  - formatting
status: draft
locale: ko
---

리치 텍스트 소스(워드 프로세서나 웹 페이지 등)에서
`contenteditable` 요소로 콘텐츠를 붙여넣을 때 결과 DOM이 소스에 있던 제목, 리스트 또는 인라인 포맷팅을 손실합니다.

이 시나리오는 여러 환경에서 유사한 동작으로 관찰되었습니다.
