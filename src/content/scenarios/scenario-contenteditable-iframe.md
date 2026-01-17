---
id: scenario-contenteditable-iframe
title: contenteditable behavior differs when inside an iframe
description: When a contenteditable region is inside an iframe, its behavior may differ from when it's in the main document. Selection, focus, and event handling may be inconsistent.
category: other
tags:
  - iframe
  - contenteditable
  - isolation
  - edge
status: draft
locale: en
---

When a contenteditable region is inside an iframe, its behavior may differ from when it's in the main document. Selection, focus, and event handling may be inconsistent.

## References

- [AllowFullscreen: Cross-origin restrictions in iframes](https://www.allowfullscreen.com/questions?q=How+do+cross-origin+restrictions+impact+JavaScript+events+in+allowfullscreen+iframes%3F) - Same-origin policy
- [Stack Overflow: Tracking focus on cross-origin iframe](https://stackoverflow.com/questions/54953474/tracking-focus-on-cross-origin-iframe) - Focus detection
- [XJavaScript: Blocked autofocusing in cross-origin subframe](https://www.xjavascript.com/blog/blocked-autofocusing-on-a-input-element-in-a-cross-origin-subframe/) - postMessage communication
- [Stack Overflow: How to detect a click inside of an iframe cross-domain](https://stackoverflow.com/questions/29337304/how-to-detect-a-click-inside-of-an-iframe-cross-domain-aka-prevent-click-frau) - Click detection
- [Stack Overflow: Detecting when an iframe gets or loses focus](https://stackoverflow.com/questions/5456239/detecting-when-an-iframe-gets-or-loses-focus) - Focus polling
- [Stack Overflow: Selection change event in contenteditable](https://stackoverflow.com/questions/8442158/selection-change-event-in-contenteditable) - selectionchange event
- [GitHub Gist: iOS Safari iframe focus issues](https://gist.github.com/dcf2d0331043586421f3) - iOS-specific workarounds
