---
id: scenario-css-filter
title: CSS filter may affect contenteditable performance
description: When a contenteditable element has CSS filters applied (blur, brightness, etc.), editing performance may be degraded. Typing may lag, and selection may be slow to update.
category: performance
tags:
  - css-filter
  - performance
  - chrome
  - macos
status: draft
locale: en
---

When a contenteditable element has CSS filters applied (blur, brightness, etc.), editing performance may be degraded. Typing may lag, and selection may be slow to update.

## References

- [GitHub: thirdweb dashboard filter performance issue](https://github.com/thirdweb-dev/dashboard/issues/703) - Filter performance problems
- [VitePress Issue #1049: backdrop-filter performance](https://github.com/vuejs/vitepress/issues/1049) - Backdrop filter issues
- [Brave Community: CSS filter blur stuttering](https://community.brave.com/t/css-filter-blur-causes-significant-stuttering-and-performance-drop-on-websites/419803) - Performance degradation
- [SitePoint: CSS filter effects](https://www.sitepoint.com/css-filter-effects-blur-grayscale-brightness-and-more-in-css/) - Filter documentation
- [Stack Overflow: CSS blur filter performance](https://stackoverflow.com/questions/31713468/css-blur-filter-performance) - Performance optimization
