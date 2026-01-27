---
id: ce-0063-contenteditable-with-required
scenarioId: scenario-required-validation
locale: en
os: Windows
osVersion: "11"
device: Desktop
deviceVersion: Any
browser: Chrome
browserVersion: "120.0"
keyboard: US
caseTitle: required attribute is not supported for validation
description: "The HTML5 'required' attribute is ignored by browsers when placed on a contenteditable element, preventing native form validation from blocking empty submissions."
tags: ["required", "validation", "form", "chrome"]
status: confirmed
---

## Phenomenon
When marking a `contenteditable` container as `required`, the browser's form validation engine does not check its content. Users can submit an empty editor even if it's logically "mandatory".

## Reproduction Steps
1. Create a `<form>`.
2. Add `<div contenteditable="true" required></div>`.
3. Add a submit button.
4. Leave the div empty and click submit.
5. Observe that the form submits without showing a "Please fill out this field" tooltip.

## Expected Behavior
The browser should ideally support native validation for editable regions or provide a focused pseudo-class for validation states.

## Solution
Use a hidden `input` with the `required` attribute and sync its value, or use the `checkValidity()` API manually on form submission.
