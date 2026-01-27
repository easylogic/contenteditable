---
id: ce-0568-chrome-android-placeholder-korean-ime
scenarioId: scenario-placeholder-behavior
locale: en
os: Android
osVersion: "14.0"
device: Smartphone
deviceVersion: Any
browser: Chrome
browserVersion: "131.0"
keyboard: Korean (IME)
caseTitle: "Placeholder breaks first character of Hangul composition"
description: "In Chrome on Android (late 2024/2025), the presence of a 'placeholder' attribute causes the first syllable of a Korean composition to break or be duplicated."
tags: ["ime", "composition", "placeholder", "android", "chrome-131"]
status: confirmed
domSteps:
  - label: "Step 1: Focus Empty with Placeholder"
    html: '<div contenteditable="true" placeholder="Type here..."></div>'
    description: "The editor is empty and shows a placeholder via CSS (e.g., :empty:before)."
  - label: "Step 2: Start Composition ('ㅎ')"
    html: '<div contenteditable="true" placeholder="Type here...">ㅎ|</div>'
    description: "User types 'ㅎ'. The placeholder should disappear immediately."
  - label: "Step 3: Bug (Data Loss)"
    html: '<div contenteditable="true" placeholder="Type here...">|</div>'
    description: "In Chrome 131, the first character 'ㅎ' is often immediately erased as the placeholder state transitions, or the composition session is reset."
  - label: "✅ Expected"
    html: '<div contenteditable="true">ㅎ|</div>'
    description: "Expected: The character remains and continues to combine into '하', '한' etc."
---

## Phenomenon
A specific regression in Chrome for Android (reported Dec 2025) involves an interaction between the CSS-based placeholder implementation and the Korean IME. When a `contenteditable` element is empty and displays a placeholder, starting a Korean composition session sometimes causes the browser to reset the DOM as it removes the placeholder, which in turn kills the active composition session for the first character.

## Reproduction Steps
1. Create a `contenteditable` element with a `placeholder` attribute or a CSS `:empty:before` rule.
2. Open the page in Chrome for Android (v131+).
3. Focus the empty element.
4. Input the first Jamo of a Korean syllable (e.g., "ㅎ").
5. Observe if the character remains or disappears.

## Observed Behavior
1. **`compositionstart`**: Fires correctly.
2. **Placeholder Logic**: The browser detects the element is no longer empty and removes the `:before` or internal placeholder node.
3. **Collision**: The DOM mutation for removing the placeholder interferes with the IME's internal buffer for the first character.
4. **Result**: The character "ㅎ" is lost, or the IME "stutters," requiring the user to type the first character twice.

## Expected Behavior
The placeholder removal should be an atomic operation that does not disrupt the active IME composition session. The first character should remain visible and combine correctly with subsequent input.

## Impact
- **Severe UX Frustration**: Users constantly have to re-type the first letter of every new sentence or field.
- **Data Corruption**: In some cases, a partial syllable is left behind as "dead text" that the editor framework cannot clean up.

## Browser Comparison
- **Chrome for Android (v131/v132)**: Exhibits the bug.
- **Firefox for Android**: Works correctly.
- **iOS Safari**: Works correctly (uses a different placeholder injection method).

## References & Solutions
### Mitigation: Hide Placeholder on Focus
Instead of relying on `:empty`, hide the placeholder as soon as the element gains focus, *before* the composition starts.

```css
/* Avoid this if possible for Korean IME */
[contenteditable]:empty::before {
  content: attr(placeholder);
}

/* Better workaround */
[contenteditable]:focus::before {
  content: "" !important; /* Remove placeholder immediately on focus */
}
```

- [Chromium Bug #40285641 (Related)](https://issues.chromium.org/issues/40285641)
- [GitHub Issue: Chrome Android Hangul Placeholder](https://github.com/facebook/lexical/issues/6821)
