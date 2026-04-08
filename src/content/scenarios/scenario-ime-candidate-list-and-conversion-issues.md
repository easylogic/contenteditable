---
id: scenario-ime-candidate-list-and-conversion-issues
title: IME candidate list timing and conversion (kanji, hanzi)
description: "Japanese kanji conversion and Chinese character selection depend on the IME candidate window. Delays, wrong ordering, or Safari-specific lag can cause users to commit the wrong character or see candidates that do not match the underlying buffer—especially under load or in complex layouts."
category: ime
tags:
  - ime
  - japanese
  - chinese
  - conversion
  - candidate
  - safari
  - chrome
status: draft
locale: en
---

Japanese **kanji conversion** and Chinese **character selection** depend on the IME **candidate window**. Delays, wrong ordering, or Safari-specific lag can cause users to commit the wrong character or see candidates that do not match the underlying buffer—especially under load or in complex layouts.

## Problem Overview

Conversion is not just a browser issue—IME software matters—but the **host app** (your editor) can worsen latency with synchronous layout, heavy `input` handlers, or forced layout reads.

## Observed Behavior

- Safari: conversion delay vs Chrome for the same input method.
- Rapid typing: candidate list lags behind buffer updates.

## Impact

Wrong characters committed; power users notice “sticky” conversion.

## Related Cases

- [ce-0175](ce-0175-japanese-ime-kanji-conversion-chrome)
- [ce-0176](ce-0176-chinese-ime-conversion-delay-safari)

## References

- [WhatWG HTML — input modalities](https://html.spec.whatwg.org/) (editing contexts)
