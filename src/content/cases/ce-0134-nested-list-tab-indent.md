---
id: ce-0134-nested-list-tab-indent
scenarioId: scenario-nested-list-behavior
locale: en
os: Windows
osVersion: "11"
device: Desktop or Laptop
deviceVersion: Any
browser: Chrome
browserVersion: "120.0"
keyboard: US
caseTitle: Tab key does not indent list items to create nested lists
description: "When pressing Tab in a list item in Chrome, a tab character is inserted instead of indenting the list item to create a nested list structure. This makes it difficult to create nested lists."
tags:
  - list
  - nested
  - tab
  - indentation
  - chrome
status: draft
domSteps:
  - label: "Before"
    html: '<ul><li>Item 1</li><li>Item 2</li></ul>'
    description: "List, cursor inside 'Item 2'"
  - label: "After Tab (Bug)"
    html: '<ul><li>Item 1</li><li>Item 2\t</li></ul>'
    description: "Tab key inserts tab character, nested list not created"
  - label: "✅ Expected"
    html: '<ul><li>Item 1<ul><li>Item 2</li></ul></li></ul>'
    description: "Expected: Tab key creates nested list (indentation)"
---

## Phenomenon

When pressing Tab in a list item in Chrome, a tab character is inserted instead of indenting the list item to create a nested list structure. This makes it difficult to create nested lists.

## Reproduction example

1. Create a list: `<ul><li>Item 1</li><li>Item 2</li></ul>`
2. Place cursor in "Item 2"
3. Press Tab

## Observed behavior

- Tab character is inserted into the list item
- List item is not indented
- Nested list structure is not created
- User cannot easily create nested lists

## Expected behavior

- Tab should indent list item (create nested list)
- Shift+Tab should unindent
- Nested list structure should be created
- Behavior should match word processors

## Browser Comparison

- **All browsers**: Tab inserts character (default behavior)
- Custom handling needed for list indentation

## Notes and possible direction for workarounds

- Intercept Tab key in list items
- Prevent default behavior
- Create nested list structure
- Move list item to nested list
- Handle Shift+Tab for unindenting

