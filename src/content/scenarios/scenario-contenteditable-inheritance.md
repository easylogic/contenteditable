---
id: scenario-contenteditable-inheritance
title: contenteditable inheritance behavior is inconsistent
description: "When a parent element has contenteditable=\"true\" and a child element has contenteditable=\"false\", the inheritance behavior is inconsistent across browsers. Some browsers allow editing in the child, while others correctly prevent it. The behavior may also differ when the child has contenteditable=\"inherit\" or no contenteditable attribute."
category: other
tags:
  - inheritance
  - nested
  - firefox
  - windows
status: draft
locale: en
---

When a parent element has `contenteditable="true"` and a child element has `contenteditable="false"`, the inheritance behavior is inconsistent across browsers. Some browsers allow editing in the child, while others correctly prevent it. The behavior may also differ when the child has `contenteditable="inherit"` or no contenteditable attribute.
