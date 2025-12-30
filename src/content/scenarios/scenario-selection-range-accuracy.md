---
id: scenario-selection-range-accuracy
title: Selection range is incorrect when selecting across multiple elements
description: "When selecting text that spans across multiple HTML elements (e.g., p, div, span) in a contenteditable region, the selection range may not accurately reflect the visual selection. The Selection and Range APIs may return incorrect boundaries."
category: selection
tags:
  - selection
  - range
  - elements
  - edge
status: draft
locale: en
---

When selecting text that spans across multiple HTML elements (e.g., `<p>`, `<div>`, `<span>`) in a contenteditable region, the selection range may not accurately reflect the visual selection. The `Selection` and `Range` APIs may return incorrect boundaries.
