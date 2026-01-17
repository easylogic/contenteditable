---
id: scenario-contenteditable-iframe-ko
title: "iframe 내부에서 contenteditable 동작이 다름"
description: "contenteditable 영역이 iframe 내부에 있을 때 메인 문서에 있을 때와 동작이 다를 수 있습니다. 선택, 포커스 및 이벤트 처리가 일관되지 않을 수 있습니다."
category: other
tags:
  - iframe
  - contenteditable
  - isolation
  - edge
status: draft
locale: ko
---

contenteditable 영역이 iframe 내부에 있을 때 메인 문서에 있을 때와 동작이 다를 수 있습니다. 선택, 포커스 및 이벤트 처리가 일관되지 않을 수 있습니다.

## 참고 자료

- [AllowFullscreen: Cross-origin restrictions in iframes](https://www.allowfullscreen.com/questions?q=How+do+cross-origin+restrictions+impact+JavaScript+events+in+allowfullscreen+iframes%3F) - Same-origin policy
- [Stack Overflow: Tracking focus on cross-origin iframe](https://stackoverflow.com/questions/54953474/tracking-focus-on-cross-origin-iframe) - Focus detection
- [XJavaScript: Blocked autofocusing in cross-origin subframe](https://www.xjavascript.com/blog/blocked-autofocusing-on-a-input-element-in-a-cross-origin-subframe/) - postMessage communication
- [Stack Overflow: How to detect a click inside of an iframe cross-domain](https://stackoverflow.com/questions/29337304/how-to-detect-a-click-inside-of-an-iframe-cross-domain-aka-prevent-click-frau) - Click detection
- [Stack Overflow: Detecting when an iframe gets or loses focus](https://stackoverflow.com/questions/5456239/detecting-when-an-iframe-gets-or-loses-focus) - Focus polling
- [Stack Overflow: Selection change event in contenteditable](https://stackoverflow.com/questions/8442158/selection-change-event-in-contenteditable) - selectionchange event
- [GitHub Gist: iOS Safari iframe focus issues](https://gist.github.com/dcf2d0331043586421f3) - iOS-specific workarounds
