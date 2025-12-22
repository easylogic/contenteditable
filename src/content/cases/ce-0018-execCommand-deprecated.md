---
id: ce-0018
scenarioId: scenario-execCommand-alternatives
locale: en
os: Any
osVersion: "Ubuntu 22.04"
device: Desktop or Laptop
deviceVersion: Any
browser: Chrome
browserVersion: "120.0"
keyboard: US
caseTitle: execCommand is deprecated but still widely used for formatting
description: "The document.execCommand() API, which is commonly used to apply formatting (bold, italic, etc.) in contenteditable regions, has been deprecated. However, there is no complete replacement, and many editors still rely on it."
tags:
  - execCommand
  - formatting
  - deprecation
  - chrome
status: draft
---

### Phenomenon

The `document.execCommand()` API, which is commonly used to apply formatting (bold, italic, etc.) in contenteditable regions, has been deprecated. However, there is no complete replacement, and many implementations still rely on it. This creates uncertainty about future browser support.

### Reproduction example

1. Create a contenteditable div.
2. Use `document.execCommand('bold', false, null)` to apply bold formatting.
3. Check browser console for deprecation warnings.
4. Observe that the command still works but shows warnings.

### Observed behavior

- Chrome shows deprecation warnings in the console when using execCommand.
- The commands still function but may stop working in future browser versions.
- The alternative (Selection API + DOM manipulation) is more complex to implement.

### Expected behavior

- A standardized, modern API should be available for formatting contenteditable regions.
- The new API should be well-documented and supported across browsers.
- Migration path from execCommand should be clear.

