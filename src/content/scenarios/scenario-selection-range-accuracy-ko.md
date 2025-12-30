---
id: scenario-selection-range-accuracy
title: 여러 요소에 걸쳐 선택할 때 선택 범위가 부정확함
description: "contenteditable 영역에서 여러 HTML 요소(예: p, div, span)에 걸쳐 텍스트를 선택할 때 선택 범위가 시각적 선택을 정확히 반영하지 않을 수 있습니다. Selection 및 Range API가 잘못된 경계를 반환할 수 있습니다."
category: selection
tags:
  - selection
  - range
  - elements
  - edge
status: draft
locale: ko
---

contenteditable 영역에서 여러 HTML 요소(예: `<p>`, `<div>`, `<span>`)에 걸쳐 텍스트를 선택할 때 선택 범위가 시각적 선택을 정확히 반영하지 않을 수 있습니다. `Selection` 및 `Range` API가 잘못된 경계를 반환할 수 있습니다.
