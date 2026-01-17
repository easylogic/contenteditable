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
locale: en
---

When a contenteditable region is inside a `<form>`, its content is not automatically included in form submission. Unlike `<input>` and `<textarea>`, contenteditable content must be manually extracted and added to the form data.

## References

- [Stack Overflow: Using contenteditable fields in form submission](https://stackoverflow.com/questions/6247702/using-html5-how-do-i-use-contenteditable-fields-in-a-form-submission) - Form integration patterns
- [Web.dev: More capable form controls](https://web.dev/articles/more-capable-form-controls) - formdata event
- [Drupal: Hidden form controls validation](https://www.drupal.org/project/drupal/issues/2571755) - Validation issues
