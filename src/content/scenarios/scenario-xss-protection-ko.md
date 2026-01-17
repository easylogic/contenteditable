---
id: scenario-xss-protection-ko
title: XSS 보호가 contenteditable HTML 삽입을 간섭할 수 있음
description: "브라우저 XSS 보호 메커니즘이 contenteditable 요소에서 프로그래밍 방식 HTML 삽입을 간섭할 수 있습니다. innerHTML 또는 유사한 방법을 통해 삽입된 스크립트 태그나 이벤트 핸들러가 제거되거나 정리될 수 있습니다."
category: other
tags:
  - xss
  - security
  - edge
  - windows
status: draft
locale: ko
---

브라우저 XSS 보호 메커니즘이 contenteditable 요소에서 프로그래밍 방식 HTML 삽입을 간섭할 수 있습니다. innerHTML 또는 유사한 방법을 통해 삽입된 스크립트 태그나 이벤트 핸들러가 제거되거나 정리될 수 있습니다.

## 참고 자료

- [MDN: XSS Attacks](https://developer.mozilla.org/docs/Web/Security/Attacks/XSS) - XSS protection overview
- [MDN: Element.setHTMLUnsafe](https://developer.mozilla.org/en-US/docs/Web/API/Element/setHTMLUnsafe) - Unsafe HTML insertion
- [MDN: HTML Sanitizer API](https://developer.mozilla.org/en-US/docs/Web/API/HTML_Sanitizer_API/Using_the_HTML_Sanitizer_API) - Sanitization API
- [Wikipedia: HTML sanitization](https://en.wikipedia.org/wiki/HTML_sanitization) - Sanitization concepts
- [CVE-2025-29771: @jitbit/htmlsanitizer XSS vulnerability](https://www.thesmartscanner.com/vulnerability-list/js-html-sanitizer-allows-xss-when-used-with-contenteditable) - Contenteditable sanitization bypass
- [GitLab Advisories: @jitbit/htmlsanitizer CVE](https://advisories.gitlab.com/pkg/npm/%40jitbit/htmlsanitizer/CVE-2025-29771/) - Vulnerability details
- [XJavaScript: Can scripts be inserted with innerHTML?](https://www.xjavascript.com/blog/can-scripts-be-inserted-with-innerhtml/) - Script execution behavior
