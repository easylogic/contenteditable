---
id: ce-0061
scenarioId: scenario-language-attribute
locale: en
os: macOS
osVersion: "Ubuntu 22.04"
device: Desktop or Laptop
deviceVersion: Any
browser: Safari
browserVersion: "120.0"
keyboard: US
caseTitle: lang attribute does not affect spellcheck language
description: "The lang attribute on a contenteditable region does not affect the spellcheck language in Safari. Spellcheck always uses the browser's default language, regardless of the lang attribute value."
tags:
  - lang
  - spellcheck
  - language
  - safari
status: draft
---

## Phenomenon

The `lang` attribute on a contenteditable region does not affect the spellcheck language in Safari. Spellcheck always uses the browser's default language, regardless of the `lang` attribute value.

## Reproduction example

1. Create a contenteditable div with `lang="fr"` and `spellcheck="true"`.
2. Type French text.
3. Observe whether spellcheck uses French dictionary.

## Observed behavior

- In Safari on macOS, the `lang` attribute does not affect spellcheck.
- Spellcheck always uses the browser's default language.
- Multi-language content cannot be properly spellchecked.

## Expected behavior

- The `lang` attribute should control the spellcheck language.
- Spellcheck should use the appropriate dictionary for the specified language.
- Multi-language content should be properly supported.

