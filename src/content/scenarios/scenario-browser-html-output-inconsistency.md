---
id: scenario-browser-html-output-inconsistency
title: innerHTML and serialization differ across browsers
description: "The same DOM edited in contenteditable may serialize to different markup strings in Safari vs Chrome—attribute order, implied tags, and span wrappers for styles."
category: input
tags:
  - innerHTML
  - serialization
  - safari
  - chrome
status: draft
locale: en
---

The same DOM edited in `contenteditable` may **serialize** to different markup strings in **Safari** vs **Chrome**—attribute order, implied tags, and **span** wrappers for styles.

## Related Cases

- [ce-0299](ce-0299-browser-html-output-inconsistency)

## References

- [HTML serialization](https://html.spec.whatwg.org/)
