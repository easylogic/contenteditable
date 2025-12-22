---
id: scenario-css-will-change
title: CSS will-change may improve or degrade contenteditable performance
description: "When a contenteditable element has CSS will-change property set, performance may be affected. In some cases, it may improve performance by hinting the browser about upcoming changes. In other cases, it may degrade performance by creating unnecessary layers."
category: performance
tags:
  - css-will-change
  - performance
  - chrome
  - macos
status: draft
---

When a contenteditable element has CSS `will-change` property set, performance may be affected. In some cases, it may improve performance by hinting the browser about upcoming changes. In other cases, it may degrade performance by creating unnecessary layers.
