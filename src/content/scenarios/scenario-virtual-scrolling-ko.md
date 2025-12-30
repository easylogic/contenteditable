---
id: scenario-virtual-scrolling
title: 가상 스크롤링 라이브러리가 contenteditable 선택을 간섭함
description: "contenteditable 요소가 가상 스크롤링 라이브러리(예: 대용량 문서용)와 함께 사용될 때 가상 스크롤링 메커니즘이 텍스트 선택과 캐럿 위치 지정을 간섭할 수 있습니다. 스크롤 중 요소가 DOM에서 제거될 때 선택이 손실될 수 있습니다."
category: performance
tags:
  - virtual-scrolling
  - performance
  - selection
  - chrome
  - macos
status: draft
locale: ko
---

contenteditable 요소가 가상 스크롤링 라이브러리(예: 대용량 문서용)와 함께 사용될 때 가상 스크롤링 메커니즘이 텍스트 선택과 캐럿 위치 지정을 간섭할 수 있습니다. 스크롤 중 요소가 DOM에서 제거될 때 선택이 손실될 수 있습니다.
