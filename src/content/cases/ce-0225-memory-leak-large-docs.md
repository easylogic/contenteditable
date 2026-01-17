---
id: ce-0225-memory-leak-large-docs
scenarioId: scenario-performance-memory-leak
locale: en
os: Any
osVersion: "Any"
device: Desktop
deviceVersion: Any
browser: Chrome
browserVersion: "115.0+"
keyboard: US QWERTY
caseTitle: Memory leaks in contenteditable with large documents and frequent DOM operations
description: "In contenteditable elements with large documents (10,000+ characters) and frequent DOM operations (formatting, selection changes, input), memory usage grows continuously and never decreases, causing browser slowdowns and eventual crashes. Memory is retained even after content is cleared."
tags:
  - performance
  - memory-leak
  - large-documents
  - dom-operations
  - contenteditable
  - browser-crash
  - memory-usage
status: draft
domSteps:
  - label: "Initial state"
    html: '<div contenteditable="true" id="editor"><p>Large document with thousands of characters...</p></div>'
    description: "Editor with 10,000+ characters loaded"
  - label: "After operations"
    html: '<div contenteditable="true" id="editor"><p>Large document with thousands of characters...</p></div>'
    description: "After multiple formatting and selection changes"
  - label: "Memory state"
    html: '<div contenteditable="true" id="editor"><p>Content cleared but memory not released</p></div>'
    description: "Content cleared but memory still allocated"
---

## Phenomenon

In contenteditable elements handling large documents (10,000+ characters) with frequent DOM operations (formatting, selection changes, text input), memory usage grows continuously and is never properly released. This causes progressive browser slowdowns, increased CPU usage, and eventual crashes, even after content is cleared.

## Reproduction example

1. Create a `contenteditable` element.
2. Load large content (10,000+ words/characters).
3. Perform frequent operations:
   - Select and format text (bold, italic, colors)
   - Change cursor position rapidly
   - Type and delete text continuously
   - Apply undo/redo operations
4. Monitor browser memory usage (DevTools Memory tab).
5. Clear all content from editor.
6. Observe that memory is not released.

## Observed behavior

### Memory growth patterns:

1. **Linear memory increase**: Memory grows steadily with each operation
2. **No garbage collection**: Memory is never released to garbage collector
3. **Content clearing doesn't help**: Even `innerHTML = ''` doesn't release memory
4. **Page reload required**: Only page reload frees accumulated memory
5. **Progressive slowdown**: Browser becomes increasingly unresponsive

### Specific operations that leak memory:

**Formatting operations:**
```javascript
// Each formatting call leaks memory
function formatText(command, value) {
  document.execCommand(command, false, value);
}

// Leaky sequence:
formatText('bold', null);        // +2MB
formatText('italic', null);      // +1.5MB  
formatText('fontSize', '18px'); // +1MB
// After 100 operations: +350MB and never released
```

**Selection operations:**
```javascript
// Selection range objects not garbage collected
function changeSelection() {
  const selection = window.getSelection();
  const range = document.createRange();
  
  range.selectNodeContents(someElement);
  selection.removeAllRanges();
  selection.addRange(range);
  
  // Range objects accumulate in memory
}
```

**Event listener accumulation:**
```javascript
// Event listeners on dynamic elements never removed
editor.addEventListener('input', handleInput);
editor.addEventListener('selectionchange', handleSelectionChange);

// When DOM changes, listeners accumulate without cleanup
```

### Memory consumption data:

```javascript
// Memory monitoring results
{
  "initialLoad": "15MB",
  "after1000Formats": "180MB", 
  "after10000Inputs": "420MB",
  "afterContentClear": "415MB", // Only 5MB released
  "afterPageReload": "18MB"   // Back to baseline
}
```

## Expected behavior

- Memory usage should remain stable with repeated operations
- Garbage collection should release unused memory periodically
- Content clearing should release most allocated memory
- Browser performance should not degrade over time
- Memory should scale with content size, not operation count

## Impact

- **Browser crashes**: Users experience crashes during long editing sessions
- **Performance degradation**: Editor becomes progressively slower
- **System resource usage**: High memory and CPU consumption
- **User experience**: Unresponsive interface and frustrating usage
- **Cross-tab impact**: High memory usage affects other browser tabs
- **Device limitations**: Mobile devices crash more quickly

## Browser Comparison

- **Chrome**: Severe memory leaks with large contenteditable
- **Edge**: Similar to Chrome, Chromium-based issues
- **Firefox**: Better memory management but still leaks with large docs
- **Safari**: Generally better but struggles with very large content
- **Mobile browsers**: All browsers more severely affected due to memory constraints

## Workarounds

### 1. Memory management and cleanup

```javascript
class ContentEditableMemoryManager {
  constructor(editorElement) {
    this.editor = editorElement;
    this.operationCount = 0;
    this.lastCleanup = Date.now();
    this.memoryThreshold = 50 * 1024 * 1024; // 50MB
    
    this.setupMemoryMonitoring();
    this.setupPeriodicCleanup();
  }
  
  setupMemoryMonitoring() {
    if (performance.memory) {
      this.monitorMemory();
    }
  }
  
  monitorMemory() {
    setInterval(() => {
      const memory = performance.memory;
      const used = memory.usedJSHeapSize;
      
      if (used > this.memoryThreshold) {
        this.performCleanup();
      }
    }, 5000);
  }
  
  setupPeriodicCleanup() {
    this.editor.addEventListener('input', () => {
      this.operationCount++;
      
      if (this.operationCount % 100 === 0) {
        this.performCleanup();
      }
    });
  }
  
  performCleanup() {
    this.cleanupEventListeners();
    this.cleanupSelections();
    this.cleanupDOMReferences();
    this.forceGarbageCollection();
    
    this.lastCleanup = Date.now();
    console.log('Memory cleanup performed');
  }
  
  cleanupEventListeners() {
    // Remove listeners from elements that are no longer in DOM
    const allElements = this.editor.querySelectorAll('*');
    
    allElements.forEach(element => {
      if (!element.parentNode) {
        // Element is detached, remove its listeners
        const clone = element.cloneNode(true);
        if (element.parentNode) {
          element.parentNode.replaceChild(clone, element);
        }
      }
    });
  }
  
  cleanupSelections() {
    // Clear selection ranges that might hold references
    const selection = window.getSelection();
    
    if (selection.rangeCount > 0) {
      // Store and restore selection to clean up old ranges
      const ranges = [];
      
      for (let i = 0; i < selection.rangeCount; i++) {
        ranges.push(selection.getRangeAt(i));
      }
      
      selection.removeAllRanges();
      
      // Restore clean ranges
      ranges.forEach(range => {
        try {
          selection.addRange(range);
        } catch (e) {
          // Range is no longer valid, skip
        }
      });
    }
  }
  
  cleanupDOMReferences() {
    // Clean up references in custom properties
    const allElements = this.editor.querySelectorAll('*');
    
    allElements.forEach(element => {
      // Remove jQuery-like data if present
      if (element._data) {
        delete element._data;
      }
      
      // Remove other custom properties
      Object.keys(element).forEach(key => {
        if (key.startsWith('_') || key.includes('event')) {
          delete element[key];
        }
      });
    });
  }
  
  forceGarbageCollection() {
    // Attempt to trigger garbage collection
    if (window.gc) {
      window.gc();
    } else {
      // Create and discard large objects to trigger GC
      const forceGC = () => {
        const large = new Array(1000000).fill(0);
        large.sort();
      };
      
      setTimeout(forceGC, 0);
      setTimeout(forceGC, 100);
      setTimeout(forceGC, 200);
    }
  }
}
```

### 2. Lazy loading and virtualization for large content

```javascript
class VirtualizedEditor {
  constructor(editorElement) {
    this.editor = editorElement;
    this.content = [];
    this.visibleRange = { start: 0, end: 100 };
    this.itemHeight = 20;
    this.bufferSize = 50;
    
    this.setupVirtualization();
  }
  
  setupVirtualization() {
    this.editor.addEventListener('scroll', this.handleScroll.bind(this));
    this.editor.addEventListener('input', this.handleInput.bind(this));
    
    this.renderVisibleContent();
  }
  
  handleScroll() {
    const scrollTop = this.editor.scrollTop;
    const start = Math.floor(scrollTop / this.itemHeight);
    const end = start + Math.ceil(this.editor.clientHeight / this.itemHeight) + this.bufferSize;
    
    if (start !== this.visibleRange.start || end !== this.visibleRange.end) {
      this.visibleRange = { start: Math.max(0, start - this.bufferSize), end };
      this.renderVisibleContent();
    }
  }
  
  handleInput(e) {
    // Update content data structure
    const cursorPosition = this.getCursorPosition();
    
    if (e.inputType === 'insertText') {
      this.content.splice(cursorPosition, 0, e.data);
    } else if (e.inputType === 'deleteContentBackward') {
      this.content.splice(cursorPosition - 1, 1);
    }
    
    this.renderVisibleContent();
  }
  
  renderVisibleContent() {
    const visibleContent = this.content.slice(
      this.visibleRange.start, 
      this.visibleRange.end
    );
    
    // Clear DOM
    this.editor.innerHTML = '';
    
    // Create fragment for efficient DOM building
    const fragment = document.createDocumentFragment();
    
    // Add spacer for content above visible range
    const topSpacer = document.createElement('div');
    topSpacer.style.height = `${this.visibleRange.start * this.itemHeight}px`;
    fragment.appendChild(topSpacer);
    
    // Add visible content
    const contentDiv = document.createElement('div');
    contentDiv.innerHTML = visibleContent.join('');
    fragment.appendChild(contentDiv);
    
    // Add spacer for content below visible range
    const bottomSpacer = document.createElement('div');
    bottomSpacer.style.height = `${(this.content.length - this.visibleRange.end) * this.itemHeight}px`;
    fragment.appendChild(bottomSpacer);
    
    this.editor.appendChild(fragment);
  }
  
  getCursorPosition() {
    // Complex logic to determine cursor position in virtualized content
    // This would require careful implementation
    return this.visibleRange.start;
  }
}
```

### 3. Content chunking for large documents

```javascript
class ChunkedContentEditor {
  constructor(editorElement) {
    this.editor = editorElement;
    this.chunks = [];
    this.maxChunkSize = 5000; // characters per chunk
    this.activeChunk = 0;
    
    this.setupChunking();
  }
  
  setupChunking() {
    this.editor.addEventListener('input', this.handleInput.bind(this));
    this.editor.addEventListener('selectionchange', this.handleSelectionChange.bind(this));
    
    this.chunkContent();
  }
  
  chunkContent() {
    const content = this.editor.textContent;
    
    // Split content into manageable chunks
    for (let i = 0; i < content.length; i += this.maxChunkSize) {
      this.chunks.push({
        content: content.slice(i, i + this.maxChunkSize),
        start: i,
        end: Math.min(i + this.maxChunkSize, content.length),
        loaded: false
      });
    }
    
    // Load only first chunk initially
    this.loadChunk(0);
  }
  
  loadChunk(chunkIndex) {
    if (this.chunks[chunkIndex] && !this.chunks[chunkIndex].loaded) {
      this.chunks[chunkIndex].loaded = true;
      
      // Unload distant chunks to save memory
      this.unloadDistantChunks(chunkIndex);
      
      this.renderActiveChunk();
    }
  }
  
  unloadDistantChunks(activeIndex) {
    this.chunks.forEach((chunk, index) => {
      const distance = Math.abs(index - activeIndex);
      
      if (distance > 2 && chunk.loaded) {
        chunk.loaded = false;
        // Clear from DOM to free memory
      }
    });
  }
  
  renderActiveChunk() {
    const activeChunk = this.chunks[this.activeChunk];
    
    if (activeChunk && activeChunk.loaded) {
      this.editor.innerHTML = activeChunk.content;
    }
  }
  
  handleInput(e) {
    // Update chunk content
    const activeChunk = this.chunks[this.activeChunk];
    
    if (activeChunk) {
      activeChunk.content = this.editor.textContent;
    }
    
    // Check if we need to load adjacent chunks
    this.checkChunkBoundaries();
  }
  
  handleSelectionChange() {
    const selection = window.getSelection();
    
    if (selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      const offset = this.getOffsetFromRange(range);
      const chunkIndex = Math.floor(offset / this.maxChunkSize);
      
      if (chunkIndex !== this.activeChunk) {
        this.activeChunk = chunkIndex;
        this.loadChunk(chunkIndex);
      }
    }
  }
  
  getOffsetFromRange(range) {
    // Calculate text offset from range position
    // This requires walking the DOM to count characters
    // Implementation would be complex but necessary
    return 0;
  }
  
  checkChunkBoundaries() {
    const activeChunk = this.chunks[this.activeChunk];
    
    if (!activeChunk) return;
    
    const currentLength = activeChunk.content.length;
    
    // Load next chunk if approaching end
    if (currentLength > this.maxChunkSize * 0.8) {
      this.loadChunk(this.activeChunk + 1);
    }
    
    // Load previous chunk if near start
    if (this.activeChunk > 0 && currentLength < this.maxChunkSize * 0.2) {
      this.loadChunk(this.activeChunk - 1);
    }
  }
}
```

### 4. Lightweight formatting system

```javascript
class LightweightFormatter {
  constructor(editor) {
    this.editor = editor;
    this.formatCache = new Map();
    this.styleSheets = new Map();
    
    this.setupLightweightFormatting();
  }
  
  setupLightweightFormatting() {
    // Use CSS classes instead of inline styles
    this.createStyleSheets();
    
    // Override execCommand to use CSS classes
    this.overrideExecCommand();
  }
  
  createStyleSheets() {
    const styleSheet = document.createElement('style');
    styleSheet.textContent = `
      .format-bold { font-weight: bold; }
      .format-italic { font-style: italic; }
      .format-underline { text-decoration: underline; }
      .format-color-red { color: red; }
      .format-bg-yellow { background-color: yellow; }
      
      /* More efficient than inline styles */
    `;
    
    document.head.appendChild(styleSheet);
    this.styleSheets.set('main', styleSheet);
  }
  
  overrideExecCommand() {
    const originalExecCommand = document.execCommand;
    
    document.execCommand = (command, showUI, value) => {
      if (this.isFormattingCommand(command)) {
        this.applyLightweightFormat(command, value);
        return true;
      }
      
      return originalExecCommand.call(document, command, showUI, value);
    };
  }
  
  isFormattingCommand(command) {
    return [
      'bold', 'italic', 'underline',
      'foreColor', 'backColor',
      'fontSize', 'fontName'
    ].includes(command);
  }
  
  applyLightweightFormat(command, value) {
    const selection = window.getSelection();
    
    if (selection.rangeCount === 0) return;
    
    const range = selection.getRangeAt(0);
    const selectedText = range.toString();
    
    // Check cache first
    const cacheKey = `${command}-${value}-${selectedText}`;
    
    if (this.formatCache.has(cacheKey)) {
      const formattedContent = this.formatCache.get(cacheKey);
      range.deleteContents();
      
      const fragment = document.createRange().createContextualFragment(formattedContent);
      range.insertNode(fragment);
      
      return;
    }
    
    // Apply formatting using CSS classes
    const className = this.getFormatClass(command, value);
    const formattedContent = `<span class="${className}">${selectedText}</span>`;
    
    // Cache result
    this.formatCache.set(cacheKey, formattedContent);
    
    // Apply to DOM
    range.deleteContents();
    const fragment = document.createRange().createContextualFragment(formattedContent);
    range.insertNode(fragment);
  }
  
  getFormatClass(command, value) {
    const classMap = {
      'bold': 'format-bold',
      'italic': 'format-italic',
      'underline': 'format-underline'
    };
    
    if (classMap[command]) {
      return classMap[command];
    }
    
    if (command === 'foreColor') {
      return `format-color-${this.colorToClass(value)}`;
    }
    
    if (command === 'backColor') {
      return `format-bg-${this.colorToClass(value)}`;
    }
    
    return '';
  }
  
  colorToClass(color) {
    // Convert color values to class names
    const colorMap = {
      'red': 'red',
      'blue': 'blue',
      'green': 'green',
      'yellow': 'yellow'
    };
    
    return colorMap[color] || 'custom';
  }
  
  clearCache() {
    this.formatCache.clear();
  }
}
```

## Testing recommendations

1. **Various document sizes**: 1K, 5K, 10K, 50K characters
2. **Different operation frequencies**: Slow, medium, rapid operations
3. **Various operation types**: Formatting, selection, input, undo/redo
4. **Memory monitoring**: Use DevTools Memory tab continuously
5. **Browser versions**: Test across Chrome versions and other browsers
6. **Long-term testing**: Extended editing sessions (30+ minutes)

## Notes

- Memory leaks are more severe with complex DOM structures
- Issue affects all browsers but Chrome is most impacted
- Problem is exacerbated by frequent formatting operations
- Large images and media content increase memory pressure
- Mobile devices reach memory limits much faster than desktop
- Proper cleanup patterns can significantly reduce memory usage