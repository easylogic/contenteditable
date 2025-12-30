---
id: scenario-paste-formatting-loss
title: Pasting rich text into contenteditable strips markup unexpectedly
description: When pasting content from a rich text source into a contenteditable element, the resulting DOM loses headings, lists, or inline formatting that were present in the source.
category: paste
tags:
  - paste
  - clipboard
  - formatting
status: draft
locale: en
---

When pasting content from a rich text source (such as a word processor or a web page) into a
`contenteditable` element, the resulting DOM loses headings, lists, or inline formatting that were
present in the source.

This scenario has been observed in multiple environments with similar behavior.
