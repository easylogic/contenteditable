---
id: scenario-xss-protection
title: XSS protection may interfere with contenteditable HTML insertion
description: "Browser XSS protection mechanisms may interfere with programmatic HTML insertion in contenteditable elements. Script tags or event handlers inserted via innerHTML or similar methods may be stripped or sanitized."
category: other
tags:
  - xss
  - security
  - edge
  - windows
status: draft
locale: en
---

Browser XSS protection mechanisms may interfere with programmatic HTML insertion in contenteditable elements. Script tags or event handlers inserted via innerHTML or similar methods may be stripped or sanitized.

## References

- [MDN: XSS Attacks](https://developer.mozilla.org/docs/Web/Security/Attacks/XSS) - XSS protection overview
- [MDN: Element.setHTMLUnsafe](https://developer.mozilla.org/en-US/docs/Web/API/Element/setHTMLUnsafe) - Unsafe HTML insertion
- [MDN: HTML Sanitizer API](https://developer.mozilla.org/en-US/docs/Web/API/HTML_Sanitizer_API/Using_the_HTML_Sanitizer_API) - Sanitization API
- [Wikipedia: HTML sanitization](https://en.wikipedia.org/wiki/HTML_sanitization) - Sanitization concepts
- [CVE-2025-29771: @jitbit/htmlsanitizer XSS vulnerability](https://www.thesmartscanner.com/vulnerability-list/js-html-sanitizer-allows-xss-when-used-with-contenteditable) - Contenteditable sanitization bypass
- [GitLab Advisories: @jitbit/htmlsanitizer CVE](https://advisories.gitlab.com/pkg/npm/%40jitbit/htmlsanitizer/CVE-2025-29771/) - Vulnerability details
- [XJavaScript: Can scripts be inserted with innerHTML?](https://www.xjavascript.com/blog/can-scripts-be-inserted-with-innerhtml/) - Script execution behavior
