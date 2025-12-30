---
id: scenario-css-filter
title: "CSS filter가 contenteditable 성능에 영향을 줄 수 있음"
description: "contenteditable 요소에 CSS 필터(blur, brightness 등)가 적용되어 있을 때 편집 성능이 저하될 수 있습니다. 입력이 지연될 수 있고 선택이 느리게 업데이트될 수 있습니다."
category: performance
tags:
  - css-filter
  - performance
  - chrome
  - macos
status: draft
locale: ko
---

contenteditable 요소에 CSS 필터(blur, brightness 등)가 적용되어 있을 때 편집 성능이 저하될 수 있습니다. 입력이 지연될 수 있고 선택이 느리게 업데이트될 수 있습니다.
