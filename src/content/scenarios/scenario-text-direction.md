---
id: scenario-text-direction
title: Text direction (dir attribute) changes are not applied during editing
description: "When the dir attribute is changed dynamically on a contenteditable region (e.g., switching between ltr and rtl), the text direction may not update correctly during active editing in Firefox. The caret position and text flow may be incorrect."
category: other
tags:
  - direction
  - rtl
  - ltr
  - firefox
status: draft
locale: en
---

When the `dir` attribute is changed dynamically on a contenteditable region (e.g., switching between `ltr` and `rtl`), the text direction may not update correctly during active editing in Firefox. The caret position and text flow may be incorrect.

## References

- [Stack Overflow: dir="auto" doesn't work as expected in Firefox](https://stackoverflow.com/questions/14346486/dir-auto-doesnt-work-as-expected-in-firefox) - dir="auto" issues
- [MDN: dir global attribute](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Global_attributes/dir) - dir attribute documentation
- [Firefox Source Docs: RTL guidelines](https://firefox-source-docs.mozilla.org/code-quality/coding-style/rtl_guidelines.html) - Firefox RTL implementation
- [Wikimedia Phabricator: dir attribute issues](https://phabricator.wikimedia.org/T153356) - Related bug report
- [ProseMirror Discuss: Firefox contenteditable false cursor bug](https://discuss.prosemirror.net/t/firefox-contenteditable-false-cursor-bug/5016) - Related cursor issues
