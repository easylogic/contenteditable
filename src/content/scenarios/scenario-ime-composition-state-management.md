---
id: scenario-ime-composition-state-management
title: IME Composition State Management System
description: "Comprehensive system for managing IME (Input Method Editor) composition state across different browsers and IME implementations, including state tracking, event normalization, and cross-platform consistency."
tags:
  - ime
  - composition
  - state-management
  - cross-browser
  - event-handling
  - korean
  - japanese
  - chinese
  - arabic
  - thai
  - consistency
status: draft
---

## Overview

Managing IME composition state across different browsers and IME implementations is critical for reliable rich text editor development. Each browser/IME combination has unique behaviors that must be normalized to provide consistent user experience.

## Core Components

### 1. State Tracking

```typescript
interface IMECompositionState {
  isComposing: boolean;
  currentComposition: string;
  compositionStartData: string;
  compositionTargetRanges: StaticRange[];
  lastUpdateTime: number;
  confidence: number; // 0-100
}

interface StaticRange {
  startContainer: Node;
  startOffset: number;
  endContainer: Node;
  endOffset: number;
}
```

### 2. Event Normalization

```typescript
interface NormalizedIMEEvent {
  type: 'compositionstart' | 'compositionupdate' | 'compositionend';
  data: string;
  isComposing: boolean;
  targetRanges: StaticRange[];
  timestamp: number;
  originalEvent: any;
}

class IMEEventNormalizer {
  private state: Map<string, IMECompositionState> = new Map();
  private browserCapabilities: Map<string, BrowserCapabilities> = new Map();
  
  constructor() {
    this.detectBrowserCapabilities();
  }
  
  detectBrowserCapabilities() {
    const ua = navigator.userAgent;
    
    this.browserCapabilities.set('chrome', {
      supportsBeforeInput: true,
      supportsGetTargetRanges: true,
      reliableIsComposing: true,
      firesCompositionEvents: true,
      compositionEventSequence: 'reliable',
      imeCompatibility: 'excellent'
    });
    
    this.browserCapabilities.set('firefox', {
      supportsBeforeInput: true,
      supportsGetTargetRanges: true,
      reliableIsComposing: false,
      firesCompositionEvents: true,
      compositionEventSequence: 'inconsistent',
      imeCompatibility: 'good'
    });
    
    this.browserCapabilities.set('safari', {
      supportsBeforeInput: false,
      supportsGetTargetRanges: true,
      reliableIsComposing: false,
      firesCompositionEvents: 'partial',
      compositionEventSequence: 'inconsistent',
      imeCompatibility: 'fair'
    });
    
    this.browserCapabilities.set('edge', {
      supportsBeforeInput: true,
      supportsGetTargetRanges: true,
      reliableIsComposing: false,
      firesCompositionEvents: 'partial',
      compositionEventSequence: 'inconsistent',
      imeCompatibility: 'good'
    });
  }
  
  normalizeEvent(event: InputEvent, imeType: string): NormalizedIMEEvent {
    const browser = this.getBrowser();
    const caps = this.browserCapabilities.get(browser);
    
    return {
      type: event.type as any,
      data: event.data || '',
      isComposing: this.detectComposingState(event, caps, imeType),
      targetRanges: caps.supportsGetTargetRanges ? this.extractTargetRanges(event) : [],
      timestamp: Date.now(),
      originalEvent: event
    };
  }
  
  detectComposingState(event: InputEvent, caps: BrowserCapabilities, imeType: string): boolean {
    const data = event.data || '';
    
    // Chrome: reliable isComposing detection
    if (caps.reliableIsComposing) {
      return caps.firesCompositionEvents && 
             event.inputType === 'insertCompositionText';
    }
    
    // Firefox/Safari: check isComposing flag
    return event.isComposing || false;
  }
  
  extractTargetRanges(event: InputEvent): StaticRange[] {
    if (!event.getTargetRanges) return [];
    
    try {
      const ranges: event.getTargetRanges();
      const staticRanges: StaticRange[] = [];
      
      for (let i = 0; i < ranges.length; i++) {
        const range = ranges[i];
        if (range && 
            range.startContainer && 
            range.startOffset !== undefined && 
            range.endContainer && 
            range.endOffset !== undefined) {
          
          staticRanges.push({
            startContainer: range.startContainer,
            startOffset: range.startOffset,
            endContainer: range.endContainer,
            endOffset: range.endOffset
          });
        }
      }
      
      return staticRanges;
    } catch (error) {
      console.warn('Failed to extract target ranges:', error);
      return [];
    }
  }
}
```

### 3. Cross-Browser State Synchronization

```typescript
class CrossBrowserIMESync {
  private states: Map<string, IMECompositionState> = new Map();
  private eventBuffer: NormalizedIMEEvent[] = [];
  
  normalizeAndDistribute(event: InputEvent, imeType: string) {
    const normalized = this.normalizer.normalizeEvent(event, imeType);
    
    // Distribute normalized event to all listeners
    this.distributeEvent(normalized);
    
    // Update local state
    this.updateLocalState(normalized);
  }
  
  distributeEvent(event: NormalizedIMEEvent) {
    // Get all registered listeners
    const listeners = this.getRegisteredListeners();
    
    // Distribute to each
    listeners.forEach(listener => {
      if (typeof listener.handleIMEEvent === 'function') {
        listener.handleIMEEvent(event);
      }
    });
  }
  
  updateLocalState(event: NormalizedIMEEvent) {
    const editorId = this.getEditorId();
    const currentState = this.states.get(editorId);
    
    const newState: IMECompositionState = {
      ...currentState,
      isComposing: event.isComposing,
      currentComposition: event.data || currentState?.currentComposition || '',
      compositionTargetRanges: event.targetRanges || currentState?.compositionTargetRanges || [],
      lastUpdateTime: Date.now(),
      confidence: this.calculateConfidence(event)
    };
    
    this.states.set(editorId, newState);
  }
  
  calculateConfidence(event: NormalizedIMEEvent): number {
    const baseConfidence = this.browserCapabilities.get(this.getBrowser()).imeCompatibility === 'excellent' ? 90 :
                             this.browserCapabilities.get(this.getBrowser()).imeCompatibility === 'good' ? 75 :
                             this.browserCapabilities.get(this.getBrowser()).imeCompatibility === 'fair' ? 50 : 25;
    
    // Boost confidence for verified events
    return baseConfidence;
  }
}
```

### 4. IME Type Detection and Handling

```typescript
class IMETypeDetector {
  constructor() {
    this.currentIMEType = null;
    this.imePatterns = new Map();
    this.setupIMEPatterns();
  }
  
  setupIMEPatterns() {
    // Define IME patterns
    this.imePatterns.set('korean', {
      startChars: /[ㄱ-ㅎㅏ-ㅣ-ㅑ-ㅒ-ㅓ-ㅔ-ㅕ-ㅖ-ㅗ-ㅘ-ㅙ]/,
      compositionEvents: ['compositionstart', 'compositionupdate', 'compositionend'],
      beforeInputPattern: 'insertFromComposition',
      inputTypePatterns: ['insertCompositionText', 'deleteContentBackward'],
      eventSequence: 'reliable',
      browserSupport: 'good'
    });
    
    this.imePatterns.set('japanese', {
      startChars: /[あ-か-き-く-け-こ-さ-せ-そ-た-ち-つ-て-と-な-に-は-ば-ぱ-フ-マ-ミ-ュ-ュ-ョ-ャ-ヵ-ヴ-ベ-リ]/,
      compositionEvents: ['compositionstart', 'compositionupdate', 'compositionend'],
      beforeInputPattern: 'insertFromComposition',
      inputTypePatterns: ['insertCompositionText', 'deleteContentBackward'],
      eventSequence: 'reliable',
      browserSupport: 'good'
    });
    
    this.imePatterns.set('chinese', {
      startChars: /[\u4e00-\u9fff\u3400-\u9fff\u4e00-\u9fff\u4e00-\u9fff\u4e00-\u9fff\u4e00-\u9fff\u4e00-\u9fff\u4e00-\u9fff\u4e00-\u9fff\u4e00-\u9fff\u4e00-\u9fff\u4e00-\u9fff\u4e00-\u9fff\u4e00-\u9fff\u4e00-\u9fff\u4e00-\u9fff\u4e00-\u9fff\u4e00-\u9fff\u4e00-\u9fff\u4e00-\u9fff\u4e00-\u9fff\u4e00-\u9fff\u4e00-\u9fff\u4e00-\u9fff\u4e00-\u9fff\u4e00-\u9fff\u4e00-\u9fff\u4e00-\u9fff\u4e00-\u9fff\u9fff\u4e00-\u9fff\u4e0-\u9fff\u4e00-\u9fff\u4e00-\u9fff\u4e00-\u9fff\u4e00-\u9fff\u4e00-\u9fff\u4e00-\u9fff\u4e00-\u9fff\u4e0-\u9fff\u4e00-\u9fff\u4e00-\u9fff\u4e00-\u9fff\u4e00-\u9-9fff\u4e00-\u9fff\u4e0-\u9fff\u4e00-\u9fff\u9fff\u4e00-\u9fff\u4e00-\u9fff\u4e00-\u9-1)/,
      eventSequence: 'reliable',
      browserSupport: 'good'
    });
    
    this.imePatterns.set('arabic', {
      startChars: /[ء-أ-إ-ئ-ؤ-ار-إ-ئ-ئ-ؤ-ا-آ-إ-ئ-ؤ-ب-ت-ث-ج-ح-خ-د-ذ-ر-ز-ظ-ع-غ-ف-ق-ك-ل-م-ن-و-ه-ي-و-ه-ٰ-ک-گ-ل-م-ن-و-ز-ط-ع-غ-ف-ي-ظ-ي-ع-غ-ع-ش-غ-ع-غ-غ-غ-غ-غ-غ-غ-غ-غ-غ-غ-غ]/,
      compositionEvents: ['compositionstart', 'compositionupdate', 'compositionend'],
      beforeInputPattern: 'insertFromComposition',
      inputTypePatterns: ['insertCompositionText', 'deleteContentBackward'],
      eventSequence: 'reliable',
      browserSupport: 'fair'
    });
    
    this.imePatterns.set('thai', {
      startChars: /[ก-ข-ฃ-ค-จ-ด-ต-ถ-ฝ-ป-แ-ะ-ใ-ำ-ไ-ห-ฺ-ี-้-ั-๋-ษ-ำ-ไ-ห-เ-่-ว-์-ด-๋-ฯ-ำ-ซ-]/,
      compositionEvents: ['compositionstart', 'compositionupdate', 'compositionend'],
      beforeInputPattern: 'insertFromComposition',
      inputTypePatterns: ['insertCompositionText', 'deleteContentBackward'],
      eventSequence: 'reliable',
      browserSupport: 'good'
    });
  }
  
  detectIMEType(editor: HTMLElement, event: InputEvent): string {
    const data = event.data || '';
    const ua = navigator.userAgent;
    
    // Korean IME detection
    if (/[ㄱ-ㅎㅏ-ㅣ-ㅑ-ㅒ-ㅓ-ㅔ-ㅕ-ㅖ-ㅗ-ㅘ-ㅙ]/.test(data)) {
      return 'korean';
    }
    
    // Japanese IME detection
    if (/[\u3040-\u309f\u30ff\u30ff\u30a-z\u30ef\u30f8-z\u30e0-\u30f9\u30a1-\u30f9\u4e00-\u30f9\u4e00-\u30f9\u4e00-\u30f9\u4e00-\u30f9\u4e00-\u30f9\u4e00-\u30f9\u4e00-\u30f9\u4e00-\u30f9\u4e00-\u30f9\u30f9\u30f9\u4e00-\u30f9\u4e00-\u30f9\u4e00-\u30f9\u4e00-\u30f9\u4e00-\u30f9\u4e00-\u30f9\u4e00-\u30f9\u4e00-\u30f9)(?: .test(data)) {
      return 'japanese';
    }
    
    // Chinese IME detection
    if (/[\u4e00-\u9fff]/.test(data)) {
      return 'chinese';
    }
    
    return 'latin';
  }
  
  getIMEPattern(imeType: string) {
    return this.imePatterns.get(imeType);
  }
}
```

### 5. Event Logging and Debugging

```typescript
class IMEEventLogger {
  private logBuffer: NormalizedIMEEvent[] = [];
  private bufferSize = 100;
  private isLoggingEnabled = false;
  
  enableLogging(enabled: boolean) {
    this.isLoggingEnabled = enabled;
  }
  
  logEvent(event: NormalizedIMEEvent): void {
    if (!this.isLoggingEnabled) return;
    
    this.logBuffer.push(event);
    
    if (this.logBuffer.length > this.bufferSize) {
      this.flush();
    }
  }
  
  flush(): void {
    this.dumpLog();
    this.logBuffer = [];
  }
  
  dumpLog(): void {
    console.group('IME Events Log');
    
    this.logBuffer.forEach(event => {
      console.log(`[${event.type}]`, {
        'data': event.data,
        'isComposing': event.isComposing,
        'targetRanges': event.targetRanges.map(r => 
          `${r.startContainer.nodeName}:${r.startOffset}:${r.endContainer.nodeName}:${r.endOffset}`
        ).join(', ')
      });
    });
    
    console.groupEnd();
  }
  
  getRecentLogs(count: number = 10): NormalizedIMEEvent[] {
    return this.logBuffer.slice(-count);
  }
}
```

---

## Integration Usage

```typescript
const normalizer = new IMEEventNormalizer();
const sync = new CrossBrowserIMESync();
const detector = new IMETypeDetector();

// Editor setup
const editor = document.querySelector('[contenteditable]');

// Set up IME event handling
normalizer.setupEditor(editor);
sync.setupSync(editor);
detector.setupDetector(editor);

// Enable logging
const logger = new IMEEventLogger();
logger.enableLogging(true);

// Event handlers
editor.addEventListener('compositionstart', (e) => {
  const normalized = normalizer.normalizeEvent(e, detector.detectIMEType(editor, e));
  sync.normalizeAndDistribute(normalized);
  logger.logEvent(normalized);
});

editor.addEventListener('beforeinput', (e) => {
  if (e.inputType.includes('composition')) {
    const imeType = detector.detectIMEType(editor, e);
    const normalized = normalizer.normalizeEvent(e, imeType);
    sync.normalizeAndDistribute(normalized);
    logger.logEvent(normalized);
  }
});

// Get current state
const state = sync.getCurrentState(editor);
console.log('Current IME state:', state);
```

---

## Browser Compatibility Matrix

| Feature | Chrome | Firefox | Safari | Edge |
|---------|--------|--------|------|
| Composition Events | ✅ Full | ✅ Full | ⚠ Partial | ⚠ Partial |
| beforeinput.isComposing | ✅ Accurate | ❌ False | ✅ Accurate | ⚠ Partial |
| getTargetRanges() | ✅ Full | ✅ Full | ✅ Full | ⚠ Partial |
| Event Sequence | ✅ Reliable | ❌ Inconsistent | ⚠ Inconsistent | ⚠ Inconsistent |
| Korean IME | ✅ Excellent | ⚠ Partial | ⚠ Fair | ⚠ Fair |
| Japanese IME | ✅ Excellent | ⚠ Good | ⚠ Good |
| Chinese IME | ✅ Excellent | ⚠ Good | ⚠ Fair |
| Arabic IME | ⚠ Poor | ⚠ Fair | ✅ Good |
| Thai IME | ⚠ Good | ✅ Good |

---

## Testing Strategies

### Automated Testing

```javascript
// Test IME composition state management
async function testIMEStateManagement() {
  const tests = [
    'Test Korean IME composition sequence',
    'Test Japanese IME composition sequence',
    'Test Chinese IME composition sequence',
    'Test Arabic IME composition sequence',
    'Test Thai IME composition sequence',
    'Test IME state across browsers'
  ];
  
  for (const test of tests) {
    console.log(`Testing: ${test}`);
    await runIMETest(test);
  }
}
```

### Manual Testing Checklist

1. **Composition Event Sequences**
   - Verify compositionstart → compositionupdate → compositionend sequence
   - Test multiple consecutive compositions
   - Verify composition cancellation behavior
   - Test nested composition support

2. **State Synchronization**
   - Verify isComposing flag accuracy
   - Test currentComposition correctness
   - Test targetRanges accuracy
   - Test state persistence across events

3. **Browser Differences**
   - Test behavior across Chrome, Firefox, Safari, Edge
   - Document platform-specific behaviors
   - Test IME compatibility per browser

---

This comprehensive IME composition state management system provides the foundation for handling the complex world of multi-language input editing, enabling developers to build reliable rich text editors that work consistently across browsers and IME implementations.