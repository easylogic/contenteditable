---
id: scenario-empty-paragraph-br-handling
title: Empty paragraphs and br handling in contenteditable
description: "Browsers disagree on how empty blocks are represented (<p><br></p>, <p></p>, <div><br></div>) and how Backspace merges them. Editors that normalize on every keystroke can fight the user or create nested spans."
category: input
tags:
  - empty
  - br
  - paragraph
  - backspace
  - normalization
status: draft
locale: en
---

Browsers disagree on how **empty blocks** are represented (`<p><br></p>`, `<p></p>`, `<div><br></div>`) and how **Backspace** merges them. Editors that **normalize** on every keystroke can fight the user or create **nested spans**.

## Related Cases

- [ce-0313](ce-0313-empty-paragraph-br-handling)

## References

- [scenario-line-break-element-type](scenario-line-break-element-type)
