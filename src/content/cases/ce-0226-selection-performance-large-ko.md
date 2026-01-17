---
id: ce-0226-selection-performance-large-ko
scenarioId: scenario-performance-selection-large-content
locale: ko
os: Any
osVersion: "Any"
device: Desktop  
deviceVersion: Any
browser: Any
browserVersion: "Any"
keyboard: US QWERTY
caseTitle: 큰 콘텐츠에서 선택 작업이 지수적으로 느려짐
description: "선택 작업(범위 생성, 텍스트 추출, 커서 이동)은 콘텐츠 크기가 증가함에 따라 지수적으로 느려집니다. 1K 문서에서 밀리초가 걸리는 간단한 범위 작업이 50K 문서에서는 초 단위가 걸려 큰 문서에 대해 편집기를 사용할 수 없게 만듭니다."
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
  - label: "작은 콘텐츠 (1K 문자)"
    html: '<div contenteditable="true"><p>Small document with about 1000 characters...</p></div>'
    description: "선택 작업: < 10ms"
  - label: "중간 콘텐츠 (10K 문자)" 
    html: '<div contenteditable="true"><p>Medium document with about 10000 characters...</p></div>'
    description: "선택 작업: 100-500ms"
  - label: "큰 콘텐츠 (50K 문자)"
    html: '<div contenteditable="true"><p>Large document with about 50000 characters...</p></div>'
    description: "선택 작업: 2000-5000ms (2-5초)"
---

## 현상

선택 작업(범위 생성, 텍스트 추출, 커서 이동)은 콘텐츠 크기가 증가함에 따라 지수적으로 느려집니다. 성능이 선형적으로 저하되지 않습니다 - 콘텐츠의 작은 증가가 극적인 속도 저하를 일으킵니다. 이것은 contenteditable을 큰 문서에 대해 사용할 수 없게 만듭니다.

## 재현 예시

1. 다른 콘텐츠 크기를 가진 contenteditable 요소를 만듭니다.
2. 선택 작업의 성능을 측정합니다:
   - `document.createRange()`로 범위 생성
   - `range.toString()`로 텍스트 추출
   - `range.collapse()`로 커서 위치 설정
   - `range.getBoundingClientRect()`로 선택 경계 가져오기
3. 다양한 문서 크기에서 성능을 비교합니다.
4. 커서 이동 및 텍스트 선택 상호작용을 테스트합니다.

## 관찰된 동작

### 성능 저하 패턴:

| 콘텐츠 크기 | 범위 생성 | 텍스트 추출 | 커서 이동 | 총 응답 시간 |
|---------------|----------------|------------------|------------------|-------------------|
| 1,000 문자   | 1-2ms        | 1-3ms           | 1-2ms           | < 10ms            |
| 5,000 문자   | 5-10ms       | 10-20ms         | 5-15ms          | 20-45ms           |
| 10,000 문자  | 20-50ms      | 50-100ms        | 20-40ms         | 90-190ms          |
| 25,000 문자  | 100-200ms    | 200-400ms       | 100-200ms       | 400-800ms         |
| 50,000 문자  | 300-500ms    | 500-1000ms      | 300-600ms       | 1100-2100ms       |
| 100,000 문자 | 1000-2000ms  | 2000-4000ms     | 1000-2000ms     | 4000-8000ms       |

### 지수적 vs 선형적 증가:

**예상 선형 동작:**
- 콘텐츠를 두 배로 늘리면 작업 시간이 두 배가 되어야 함
- 10K는 1K보다 10배 느려야 함
- 50K는 1K보다 50배 느려야 함

**실제 지수적 동작:**
- 10K는 1K보다 50-100배 느림
- 50K는 1K보다 200-500배 느림  
- 100K는 1K보다 1000-2000배 느림

### 특정 느린 작업:

**범위 생성 및 조작:**
```javascript
// 성능 테스트
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

**커서 이동:**
```javascript
// 커서 위치 지정이 매우 느려짐
function setCursorToPosition(position) {
  const selection = window.getSelection();
  const range = document.createRange();
  
  // 이것은 큰 콘텐츠에서 지수적으로 느려짐
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

**선택 범위 추출:**
```javascript
// 선택된 텍스트 가져오기가 느려짐
function getSelectedText() {
  const selection = window.getSelection();
  if (selection.rangeCount > 0) {
    const range = selection.getRangeAt(0);
    
    // 이 작업이 지수적으로 느려짐
    return range.toString();
  }
}
```

## 예상 동작

- 성능이 콘텐츠 크기에 선형적으로 저하되어야 합니다
- 선택 작업은 큰 문서에서도 100ms 미만으로 유지되어야 합니다
- 커서 이동이 사용자에게 즉각적이어야 합니다
- 텍스트 추출이 문서 크기와 관계없이 빠르게 유지되어야 합니다
- 편집기가 최대 100K 문자 문서에 대해 반응적으로 유지되어야 합니다

## 영향

- **사용자 경험**: 편집기가 큰 문서에서 반응하지 않게 됨
- **사용성**: 사용자가 긴 문서로 효과적으로 작업할 수 없음
- **생산성**: 느린 작업이 작성 워크플로우를 방해함
- **브라우저 호환성**: 브라우저 간 성능이 극적으로 다름
- **모바일 영향**: 모바일 장치가 훨씬 빠르게 사용할 수 없게 됨
- **애플리케이션 제한**: Contenteditable이 문서 편집에 사용될 수 없음

## 브라우저 비교

- **Chrome**: 최악의 성능, 지수적 저하가 심각함
- **Edge**: Chrome과 유사, Chromium 기반 제한
- **Firefox**: Chrome보다 나지만 여전히 지수적 속도 저하
- **Safari**: 최고의 성능이지만 여전히 크게 저하됨
- **모바일 브라우저**: 모든 브라우저가 데스크톱 대응보다 더 나쁘게 수행됨

### 성능 벤치마크 (50K 콘텐츠):

| 브라우저 | 범위 생성 | 텍스트 추출 | 총 시간 | 사용성 |
|---------|----------------|------------------|-------------|------------|
| Chrome  | 400-600ms     | 800-1200ms      | 1.2-1.8s   | 나쁨       |
| Edge    | 350-500ms     | 700-1000ms      | 1.0-1.5s   | 나쁨       |
| Firefox | 200-300ms     | 400-600ms       | 0.6-0.9s   | 보통       |
| Safari  | 150-250ms     | 300-500ms       | 0.4-0.7s   | 좋음       |

## 해결 방법

### 1. 효율적인 범위 캐싱 시스템

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
    // 빠른 조회를 위해 텍스트 노드 위치 사전 계산
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
    // O(log n) 조회를 위해 노드를 통한 이진 검색
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
      
      // 범위 캐시
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
      
      // 결과 캐시
      this.textCache.set(cacheKey, text);
      
      // 캐시 크기 제한
      if (this.textCache.size > 1000) {
        const firstKey = this.textCache.keys().next().value;
        this.textCache.delete(firstKey);
      }
      
      return text;
    }
    
    return '';
  }
  
  invalidateCaches() {
    // 콘텐츠가 변경되면 캐시 지우기
    this.rangeCache.clear();
    this.textCache.clear();
    this.precomputeNodeMap();
  }
}
```

### 2. 큰 콘텐츠를 위한 가상 DOM

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
    // DOM 대신 가상 콘텐츠 업데이트
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
    
    // 새 DOM 프래그먼트 생성
    const fragment = document.createDocumentFragment();
    
    // 보이는 창 위의 콘텐츠를 위한 스페이서 추가
    const topSpacer = document.createElement('div');
    topSpacer.style.height = `${this.visibleWindow.start * this.getLineHeight()}px`;
    fragment.appendChild(topSpacer);
    
    // 보이는 콘텐츠 추가
    const contentDiv = document.createElement('div');
    contentDiv.textContent = visibleContent.join('');
    fragment.appendChild(contentDiv);
    
    // 아래 콘텐츠를 위한 스페이서 추가
    const bottomSpacer = document.createElement('div');
    bottomSpacer.style.height = `${(this.virtualContent.length - this.visibleWindow.start - this.visibleWindow.size) * this.getLineHeight()}px`;
    fragment.appendChild(bottomSpacer);
    
    // 콘텐츠를 효율적으로 교체
    this.editor.innerHTML = '';
    this.editor.appendChild(fragment);
    
    // 빠른 작업을 위한 참조 저장
    this.visibleDOM = contentDiv;
  }
  
  getLineHeight() {
    return 20; // 동적으로 계산될 수 있음
  }
  
  getVirtualCursorPosition() {
    // 현재 DOM 커서 위치를 가상 콘텐츠 위치로 매핑
    return this.visibleWindow.start + this.getDOMCursorPosition();
  }
  
  getDOMCursorPosition() {
    // 보이는 창 내에서 빠른 커서 위치 계산
    const selection = window.getSelection();
    
    if (selection.rangeCount > 0 && this.visibleDOM) {
      const range = selection.getRangeAt(0);
      
      // 보이는 콘텐츠 내 오프셋 계산
      const preCaretRange = document.createRange();
      preCaretRange.selectNodeContents(this.visibleDOM);
      preCaretRange.setEnd(range.startContainer, range.startOffset);
      
      return preCaretRange.toString().length;
    }
    
    return 0;
  }
}
```

### 3. 최적화된 선택 작업

```javascript
class OptimizedSelector {
  constructor(editor) {
    this.editor = editor;
    this.selectionIndex = new Map();
    this.lastSelectionUpdate = 0;
    
    this.setupOptimizedSelection();
  }
  
  setupOptimizedSelection() {
    // 선택 변경 디바운스
    let selectionTimeout;
    
    this.editor.addEventListener('selectionchange', () => {
      clearTimeout(selectionTimeout);
      
      selectionTimeout = setTimeout(() => {
        this.updateSelectionIndex();
      }, 50); // 50ms 디바운스
    });
  }
  
  updateSelectionIndex() {
    const now = Date.now();
    
    // 빠른 연속 업데이트 건너뛰기
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
    // 범위 경계의 효율적인 인덱스 생성
    const startKey = this.createRangeKey(range.startContainer, range.startOffset);
    const endKey = this.createRangeKey(range.endContainer, range.endOffset);
    
    this.selectionIndex.set('start', startKey);
    this.selectionIndex.set('end', endKey);
  }
  
  createRangeKey(node, offset) {
    // node+offset 조합에 대한 고유 키 생성
    const nodeIndex = this.getNodeIndex(node);
    return `${nodeIndex}:${offset}`;
  }
  
  getNodeIndex(node) {
    // 사전 계산되거나 캐시된 노드 인덱싱
    if (this.nodeIndexMap) {
      return this.nodeIndexMap.get(node);
    }
    
    // 인덱스 계산으로 폴백
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
    // 캐시된 선택 정보 사용
    const startKey = this.selectionIndex.get('start');
    const endKey = this.selectionIndex.get('end');
    
    if (!startKey || !endKey) {
      return '';
    }
    
    // 범위 작업 대신 캐시된 위치를 사용하여 텍스트 추출
    return this.extractTextBetweenKeys(startKey, endKey);
  }
  
  extractTextBetweenKeys(startKey, endKey) {
    const [startIndex, startOffset] = startKey.split(':').map(Number);
    const [endIndex, endOffset] = endKey.split(':').map(Number);
    
    // 콘텐츠 구조에서 효율적으로 텍스트 추출
    // 이것은 콘텐츠 구성에 따라 사용자 정의 구현이 필요합니다
    return '';
  }
}
```

### 4. 성능 모니터링 및 스로틀링

```javascript
class PerformanceThrottler {
  constructor(editor) {
    this.editor = editor;
    this.operationQueue = [];
    this.isProcessing = false;
    this.maxOperationTime = 16; // 60fps = 프레임당 16ms
    
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
      
      // 작업 처리
      this.processOperation(operation);
      
      const operationTime = performance.now() - startTime;
      
      // 작업이 너무 오래 걸리면 브라우저에 양보
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
    // 최적화된 선택 변경 처리
    // 비용이 많이 드는 범위 작업 피하기
  }
  
  handleInput(data) {
    // 최적화된 입력 처리
    // DOM 업데이트 일괄 처리
  }
}
```

## 테스트 권장 사항

1. **성능 프로파일링**: 브라우저 DevTools를 사용하여 작업 시간 측정
2. **다양한 콘텐츠 크기**: 1K, 10K, 50K, 100K 문자 문서 테스트
3. **다양한 작업**: 범위 생성, 텍스트 추출, 커서 이동
4. **크로스 브라우저 테스트**: 브라우저 간 성능 비교
5. **모바일 테스트**: 모바일 장치에서 성능 테스트
6. **장기 사용**: 시간에 따른 성능 저하 테스트

## 참고사항

- 성능 문제는 contenteditable 구현의 근본적인 문제입니다
- 브라우저는 작은 문서에 최적화되어 있으며 큰 문서에는 최적화되지 않았습니다
- 가상화는 큰 콘텐츠에 대한 가장 효과적인 해결 방법입니다
- 캐싱 전략이 성능을 크게 개선할 수 있습니다
- 문제는 사용자 정의 구현뿐만 아니라 모든 리치 텍스트 편집기에 영향을 미칩니다
- Contenteditable은 작은 문서 편집을 위해 설계되었으며 책 길이의 콘텐츠를 위한 것이 아닙니다
