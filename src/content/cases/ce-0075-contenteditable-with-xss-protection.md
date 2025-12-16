---
id: ce-0075
scenarioId: scenario-xss-protection
locale: en
os: Windows
osVersion: "11"
device: Desktop or Laptop
deviceVersion: Any
browser: Edge
browserVersion: "120.0"
keyboard: US
caseTitle: XSS protection may interfere with contenteditable HTML insertion
tags:
  - xss
  - security
  - edge
  - windows
status: draft
---

### Phenomenon

Browser XSS protection mechanisms may interfere with programmatic HTML insertion in contenteditable elements. Script tags or event handlers inserted via innerHTML or similar methods may be stripped or sanitized.

### Reproduction example

1. Create a contenteditable div.
2. Try to insert HTML with script tags or event handlers programmatically.
3. Observe whether the HTML is inserted as-is or sanitized.
4. Check if script execution is blocked.

### Observed behavior

- In Edge on Windows, XSS protection may strip script tags from inserted HTML.
- Event handlers may be removed from attributes.
- Some HTML may be sanitized automatically.
- Behavior may differ from standard DOM manipulation.

### Expected behavior

- XSS protection should work transparently.
- Or, there should be clear documentation on what is allowed.
- Sanitization should be consistent and predictable.

