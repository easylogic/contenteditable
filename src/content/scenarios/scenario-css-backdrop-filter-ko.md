---
id: scenario-css-backdrop-filter-ko
title: CSS backdrop-filter가 contenteditable에서 렌더링 문제를 일으킬 수 있음
description: "contenteditable 요소에 CSS backdrop-filter가 적용되어 있을 때 렌더링이 영향을 받을 수 있습니다. 텍스트가 흐릿하게 나타날 수 있고, 선택이 올바르게 렌더링되지 않을 수 있으며, 특히 모바일 기기에서 성능이 저하될 수 있습니다."
category: mobile
tags:
  - css-backdrop-filter
  - rendering
  - mobile
  - ios
  - safari
status: draft
locale: ko
---

contenteditable 요소에 CSS `backdrop-filter`가 적용되어 있을 때 렌더링이 영향을 받을 수 있습니다. 텍스트가 흐릿하게 나타날 수 있고, 선택이 올바르게 렌더링되지 않을 수 있으며, 특히 모바일 기기에서 성능이 저하될 수 있습니다.

## 참고 자료

- [MDN: Using filter effects](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_filter_effects/Using_filter_effects) - backdrop-filter documentation
- [Stack Overflow: backdrop-filter not working for nested elements](https://stackoverflow.com/questions/60997948/backdrop-filter-not-working-for-nested-elements-in-chrome) - Nested filter issues
- [VitePress Issue #1049: backdrop-filter performance](https://github.com/vuejs/vitepress/issues/1049) - Performance problems
- [Headless UI Issue #690: backdrop-filter input lag](https://github.com/tailwindlabs/headlessui/issues/690) - UI lag issues
- [Stack Overflow: Text seems blurry on backdrop blur](https://stackoverflow.com/questions/65788900/text-seems-a-bit-blurry-on-a-backdrop-blur-html-css) - Blurry text rendering
- [Stack Overflow: Why backdrop-filter in Firefox don't work](https://stackoverflow.com/questions/63789769/why-backdrop-filter-in-firefox-dont-work) - Firefox compatibility
- [Stack Overflow: Firefox backdrop-filter blur with sticky positioning](https://stackoverflow.com/questions/74277643/firefox-backdrop-filter-blur-not-working-with-sticky-positioning) - Sticky position issues
- [Electron Issue #39529: backdrop-filter inconsistencies](https://github.com/electron/electron/issues/39529) - WebView issues
