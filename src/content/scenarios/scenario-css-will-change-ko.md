---
id: scenario-css-will-change
title: CSS will-change가 contenteditable 성능을 개선하거나 저하시킬 수 있음
description: "contenteditable 요소에 CSS will-change 속성이 설정되어 있을 때 성능이 영향을 받을 수 있습니다. 일부 경우에는 브라우저에 다가오는 변경 사항을 힌트하여 성능을 개선할 수 있습니다. 다른 경우에는 불필요한 레이어를 만들어 성능을 저하시킬 수 있습니다."
category: performance
tags:
  - css-will-change
  - performance
  - chrome
  - macos
status: draft
locale: ko
---

contenteditable 요소에 CSS `will-change` 속성이 설정되어 있을 때 성능이 영향을 받을 수 있습니다. 일부 경우에는 브라우저에 다가오는 변경 사항을 힌트하여 성능을 개선할 수 있습니다. 다른 경우에는 불필요한 레이어를 만들어 성능을 저하시킬 수 있습니다.
