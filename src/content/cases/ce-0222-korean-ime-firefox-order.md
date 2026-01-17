---
id: ce-0222-korean-ime-firefox-order
scenarioId: scenario-korean-ime-composition-firefox
locale: en
os: Windows
osVersion: "10/11"
device: Desktop
deviceVersion: Any
browser: Firefox
browserVersion: "115.0+"
keyboard: Korean (IME)
caseTitle: Firefox Korean IME composition events fire in wrong order with rapid typing
description: "In Firefox with Korean IME, when typing rapidly, composition events fire in incorrect order. compositionend may fire before compositionupdate, or multiple compositionend events may fire without corresponding compositionstart. This breaks composition state tracking."
tags:
  - firefox
  - korean
  - ime
  - composition-events
  - event-order
  - rapid-typing
  - windows
status: draft
domSteps:
  - label: "Rapid typing start"
    html: '<p>안녕</p>'
    description: "User types '안녕' quickly"
  - label: "Expected event sequence"
    html: '<p>안녕</p>'
    description: "compositionstart → compositionupdate → compositionend (repeated)"
  - label: "Actual Firefox sequence"
    html: '<p>안녕</p>'
    description: "compositionstart → compositionend → compositionupdate (incorrect order)"
  - label: "Duplicate events"
    html: '<p>안녕하세요</p>'
    description: "Multiple compositionend events without proper starts"
---

## Phenomenon

In Firefox with Korean IME on Windows, rapid typing causes composition events to fire in incorrect order. Instead of the expected `compositionstart → compositionupdate → compositionend` sequence for each character, Firefox may fire `compositionend` before `compositionupdate`, fire multiple `compositionend` events, or skip events entirely.

## Reproduction example

1. Open Firefox on Windows with Korean IME enabled.
2. Focus a `contenteditable` element.
3. Enable composition event logging.
4. Type Korean text rapidly (e.g., "안녕하세요" or "가나다라마바사").
5. Observe the sequence of composition events.
6. Pay attention to event order and duplicate events.

## Observed behavior

### Incorrect event sequences:

**Expected sequence for each character:**
```
compositionstart → compositionupdate → compositionend
```

**Firefox actual sequences during rapid typing:**

1. **Event order inversion**:
   ```
   compositionstart → compositionend → compositionupdate
   ```

2. **Missing events**:
   ```
   compositionstart → compositionend (no compositionupdate)
   ```

3. **Duplicate events**:
   ```
   compositionstart → compositionupdate → compositionend → compositionend
   ```

4. **Event clustering**:
   ```
   compositionstart → (multiple compositionupdate) → compositionend → compositionend
   ```

### Specific patterns observed:

- **Rapid character input**: Most likely to trigger incorrect ordering
- **Complex compositions**: Multiple jamo combinations increase probability
- **System load**: Higher CPU usage increases event sequencing errors
- **Firefox version**: Newer versions show improved but still imperfect behavior
- **IME type**: Different Korean IMEs (Microsoft, Naver, Google) vary in behavior

### Event data inconsistencies:

```javascript
// Example of problematic event sequence
[
  { type: 'compositionstart', data: '' },
  { type: 'compositionend', data: '가' },
  { type: 'compositionupdate', data: '가' }, // Wrong order!
  { type: 'compositionstart', data: '' },
  { type: 'compositionupdate', data: '나' },
  { type: 'compositionend', data: '나' },
  { type: 'compositionend', data: '나' } // Duplicate!
]
```

## Expected behavior

- Composition events should follow consistent order for every character
- Each character should have exactly one start, update(s), and end event
- Event timing should be predictable and reliable
- Rapid typing should not break event sequencing
- Event data should be consistent and reliable

## Impact

- **State tracking broken**: Composition state becomes unreliable
- **Input handling fails**: Applications can't properly track IME state
- **Text corruption**: Characters may be duplicated or lost
- **Performance issues**: Applications must add complex workarounds
- **Cross-browser compatibility**: Firefox-specific handling required

## Browser Comparison

- **Firefox Windows**: Pronounced event ordering issues with Korean IME
- **Firefox macOS**: Better behavior but still occasional issues
- **Firefox Linux**: Generally correct behavior
- **Chrome Windows**: Correct event ordering, reliable behavior
- **Edge Windows**: Correct event ordering, same as Chrome
- **Safari macOS**: Correct event ordering

## Workarounds

### 1. Robust composition state tracking

```javascript
class RobustKoreanIMEHandler {
  constructor(editor) {
    this.editor = editor;
    this.compositionState = {
      isComposing: false,
      currentCharacter: '',
      lastStart: null,
      lastEnd: null,
      eventQueue: [],
      processingEvents: false
    };
    
    this.setupEventHandling();
  }
  
  setupEventHandling() {
    this.editor.addEventListener('compositionstart', this.handleCompositionStart.bind(this));
    this.editor.addEventListener('compositionupdate', this.handleCompositionUpdate.bind(this));
    this.editor.addEventListener('compositionend', this.handleCompositionEnd.bind(this));
    this.editor.addEventListener('input', this.handleInput.bind(this));
  }
  
  handleCompositionStart(e) {
    // Add to queue for ordered processing
    this.queueEvent('compositionstart', e);
    this.processEventQueue();
  }
  
  handleCompositionUpdate(e) {
    this.queueEvent('compositionupdate', e);
    this.processEventQueue();
  }
  
  handleCompositionEnd(e) {
    this.queueEvent('compositionend', e);
    this.processEventQueue();
  }
  
  queueEvent(type, event) {
    this.compositionState.eventQueue.push({
      type,
      data: event.data,
      timestamp: Date.now(),
      originalEvent: event
    });
  }
  
  async processEventQueue() {
    if (this.compositionState.processingEvents) {
      return;
    }
    
    this.compositionState.processingEvents = true;
    
    // Wait a bit to collect related events
    await this.wait(10);
    
    const events = this.compositionState.eventQueue.splice(0);
    const normalizedEvents = this.normalizeEventSequence(events);
    
    // Process normalized events
    for (const event of normalizedEvents) {
      this.processNormalizedEvent(event);
    }
    
    this.compositionState.processingEvents = false;
  }
  
  normalizeEventSequence(events) {
    // Fix Firefox event ordering issues
    const normalized = [];
    let currentComposition = null;
    
    for (let i = 0; i < events.length; i++) {
      const event = events[i];
      
      switch (event.type) {
        case 'compositionstart':
          // Start new composition
          if (currentComposition) {
            // Force end previous composition
            normalized.push({
              type: 'compositionend',
              data: currentComposition.character,
              timestamp: event.timestamp - 1
            });
          }
          
          currentComposition = {
            started: true,
            character: '',
            updates: []
          };
          
          normalized.push(event);
          break;
          
        case 'compositionupdate':
          if (!currentComposition) {
            // Missing start event - insert it
            normalized.push({
              type: 'compositionstart',
              data: '',
              timestamp: event.timestamp - 2
            });
            
            currentComposition = {
              started: true,
              character: '',
              updates: []
            };
          }
          
          currentComposition.character = event.data || '';
          currentComposition.updates.push(event);
          normalized.push(event);
          break;
          
        case 'compositionend':
          if (!currentComposition) {
            // Missing start event - insert it
            normalized.push({
              type: 'compositionstart',
              data: '',
              timestamp: event.timestamp - 2
            });
            
            normalized.push({
              type: 'compositionupdate',
              data: event.data || '',
              timestamp: event.timestamp - 1
            });
          }
          
          // Remove duplicate end events
          if (!this.isDuplicateEnd(normalized, event)) {
            normalized.push(event);
            currentComposition = null;
          }
          break;
      }
    }
    
    return normalized;
  }
  
  isDuplicateEnd(events, newEvent) {
    const recentEndEvents = events.filter(e => 
      e.type === 'compositionend' && 
      e.timestamp > newEvent.timestamp - 50
    );
    
    return recentEndEvents.length > 0;
  }
  
  processNormalizedEvent(event) {
    switch (event.type) {
      case 'compositionstart':
        this.compositionState.isComposing = true;
        this.compositionState.lastStart = event;
        this.onCompositionStart(event.originalEvent);
        break;
        
      case 'compositionupdate':
        this.compositionState.currentCharacter = event.data || '';
        this.onCompositionUpdate(event.originalEvent);
        break;
        
      case 'compositionend':
        this.compositionState.isComposing = false;
        this.compositionState.lastEnd = event;
        this.onCompositionEnd(event.originalEvent);
        break;
    }
  }
  
  onCompositionStart(e) {
    // Custom handling
    console.log('Composition started:', e);
  }
  
  onCompositionUpdate(e) {
    // Custom handling
    console.log('Composition updated:', e.data);
  }
  
  onCompositionEnd(e) {
    // Custom handling
    console.log('Composition ended:', e.data);
  }
  
  handleInput(e) {
    // Additional validation for input events
    if (this.compositionState.isComposing !== e.isComposing) {
      // Fix mismatched composition state
      this.compositionState.isComposing = e.isComposing;
    }
  }
  
  wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}
```

### 2. Firefox-specific detection and handling

```javascript
class FirefoxKoreanIMEHandler extends RobustKoreanIMEHandler {
  constructor(editor) {
    super(editor);
    this.isFirefox = /Firefox/.test(navigator.userAgent);
    this.isWindows = /Win/.test(navigator.platform);
    this.isKoreanIME = false;
    
    if (this.isFirefox && this.isWindows) {
      this.setupKoreanIMEDetection();
    }
  }
  
  setupKoreanIMEDetection() {
    // Detect Korean IME usage patterns
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Process' || e.keyCode === 229) {
        this.isKoreanIME = true;
      }
    });
    
    document.addEventListener('compositionstart', () => {
      if (this.getLocale().startsWith('ko')) {
        this.isKoreanIME = true;
      }
    });
  }
  
  getLocale() {
    return navigator.language || navigator.userLanguage || 'en';
  }
  
  normalizeEventSequence(events) {
    if (!this.isKoreanIME) {
      return events;
    }
    
    // Apply Firefox-specific normalization
    return super.normalizeEventSequence(events);
  }
}
```

### 3. Alternative: Use beforeinput events instead

```javascript
class BeforeInputKoreanHandler {
  constructor(editor) {
    this.editor = editor;
    this.compositionState = {
      isComposing: false,
      currentText: ''
    };
    
    this.setupBeforeInputHandling();
  }
  
  setupBeforeInputHandling() {
    this.editor.addEventListener('beforeinput', this.handleBeforeInput.bind(this));
    this.editor.addEventListener('input', this.handleInput.bind(this));
  }
  
  handleBeforeInput(e) {
    if (e.inputType === 'insertCompositionText' || 
        e.inputType === 'insertText') {
      
      if (e.isComposing) {
        // Handle composition update
        this.handleCompositionUpdate(e.data);
      } else {
        // Handle final character insertion
        this.handleCompositionEnd(e.data);
      }
    } else if (e.inputType === 'deleteContentBackward') {
      // Handle backspace during composition
      this.handleCompositionBackspace();
    }
  }
  
  handleCompositionUpdate(data) {
    // More reliable than composition events for Firefox
    this.compositionState.currentText = data || '';
    this.compositionState.isComposing = true;
    
    // Update UI based on current composition
    this.updateCompositionDisplay(data);
  }
  
  handleCompositionEnd(data) {
    this.compositionState.isComposing = false;
    this.compositionState.currentText = '';
    
    // Finalize character
    this.finalizeCharacter(data);
  }
  
  handleCompositionBackspace() {
    if (this.compositionState.currentText.length > 0) {
      // Remove last character from composition
      const newText = this.compositionState.currentText.slice(0, -1);
      this.compositionState.currentText = newText;
      this.updateCompositionDisplay(newText);
    }
  }
}
```

## Testing recommendations

1. **Various typing speeds**: Slow, medium, fast, very fast
2. **Different Korean IME**: Microsoft, Naver, Google, Danbee
3. **Various text patterns**: Simple words, complex compounds, mixed Korean/English
4. **Different Firefox versions**: 110, 111, 112, 113, 114, 115, latest
5. **System conditions**: Low vs high CPU load
6. **Timing tests**: Measure event intervals and ordering

## Notes

- This is a long-standing Firefox issue with Korean IME
- Issue appears to be related to Firefox's event handling architecture
- Different Korean IME implementations show varying levels of the problem
- Workarounds add complexity but provide more reliable behavior
- The issue is less pronounced in newer Firefox versions but still exists