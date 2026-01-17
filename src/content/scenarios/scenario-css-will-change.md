---
id: scenario-css-will-change
title: CSS will-change may improve or degrade contenteditable performance
description: "When a contenteditable element has CSS will-change property set, performance may be affected. In some cases, it may improve performance by hinting the browser about upcoming changes. In other cases, it may degrade performance by creating unnecessary layers."
category: performance
tags:
  - css-will-change
  - performance
  - chrome
  - macos
status: draft
locale: en
---

When a contenteditable element has CSS `will-change` property set, performance may be affected. In some cases, it may improve performance by hinting the browser about upcoming changes. In other cases, it may degrade performance by creating unnecessary layers.

## References

- [Chrome Developers: Inside Browser Part 3](https://developer.chrome.com/blog/inside-browser-part3) - Compositor layers explanation
- [Web.dev: Stick to compositor-only properties](https://web.dev/stick-to-compositor-only-properties-and-manage-layer-count/) - Layer management
- [LogRocket: When and how to use CSS will-change](https://blog.logrocket.com/when-how-use-css-will-change/) - will-change best practices
- [Readium: CSS performance hacks](https://readium.org/css/docs/CSS25-performance_hacks.html) - will-change: contents
- [ProseMirror Discuss: Performance issue with Chrome v96](https://discuss.prosemirror.net/t/performance-issue-with-chrome-v96/4208/7) - Spellcheck performance
- [Web.dev: content-visibility](https://web.dev/articles/content-visibility) - Content visibility optimization
- [Coding Courses: CSS will-change property](https://coding.courses/css-will-change-property/) - Usage timing

## References

- [Chrome Developers: Inside Browser Part 3](https://developer.chrome.com/blog/inside-browser-part3) - Compositor layers explanation
- [Web.dev: Stick to compositor-only properties](https://web.dev/stick-to-compositor-only-properties-and-manage-layer-count/) - Layer management
- [LogRocket: When and how to use CSS will-change](https://blog.logrocket.com/when-how-use-css-will-change/) - will-change best practices
- [Readium: CSS performance hacks](https://readium.org/css/docs/CSS25-performance_hacks.html) - will-change: contents caveats
- [ProseMirror Discuss: Performance issue with Chrome v96](https://discuss.prosemirror.net/t/performance-issue-with-chrome-v96/4208/7) - Spellcheck performance
- [Web.dev: content-visibility](https://web.dev/articles/content-visibility) - Content visibility optimization
- [Coding Courses: CSS will-change property](https://coding.courses/css-will-change-property/) - Usage guidelines
