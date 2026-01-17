---
id: scenario-placeholder-behavior
title: Placeholder text disappears when contenteditable receives focus
description: "When using CSS ::before or ::after pseudo-elements to create placeholder text for a contenteditable region, the placeholder disappears immediately when the element receives focus, even if the content is empty. This differs from input and textarea behavior."
category: focus
tags:
  - placeholder
  - focus
  - safari
status: draft
locale: en
---

When using CSS `::before` or `::after` pseudo-elements to create placeholder text for a contenteditable region, the placeholder disappears immediately when the element receives focus, even if the content is empty. This differs from `<input>` and `<textarea>` behavior.

## References

- [Stack Overflow: Placeholder for contenteditable div](https://stackoverflow.com/questions/20726174/placeholder-for-contenteditable-div) - CSS placeholder implementation
- [CodePen: contenteditable placeholder](https://codepen.io/peleskei_gabriel/pen/beBoLY) - Placeholder examples
- [Stack Overflow: Firefox contenteditable cursor issue](https://stackoverflow.com/questions/27093136/firefox-contenteditable-cursor-issue) - Firefox behavior
