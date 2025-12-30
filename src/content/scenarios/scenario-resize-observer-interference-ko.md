---
id: scenario-resize-observer-interference
title: ResizeObserver가 contenteditable 편집 중 레이아웃 이동을 유발할 수 있음
description: "ResizeObserver가 contenteditable 요소에 연결되면 콘텐츠 크기가 변경될 때 편집 중에 옵저버가 트리거될 수 있습니다. 이것은 레이아웃 재계산과 시각적 점프를 유발할 수 있으며, 특히 contenteditable이 동적 높이를 가질 때 그렇습니다."
category: performance
tags:
  - resize-observer
  - layout
  - performance
  - chrome
  - windows
status: draft
locale: ko
---

ResizeObserver가 contenteditable 요소에 연결되면 콘텐츠 크기가 변경될 때 편집 중에 옵저버가 트리거될 수 있습니다. 이것은 레이아웃 재계산과 시각적 점프를 유발할 수 있으며, 특히 contenteditable이 동적 높이를 가질 때 그렇습니다.
