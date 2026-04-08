---
id: scenario-beforeinput-not-cancelable-ime
title: beforeinput not cancelable during IME composition
description: "Some beforeinput events during IME composition cannot be canceled per spec or implementation—calling preventDefault may throw or be ignored, so editors cannot always block native insertion."
category: ime
tags:
  - beforeinput
  - ime
  - composition
  - preventDefault
status: draft
locale: en
---

Some **`beforeinput`** events during **IME composition** cannot be **canceled** per spec or implementation—calling **`preventDefault`** may throw or be ignored, so editors cannot always block native insertion.

## Related Cases

- [ce-0305](ce-0305-beforeinput-not-cancelable-ime)

## References

- [Input Events](https://www.w3.org/TR/input-events/)
