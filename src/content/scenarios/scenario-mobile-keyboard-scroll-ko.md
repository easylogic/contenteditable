---
id: scenario-mobile-keyboard-scroll-ko
title: "모바일의 가상 키보드가 contenteditable을 화면 밖으로 스크롤함"
description: "모바일 기기에서 `contenteditable` 요소에 포커스를 줄 때 가상 키보드가 나타나면,"
category: mobile
tags:
  - mobile
  - keyboard
  - scroll
status: draft
locale: ko
---

모바일 기기에서 `contenteditable` 요소에 포커스를 줄 때 가상 키보드가 나타나면,
페이지가 캐럿이나 편집 가능한 영역을 부분적으로 화면 밖으로 이동시키는 방식으로 스크롤됩니다.

## 참고 자료

- [Chrome Developers: Viewport resize behavior](https://developer.chrome.com/blog/viewport-resize-behavior) - interactive-widget meta tag
- [Bram.us: Prevent items from being hidden underneath virtual keyboard](https://www.bram.us/2021/09/13/prevent-items-from-being-hidden-underneath-the-virtual-keyboard-by-means-of-the-virtualkeyboard-api/) - VirtualKeyboard API
- [HTMHell: interactive-widget](https://www.htmhell.dev/adventcalendar/2024/4/) - Viewport meta tag guide
- [Stack Overflow: Force content to shrink when keyboard opens](https://stackoverflow.com/questions/77812591/when-opening-the-keyboard-on-mobile-how-can-i-force-my-content-to-shrink-to-fit) - Viewport resizing
- [Reddit: iOS interactive-widget support](https://www.reddit.com//r/webdev/comments/1mehksi) - iOS limitations
- [Stack Overflow: Automatic scrolling in contenteditable](https://stackoverflow.com/questions/8523232/automatic-scrolling-when-contenteditable-designmode-in-a-uiwebview) - Scroll container solutions
- [PHP.cn: Mobile keyboard focus handling](https://m.php.cn/en/faq/1796897449.html) - Focus delay techniques
