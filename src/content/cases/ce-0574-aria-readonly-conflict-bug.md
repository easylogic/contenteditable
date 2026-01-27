---
id: ce-0574
scenarioId: scenario-accessibility-foundations
locale: en
os: Windows
osVersion: "11"
device: Desktop
deviceVersion: Any
browser: Chrome
browserVersion: "124.0"
keyboard: US QWERTY
caseTitle: "aria-readonly conflicts with contenteditable state"
description: "In Chromium versions near 124, applying aria-readonly='false' to a contenteditable region incorrectly causes some screen readers (NVDA/JAWS) to announce the field as 'read-only' instead of editable."
tags: ["accessibility", "aria", "readonly", "screen-reader", "chrome-124"]
status: confirmed
domSteps:
  - label: "Step 1: Setup Custom Box"
    html: '<div contenteditable="true" role="textbox" aria-readonly="false">|</div>'
    description: "Initialize a custom edit box. aria-readonly is explicitly set to false to encourage accessibility."
  - label: "Step 2: Bug Announcement"
    html: '<!-- AX Tree Interpretation -->'
    description: "Despite aria-readonly='false', the Accessibility Tree combines state flags in a way that signals 'read-only' to NVDA. NVDA announces: 'Edit, read only'."
  - label: "✅ Expected"
    html: '<div contenteditable="true" role="textbox">|</div>'
    description: "Expected: Removing aria-readonly (or setting it to false) should never override the native 'read-write' state of a contenteditable element."
---

## Phenomenon
A conflict exists in Chromium's Accessibility implementation where legacy ARIA attributes can override or mangle the state derived from the `contenteditable` attribute. Specifically, when a developer explicitly sets `aria-readonly="false"` (often done to be safe or when toggling states dynamically), Chrome sometimes internalizes this flag in a way that suggests a restricted state to the macOS and Windows Accessibility APIs. This leads screen readers like NVDA to announce the field as "read only" even though the user can type into it.

## Reproduction Steps
1. Create an element with `contenteditable="true"` and `role="textbox"`.
2. Add the attribute `aria-readonly="false"`.
3. Open Chrome (v122 - v124).
4. Start a screen reader like NVDA or JAWS.
5. Tab focus into the editor.
6. Listen for the initial announcement.

## Observed Behavior
1. **Screen Reader Voice**: NVDA says "Type here, Edit, Read only."
2. **User Confusion**: The user is told the field is read-only, so they may stop trying to input text, despite the caret being active and blinking.
3. **Accessibility Tree**: The `readonly` bit in the platform-specific accessibility node (e.g., IA2 on Windows) is set to true incorrectly.

## Expected Behavior
The `contenteditable="true"` state should define the primary editing capability. `aria-readonly="false"` should be redundant or ignored, and `aria-readonly="true"` should only take effect if the `contenteditable` attribute is also set to `false`.

## Impact
- **Non-Standard Workflow**: Users who rely on screen readers are misled about the interactability of the application.
- **Dynamic State Failure**: Applications that toggle between "Read Mode" and "Edit Mode" via ARIA attributes experience "ghost" read-only states that persist after the user enters edit mode.

## Browser Comparison
- **Chrome 124**: Confirmed conflict in certain Shadow DOM and Custom Element scenarios.
- **Firefox**: Correctly prioritizes the editable state; ignores `aria-readonly="false"`.
- **Safari**: Generally consistent with ARIA mappings but has other `role="textbox"` challenges.

## References & Solutions
### Mitigation: Avoid aria-readonly on Editable regions
Unless you are explicitly in a non-editable state, do not include the `aria-readonly` attribute at all. Use the presence or absence of the `contenteditable` attribute to signal the state to the browser.

```javascript
function setEditMode(isEditable) {
    const editor = document.getElementById('editor');
    editor.contentEditable = isEditable ? 'true' : 'false';
    // REMOVE aria-readonly instead of setting to false
    if (isEditable) {
        editor.removeAttribute('aria-readonly');
    } else {
        editor.setAttribute('aria-readonly', 'true');
    }
}
```

- [Chromium Issue #40945892: aria-readonly conflict in edit boxes](https://issues.chromium.org/issues/40945892)
- [W3C ARIA: aria-readonly property](https://www.w3.org/WAI/PF/aria-1.1/states_and_properties#aria-readonly)
