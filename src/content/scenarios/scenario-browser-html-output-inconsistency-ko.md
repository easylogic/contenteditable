---
id: scenario-browser-html-output-inconsistency-ko
title: "브라우저별 innerHTML·직렬화 불일치"
description: "같은 contenteditable DOM도 Safari와 Chrome에서 속성 순서·암시 태그·스타일용 span 래핑 등 직렬화 문자열이 다를 수 있습니다."
category: input
tags:
  - innerHTML
  - serialization
  - safari
  - chrome
status: draft
locale: ko
---

같은 `contenteditable` **DOM**도 **Safari**와 **Chrome**에서 속성 순서·암시 태그·스타일용 **span** 래핑 등 **직렬화** 문자열이 다를 수 있습니다.

## 관련 케이스

- [ce-0299](ce-0299-browser-html-output-inconsistency)

## 참고 자료

- [HTML serialization](https://html.spec.whatwg.org/)
