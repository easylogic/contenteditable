---
id: scenario-focus-management
title: Focus is lost when clicking on certain elements within contenteditable
description: "When a contenteditable region contains interactive elements (buttons, links, etc.), clicking on these elements causes the contenteditable to lose focus. This interrupts the editing flow and may cause the caret to disappear."
category: focus
tags:
  - focus
  - click
  - firefox
status: draft
locale: en
---

When a contenteditable region contains interactive elements (buttons, links, etc.), clicking on these elements causes the contenteditable to lose focus. This interrupts the editing flow and may cause the caret to disappear.

## References

- [Stack Overflow: contenteditable div loses selection when input focuses](https://stackoverflow.com/questions/12778508/contenteditable-div-loses-selection-when-another-input-focuses) - Focus loss issues
- [Stack Overflow: Avoid losing focus on contenteditable when clicking button](https://stackoverflow.com/questions/7392959/how-do-you-avoid-losing-focus-on-a-contenteditable-element-when-a-user-clicks-ou) - preventDefault solution
- [Stack Overflow: jQuery button click causes focus loss](https://stackoverflow.com/questions/53973882/jquery-button-click-causes-focus-loss-on-highlighted-text-in-editable-div) - Button focus behavior
- [GitHub Gist: WebKit focus hack](https://gist.github.com/1081133/cfb74dde66261a892c5db1726ff97f7edcd3f780) - WebKit blur workaround
