---
id: scenario-ios-dictation-duplicate-events
title: iOS dictation triggers duplicate input events after completion
description: "On iOS, when using voice dictation to input text into contenteditable elements, the system may fire duplicate beforeinput and input events after the initial dictation completes. The text is split into words and events are re-fired, causing synchronization issues. Composition events do not fire during dictation, making it difficult to distinguish dictation from keyboard input."
category: ime
tags:
  - ime
  - dictation
  - voice-input
  - beforeinput
  - input
  - ios
  - safari
  - duplicate-events
  - sync-issue
status: draft
locale: en
---

On iOS, when using the built-in voice dictation feature to input text into `contenteditable` elements, the system may fire duplicate `beforeinput` and `input` events after the initial dictation completes. The dictated text is split into individual words and events are re-fired, causing synchronization issues between the event sequence and the actual DOM state.

## The Problem

When using iOS dictation:
1. User activates voice dictation and speaks text (e.g., "만나서 반갑습니다")
2. Initial `beforeinput` and `input` events fire with the complete text
3. After the initial input completes, the system re-fires events with the text split into words
4. Example: "만나서 반갑습니다" → events fire again as "만나서" + space + "반갑습니다"
5. The event sequence becomes out of sync with the actual DOM state
6. Event handlers may process the same input multiple times

## Platform-Specific Behavior

### iOS/iPadOS (Safari, Chrome iOS)
- Dictation does NOT fire composition events (`compositionstart`, `compositionupdate`, `compositionend`)
- Only `beforeinput` and `input` events fire during dictation
- Events may be re-fired after dictation completes with text split into words
- No reliable way to distinguish dictation input from keyboard input through web APIs

### macOS Safari
- Dictation DOES fire composition events
- Behavior is more consistent with standard IME input
- Events are not re-fired after completion

## Observed Behavior

When using iOS dictation, the following event pattern is observed:

- **Initial input**: Complete text is inserted at once, firing `beforeinput` → `input` events
- **Duplicate events**: After initial input completes, text is split word-by-word and `beforeinput` → `input` events fire again
- **DOM state**: DOM actually changes only in initial input; duplicate events don't change the DOM
- **Composition events**: `compositionstart`, `compositionupdate`, `compositionend` events do NOT fire in any phase

See the "Event Sequence" section below for detailed event order.

## Impact

- **Duplicate processing**: Event handlers execute multiple times for the same input
- **State synchronization issues**: Application state may become inconsistent with DOM state
- **Performance issues**: Unnecessary processing of duplicate events
- **Undo/redo corruption**: Undo stack may contain duplicate or incorrect entries
- **Validation issues**: Validation logic may run multiple times on the same input
- **Formatting issues**: Formatting logic may be applied incorrectly due to split text

## Distinguishing Dictation from Keyboard Input

**Important**: There is no reliable way to detect dictation input in web applications on iOS. The following characteristics may help identify potential dictation input, but they are not definitive:

### Potential Indicators (Not Reliable)
- Absence of composition events (but this also occurs with Korean IME on iOS)
- Rapid insertion of multiple words
- Text appears to be split and re-inserted
- Events fire in quick succession with complete words

### Limitations
- Native iOS APIs like `UITextInputContext.isDictationInputExpected` are not available in web contexts
- Web APIs do not provide dictation detection capabilities
- Pattern-based detection is unreliable and may produce false positives

## Browser Comparison

- **iOS Safari**: Dictation does not fire composition events, events may be re-fired after completion
- **iOS Chrome**: Same behavior as Safari (uses WebKit engine)
- **macOS Safari**: Dictation fires composition events, more consistent behavior
- **Chrome/Edge/Firefox (Desktop)**: Dictation behavior varies but generally more consistent

## Event Sequence

The sequence of events when inputting "만나서 반갑습니다" via iOS dictation:

### Phase 1: Initial Dictation Input

```
User: Activates dictation → Speaks "만나서 반갑습니다"

Event 1: beforeinput
  - inputType: 'insertText'
  - data: '만나서 반갑습니다'
  - isComposing: false
  - DOM state: (before) ""

Event 2: input
  - inputType: 'insertText'
  - data: '만나서 반갑습니다'
  - isComposing: false
  - DOM state: (after) "만나서 반갑습니다"
```

### Phase 2: Duplicate Events (Bug)

After the initial input completes, after a short delay (typically 100-500ms), events are re-fired with text split into words:

```
Event 3: beforeinput
  - inputType: 'insertText'
  - data: '만나서'
  - isComposing: false
  - DOM state: (before) "만나서 반갑습니다" (already exists)

Event 4: input
  - inputType: 'insertText'
  - data: '만나서'
  - isComposing: false
  - DOM state: (after) "만나서 반갑습니다" (no change)

Event 5: beforeinput
  - inputType: 'insertText'
  - data: ' ' (space)
  - isComposing: false
  - DOM state: (before) "만나서 반갑습니다"

Event 6: input
  - inputType: 'insertText'
  - data: ' '
  - isComposing: false
  - DOM state: (after) "만나서 반갑습니다" (no change)

Event 7: beforeinput
  - inputType: 'insertText'
  - data: '반갑습니다'
  - isComposing: false
  - DOM state: (before) "만나서 반갑습니다"

Event 8: input
  - inputType: 'insertText'
  - data: '반갑습니다'
  - isComposing: false
  - DOM state: (after) "만나서 반갑습니다" (no change)
```

### Complete Event Sequence Summary

| Order | Event | inputType | data | DOM Changed |
|-------|-------|-----------|------|-------------|
| 1 | beforeinput | insertText | '만나서 반갑습니다' | - |
| 2 | input | insertText | '만나서 반갑습니다' | ✅ Changed |
| 3 | beforeinput | insertText | '만나서' | - |
| 4 | input | insertText | '만나서' | ❌ No change |
| 5 | beforeinput | insertText | ' ' | - |
| 6 | input | insertText | ' ' | ❌ No change |
| 7 | beforeinput | insertText | '반갑습니다' | - |
| 8 | input | insertText | '반갑습니다' | ❌ No change |

### Key Characteristics

- **Initial input**: Events 1-2 insert the complete text at once (DOM actually changes)
- **Duplicate events**: Events 3-8 re-fire text word-by-word but DOM doesn't change
- **Composition events**: `compositionstart`, `compositionupdate`, `compositionend` events do NOT fire in any phase
- **isComposing**: All events have `isComposing: false`
- **Delay between phases**: 100-500ms delay between initial input (Event 2) and duplicate events start (Event 3)

## Complete Event Monitoring

Code example to monitor all events during iOS dictation input:

```javascript
const element = document.querySelector('[contenteditable]');
const eventLog = [];

// Monitor all relevant events
const eventsToMonitor = [
  'compositionstart',
  'compositionupdate', 
  'compositionend',
  'beforeinput',
  'input',
  'keydown',
  'keyup',
  'keypress'
];

eventsToMonitor.forEach(eventType => {
  element.addEventListener(eventType, (e) => {
    const eventData = {
      timestamp: Date.now(),
      type: eventType,
      inputType: e.inputType || null,
      data: e.data || null,
      isComposing: e.isComposing || false,
      textContent: element.textContent,
      selectionStart: window.getSelection()?.anchorOffset || null,
      selectionEnd: window.getSelection()?.focusOffset || null
    };
    
    eventLog.push(eventData);
    console.log(`[${eventType}]`, eventData);
  }, { capture: true });
});

// Print event log
function printEventLog() {
  console.table(eventLog);
  return eventLog;
}
```

### Actual Monitoring Results Example

Actual event sequence when inputting "만나서 반갑습니다" via dictation on iOS Safari:

```
[beforeinput] {
  timestamp: 1000,
  type: 'beforeinput',
  inputType: 'insertText',
  data: '만나서 반갑습니다',
  isComposing: false,
  textContent: '',
  selectionStart: 0,
  selectionEnd: 0
}

[input] {
  timestamp: 1001,
  type: 'input',
  inputType: 'insertText',
  data: '만나서 반갑습니다',
  isComposing: false,
  textContent: '만나서 반갑습니다',
  selectionStart: 8,
  selectionEnd: 8
}

// Approximately 200ms delay

[beforeinput] {
  timestamp: 1201,
  type: 'beforeinput',
  inputType: 'insertText',
  data: '만나서',
  isComposing: false,
  textContent: '만나서 반갑습니다',
  selectionStart: 8,
  selectionEnd: 8
}

[input] {
  timestamp: 1202,
  type: 'input',
  inputType: 'insertText',
  data: '만나서',
  isComposing: false,
  textContent: '만나서 반갑습니다',  // No change
  selectionStart: 8,
  selectionEnd: 8
}

[beforeinput] {
  timestamp: 1203,
  type: 'beforeinput',
  inputType: 'insertText',
  data: ' ',
  isComposing: false,
  textContent: '만나서 반갑습니다',
  selectionStart: 8,
  selectionEnd: 8
}

[input] {
  timestamp: 1204,
  type: 'input',
  inputType: 'insertText',
  data: ' ',
  isComposing: false,
  textContent: '만나서 반갑습니다',  // No change
  selectionStart: 8,
  selectionEnd: 8
}

[beforeinput] {
  timestamp: 1205,
  type: 'beforeinput',
  inputType: 'insertText',
  data: '반갑습니다',
  isComposing: false,
  textContent: '만나서 반갑습니다',
  selectionStart: 8,
  selectionEnd: 8
}

[input] {
  timestamp: 1206,
  type: 'input',
  inputType: 'insertText',
  data: '반갑습니다',
  isComposing: false,
  textContent: '만나서 반갑습니다',  // No change
  selectionStart: 8,
  selectionEnd: 8
}
```

### Events That Do NOT Fire

The following events do **NOT** fire during iOS dictation:

- ❌ `compositionstart`
- ❌ `compositionupdate`
- ❌ `compositionend`
- ❌ `keydown` (for dictation input)
- ❌ `keyup` (for dictation input)
- ❌ `keypress` (for dictation input)

### Event Pattern Summary

| Event Type | Initial Input | Duplicate Events | Fires? |
|-----------|---------------|------------------|--------|
| `beforeinput` | ✅ 1 time | ✅ 3 times | Yes |
| `input` | ✅ 1 time | ✅ 3 times | Yes |
| `compositionstart` | ❌ | ❌ | No |
| `compositionupdate` | ❌ | ❌ | No |
| `compositionend` | ❌ | ❌ | No |
| `keydown` | ❌ | ❌ | No |
| `keyup` | ❌ | ❌ | No |
| `keypress` | ❌ | ❌ | No |

## Other Editors: ProseMirror

How ProseMirror handles input events on iOS Safari:

### No Special Handling for iOS Dictation

- **ProseMirror does not distinguish dictation**: Since iOS dictation does not fire composition events, ProseMirror treats it as regular `insertText` input.
- **Same issues occur**: As observed in this scenario, dictation input only fires `beforeinput`/`input` events without composition events.
- **No dedicated workaround**: The ProseMirror codebase does not have special logic to handle dictation input.

### IME Composition Handling Improvements

ProseMirror has applied the following fix to address IME composition issues on iOS Safari:

**Problem**: In Safari, re-selecting text during IME composition prevents `compositionend` from firing and causes duplicate `compositionstart`/`compositionupdate` events, leading to character duplication.

**Solution**: Modified `prosemirror-view` to avoid re-selection during composition:

```javascript
// Example modification in ProseMirror's setSelection
if (!view.composing) {
  view.docView.setSelection(anchor, head, view.root, force);
}
```

This change prevents selection updates during composition, maintaining the IME lifecycle.

### iOS Safari Limitations

- **`isComposing` state synchronization issues**: On iOS Safari, `isComposing` is always `false` or composition events don't fire, so ProseMirror's `view.composing` state may not be accurately tracked.
- **Formatting during IME input**: Applying formatting (e.g., bold) during IME composition on iOS Safari may set `isComposing` to an incorrect state, causing subsequent input to not display properly.

### Related Issues and Discussions

- **GitHub Issue #944**: Duplicate character issue with IME input in Safari ([github.com/ProseMirror/prosemirror/issues/944](https://github.com/ProseMirror/prosemirror/issues/944))
- **ProseMirror Discuss**: `isComposing` state synchronization issues on iOS Safari ([discuss.prosemirror.net](https://discuss.prosemirror.net/t/iscomposing-gets-out-of-sync-on-ios/4067))

### Conclusion

ProseMirror also experiences the same limitations of iOS dictation (no composition events, inaccurate `isComposing`) and has no special solution for dictation. Instead, it addresses IME composition issues by avoiding selection re-setting during composition.

## Additional Considerations

### Selection/Cursor Perspective

Considerations regarding cursor position and selection state after dictation completion:

- **Cursor position**: Whether the cursor moves to the expected position after dictation, or if it gets reset when duplicate events fire
- **Selection state**: When duplicate events fire, `window.getSelection()` may return an unexpected state

### Undo/Redo Perspective

How iOS dictation affects the undo/redo stack:

- **OS-level behavior**: iOS dictation may be grouped as a single undo step at the OS level, or split word-by-word
- **Editor's undo stack management**: If the editor manages its own undo stack, recording duplicate events as-is causes problems

**Problem scenario**:
1. User inputs "만나서 반갑습니다" via dictation
2. Initial event: "만나서 반갑습니다" insertion recorded in undo stack
3. Duplicate events: "만나서" insertion, space insertion, "반갑습니다" insertion each recorded in undo stack
4. When user performs undo: Requires 4 undo operations, or duplicate undo entries are created

### Voice Control / Dictation Simultaneous Use

When both Voice Control and Dictation are enabled in iOS settings:

- **Actual duplicate insertion**: Some user reports indicate that enabling both Voice Control and Dictation may cause text to be inserted twice
- **Event sequence**: Actual duplicate insertion from Voice Control + Dictation changes the DOM, so the event sequence may differ

**User guidance**:
- Inform users that problems may occur when using Voice Control and Dictation simultaneously
- Recommend enabling only one in iOS settings

### Test Matrix

Reproduction status across different environments:

| iOS Version | Browser | Language | Reproduced | Notes |
|------------|---------|----------|------------|-------|
| iOS 16.x | Safari | Korean | ✅ Confirmed | Text re-fired word-by-word |
| iOS 16.x | Safari | English | ✅ Confirmed | Text re-fired word-by-word |
| iOS 16.x | Chrome iOS | Korean | ✅ Confirmed | Same as Safari (WebKit engine) |
| iOS 17.x | Safari | Korean | ✅ Confirmed | Same behavior as iOS 16 |
| iOS 17.x | Safari | English | ✅ Confirmed | Same behavior as iOS 16 |
| iOS 17.x | Chrome iOS | Korean | ✅ Confirmed | Same as Safari |
| iOS 18.x | Safari | Korean | ⚠️ Unconfirmed | Testing needed |
| iOS 18.x | Safari | English | ⚠️ Unconfirmed | Testing needed |

**Testing method**:
1. Open Safari or Chrome iOS on iOS device
2. Focus a `contenteditable` element
3. Activate dictation (long press spacebar or tap microphone icon)
4. Dictate a multi-word phrase (e.g., "만나서 반갑습니다")
5. Check `beforeinput` and `input` event logs in browser console
6. Verify if text is re-fired word-by-word after initial input

**Note**:
- The same issue likely occurs across all iOS versions (shared WebKit engine)
- Issue appears to occur regardless of language
- macOS Safari fires composition events, so the issue doesn't occur there

## WebKit Bug Report

This issue has been officially reported in the WebKit bug tracker:

- **WebKit Bug 261764**: "iOS/iPadOS dictation doesn't trigger composition events"
  - URL: https://bugs.webkit.org/show_bug.cgi?id=261764
  - Status: Not yet resolved
  - Description: `compositionstart`, `compositionupdate`, `compositionend` events do not fire when using dictation on iOS/iPadOS

This bug report documents that iOS dictation does not fire composition events, and confirms that macOS Safari works correctly.

## Other Editor Frameworks

### Slate, Lexical, Quill

Other major editor frameworks also experience the limitations of iOS dictation:

- **Slate**: No special handling for iOS dictation documented
- **Lexical**: Issues reported where dictation input is identified but transcriptions from Speech Kit are not displayed
- **Quill**: Updates to improve compatibility with iOS dictation, but the fundamental issue (no composition events) remains unresolved

### Common Limitations

All editor frameworks share these common issues:

- iOS dictation does not fire composition events
- `isComposing` flag is inaccurate
- Cannot distinguish dictation input through web APIs
- Event sequence may differ from expectations

### Similar Issues in React Native

Similar issues related to iOS dictation have been reported in React Native applications:

- **Dictation session termination between words**: Dictation sessions may terminate unexpectedly during component re-renders
- **Workaround**: Implement debouncing mechanism to prevent re-renders during dictation

This suggests similar issues may occur in web applications.
