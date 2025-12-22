---
id: scenario-clipboard-api
title: Clipboard API paste does not work in contenteditable
description: "When using the Clipboard API (navigator.clipboard.readText() or navigator.clipboard.read()) to programmatically paste content into a contenteditable region, the paste operation may fail or not work as expected."
category: paste
tags:
  - clipboard
  - api
  - paste
  - chrome
status: draft
---

When using the Clipboard API (`navigator.clipboard.readText()` or `navigator.clipboard.read()`) to programmatically paste content into a contenteditable region, the paste operation may fail or not work as expected.

This scenario has been observed in multiple environments with similar behavior.
