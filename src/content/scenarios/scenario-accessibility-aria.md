---
id: scenario-accessibility-aria
title: ARIA attributes on contenteditable are not properly announced
description: "When ARIA attributes (like role, aria-label, aria-describedby) are applied to contenteditable regions, screen readers may not properly announce them in Safari. The accessibility information is lost."
category: accessibility
tags:
  - accessibility
  - aria
  - screen-reader
  - safari
status: draft
locale: en
---

When ARIA attributes (like `role`, `aria-label`, `aria-describedby`) are applied to contenteditable regions, screen readers may not properly announce them in Safari. The accessibility information is lost.

## References

- [MDN: textbox role](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles/textbox_role) - textbox role documentation
- [Stack Overflow: Indicate inline editable to screen readers](https://stackoverflow.com/questions/59074409/how-to-indicate-to-screen-readers-that-content-is-inline-editable) - ARIA setup
- [Stack Overflow: Safari VoiceOver not reading aria-label for span](https://stackoverflow.com/questions/70084551/safari-voice-over-not-reading-aria-label-for-a-span) - Generic element issues
- [Stack Overflow: VoiceOver does not read aria-label on iOS Safari](https://stackoverflow.com/questions/69474496/voice-over-does-not-read-aria-label-on-ios-safari-but-screen-reader-reads-on-chr) - Role requirements
- [Apple Discussions: VoiceOver ignores aria-describedby](https://discussions.apple.com/thread/255163557) - Safari limitations
- [Stack Overflow: Safari OSX VoiceOver not reading aria-label](https://stackoverflow.com/questions/35215298/safari-osx-voiceover-not-reading-aria-label-for-input) - Hidden content issues
- [AppleVis: role=text support removed](https://www.applevis.com/forum/app-development-programming/voiceover-aria-roletext-support-no-longer-supported-ios-v172) - Deprecated role
- [Stack Overflow: VoiceOver Safari does not read aria-label as expected](https://stackoverflow.com/questions/68742041/voiceover-safari-does-not-read-aria-label-as-expected) - Live region workarounds
