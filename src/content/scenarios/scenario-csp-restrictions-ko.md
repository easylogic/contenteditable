---
id: scenario-csp-restrictions-ko
title: 콘텐츠 보안 정책이 contenteditable 동작을 제한할 수 있음
description: "페이지에 엄격한 콘텐츠 보안 정책(CSP)이 있을 때 특정 contenteditable 작업이 제한될 수 있습니다. CSP 지시문에 따라 콘텐츠 붙여넣기, 스크립트 실행 또는 HTML 삽입이 차단될 수 있습니다."
category: other
tags:
  - csp
  - security
  - chrome
  - windows
status: draft
locale: ko
---

페이지에 엄격한 콘텐츠 보안 정책(CSP)이 있을 때 특정 contenteditable 작업이 제한될 수 있습니다. CSP 지시문에 따라 콘텐츠 붙여넣기, 스크립트 실행 또는 HTML 삽입이 차단될 수 있습니다.

## 참고 자료

- [MDN: Content Security Policy script-src](https://developer.mozilla.org/docs/Web/HTTP/Reference/Headers/Content-Security-Policy/script-src) - CSP script-src directive
- [Content Security Policy: require-trusted-types-for](https://content-security-policy.com/require-trusted-types-for/) - Trusted Types documentation
- [Stack Overflow: Why isn't inline JavaScript blocked by CSP?](https://stackoverflow.com/questions/24856089/why-isnt-this-inline-javascript-blocked-by-content-security-policy) - Script execution behavior
- [LateNode Community: Block JavaScript in design-mode iframe](https://community.latenode.com/t/how-can-i-block-users-from-inserting-javascript-in-a-design-mode-iframe/1476) - Security considerations
- [XJavaScript: Can scripts be inserted with innerHTML?](https://www.xjavascript.com/blog/can-scripts-be-inserted-with-innerhtml/) - Script insertion behavior
