---
id: ce-0128-nested-formatting-removal
scenarioId: scenario-nested-formatting
locale: en
os: Windows
osVersion: "11"
device: Desktop or Laptop
deviceVersion: Any
browser: Chrome
browserVersion: "120.0"
keyboard: US
caseTitle: Removing nested formatting leaves empty or partial elements
description: "When removing formatting from text that has nested formatting (e.g., <b><i>text</i></b>), empty or partial formatting elements may be left in the DOM. The structure becomes broken."
tags:
  - formatting
  - nested
  - removal
  - chrome
status: draft
domSteps:
  - label: "Before"
    html: 'Hello <b><i>World</i></b>'
    description: "Nested formatting (bold + italic)"
  - label: "After Removing Bold (Bug)"
    html: 'Hello <b></b><i>World</i>'
    description: "After bold removal, empty &lt;b&gt; element remains"
  - label: "✅ Expected"
    html: 'Hello <i>World</i>'
    description: "Expected: Empty elements removed, clean nested structure"
---

## Phenomenon

When removing formatting from text that has nested formatting (e.g., `<b><i>text</i></b>`), empty or partial formatting elements may be left in the DOM. The structure becomes broken.

## Reproduction example

1. Apply bold and italic to text: `<b><i>formatted text</i></b>`
2. Remove bold formatting
3. Observe the DOM structure

## Observed behavior

- Empty `<b></b>` elements may remain
- Or partial nesting may remain: `<b><i>text</i></b>` becomes `<i>text</i>` but `<b>` wrapper may remain
- DOM structure becomes broken
- Empty elements accumulate

## Expected behavior

- Formatting should be removed cleanly
- No empty elements should remain
- Structure should be normalized
- DOM should be clean

## Browser Comparison

- **Chrome/Edge**: May leave empty elements (this case)
- **Firefox**: More likely to leave empty structures
- **Safari**: Most likely to leave broken structures

## Notes and possible direction for workarounds

- Normalize formatting structure after removal
- Remove empty formatting elements
- Merge or unwrap nested structures
- Clean up DOM regularly

