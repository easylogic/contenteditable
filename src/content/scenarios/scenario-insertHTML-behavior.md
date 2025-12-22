---
id: scenario-insertHTML-behavior
title: insertHTML breaks DOM structure and formatting
description: "When using document.execCommand('insertHTML', ...) to insert HTML content into a contenteditable region, the DOM structure may be broken or reformatted unexpectedly. Nested elements may be flattened or reorganized."
category: formatting
tags:
  - insertHTML
  - dom
  - formatting
  - chrome
status: draft
---

When using `document.execCommand('insertHTML', ...)` to insert HTML content into a contenteditable region, the DOM structure may be broken or reformatted unexpectedly. Nested elements may be flattened or reorganized.
