---
id: ce-0160
scenarioId: scenario-nested-formatting
locale: en
os: Windows
osVersion: "11"
device: Desktop or Laptop
deviceVersion: Any
browser: Safari
browserVersion: "17.0"
keyboard: US
caseTitle: Nested formatting element order is inconsistent in Safari
description: "When applying multiple formatting operations in Safari, the nesting order of elements varies inconsistently. The same formatting may result in <b><i>text</i></b> or <i><b>text</b></i> depending on application order."
tags:
  - formatting
  - nested
  - order
  - safari
status: draft
domSteps:
  - label: "Before"
    html: 'Hello World'
    description: "기본 텍스트"
  - label: "After Bold then Italic"
    html: 'Hello <b><i>World</i></b>'
    description: "볼드 먼저, 이탤릭 나중"
  - label: "After Italic then Bold (Bug)"
    html: 'Hello <i><b>World</b></i>'
    description: "이탤릭 먼저, 볼드 나중 - 다른 중첩 순서"
  - label: "✅ Expected"
    html: 'Hello <b><i>World</i></b>'
    description: "정상: 일관된 중첩 순서 (항상 b > i)"
---

### Phenomenon

When applying multiple formatting operations in Safari, the nesting order of elements varies inconsistently. The same formatting may result in `<b><i>text</i></b>` or `<i><b>text</b></i>` depending on application order.

### Reproduction example

1. Select some text
2. Apply bold, then italic
3. Observe nesting: `<b><i>text</i></b>`
4. Remove formatting and reapply in reverse order (italic, then bold)
5. Observe nesting: `<i><b>text</b></i>`

### Observed behavior

- Nesting order depends on application order
- Same visual result has different DOM structure
- Inconsistent structure makes management difficult
- Querying formatting state is complex

### Expected behavior

- Nesting order should be consistent
- Or order should be predictable
- Same formatting should have same structure
- Structure should be normalized

### Browser Comparison

- **Chrome/Edge**: Nesting order more consistent
- **Firefox**: Similar nesting behavior
- **Safari**: Nesting order most inconsistent (this case)

### Notes and possible direction for workarounds

- Normalize formatting structure after operations
- Use consistent nesting order (e.g., always b > i > u)
- Merge or reorder nested elements
- Document expected nesting order

