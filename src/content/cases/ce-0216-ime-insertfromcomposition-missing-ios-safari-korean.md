---
id: ce-0216
scenarioId: scenario-ime-insertfromcomposition-targetranges
locale: en
os: iOS
osVersion: "17.0+"
device: iPhone or iPad
deviceVersion: Any
browser: Safari
browserVersion: "17.0+"
keyboard: Korean (IME)
caseTitle: insertFromComposition does not fire in iOS Safari with Korean IME
description: "In iOS Safari with Korean IME, insertFromComposition events do not fire at all. Composition events (compositionstart, compositionupdate, compositionend) also do not fire. Instead, iOS Safari uses a deleteContentBackward followed by insertText pattern. This is likely due to iOS Safari using its own input model for Korean IME."
tags:
  - composition
  - ime
  - beforeinput
  - insertFromComposition
  - ios
  - safari
  - korean
  - missing-events
status: draft
domSteps:
  - label: "Before"
    html: '<p>Hello <span style="text-decoration: underline; background: #fef08a;">한</span></p>'
    description: "Korean composition in progress"
  - label: "beforeinput event (Bug)"
    html: '<p>Hello <span style="text-decoration: underline; background: #fef08a;">한</span></p>'
    description: "insertFromComposition does NOT fire, composition events do NOT fire"
  - label: "Actual events"
    html: '<p>Hello </p>'
    description: "deleteContentBackward fires instead"
  - label: "After"
    html: '<p>Hello <span style="text-decoration: underline; background: #fef08a;">한글</span></p>'
    description: "insertText fires to insert new composition text"
---

## Phenomenon

In iOS Safari with Korean IME, `insertFromComposition` events do not fire at all. Composition events (`compositionstart`, `compositionupdate`, `compositionend`) also do not fire. Instead, iOS Safari uses a `deleteContentBackward` followed by `insertText` pattern for each composition update. This is likely due to iOS Safari using its own input model for Korean IME.

## Reproduction example

1. Focus a `contenteditable` element in iOS Safari (iPhone/iPad).
2. Activate Korean IME.
3. Start composing Korean text (e.g., type "ㅎ" then "ㅏ" then "ㄴ" to compose "한").
4. Continue typing to update composition (e.g., type "ㄱ" then "ㅡ" then "ㄹ" to update to "한글").
5. Observe `beforeinput` events - `insertFromComposition` does NOT fire.
6. Observe composition events - they do NOT fire.
7. Instead, observe `deleteContentBackward` followed by `insertText` pattern.

## Observed behavior

When composing Korean text:

1. **No insertFromComposition events**:
   - `insertFromComposition` never fires
   - Handlers expecting `insertFromComposition` will never receive these events

2. **No composition events**:
   - `compositionstart` does NOT fire
   - `compositionupdate` does NOT fire
   - `compositionend` does NOT fire
   - Handlers expecting composition events will never receive them

3. **Alternative event pattern**:
   - `beforeinput` fires with `inputType: 'deleteContentBackward'` and `isComposing: true`
   - `beforeinput` fires again with `inputType: 'insertText'` (not `insertCompositionText`) and `isComposing: true`
   - This pattern repeats for each composition update

4. **Result**:
   - Handlers expecting `insertFromComposition` will never work
   - Handlers expecting composition events will never work
   - Only handlers that recognize the `deleteContentBackward` + `insertText` pattern will work

## Expected behavior

- `insertFromComposition` should fire during composition updates
- Composition events should fire during composition
- Standard composition event model should be used
- Behavior should be consistent with other browsers and IMEs

## Impact

- **Missing event handlers**: Handlers expecting `insertFromComposition` will never receive events
- **Missing composition handlers**: Handlers expecting composition events will never receive events
- **Different input model**: iOS Safari uses fundamentally different input model for Korean IME
- **Platform-specific code required**: Different handling logic required for iOS Safari Korean IME
- **IME-specific code required**: Different handling logic required for Korean vs other IMEs on iOS Safari

## Browser Comparison

- **iOS Safari (Korean)**: `insertFromComposition` does NOT fire, composition events do NOT fire, uses `deleteContentBackward` + `insertText` pattern
- **iOS Safari (Japanese/Kanji)**: `insertFromComposition` fires, composition events fire
- **Desktop Safari**: `insertFromComposition` fires, composition events fire
- **Chrome/Edge**: Generally uses `insertCompositionText` instead of `insertFromComposition`, composition events fire
- **Firefox**: Behavior varies but generally more consistent with Chrome

## Notes and possible direction for workarounds

- **Handle deleteContentBackward + insertText pattern**: Recognize this pattern as composition update:
  ```javascript
  let lastCompositionDelete = null;

  element.addEventListener('beforeinput', (e) => {
    if (e.inputType === 'deleteContentBackward' && e.isComposing) {
      // Store for pairing with insertText
      lastCompositionDelete = e;
      return;
    }
    
    if (e.inputType === 'insertText' && e.isComposing) {
      // iOS Safari Korean IME: insertFromComposition never fires
      // Handle as composition update
      if (lastCompositionDelete) {
        // Process as single composition update
        handleCompositionUpdate(e.data);
        lastCompositionDelete = null;
      }
    }
  });
  ```

- **Platform and IME detection**: Detect iOS Safari with Korean IME:
  ```javascript
  const isIOSSafari = /iPhone|iPad|iPod/.test(navigator.userAgent) && /Safari/.test(navigator.userAgent) && !/Chrome/.test(navigator.userAgent);
  const isKoreanIME = /* detect Korean IME */;
  
  if (isIOSSafari && isKoreanIME) {
    // Use deleteContentBackward + insertText pattern handler
    // Do not expect insertFromComposition or composition events
  }
  ```

- **Do not rely on insertFromComposition**: For iOS Safari Korean IME, do not expect `insertFromComposition` events
- **Do not rely on composition events**: For iOS Safari Korean IME, do not expect composition events
- **Use isComposing flag**: Use `e.isComposing` flag to detect composition state instead of composition events
