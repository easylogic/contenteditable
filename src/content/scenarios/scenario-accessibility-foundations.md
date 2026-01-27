---
id: scenario-accessibility-foundations
title: "Accessibility Foundations: Roles, ARIA, and AT Interop"
description: "Core principles for building screen-reader friendly editors, focusing on role mapping and state synchronization."
category: "accessibility"
tags: ["accessibility", "aria", "role", "screen-reader", "state-sync"]
status: "confirmed"
locale: "en"
---

## Overview
Contenteditable regions are often "islands" of custom interaction. Assitive Technology (AT) relies on the browser's Accessibility Tree (AX Tree) to understand that a `div` is actually a text input.

## Key Integration Challenges

### 1. Platform Role Mapping
Browsers must map the `contenteditable` property to an OS-level role (e.g., `AXTextArea`).
- **Regression Note**: macOS Sequoia (Chrome 129) had a major regression where editors were reported as `AXGroup`, breaking word-by-word navigation in VoiceOver.

### 2. State & Property Conflicts
Explicit ARIA attributes can sometimes "clobber" native states.
- **Pattern**: Applying `aria-readonly="false"` to a `contenteditable="true"` element in Chromium can ironically trigger a read-only signal to the AT.
- **Guideline**: Let native attributes handle the state unless you are implementing a complex composite widget (like a Grid or Tree).

### 3. Relation API (Controls/Owns)
Linking an editor to a floating menu (e.g., Slash Command menu) requires `aria-controls` or `aria-owns`. 
- **Bug**: WebKit often fails to forward focus intent to these related elements during an active composition.

## Best Practice Template

```html
<!-- The 'Accessible Editor' Pattern -->
<div 
  contenteditable="true" 
  role="textbox" 
  aria-multiline="true"
  aria-label="Editor content"
  aria-autocomplete="list"
>
  <!-- Content here -->
</div>
```

## Related Cases
- [ce-0573: macOS Sequoia AXGroup bug](file:///Users/user/github/barocss/contenteditable/src/content/cases/ce-0573-macos-sequoia-chrome-ax-group-bug.md)
- [ce-0574: aria-readonly attribute conflict](file:///Users/user/github/barocss/contenteditable/src/content/cases/ce-0574-aria-readonly-conflict-bug.md)
---
id: scenario-accessibility-foundations
title: "Accessibility Foundations: Roles, ARIA, and AT Interop"
description: "Core principles for building screen-reader friendly editors, focusing on role mapping and state synchronization."
category: "accessibility"
tags: ["accessibility", "aria", "role", "screen-reader", "state-sync"]
status: "confirmed"
locale: "en"
---

## Overview
Contenteditable regions are often "islands" of custom interaction. Assitive Technology (AT) relies on the browser's Accessibility Tree (AX Tree) to understand that a `div` is actually a text input.

## Key Integration Challenges

### 1. Platform Role Mapping
Browsers must map the `contenteditable` property to an OS-level role (e.g., `AXTextArea`).
- **Regression Note**: macOS Sequoia (Chrome 129) had a major regression where editors were reported as `AXGroup`, breaking word-by-word navigation in VoiceOver.

### 2. State & Property Conflicts
Explicit ARIA attributes can sometimes "clobber" native states.
- **Pattern**: Applying `aria-readonly="false"` to a `contenteditable="true"` element in Chromium can ironically trigger a read-only signal to the AT.
- **Guideline**: Let native attributes handle the state unless you are implementing a complex composite widget (like a Grid or Tree).

### 3. Relation API (Controls/Owns)
Linking an editor to a floating menu (e.g., Slash Command menu) requires `aria-controls` or `aria-owns`. 
- **Bug**: WebKit often fails to forward focus intent to these related elements during an active composition.

## Best Practice Template

```html
<!-- The 'Accessible Editor' Pattern -->
<div 
  contenteditable="true" 
  role="textbox" 
  aria-multiline="true"
  aria-label="Editor content"
  aria-autocomplete="list"
>
  <!-- Content here -->
</div>
```

## Related Cases
- [ce-0573: macOS Sequoia AXGroup bug](file:///Users/user/github/barocss/contenteditable/src/content/cases/ce-0573-macos-sequoia-chrome-ax-group-bug.md)
- [ce-0574: aria-readonly attribute conflict](file:///Users/user/github/barocss/contenteditable/src/content/cases/ce-0574-aria-readonly-conflict-bug.md)
