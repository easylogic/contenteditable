---
id: scenario-selection-api-behavior
title: window.getSelection() returns null when contenteditable loses focus
description: "When a contenteditable region loses focus, window.getSelection() may return null in Safari, even if there was a valid selection before the focus loss. This makes it difficult to preserve or work with selections."
category: selection
tags:
  - selection
  - api
  - focus
  - safari
status: draft
locale: en
---

When a contenteditable region loses focus, `window.getSelection()` may return `null` in Safari, even if there was a valid selection before the focus loss. This makes it difficult to preserve or work with selections.
