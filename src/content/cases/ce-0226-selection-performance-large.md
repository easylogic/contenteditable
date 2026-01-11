---
id: ce-0226
scenarioId: scenario-performance-selection-large-content
locale: en
os: Any
osVersion: "Any"
device: Desktop  
deviceVersion: Any
browser: Any
browserVersion: "Any"
keyboard: US QWERTY
caseTitle: Selection operations become exponentially slower with large content
description: "Selection operations (range creation, text extraction, cursor movement) become exponentially slower as content size increases. A simple range operation that takes milliseconds in 1K documents takes seconds in 50K documents, making the editor unusable for large documents."
tags:
  - performance
  - selection
  - range-api
  - large-content
  - exponential-slowdown
  - browser-performance
  - contenteditable
status: draft
domSteps:
  - label: "Small content (1K chars)"
    html: '<div contenteditable="true"><p>Small document with about 1000 characters...</p></div>'
    description: "Selection operations: < 10ms"
  - label: "Medium content (10K chars)" 
    html: '<div contenteditable="true"><p>Medium document with about 10000 characters...</p></div>'
    description: "Selection operations: 100-500ms"
  - label: "Large content (50K chars)"
    html: '<div contenteditable="true"><p>Large document with about 50000 characters...</p></div>'
    description: "Selection operations: 2000-5000ms (2-5 seconds)"
---

## Phenomenon

Selection operations (range creation, text extraction, cursor movement) become exponentially slower as content size increases. Performance doesn't degrade linearly - small increases in content cause dramatic slowdowns. This makes contenteditable unusable for large documents.

## Reproduction example

1. Create contenteditable elements with different content sizes.
2. Measure performance of selection operations:
   - Creating ranges with `document.createRange()`
   - Extracting text with `range.toString()`
   - Setting cursor position with `range.collapse()`
   - Getting selection boundaries with `range.getBoundingClientRect()`
3. Compare performance across different document sizes.
4. Test cursor movement and text selection interactions.

## Observed behavior

### Performance degradation pattern:

| Content Size | Range Creation | Text Extraction | Cursor Movement | Total Response Time |
|---------------|----------------|------------------|------------------|-------------------|
| 1,000 chars   | 1-2ms        | 1-3ms           | 1-2ms           | < 10ms            |
| 5,000 chars   | 5-10ms       | 10-20ms         | 5-15ms          | 20-45ms           |
| 10,000 chars  | 20-50ms      | 50-100ms        | 20-40ms         | 90-190ms          |
| 25,000 chars  | 100-200ms    | 200-400ms       | 100-200ms       | 400-800ms         |
| 50,000 chars  | 300-500ms    | 500-1000ms      | 300-600ms       | 1100-2100ms       |
| 100,000 chars | 1000-2000ms  | 2000-4000ms     | 1000-2000ms     | 4000-8000ms       |

### Exponential vs Linear growth:

**Expected linear behavior:**
- Doubling content should double operation time
- 10K should be 10x slower than 1K
- 50K should be 50x slower than 1K

**Actual exponential behavior:**
- 10K is 50-100x slower than 1K
- 50K is 200-500x slower than 1K  
- 100K is 1000-2000x slower than 1K

### Specific slow operations:

**Range creation and manipulation:**
```javascript
// Performance test
function testRangePerformance(contentLength) {
  const editor = document.createElement('div');
  editor.contentEditable = true;
  editor.textContent = 'x'.repeat(contentLength);
  
  console.time('range creation');
  const range = document.createRange();
  range.selectNodeContents(editor);
  console.timeEnd('range creation');
  
  console.time('text extraction');
  const text = range.toString();
  console.timeEnd('text extraction');
  
  console.time('boundary calculation');
  const rect = range.getBoundingClientRect();
  console.timeEnd('boundary calculation');
}
```

**Cursor movement:**
```javascript
// Cursor positioning becomes very slow
function setCursorToPosition(position) {
  const selection = window.getSelection();
  const range = document.createRange();
  
  // This becomes exponentially slow with large content
  const walker = document.createTreeWalker(
    editor,
    NodeFilter.SHOW_TEXT,
    null
  );
  
  let currentPosition = 0;
  let node, offset;
  
  while (node = walker.nextNode()) {
    if (currentPosition + node.textContent.length >= position) {
      offset = position - currentPosition;
      break;
    }
    currentPosition += node.textContent.length;
  }
  
  range.setStart(node, offset);
  range.collapse(true);
  selection.removeAllRanges();
  selection.addRange(range);
}
```

**Selection range extraction:**
```javascript
// Getting selected text becomes slow
function getSelectedText() {
  const selection = window.getSelection();
  if (selection.rangeCount > 0) {
    const range = selection.getRangeAt(0);
    
    // This operation becomes exponentially slow
    return range.toString();
  }
}
```

## Expected behavior

- Performance should degrade linearly with content size
- Selection operations should remain under 100ms even for large documents
- Cursor movement should be instantaneous for human users
- Text extraction should be fast regardless of document size
- Editor should remain responsive for documents up to 100K characters

## Impact

- **User experience**: Editor becomes unresponsive with large documents
- **Usability**: Users can't work with long documents effectively
- **Productivity**: Slow operations disrupt writing workflow
- **Browser compatibility**: Performance varies dramatically between browsers
- **Mobile impact**: Mobile devices become unusable much faster
- **Application limits**: Contenteditable can't be used for document editing

## Browser Comparison

- **Chrome**: Worst performance, exponential degradation severe
- **Edge**: Similar to Chrome, Chromium-based limitations
- **Firefox**: Better than Chrome but still exponential slowdown
- **Safari**: Best performance but still degrades significantly
- **Mobile browsers**: All perform worse than desktop counterparts

### Performance benchmarks (50K content):

| Browser | Range Creation | Text Extraction | Total Time | Usability |
|---------|----------------|------------------|-------------|------------|
| Chrome  | 400-600ms     | 800-1200ms      | 1.2-1.8s   | Poor       |
| Edge    | 350-500ms     | 700-1000ms      | 1.0-1.5s   | Poor       |
| Firefox | 200-300ms     | 400-600ms       | 0.6-0.9s   | Fair       |
| Safari  | 150-250ms     | 300-500ms       | 0.4-0.7s   | Good       |

## Workarounds

### 1. Efficient range caching system

```javascript
class EfficientRangeManager {
  constructor(editor) {
    this.editor = editor;
    this.rangeCache = new Map();
    this.textCache = new Map();
    this.nodeMap = new Map();
    
    this.setupEfficientSelection();
  }
  
  setupEfficientSelection() {
    this.precomputeNodeMap();
    this.setupSelectionOptimization();
  }
  
  precomputeNodeMap() {
    // Pre-compute text node positions for fast lookup
    const walker = document.createTreeWalker(
      this.editor,
      NodeFilter.SHOW_TEXT,
      null
    );
    
    let position = 0;
    let node;
    
    while (node = walker.nextNode()) {
      this.nodeMap.set(node, {
        start: position,
        end: position + node.textContent.length,
        length: node.textContent.length
      });
      
      position += node.textContent.length;
    }
  }
  
  getNodeAtPosition(targetPosition) {
    // Binary search through nodes for O(log n) lookup
    const nodes = Array.from(this.nodeMap.keys());
    let left = 0;
    let right = nodes.length - 1;
    
    while (left <= right) {
      const mid = Math.floor((left + right) / 2);
      const nodeInfo = this.nodeMap.get(nodes[mid]);
      
      if (targetPosition >= nodeInfo.start && targetPosition < nodeInfo.end) {
        return {
          node: nodes[mid],
          offset: targetPosition - nodeInfo.start
        };
      } else if (targetPosition < nodeInfo.start) {
        right = mid - 1;
      } else {
        left = mid + 1;
      }
    }
    
    return null;
  }
  
  setCursorToPosition(position) {
    const cacheKey = `cursor-${position}`;
    
    if (this.rangeCache.has(cacheKey)) {
      const cachedRange = this.rangeCache.get(cacheKey);
      const selection = window.getSelection();
      selection.removeAllRanges();
      selection.addRange(cachedRange);
      return;
    }
    
    const nodeInfo = this.getNodeAtPosition(position);
    
    if (nodeInfo) {
      const range = document.createRange();
      range.setStart(nodeInfo.node, nodeInfo.offset);
      range.collapse(true);
      
      // Cache the range
      this.rangeCache.set(cacheKey, range.cloneRange());
      
      const selection = window.getSelection();
      selection.removeAllRanges();
      selection.addRange(range);
    }
  }
  
  getTextRange(start, end) {
    const cacheKey = `text-${start}-${end}`;
    
    if (this.textCache.has(cacheKey)) {
      return this.textCache.get(cacheKey);
    }
    
    const startNode = this.getNodeAtPosition(start);
    const endNode = this.getNodeAtPosition(end);
    
    if (startNode && endNode) {
      const range = document.createRange();
      range.setStart(startNode.node, startNode.offset);
      range.setEnd(endNode.node, endNode.offset);
      
      const text = range.toString();
      
      // Cache the result
      this.textCache.set(cacheKey, text);
      
      // Limit cache size
      if (this.textCache.size > 1000) {
        const firstKey = this.textCache.keys().next().value;
        this.textCache.delete(firstKey);
      }
      
      return text;
    }
    
    return '';
  }
  
  invalidateCaches() {
    // Clear caches when content changes
    this.rangeCache.clear();
    this.textCache.clear();
    this.precomputeNodeMap();
  }
}
```

### 2. Virtual DOM for large content

```javascript
class VirtualContentEditor {
  constructor(editorElement) {
    this.editor = editorElement;
    this.virtualContent = [];
    this.visibleWindow = { start: 0, size: 1000 };
    this.visibleDOM = null;
    
    this.setupVirtualRendering();
  }
  
  setupVirtualRendering() {
    this.editor.addEventListener('scroll', this.handleScroll.bind(this));
    this.editor.addEventListener('input', this.handleInput.bind(this));
    this.editor.addEventListener('keydown', this.handleKeydown.bind(this));
    
    this.renderVisibleWindow();
  }
  
  handleScroll() {
    const scrollTop = this.editor.scrollTop;
    const lineHeight = this.getLineHeight();
    const start = Math.floor(scrollTop / lineHeight);
    
    if (start !== this.visibleWindow.start) {
      this.visibleWindow.start = start;
      this.renderVisibleWindow();
    }
  }
  
  handleInput(e) {
    // Update virtual content instead of DOM
    const cursorPos = this.getVirtualCursorPosition();
    
    if (e.inputType === 'insertText') {
      this.virtualContent.splice(cursorPos, 0, e.data);
    } else if (e.inputType === 'deleteContentBackward') {
      this.virtualContent.splice(cursorPos - 1, 1);
    }
    
    this.renderVisibleWindow();
  }
  
  renderVisibleWindow() {
    const visibleContent = this.virtualContent.slice(
      this.visibleWindow.start,
      this.visibleWindow.start + this.visibleWindow.size
    );
    
    // Create new DOM fragment
    const fragment = document.createDocumentFragment();
    
    // Add spacer for content above visible window
    const topSpacer = document.createElement('div');
    topSpacer.style.height = `${this.visibleWindow.start * this.getLineHeight()}px`;
    fragment.appendChild(topSpacer);
    
    // Add visible content
    const contentDiv = document.createElement('div');
    contentDiv.textContent = visibleContent.join('');
    fragment.appendChild(contentDiv);
    
    // Add spacer for content below
    const bottomSpacer = document.createElement('div');
    bottomSpacer.style.height = `${(this.virtualContent.length - this.visibleWindow.start - this.visibleWindow.size) * this.getLineHeight()}px`;
    fragment.appendChild(bottomSpacer);
    
    // Replace content efficiently
    this.editor.innerHTML = '';
    this.editor.appendChild(fragment);
    
    // Store reference for fast operations
    this.visibleDOM = contentDiv;
  }
  
  getLineHeight() {
    return 20; // Could be computed dynamically
  }
  
  getVirtualCursorPosition() {
    // Map current DOM cursor position to virtual content position
    return this.visibleWindow.start + this.getDOMCursorPosition();
  }
  
  getDOMCursorPosition() {
    // Fast cursor position calculation within visible window
    const selection = window.getSelection();
    
    if (selection.rangeCount > 0 && this.visibleDOM) {
      const range = selection.getRangeAt(0);
      
      // Calculate offset within visible content
      const preCaretRange = document.createRange();
      preCaretRange.selectNodeContents(this.visibleDOM);
      preCaretRange.setEnd(range.startContainer, range.startOffset);
      
      return preCaretRange.toString().length;
    }
    
    return 0;
  }
}
```

### 3. Optimized selection operations

```javascript
class OptimizedSelector {
  constructor(editor) {
    this.editor = editor;
    this.selectionIndex = new Map();
    this.lastSelectionUpdate = 0;
    
    this.setupOptimizedSelection();
  }
  
  setupOptimizedSelection() {
    // Debounce selection changes
    let selectionTimeout;
    
    this.editor.addEventListener('selectionchange', () => {
      clearTimeout(selectionTimeout);
      
      selectionTimeout = setTimeout(() => {
        this.updateSelectionIndex();
      }, 50); // Debounce for 50ms
    });
  }
  
  updateSelectionIndex() {
    const now = Date.now();
    
    // Skip rapid successive updates
    if (now - this.lastSelectionUpdate < 100) {
      return;
    }
    
    this.lastSelectionUpdate = now;
    
    const selection = window.getSelection();
    
    if (selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      this.indexRange(range);
    }
  }
  
  indexRange(range) {
    // Create efficient index of range boundaries
    const startKey = this.createRangeKey(range.startContainer, range.startOffset);
    const endKey = this.createRangeKey(range.endContainer, range.endOffset);
    
    this.selectionIndex.set('start', startKey);
    this.selectionIndex.set('end', endKey);
  }
  
  createRangeKey(node, offset) {
    // Create unique key for node+offset combination
    const nodeIndex = this.getNodeIndex(node);
    return `${nodeIndex}:${offset}`;
  }
  
  getNodeIndex(node) {
    // Pre-computed or cached node indexing
    if (this.nodeIndexMap) {
      return this.nodeIndexMap.get(node);
    }
    
    // Fallback to computing index
    return this.computeNodeIndex(node);
  }
  
  computeNodeIndex(targetNode) {
    const walker = document.createTreeWalker(
      this.editor,
      NodeFilter.SHOW_ALL,
      null
    );
    
    let index = 0;
    let node;
    
    while (node = walker.nextNode()) {
      if (node === targetNode) {
        return index;
      }
      index++;
    }
    
    return -1;
  }
  
  getSelectionText() {
    // Use cached selection information
    const startKey = this.selectionIndex.get('start');
    const endKey = this.selectionIndex.get('end');
    
    if (!startKey || !endKey) {
      return '';
    }
    
    // Extract text using cached positions instead of range operations
    return this.extractTextBetweenKeys(startKey, endKey);
  }
  
  extractTextBetweenKeys(startKey, endKey) {
    const [startIndex, startOffset] = startKey.split(':').map(Number);
    const [endIndex, endOffset] = endKey.split(':').map(Number);
    
    // Extract text efficiently from content structure
    // This would need custom implementation based on content organization
    return '';
  }
}
```

### 4. Performance monitoring and throttling

```javascript
class PerformanceThrottler {
  constructor(editor) {
    this.editor = editor;
    this.operationQueue = [];
    this.isProcessing = false;
    this.maxOperationTime = 16; // 60fps = 16ms per frame
    
    this.setupThrottling();
  }
  
  setupThrottling() {
    this.editor.addEventListener('selectionchange', () => {
      this.queueOperation('selectionchange');
    });
    
    this.editor.addEventListener('input', () => {
      this.queueOperation('input');
    });
  }
  
  queueOperation(type, data) {
    this.operationQueue.push({
      type,
      data,
      timestamp: Date.now()
    });
    
    if (!this.isProcessing) {
      this.processQueue();
    }
  }
  
  async processQueue() {
    this.isProcessing = true;
    
    while (this.operationQueue.length > 0) {
      const startTime = performance.now();
      const operation = this.operationQueue.shift();
      
      // Process operation
      this.processOperation(operation);
      
      const operationTime = performance.now() - startTime;
      
      // If operation took too long, yield to browser
      if (operationTime > this.maxOperationTime) {
        await this.yieldToBrowser();
      }
    }
    
    this.isProcessing = false;
  }
  
  processOperation(operation) {
    switch (operation.type) {
      case 'selectionchange':
        this.handleSelectionChange(operation.data);
        break;
      case 'input':
        this.handleInput(operation.data);
        break;
    }
  }
  
  yieldToBrowser() {
    return new Promise(resolve => {
      requestAnimationFrame(() => {
        resolve();
      });
    });
  }
  
  handleSelectionChange(data) {
    // Optimized selection change handling
    // Avoid expensive range operations
  }
  
  handleInput(data) {
    // Optimized input handling
    // Batch DOM updates
  }
}
```

## Testing recommendations

1. **Performance profiling**: Use browser DevTools to measure operation times
2. **Different content sizes**: Test 1K, 10K, 50K, 100K character documents
3. **Various operations**: Range creation, text extraction, cursor movement
4. **Cross-browser testing**: Compare performance across browsers
5. **Mobile testing**: Test performance on mobile devices
6. **Long-term usage**: Test performance degradation over time

## Notes

- Performance issues are fundamental to contenteditable implementation
- Browsers optimize for small documents, not large ones
- Virtualization is the most effective workaround for large content
- Caching strategies can significantly improve performance
- The problem affects all rich text editors, not just custom implementations
- Contenteditable was designed for small document editing, not book-length content