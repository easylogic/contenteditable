---
id: scenario-cors-restrictions
title: CORS restrictions may affect contenteditable in cross-origin iframes
description: "When a contenteditable element is inside a cross-origin iframe, CORS restrictions may prevent certain operations. Accessing the contenteditable from the parent frame may be blocked, and some editing operations may be restricted."
category: other
tags:
  - cors
  - iframe
  - security
  - safari
  - macos
status: draft
locale: en
---

When a contenteditable element is inside a cross-origin iframe, CORS restrictions may prevent certain operations. Accessing the contenteditable from the parent frame may be blocked, and some editing operations may be restricted.

## References

- [Medium: Seamless communication between iframes with postMessage](https://ran-bajra.medium.com/seamless-communication-between-iframes-with-postmessage-even-across-origins-ae49fa1ad4b4) - postMessage guide
- [React Issue #15098: Cross-origin iframe access](https://github.com/facebook/react/issues/15098) - React iframe issues
- [Stack Overflow: postMessage to sandboxed iframe](https://stackoverflow.com/questions/53642613/is-it-possible-to-send-a-postmessage-to-a-sandboxed-iframe-without-the-allow-sc) - Sandbox restrictions
- [Stack Overflow: Is contenteditable secure?](https://stackoverflow.com/questions/41623980/is-the-html5-property-contenteditable-secure) - Security considerations
- [MDN: Window.postMessage](https://developer.mozilla.org/en-US/docs/Web/API/Window/postMessage) - postMessage API documentation
- [CyberAngles: Synchronous cross-domain communication](https://www.cyberangles.org/blog/can-i-do-synchronous-cross-domain-communicating-with-window-postmessage/) - Message timing
- [Chrome Developers: Permissions Policy](https://developer.chrome.com/docs/privacy-security/permissions-policy) - Feature policies
- [Chrome Developers: iframe credentialless](https://developer.chrome.com/blog/iframe-credentialless) - Credentialless iframes
