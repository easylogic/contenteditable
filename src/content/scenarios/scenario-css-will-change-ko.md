---
id: scenario-css-will-change-ko
title: CSS will-change가 contenteditable 성능을 개선하거나 저하시킬 수 있음
description: "contenteditable 요소에 CSS will-change 속성이 설정되어 있을 때 성능이 영향을 받을 수 있습니다. 일부 경우에는 브라우저에 다가오는 변경 사항을 힌트하여 성능을 개선할 수 있습니다. 다른 경우에는 불필요한 레이어를 만들어 성능을 저하시킬 수 있습니다."
category: performance
tags:
  - css-will-change
  - performance
  - chrome
  - macos
status: draft
locale: ko
---

contenteditable 요소에 CSS `will-change` 속성이 설정되어 있을 때 성능이 영향을 받을 수 있습니다. 일부 경우에는 브라우저에 다가오는 변경 사항을 힌트하여 성능을 개선할 수 있습니다. 다른 경우에는 불필요한 레이어를 만들어 성능을 저하시킬 수 있습니다.

## 참고 자료

- [Chrome Developers: Inside Browser Part 3](https://developer.chrome.com/blog/inside-browser-part3) - Compositor layers explanation
- [Web.dev: Stick to compositor-only properties](https://web.dev/stick-to-compositor-only-properties-and-manage-layer-count/) - Layer management
- [LogRocket: When and how to use CSS will-change](https://blog.logrocket.com/when-how-use-css-will-change/) - will-change best practices
- [Readium: CSS performance hacks](https://readium.org/css/docs/CSS25-performance_hacks.html) - will-change: contents
- [ProseMirror Discuss: Performance issue with Chrome v96](https://discuss.prosemirror.net/t/performance-issue-with-chrome-v96/4208/7) - Spellcheck performance
- [Web.dev: content-visibility](https://web.dev/articles/content-visibility) - Content visibility optimization
- [Coding Courses: CSS will-change property](https://coding.courses/css-will-change-property/) - Usage timing
