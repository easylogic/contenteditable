---
id: scenario-ime-composition-events-missing-ko
title: "iOS에서 조합 이벤트 누락 (IME)"
description: "일부 iOS Safari·키보드 조합에서는 특정 언어에서 compositionstart·compositionupdate가 안정적으로 오지 않고 input만 올 수 있습니다. 조합 경계에서만 동기화하는 에디터는 어긋날 수 있습니다."
category: ime
tags:
  - ime
  - composition
  - ios
  - safari
  - input
status: draft
locale: ko
---

일부 **iOS Safari**·키보드 조합에서는 특정 언어에서 **`compositionstart`**·**`compositionupdate`**가 안정적으로 오지 않고 **`input`**만 올 수 있습니다. 조합 경계에서만 동기화하는 에디터는 **어긋날** 수 있습니다.

## 관련 케이스

- [ce-0550](ce-0550-ime-composition-events-missing-ios)

## 참고 자료

- [UI Events — CompositionEvent](https://www.w3.org/TR/uievents/)
