---
id: scenario-xss-protection
title: XSS 보호가 contenteditable HTML 삽입을 간섭할 수 있음
description: "브라우저 XSS 보호 메커니즘이 contenteditable 요소에서 프로그래밍 방식 HTML 삽입을 간섭할 수 있습니다. innerHTML 또는 유사한 방법을 통해 삽입된 스크립트 태그나 이벤트 핸들러가 제거되거나 정리될 수 있습니다."
category: other
tags:
  - xss
  - security
  - edge
  - windows
status: draft
---

브라우저 XSS 보호 메커니즘이 contenteditable 요소에서 프로그래밍 방식 HTML 삽입을 간섭할 수 있습니다. innerHTML 또는 유사한 방법을 통해 삽입된 스크립트 태그나 이벤트 핸들러가 제거되거나 정리될 수 있습니다.
