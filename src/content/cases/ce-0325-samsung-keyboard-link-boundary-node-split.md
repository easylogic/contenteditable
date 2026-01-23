---
id: ce-0325-samsung-keyboard-link-boundary-node-split
scenarioId: scenario-samsung-keyboard-link-boundary
locale: en
os: Android
osVersion: "10-14"
device: Mobile (Samsung Galaxy series)
browser: Chrome for Android
keyboard: Korean (IME) - Samsung Keyboard with Text Prediction ON
caseTitle: Samsung Keyboard Link Boundary Node Splitting and Escaping
description: "Covers the 'Character Leakage' phenomenon where typing Korean at the end of an <a> tag with Samsung Keyboard's Text Prediction ON causes the last character (e.g., 'm') to be duplicated and pushed out into the parent element along with the new composition."
tags:
  - samsung-keyboard
  - link-boundary
  - node-split
  - ime-composition
  - android-chrome
status: draft
initialHtml: |
  <div contenteditable="true" style="padding: 20px;">
    <p><a href="#">naver.com</a></p>
  </div>
domSteps:
  - label: "Initial State"
    html: '<div contenteditable="true"><p><a href="#">[naver.com]</a>|</p></div>'
    description: "Caret is at the end of the text node inside the <a> tag."
  - label: "Typing Attempt (Type 'ㅁ')"
    html: '<div contenteditable="true"><p><a href="#">[naver.com]</a>[mㅁ]</p></div>'
    description: "The last character of the link ('m') is duplicated and jumps out with the new node."
  - label: "Composition Progress (Type 'Ma')"
    html: '<div contenteditable="true"><p><a href="#">[naver.com]</a>[m마]</p></div>'
    description: "Composition proceeds with a duplicated prefix (`m마` phenomenon)."
---

## Phenomenon

When using Chrome on Android with **Samsung Keyboard Text Prediction** ON, typing Korean at the boundary of a link (`<a>`) element causes the following structural issues:

1.  **Forced Text Node Splitting**: What should be a single continuous text node is physically split into two.
2.  **Caret/Input Escape and Duplication (Leakage)**: The input value jumps out of the link, and **the last character of the link is often duplicated** into the new node (e.g., typing 'Ma' after 'com' results in 'com' + 'mMa').
3.  **Loss of Composition Reference**: The IME loses context between the link text and the new input, leading to the duplication and broken composition described above.

## Reproduction Steps

1. On a Samsung Galaxy device, open Chrome and enable 'Predictive text' in Samsung Keyboard settings.
2. Create a link (`<a>Link</a>`) within a `contenteditable` region.
3. Place the caret at the very end of the link text.
4. Type a Korean character (e.g., '안녕').

## Observed Behavior (Based on Zero Trace Log)

- **Step 72 (beforeinput)**: The target ranges correctly point inside the `A` tag during the `insertCompositionText` event.
- **Step 73 (input)**: The moment the input is reflected in the DOM, the character (`ㅇ`) is inserted into the `P` tag, outside the `A` tag.
- As a result, the DOM structure becomes `<p><a>Link</a>ㅇ</p>`, unintentionally breaking the link formatting.

## Expected Behavior

- The typed character should remain within the text node at the end of the `<a>` tag.
- The text node should not split; new content should be merged into the existing node.

## Circular Sync Normalization Points

1.  **Normalization Cycle**: Immediately after the `input` event, if a node split is detected, the algorithm reconciles the state back to the Model's truth (ID-based structure) by "rotating" the stray text back into the link.
2.  **Shadow Composition Tracking**: Even if the browser splits the DOM, the Model treats it as a single node, ensuring a merged output in the next rendering cycle.
