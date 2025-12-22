---
id: scenario-double-line-break
title: Pressing Enter inserts two line breaks in contenteditable
description: In a plain `contenteditable` element, pressing Enter inserts two visible line breaks instead of one.
category: other
tags:
  - enter
  - newline
status: draft
---

In a plain `contenteditable` element, pressing Enter inserts two visible line breaks instead of one.
The resulting DOM contains nested `<div>` or `<br>` elements that render as an extra blank line.

This scenario has been observed in multiple environments with similar behavior.
