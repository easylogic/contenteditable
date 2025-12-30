---
id: scenario-css-isolation
title: CSS isolation property may affect contenteditable stacking context
description: "When a contenteditable element has the CSS isolation: isolate property, it creates a new stacking context. This may affect how selection handles and IME candidate windows are positioned relative to the element."
category: other
tags:
  - css-isolation
  - stacking-context
  - safari
  - macos
status: draft
locale: en
---

When a contenteditable element has the CSS `isolation: isolate` property, it creates a new stacking context. This may affect how selection handles and IME candidate windows are positioned relative to the contenteditable.
