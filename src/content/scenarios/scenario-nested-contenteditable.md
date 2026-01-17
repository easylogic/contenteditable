---
id: scenario-nested-contenteditable
title: Nested contenteditable elements cause focus and selection issues
description: "When a contenteditable element contains another contenteditable element, focus behavior becomes unpredictable. Clicking on the nested element may not properly focus it, and selection ranges may span across both elements incorrectly."
category: focus
tags:
  - nested
  - focus
  - selection
status: draft
locale: en
---

When a contenteditable element contains another contenteditable element, focus behavior becomes unpredictable. Clicking on the nested element may not properly focus it, and selection ranges may span across both elements incorrectly.

## References

- [ExchangeTuts: Focusing on nested contenteditable element](https://exchangetuts.com/focusing-on-nested-contenteditable-element-1641465483617619) - Focus delegation
- [Lightrun: Cypress cannot focus element inside contenteditable](https://lightrun.com/answers/cypress-io-cypress-cannot-focus-element-inside-content-editable-element) - Focus issues
- [ProseMirror Discuss: Focus issue in Chrome with contenteditable false](https://discuss.prosemirror.net/t/focus-issue-in-chrome-when-the-first-child-node-of-the-node-view-has-contenteditable-false/1820) - Browser differences
- [Stack Overflow: contenteditable div loses selection when input focuses](https://stackoverflow.com/questions/12778508/contenteditable-div-loses-selection-when-another-input-focuses) - Selection loss
- [Web.dev: Learn HTML focus](https://web.dev/learn/html/focus/) - tabindex usage
