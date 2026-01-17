---
id: scenario-css-backdrop-filter
title: CSS backdrop-filter may cause rendering issues in contenteditable
description: "When a contenteditable element has CSS backdrop-filter applied, rendering may be affected. Text may appear blurry, selection may not render correctly, and performance may be degraded, especially on mobile devices."
category: mobile
tags:
  - css-backdrop-filter
  - rendering
  - mobile
  - ios
  - safari
status: draft
locale: en
---

When a contenteditable element has CSS `backdrop-filter` applied, rendering may be affected. Text may appear blurry, selection may not render correctly, and performance may be degraded, especially on mobile devices.

## References

- [MDN: Using filter effects](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_filter_effects/Using_filter_effects) - backdrop-filter documentation
- [Stack Overflow: backdrop-filter not working for nested elements](https://stackoverflow.com/questions/60997948/backdrop-filter-not-working-for-nested-elements-in-chrome) - Nested filter issues
- [VitePress Issue #1049: backdrop-filter performance](https://github.com/vuejs/vitepress/issues/1049) - Performance problems
- [Headless UI Issue #690: backdrop-filter input lag](https://github.com/tailwindlabs/headlessui/issues/690) - UI lag issues
- [Stack Overflow: Text seems blurry on backdrop blur](https://stackoverflow.com/questions/65788900/text-seems-a-bit-blurry-on-a-backdrop-blur-html-css) - Blurry text rendering
- [Stack Overflow: Why backdrop-filter in Firefox don't work](https://stackoverflow.com/questions/63789769/why-backdrop-filter-in-firefox-dont-work) - Firefox compatibility
- [Stack Overflow: Firefox backdrop-filter blur with sticky positioning](https://stackoverflow.com/questions/74277643/firefox-backdrop-filter-blur-not-working-with-sticky-positioning) - Sticky position issues
- [Electron Issue #39529: backdrop-filter inconsistencies](https://github.com/electron/electron/issues/39529) - WebView issues

## References

- [MDN: Using filter effects](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_filter_effects/Using_filter_effects) - backdrop-filter documentation
- [Stack Overflow: backdrop-filter not working for nested elements](https://stackoverflow.com/questions/60997948/backdrop-filter-not-working-for-nested-elements-in-chrome) - Nested filter issues
- [VitePress Issue #1049: backdrop-filter performance](https://github.com/vuejs/vitepress/issues/1049) - Performance problems
- [Headless UI Issue #690: backdrop-filter input lag](https://github.com/tailwindlabs/headlessui/issues/690) - Input lag issues
- [Stack Overflow: Text seems blurry on backdrop blur](https://stackoverflow.com/questions/65788900/text-seems-a-bit-blurry-on-a-backdrop-blur-html-css) - Blurry text rendering
- [Stack Overflow: Why backdrop-filter in Firefox don't work](https://stackoverflow.com/questions/63789769/why-backdrop-filter-in-firefox-dont-work) - Firefox compatibility
- [Stack Overflow: Firefox backdrop-filter blur not working with sticky](https://stackoverflow.com/questions/74277643/firefox-backdrop-filter-blur-not-working-with-sticky-positioning) - Sticky positioning issues
- [Electron Issue #39529: backdrop-filter inconsistencies](https://github.com/electron/electron/issues/39529) - WebView issues
