---
id: scenario-mobile-keyboard-scroll
title: Virtual keyboard on mobile scrolls contenteditable out of view
description: On mobile devices, when the virtual keyboard appears while focusing a `contenteditable` element,
category: mobile
tags:
  - mobile
  - keyboard
  - scroll
status: draft
locale: en
---

On mobile devices, when the virtual keyboard appears while focusing a `contenteditable` element,
the page scrolls in a way that moves the caret or the editable region partially out of view.

## References

- [Chrome Developers: Viewport resize behavior](https://developer.chrome.com/blog/viewport-resize-behavior) - interactive-widget meta tag
- [Bram.us: Prevent items from being hidden underneath virtual keyboard](https://www.bram.us/2021/09/13/prevent-items-from-being-hidden-underneath-the-virtual-keyboard-by-means-of-the-virtualkeyboard-api/) - VirtualKeyboard API
- [HTMHell: interactive-widget](https://www.htmhell.dev/adventcalendar/2024/4/) - Viewport meta tag guide
- [Stack Overflow: Force content to shrink when keyboard opens](https://stackoverflow.com/questions/77812591/when-opening-the-keyboard-on-mobile-how-can-i-force-my-content-to-shrink-to-fit) - Viewport resizing
- [Reddit: iOS interactive-widget support](https://www.reddit.com//r/webdev/comments/1mehksi) - iOS limitations
- [Stack Overflow: Automatic scrolling in contenteditable](https://stackoverflow.com/questions/8523232/automatic-scrolling-when-contenteditable-designmode-in-a-uiwebview) - Scroll container solutions
- [PHP.cn: Mobile keyboard focus handling](https://m.php.cn/en/faq/1796897449.html) - Focus delay techniques
