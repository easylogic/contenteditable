---
id: scenario-cors-restrictions-ko
title: CORS 제한이 교차 출처 iframe의 contenteditable에 영향을 줄 수 있음
description: "contenteditable 요소가 교차 출처 iframe 내부에 있을 때 CORS 제한이 특정 작업을 방지할 수 있습니다. 부모 프레임에서 contenteditable에 액세스하는 것이 차단될 수 있으며 일부 편집 작업이 제한될 수 있습니다."
category: other
tags:
  - cors
  - iframe
  - security
  - safari
  - macos
status: draft
locale: ko
---

contenteditable 요소가 교차 출처 iframe 내부에 있을 때 CORS 제한이 특정 작업을 방지할 수 있습니다. 부모 프레임에서 contenteditable에 액세스하는 것이 차단될 수 있으며 일부 편집 작업이 제한될 수 있습니다.

## 참고 자료

- [Medium: Seamless communication between iframes with postMessage](https://ran-bajra.medium.com/seamless-communication-between-iframes-with-postmessage-even-across-origins-ae49fa1ad4b4) - postMessage guide
- [React Issue #15098: Cross-origin iframe access](https://github.com/facebook/react/issues/15098) - React iframe issues
- [Stack Overflow: postMessage to sandboxed iframe](https://stackoverflow.com/questions/53642613/is-it-possible-to-send-a-postmessage-to-a-sandboxed-iframe-without-the-allow-sc) - Sandbox restrictions
- [Stack Overflow: Is contenteditable secure?](https://stackoverflow.com/questions/41623980/is-the-html5-property-contenteditable-secure) - Security considerations
- [MDN: Window.postMessage](https://developer.mozilla.org/en-US/docs/Web/API/Window/postMessage) - postMessage API documentation
- [CyberAngles: Synchronous cross-domain communication](https://www.cyberangles.org/blog/can-i-do-synchronous-cross-domain-communicating-with-window-postmessage/) - Message timing
- [Chrome Developers: Permissions Policy](https://developer.chrome.com/docs/privacy-security/permissions-policy) - Feature policies
- [Chrome Developers: iframe credentialless](https://developer.chrome.com/blog/iframe-credentialless) - Credentialless iframes
