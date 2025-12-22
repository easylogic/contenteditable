---
id: scenario-form-integration
title: contenteditable content is not included in form submission
description: "When a contenteditable region is inside a form, its content is not automatically included in form submission. Unlike input and textarea, contenteditable content must be manually extracted and added to the form data."
category: other
tags:
  - form
  - submission
  - chrome
status: draft
---

When a contenteditable region is inside a `<form>`, its content is not automatically included in form submission. Unlike `<input>` and `<textarea>`, contenteditable content must be manually extracted and added to the form data.
