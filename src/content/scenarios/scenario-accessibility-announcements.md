---
id: scenario-accessibility-announcements
title: Screen readers do not announce changes in contenteditable regions
description: "When content changes in a contenteditable region (text is typed, deleted, or formatted), screen readers do not announce these changes to users. This makes it difficult for users relying on assistive technologies to understand what is happening in the editor."
category: accessibility
tags:
  - accessibility
  - screen-reader
  - aria
  - safari
status: draft
locale: en
---

When content changes in a contenteditable region (text is typed, deleted, or formatted), screen readers do not announce these changes to users. This makes it difficult for users relying on assistive technologies to understand what is happening in the editor.

## References

- [MDN: ARIA Live Regions](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Guides/Live_regions) - Live regions guide
- [Sara Soueidan: Accessible notifications with ARIA live regions](https://www.sarasoueidan.com/blog/accessible-notifications-with-aria-live-regions-part-1/) - Live region patterns
- [HTMHell: ARIA live regions](https://www.htmhell.dev/adventcalendar/2023/22/) - Visibility considerations
- [Dev.to: When your live region isn't live](https://dev.to/dkoppenhagen/when-your-live-region-isnt-live-fixing-aria-live-in-angular-react-and-vue-1g0j) - Framework issues
- [MDN: aria-live attribute](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Attributes/aria-live) - aria-live documentation
- [WebDocs: ARIA live regions](https://webdocs.dev/en-us/docs/web/accessibility/aria/aria_live_regions) - aria-relevant documentation
- [Orange A11y Guidelines: aria-live alert](https://a11y-guidelines.orange.com/en/articles/aria-live-alert/) - Alert role usage
- [Web.dev: Hiding and updating content](https://web.dev/articles/hiding-and-updating-content) - Visibility requirements
- [Reddit: Accessibility live region issues](https://www.reddit.com/r/accessibility/comments/1l4nwj2) - Screen reader testing
