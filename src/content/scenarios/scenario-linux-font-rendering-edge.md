---
id: scenario-linux-font-rendering-edge
title: Font rendering and caret alignment on Linux (Edge and others)
description: "On Linux, fontconfig, subpixel rendering, and fractional DPI can make caret position, selection highlights, and IME candidate anchoring diverge slightly from macOS/Windows—Edge and Chromium builds may differ from Firefox for the same CSS font stack."
category: css
tags:
  - linux
  - font
  - caret
  - edge
  - firefox
status: draft
locale: en
---

On **Linux**, **fontconfig**, subpixel rendering, and fractional **DPI** can make **caret position**, selection highlights, and **IME candidate anchoring** diverge slightly from macOS/Windows—**Edge** and Chromium builds may differ from **Firefox** for the same CSS `font` stack.

## Related Cases

- [ce-0220](ce-0220-linux-font-rendering-edge)

## References

- [CSS Fonts Module](https://www.w3.org/TR/css-fonts/)
