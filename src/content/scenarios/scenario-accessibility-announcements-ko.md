---
id: scenario-accessibility-announcements-ko
title: 스크린 리더가 contenteditable 영역의 변경 사항을 알리지 않음
description: "contenteditable 영역에서 콘텐츠가 변경될 때(텍스트 입력, 삭제 또는 서식 적용) 스크린 리더가 이러한 변경 사항을 사용자에게 알리지 않습니다. 이것은 보조 기술에 의존하는 사용자가 편집기에서 무슨 일이 일어나고 있는지 이해하기 어렵게 만듭니다."
category: accessibility
tags:
  - accessibility
  - screen-reader
  - aria
  - safari
status: draft
locale: ko
---

contenteditable 영역에서 콘텐츠가 변경될 때(텍스트 입력, 삭제 또는 서식 적용) 스크린 리더가 이러한 변경 사항을 사용자에게 알리지 않습니다. 이것은 보조 기술에 의존하는 사용자가 편집기에서 무슨 일이 일어나고 있는지 이해하기 어렵게 만듭니다.

## 참고 자료

- [MDN: ARIA Live Regions](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Guides/Live_regions) - Live regions guide
- [Sara Soueidan: Accessible notifications with ARIA live regions](https://www.sarasoueidan.com/blog/accessible-notifications-with-aria-live-regions-part-1/) - Live region patterns
- [HTMHell: ARIA live regions](https://www.htmhell.dev/adventcalendar/2023/22/) - Visibility considerations
- [Dev.to: When your live region isn't live](https://dev.to/dkoppenhagen/when-your-live-region-isnt-live-fixing-aria-live-in-angular-react-and-vue-1g0j) - Framework issues
- [MDN: aria-live attribute](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Attributes/aria-live) - aria-live documentation
- [WebDocs: ARIA live regions](https://webdocs.dev/en-us/docs/web/accessibility/aria/aria_live_regions) - aria-relevant documentation
- [Orange A11y Guidelines: aria-live alert](https://a11y-guidelines.orange.com/en/articles/aria-live-alert/) - Alert role usage
- [Web.dev: Hiding and updating content](https://web.dev/articles/hiding-and-updating-content) - Visibility requirements
- [Reddit: Accessibility live region issues](https://www.reddit.com/r/accessibility/comments/1l4nwj2) - Screen reader testing
