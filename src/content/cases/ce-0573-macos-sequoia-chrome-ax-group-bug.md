---
id: ce-0573
scenarioId: scenario-accessibility-foundations
locale: en
os: macOS
osVersion: "15.0"
device: Desktop
deviceVersion: Any
browser: Chrome
browserVersion: "129.0"
keyboard: US QWERTY
caseTitle: "Contenteditable reported as AXGroup instead of AXTextArea"
description: "In Chrome 129+ on macOS Sequoia, contenteditable regions are incorrectly exposed to the Accessibility Tree as groups (AXGroup), causing VoiceOver to fail to identify them as editable text areas."
tags: ["accessibility", "voiceover", "macos-sequoia", "chrome-129", "ax-tree"]
status: confirmed
domSteps:
  - label: "Step 1: Editor Focus"
    html: '<div contenteditable="true" aria-label="Editor">Type here...</div>'
    description: "User focuses an editor configured with standard accessibility attributes."
  - label: "Step 2: Accessibility Tree Inspection"
    html: '<!-- AXTree View -->'
    description: "In macOS Sequoia, the node is exposed as AXGroup rather than AXTextArea. VoiceOver says 'Editor, group' instead of 'Editor, text area, editable'."
  - label: "✅ Expected"
    html: '<div contenteditable="true" role="textbox">Type here...</div>'
    description: "Expected: The role should be consistently AXTextArea, allowing caret tracking and text selection via assistive tools."
---

## Phenomenon
A major accessibility regression occurred with the release of macOS Sequoia (15.0) and Chrome 129. The internal mapping between HTML `contenteditable` and the macOS Accessibility API (NSAccessibility) was changed or broken. Instead of reporting an `AXTextArea` (the standard for multi-line editable regions), Chrome started reporting these elements as an `AXGroup`. 

## Reproduction Steps
1. Use a Mac running macOS Sequoia.
2. Open Chrome (v129 or higher).
3. Navigate to any `contenteditable` region.
4. Enable VoiceOver (`Cmd + F5`).
5. Open the Accessibility Inspector (Xcode tool) and inspect the editor.
6. Observe the reported "Role" and VoiceOver announcement.

## Observed Behavior
1. **Role Mismatch**: The element's accessibility role is `AXGroup`. 
2. **VoiceOver Announcement**: VoiceOver announces the element as a "group" and often fails to enter "Forms Mode" or "Edit Mode," making it impossible for blind users to type or navigate characters.
3. **Tool Incompatibility**: Third-party tools like Grammarly or specialized screen readers (VoiceOver) lose the ability to track the caret position because they don't expect text content to be primary in an `AXGroup`.

## Expected Behavior
Chrome should map `contenteditable` elements directly to the `textbox` role (in ARIA terms) and `AXTextArea` (in macOS terms) to ensure full compatibility with assistive technologies.

## Impact
- **Severe Accessibility Barrier**: Blind and low-vision users cannot interact with editors, effectively locking them out of complex web applications (Docs, CMS, Email).
- **Broken Integration**: External highlighting extensions and grammar checkers fail to anchor their UI correctly because the text boundaries are reported as a generic group.

## Browser Comparison
- **Chrome 129+**: Exhibits the regression on Sequoia.
- **Safari (Sequoia)**: Initially had issues in macOS 14.4 but was fixed in 15.0 to correctly report `AXTextArea`.
- **Firefox**: Most consistent; continues to report character-level accessibility data correctly.

## References & Solutions
### Mitigation: Explicit ARIA roles
While the browser should handle this natively, explicitly setting `role="textbox"` and `aria-multiline="true"` can sometimes force the accessibility tree to prioritize the text-area behaviors.

```html
<!-- Forced Accessibility Mapping -->
<div 
    contenteditable="true" 
    role="textbox" 
    aria-multiline="true"
    aria-label="Secure Editor Context"
>
    Type here...
</div>
```

- [Chromium Bug #367355088: AX role for contenteditable is AXGroup on macOS Sequoia](https://issues.chromium.org/issues/367355088)
- [VoiceOver Documentation: Interacting with groups vs text areas](https://support.apple.com/guide/voiceover/welcome/mac)
---
id: ce-0573
scenarioId: scenario-accessibility-foundations
locale: en
os: macOS
osVersion: "15.0"
device: Desktop
deviceVersion: Any
browser: Chrome
browserVersion: "129.0"
keyboard: US QWERTY
caseTitle: "Contenteditable reported as AXGroup instead of AXTextArea"
description: "In Chrome 129+ on macOS Sequoia, contenteditable regions are incorrectly exposed to the Accessibility Tree as groups (AXGroup), causing VoiceOver to fail to identify them as editable text areas."
tags: ["accessibility", "voiceover", "macos-sequoia", "chrome-129", "ax-tree"]
status: confirmed
domSteps:
  - label: "Step 1: Editor Focus"
    html: '<div contenteditable="true" aria-label="Editor">Type here...</div>'
    description: "User focuses an editor configured with standard accessibility attributes."
  - label: "Step 2: Accessibility Tree Inspection"
    html: '<!-- AXTree View -->'
    description: "In macOS Sequoia, the node is exposed as AXGroup rather than AXTextArea. VoiceOver says 'Editor, group' instead of 'Editor, text area, editable'."
  - label: "✅ Expected"
    html: '<div contenteditable="true" role="textbox">Type here...</div>'
    description: "Expected: The role should be consistently AXTextArea, allowing caret tracking and text selection via assistive tools."
---

## Phenomenon
A major accessibility regression occurred with the release of macOS Sequoia (15.0) and Chrome 129. The internal mapping between HTML `contenteditable` and the macOS Accessibility API (NSAccessibility) was changed or broken. Instead of reporting an `AXTextArea` (the standard for multi-line editable regions), Chrome started reporting these elements as an `AXGroup`. 

## Reproduction Steps
1. Use a Mac running macOS Sequoia.
2. Open Chrome (v129 or higher).
3. Navigate to any `contenteditable` region.
4. Enable VoiceOver (`Cmd + F5`).
5. Open the Accessibility Inspector (Xcode tool) and inspect the editor.
6. Observe the reported "Role" and VoiceOver announcement.

## Observed Behavior
1. **Role Mismatch**: The element's accessibility role is `AXGroup`. 
2. **VoiceOver Announcement**: VoiceOver announces the element as a "group" and often fails to enter "Forms Mode" or "Edit Mode," making it impossible for blind users to type or navigate characters.
3. **Tool Incompatibility**: Third-party tools like Grammarly or specialized screen readers (VoiceOver) lose the ability to track the caret position because they don't expect text content to be primary in an `AXGroup`.

## Expected Behavior
Chrome should map `contenteditable` elements directly to the `textbox` role (in ARIA terms) and `AXTextArea` (in macOS terms) to ensure full compatibility with assistive technologies.

## Impact
- **Severe Accessibility Barrier**: Blind and low-vision users cannot interact with editors, effectively locking them out of complex web applications (Docs, CMS, Email).
- **Broken Integration**: External highlighting extensions and grammar checkers fail to anchor their UI correctly because the text boundaries are reported as a generic group.

## Browser Comparison
- **Chrome 129+**: Exhibits the regression on Sequoia.
- **Safari (Sequoia)**: Initially had issues in macOS 14.4 but was fixed in 15.0 to correctly report `AXTextArea`.
- **Firefox**: Most consistent; continues to report character-level accessibility data correctly.

## References & Solutions
### Mitigation: Explicit ARIA roles
While the browser should handle this natively, explicitly setting `role="textbox"` and `aria-multiline="true"` can sometimes force the accessibility tree to prioritize the text-area behaviors.

```html
<!-- Forced Accessibility Mapping -->
<div 
    contenteditable="true" 
    role="textbox" 
    aria-multiline="true"
    aria-label="Secure Editor Context"
>
    Type here...
</div>
```

- [Chromium Bug #367355088: AX role for contenteditable is AXGroup on macOS Sequoia](https://issues.chromium.org/issues/367355088)
- [VoiceOver Documentation: Interacting with groups vs text areas](https://support.apple.com/guide/voiceover/welcome/mac)
