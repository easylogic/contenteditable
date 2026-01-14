---
id: ce-0293
scenarioId: scenario-ios-dictation-duplicate-events
locale: en
os: iOS
osVersion: "17.0+"
device: iPhone or iPad
deviceVersion: Any
browser: Safari
browserVersion: "17.0+"
keyboard: Voice Dictation
caseTitle: iOS dictation re-fires input events with text split into words
description: "On iOS Safari, when using voice dictation to input text into contenteditable elements, the system fires initial beforeinput and input events with the complete text, then re-fires events with the text split into individual words. This causes event handlers to execute multiple times and creates synchronization issues between the event sequence and DOM state."
tags:
  - dictation
  - voice-input
  - beforeinput
  - input
  - ios
  - safari
  - duplicate-events
  - sync-issue
status: draft
domSteps:
  - label: "Initial dictation"
    html: '만나서 반갑습니다'
    description: "User dictates '만나서 반갑습니다' - initial events fire with complete text"
  - label: "After duplicate events (Bug)"
    html: '만나서 반갑습니다'
    description: "Same text but events fire again as '만나서' + space + '반갑습니다'"
  - label: "✅ Expected"
    html: '만나서 반갑습니다'
    description: "Expected: Events fire only once with complete text, no re-firing"
---

## Phenomenon

On iOS Safari, when using voice dictation to input text into `contenteditable` elements, the system fires initial `beforeinput` and `input` events with the complete dictated text. After the initial input completes, the system re-fires `beforeinput` and `input` events with the text split into individual words, causing event handlers to execute multiple times for the same input.

## Reproduction example

1. Open a web page with a `contenteditable` element on iOS Safari (iPhone or iPad).
2. Focus the `contenteditable` element.
3. Activate voice dictation (long press spacebar or tap microphone icon on keyboard).
4. Dictate text: "만나서 반갑습니다" (or any multi-word phrase).
5. Observe the `beforeinput` and `input` events in the browser console or event log.

## Observed behavior

### Initial Dictation Sequence
1. User activates dictation and speaks "만나서 반갑습니다"
2. `beforeinput` event fires with:
   - `inputType: 'insertText'`
   - `data: '만나서 반갑습니다'`
   - `isComposing: false`
3. `input` event fires with the complete text "만나서 반갑습니다" inserted into DOM

### Duplicate Events Sequence (Bug)
4. After a short delay (typically 100-500ms), `beforeinput` event fires again with:
   - `inputType: 'insertText'`
   - `data: '만나서'`
   - `isComposing: false`
5. `input` event fires with "만나서" inserted
6. `beforeinput` event fires again with:
   - `inputType: 'insertText'`
   - `data: ' '` (space character)
   - `isComposing: false`
7. `input` event fires with space inserted
8. `beforeinput` event fires again with:
   - `inputType: 'insertText'`
   - `data: '반갑습니다'`
   - `isComposing: false`
9. `input` event fires with "반갑습니다" inserted

### Key Characteristics
- Composition events (`compositionstart`, `compositionupdate`, `compositionend`) do NOT fire during dictation
- `isComposing` is always `false` in all events
- Events are re-fired after the initial input completes
- Text is split at word boundaries (spaces)
- The DOM state after duplicate events is the same as after initial events (no actual change)
- Event sequence becomes out of sync with DOM state

## Expected behavior

- Initial `beforeinput` and `input` events should fire once with the complete dictated text
- Events should NOT be re-fired after completion
- If events are re-fired, they should reflect actual DOM changes (not duplicate insertions)
- Event sequence should remain synchronized with DOM state
- Composition events should fire during dictation (as they do on macOS Safari)

## Impact

This can lead to:
- **Duplicate processing**: Event handlers execute multiple times for the same input
- **State synchronization issues**: Application state may become inconsistent with DOM state
- **Performance issues**: Unnecessary processing of duplicate events
- **Undo/redo corruption**: Undo stack may contain duplicate or incorrect entries
- **Validation issues**: Validation logic may run multiple times on the same input
- **Formatting issues**: Formatting logic may be applied incorrectly due to split text
- **Event sequence confusion**: Handlers expecting a single input event receive multiple events

## Browser Comparison

- **iOS Safari**: Dictation does not fire composition events, events are re-fired after completion with text split into words
- **iOS Chrome**: Same behavior as Safari (uses WebKit engine, required by Apple)
- **macOS Safari**: Dictation fires composition events, events are not re-fired after completion
- **Chrome/Edge/Firefox (Desktop)**: Dictation behavior varies but generally more consistent, no duplicate re-firing

## Distinguishing Dictation Input

**Important**: There is no reliable way to detect dictation input in web applications on iOS. Web APIs do not provide dictation detection capabilities, and native iOS APIs like `UITextInputContext.isDictationInputExpected` are not available in web contexts.

### Potential Indicators (Not Reliable)
- Absence of composition events (but this also occurs with Korean IME on iOS)
- Rapid insertion of multiple words
- Text appears to be split and re-inserted
- Events fire in quick succession with complete words
- `isComposing` is always `false` (but this is also true for Korean IME on iOS)

These indicators are not definitive and may produce false positives.

## Event Sequence

The sequence of events when inputting "만나서 반갑습니다" via dictation:

### Phase 1: Initial Dictation Input

| Order | Event | inputType | data | DOM State (before) | DOM State (after) |
|-------|-------|-----------|------|-------------------|-------------------|
| 1 | beforeinput | insertText | '만나서 반갑습니다' | "" | - |
| 2 | input | insertText | '만나서 반갑습니다' | "" | "만나서 반갑습니다" ✅ |

### Phase 2: Duplicate Events (Bug)

After initial input completes, after a delay of approximately 100-500ms, events are re-fired with text split into words:

| Order | Event | inputType | data | DOM State (before) | DOM State (after) |
|-------|-------|-----------|------|-------------------|-------------------|
| 3 | beforeinput | insertText | '만나서' | "만나서 반갑습니다" | - |
| 4 | input | insertText | '만나서' | "만나서 반갑습니다" | "만나서 반갑습니다" ❌ |
| 5 | beforeinput | insertText | ' ' | "만나서 반갑습니다" | - |
| 6 | input | insertText | ' ' | "만나서 반갑습니다" | "만나서 반갑습니다" ❌ |
| 7 | beforeinput | insertText | '반갑습니다' | "만나서 반갑습니다" | - |
| 8 | input | insertText | '반갑습니다' | "만나서 반갑습니다" | "만나서 반갑습니다" ❌ |

### Key Characteristics

- **Events 1-2**: Complete text inserted at once (DOM actually changes)
- **Events 3-8**: Text re-fired word-by-word but DOM doesn't change
- **Composition events**: `compositionstart`, `compositionupdate`, `compositionend` events do NOT fire in any phase
- **isComposing**: All events have `isComposing: false`
- **Delay between phases**: 100-500ms delay between Event 2 and Event 3

## Complete Event Monitoring

Code to monitor all events during iOS dictation input:

```javascript
const element = document.querySelector('[contenteditable]');
const eventLog = [];

const eventsToMonitor = [
  'compositionstart', 'compositionupdate', 'compositionend',
  'beforeinput', 'input',
  'keydown', 'keyup', 'keypress'
];

eventsToMonitor.forEach(eventType => {
  element.addEventListener(eventType, (e) => {
    const eventData = {
      timestamp: Date.now(),
      type: eventType,
      inputType: e.inputType || null,
      data: e.data || null,
      isComposing: e.isComposing || false,
      textContent: element.textContent
    };
    eventLog.push(eventData);
    console.log(`[${eventType}]`, eventData);
  }, { capture: true });
});
```

### Events That Fire vs Do Not Fire

| Event Type | Fires? | Initial Input | Duplicate Events |
|-----------|--------|---------------|------------------|
| `beforeinput` | ✅ Yes | 1 time | 3 times |
| `input` | ✅ Yes | 1 time | 3 times |
| `compositionstart` | ❌ No | - | - |
| `compositionupdate` | ❌ No | - | - |
| `compositionend` | ❌ No | - | - |
| `keydown` | ❌ No | - | - |
| `keyup` | ❌ No | - | - |
| `keypress` | ❌ No | - | - |

## Notes and possible direction for workarounds

### Event Handling Considerations
- Event handlers may execute multiple times for the same input
- Events without actual DOM changes (Events 4, 6, 8) should not be processed
- Check `textContent` to determine if DOM actually changed

### Undo/Redo Stack
- Recording duplicate events in undo stack creates duplicate undo entries
- Only record in undo stack when there's an actual DOM change

## Additional Considerations

### Selection State
- Selection state may be reset when duplicate events fire, so don't use selection for duplicate detection; trust only `textContent`

### Undo/Redo Stack
- Recording duplicate events in the undo stack creates duplicate undo entries
- Using `textContent`-based deduplication ensures only actual changes are recorded in the undo stack

### Voice Control Simultaneous Use
- Enabling both Voice Control and Dictation in iOS settings may cause text to be inserted twice
- This case actually changes the DOM, so `textContent`-based deduplication won't detect it
- Recommend users enable only one

## Test Environment

| iOS Version | Browser | Language | Reproduced |
|------------|---------|----------|------------|
| iOS 16.x | Safari | Korean | ✅ Confirmed |
| iOS 16.x | Safari | English | ✅ Confirmed |
| iOS 16.x | Chrome iOS | Korean | ✅ Confirmed |
| iOS 17.x | Safari | Korean | ✅ Confirmed |
| iOS 17.x | Safari | English | ✅ Confirmed |
| iOS 17.x | Chrome iOS | Korean | ✅ Confirmed |
| iOS 18.x | Safari | Korean | ⚠️ Unconfirmed |
| iOS 18.x | Safari | English | ⚠️ Unconfirmed |

**Note**: The same issue likely occurs across all iOS versions (shared WebKit engine). Issue appears to occur regardless of language.
