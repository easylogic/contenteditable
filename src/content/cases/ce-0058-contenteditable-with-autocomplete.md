---
id: ce-0058
scenarioId: scenario-autocomplete-behavior
locale: en
os: macOS
osVersion: "Ubuntu 22.04"
device: Desktop or Laptop
deviceVersion: Any
browser: Chrome
browserVersion: "120.0"
keyboard: US
caseTitle: Autocomplete suggestions do not appear for contenteditable
description: "Browser autocomplete suggestions (for forms, addresses, etc.) do not appear when typing in contenteditable regions, even when appropriate autocomplete attributes are set. This limits the usefulness of contenteditable for form-like inputs."
tags:
  - autocomplete
  - suggestions
  - chrome
status: draft
---

### Phenomenon

Browser autocomplete suggestions (for forms, addresses, etc.) do not appear when typing in contenteditable regions, even when appropriate `autocomplete` attributes are set. This limits the usefulness of contenteditable for form-like inputs.

### Reproduction example

1. Create a contenteditable div with `autocomplete="name"`.
2. Start typing a name that has been previously entered in forms.
3. Observe whether autocomplete suggestions appear.

### Observed behavior

- In Chrome on macOS, autocomplete suggestions do not appear for contenteditable.
- The `autocomplete` attribute is ignored.
- Users cannot benefit from browser autocomplete features.

### Expected behavior

- Autocomplete suggestions should appear for contenteditable when appropriate attributes are set.
- The behavior should match standard input elements.
- Form-like contenteditable regions should support autocomplete.

