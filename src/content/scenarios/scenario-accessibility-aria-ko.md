---
id: scenario-accessibility-aria-ko
title: contenteditable의 ARIA 속성이 올바르게 알려지지 않음
description: "contenteditable 영역에 ARIA 속성(role, aria-label, aria-describedby 등)을 적용할 때 스크린 리더가 Safari에서 이를 올바르게 알리지 않을 수 있습니다. 접근성 정보가 손실됩니다."
category: accessibility
tags:
  - accessibility
  - aria
  - screen-reader
  - safari
status: draft
locale: ko
---

contenteditable 영역에 ARIA 속성(`role`, `aria-label`, `aria-describedby` 등)을 적용할 때 스크린 리더가 Safari에서 이를 올바르게 알리지 않을 수 있습니다. 접근성 정보가 손실됩니다.

## 참고 자료

- [MDN: textbox role](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles/textbox_role) - textbox role documentation
- [Stack Overflow: Indicate inline editable to screen readers](https://stackoverflow.com/questions/59074409/how-to-indicate-to-screen-readers-that-content-is-inline-editable) - ARIA setup
- [Stack Overflow: Safari VoiceOver not reading aria-label for span](https://stackoverflow.com/questions/70084551/safari-voice-over-not-reading-aria-label-for-a-span) - Generic element issues
- [Stack Overflow: VoiceOver does not read aria-label on iOS Safari](https://stackoverflow.com/questions/69474496/voice-over-does-not-read-aria-label-on-ios-safari-but-screen-reader-reads-on-chr) - Role requirements
- [Apple Discussions: VoiceOver ignores aria-describedby](https://discussions.apple.com/thread/255163557) - Safari limitations
- [Stack Overflow: Safari OSX VoiceOver not reading aria-label](https://stackoverflow.com/questions/35215298/safari-osx-voiceover-not-reading-aria-label-for-input) - Hidden content issues
- [AppleVis: role=text support removed](https://www.applevis.com/forum/app-development-programming/voiceover-aria-roletext-support-no-longer-supported-ios-v172) - Deprecated role
- [Stack Overflow: VoiceOver Safari does not read aria-label as expected](https://stackoverflow.com/questions/68742041/voiceover-safari-does-not-read-aria-label-as-expected) - Live region workarounds
