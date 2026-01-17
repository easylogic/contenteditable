---
id: scenario-css-filter-ko
title: "CSS filter가 contenteditable 성능에 영향을 줄 수 있음"
description: "contenteditable 요소에 CSS 필터(blur, brightness 등)가 적용되어 있을 때 편집 성능이 저하될 수 있습니다. 입력이 지연될 수 있고 선택이 느리게 업데이트될 수 있습니다."
category: performance
tags:
  - css-filter
  - performance
  - chrome
  - macos
status: draft
locale: ko
---

contenteditable 요소에 CSS 필터(blur, brightness 등)가 적용되어 있을 때 편집 성능이 저하될 수 있습니다. 입력이 지연될 수 있고 선택이 느리게 업데이트될 수 있습니다.

## 참고 자료

- [GitHub: thirdweb dashboard filter performance issue](https://github.com/thirdweb-dev/dashboard/issues/703) - 필터 성능 문제
- [VitePress Issue #1049: backdrop-filter performance](https://github.com/vuejs/vitepress/issues/1049) - backdrop-filter 이슈
- [Brave Community: CSS filter blur stuttering](https://community.brave.com/t/css-filter-blur-causes-significant-stuttering-and-performance-drop-on-websites/419803) - 성능 저하
- [SitePoint: CSS filter effects](https://www.sitepoint.com/css-filter-effects-blur-grayscale-brightness-and-more-in-css/) - 필터 문서
- [Stack Overflow: CSS blur filter performance](https://stackoverflow.com/questions/31713468/css-blur-filter-performance) - 성능 최적화
