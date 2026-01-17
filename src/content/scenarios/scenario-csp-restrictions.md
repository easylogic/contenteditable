---
id: scenario-csp-restrictions
title: Content Security Policy may restrict contenteditable behavior
description: "When a page has a strict Content Security Policy (CSP), certain contenteditable operations may be restricted. Pasting content, executing scripts, or inserting HTML may be blocked depending on the CSP directives."
category: other
tags:
  - csp
  - security
  - chrome
  - windows
status: draft
locale: en
---

When a page has a strict Content Security Policy (CSP), certain contenteditable operations may be restricted. Pasting content, executing scripts, or inserting HTML may be blocked depending on the CSP directives.

## References

- [MDN: Content Security Policy script-src](https://developer.mozilla.org/docs/Web/HTTP/Reference/Headers/Content-Security-Policy/script-src) - CSP script-src directive
- [Content Security Policy: require-trusted-types-for](https://content-security-policy.com/require-trusted-types-for/) - Trusted Types documentation
- [Stack Overflow: Why isn't inline JavaScript blocked by CSP?](https://stackoverflow.com/questions/24856089/why-isnt-this-inline-javascript-blocked-by-content-security-policy) - Script execution behavior
- [LateNode Community: Block JavaScript in design-mode iframe](https://community.latenode.com/t/how-can-i-block-users-from-inserting-javascript-in-a-design-mode-iframe/1476) - Security considerations
- [XJavaScript: Can scripts be inserted with innerHTML?](https://www.xjavascript.com/blog/can-scripts-be-inserted-with-innerhtml/) - Script insertion behavior
