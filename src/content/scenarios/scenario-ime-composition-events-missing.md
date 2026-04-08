---
id: scenario-ime-composition-events-missing
title: Missing composition events on iOS (IME)
description: "On some iOS Safari versions and keyboards, compositionstart or compositionupdate may not fire reliably for certain languages, while input events still fire—editors that only reconcile on composition boundaries can desync."
category: ime
tags:
  - ime
  - composition
  - ios
  - safari
  - input
status: draft
locale: en
---

On some **iOS Safari** versions and keyboards, **`compositionstart`** or **`compositionupdate`** may not fire reliably for certain languages, while **`input`** events still fire—editors that only reconcile on composition boundaries can **desync**.

## Related Cases

- [ce-0550](ce-0550-ime-composition-events-missing-ios)

## References

- [UI Events — CompositionEvent](https://www.w3.org/TR/uievents/)
