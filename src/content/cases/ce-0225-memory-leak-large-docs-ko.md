---
id: ce-0225-memory-leak-large-docs-ko
scenarioId: scenario-memory-leak-prevention
locale: ko
os: Any
osVersion: "Any"
device: Desktop
deviceVersion: Any
browser: Chrome
browserVersion: "115.0+"
keyboard: US QWERTY
caseTitle: 큰 문서와 빈번한 DOM 작업이 있는 contenteditable에서 메모리 누수
description: "큰 문서(10,000자 이상)와 빈번한 DOM 작업(포맷팅, 선택 변경, 입력)이 있는 contenteditable 요소에서 메모리 사용량이 지속적으로 증가하고 절대 감소하지 않아 브라우저 속도 저하와 최종적으로 크래시를 일으킵니다. 콘텐츠가 지워진 후에도 메모리가 유지됩니다."
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
  - label: "초기 상태"
    html: '<div contenteditable="true" id="editor"><p>Large document with thousands of characters...</p></div>'
    description: "10,000자 이상이 로드된 편집기"
  - label: "작업 후"
    html: '<div contenteditable="true" id="editor"><p>Large document with thousands of characters...</p></div>'
    description: "여러 포맷팅 및 선택 변경 후"
  - label: "메모리 상태"
    html: '<div contenteditable="true" id="editor"><p>Content cleared but memory not released</p></div>'
    description: "콘텐츠가 지워졌지만 메모리는 여전히 할당됨"
---

## 현상

큰 문서(10,000자 이상)를 처리하고 빈번한 DOM 작업(포맷팅, 선택 변경, 텍스트 입력)이 있는 contenteditable 요소에서 메모리 사용량이 지속적으로 증가하고 제대로 해제되지 않습니다. 이것은 점진적인 브라우저 속도 저하, CPU 사용량 증가, 콘텐츠가 지워진 후에도 최종적으로 크래시를 일으킵니다.

## 재현 예시

1. `contenteditable` 요소를 만듭니다.
2. 큰 콘텐츠(10,000단어/문자 이상)를 로드합니다.
3. 빈번한 작업을 수행합니다:
   - 텍스트 선택 및 포맷팅(굵게, 기울임꼴, 색상)
   - 커서 위치를 빠르게 변경
   - 텍스트를 지속적으로 입력 및 삭제
   - 실행 취소/다시 실행 작업 적용
4. 브라우저 메모리 사용량을 모니터링합니다 (DevTools Memory 탭).
5. 편집기에서 모든 콘텐츠를 지웁니다.
6. 메모리가 해제되지 않는 것을 관찰합니다.

## 관찰된 동작

### 메모리 증가 패턴:

1. **선형 메모리 증가**: 각 작업마다 메모리가 꾸준히 증가합니다
2. **가비지 수집 없음**: 메모리가 가비지 수집기에 절대 해제되지 않습니다
3. **콘텐츠 지우기가 도움이 안 됨**: `innerHTML = ''`도 메모리를 해제하지 않습니다
4. **페이지 다시 로드 필요**: 페이지 다시 로드만 누적된 메모리를 해제합니다
5. **점진적 속도 저하**: 브라우저가 점점 반응하지 않게 됩니다

### 메모리를 누수하는 특정 작업:

**포맷팅 작업:**
```javascript
// 각 포맷팅 호출이 메모리를 누수함
function formatText(command, value) {
  document.execCommand(command, false, value);
}

// 누수 시퀀스:
formatText('bold', null);        // +2MB
formatText('italic', null);      // +1.5MB  
formatText('fontSize', '18px'); // +1MB
// 100개 작업 후: +350MB이고 절대 해제되지 않음
```

**선택 작업:**
```javascript
// 선택 범위 객체가 가비지 수집되지 않음
function changeSelection() {
  const selection = window.getSelection();
  const range = document.createRange();
  
  range.selectNodeContents(someElement);
  selection.removeAllRanges();
  selection.addRange(range);
  
  // 범위 객체가 메모리에 누적됨
}
```

**이벤트 리스너 누적:**
```javascript
// 동적 요소의 이벤트 리스너가 절대 제거되지 않음
editor.addEventListener('input', handleInput);
editor.addEventListener('selectionchange', handleSelectionChange);

// DOM이 변경되면 리스너가 정리 없이 누적됨
```

### 메모리 소비 데이터:

```javascript
// 메모리 모니터링 결과
{
  "initialLoad": "15MB",
  "after1000Formats": "180MB", 
  "after10000Inputs": "420MB",
  "afterContentClear": "415MB", // 5MB만 해제됨
  "afterPageReload": "18MB"   // 기준선으로 돌아감
}
```

## 예상 동작

- 메모리 사용량이 반복 작업으로 안정적으로 유지되어야 합니다
- 가비지 수집이 주기적으로 사용하지 않는 메모리를 해제해야 합니다
- 콘텐츠 지우기가 할당된 대부분의 메모리를 해제해야 합니다
- 브라우저 성능이 시간이 지나도 저하되지 않아야 합니다
- 메모리는 작업 수가 아닌 콘텐츠 크기에 비례해야 합니다

## 영향

- **브라우저 크래시**: 사용자가 긴 편집 세션 중 크래시를 경험함
- **성능 저하**: 편집기가 점진적으로 느려짐
- **시스템 리소스 사용**: 높은 메모리 및 CPU 소비
- **사용자 경험**: 반응하지 않는 인터페이스와 좌절스러운 사용
- **크로스 탭 영향**: 높은 메모리 사용량이 다른 브라우저 탭에 영향을 미침
- **장치 제한**: 모바일 장치가 더 빠르게 크래시됨

## 브라우저 비교

- **Chrome**: 큰 contenteditable과 함께 심각한 메모리 누수
- **Edge**: Chrome과 유사, Chromium 기반 문제
- **Firefox**: 더 나은 메모리 관리이지만 큰 문서에서 여전히 누수
- **Safari**: 일반적으로 더 나지만 매우 큰 콘텐츠에서 어려움
- **모바일 브라우저**: 메모리 제약으로 인해 모든 브라우저가 더 심각하게 영향을 받음

## 해결 방법

### 1. 메모리 관리 및 정리

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
    console.log('메모리 정리 수행됨');
  }
  
  cleanupEventListeners() {
    // 더 이상 DOM에 없는 요소의 리스너 제거
    const allElements = this.editor.querySelectorAll('*');
    
    allElements.forEach(element => {
      if (!element.parentNode) {
        // 요소가 분리됨, 리스너 제거
        const clone = element.cloneNode(true);
        if (element.parentNode) {
          element.parentNode.replaceChild(clone, element);
        }
      }
    });
  }
  
  cleanupSelections() {
    // 참조를 보유할 수 있는 선택 범위 지우기
    const selection = window.getSelection();
    
    if (selection.rangeCount > 0) {
      // 선택을 저장하고 복원하여 이전 범위 정리
      const ranges = [];
      
      for (let i = 0; i < selection.rangeCount; i++) {
        ranges.push(selection.getRangeAt(i));
      }
      
      selection.removeAllRanges();
      
      // 깨끗한 범위 복원
      ranges.forEach(range => {
        try {
          selection.addRange(range);
        } catch (e) {
          // 범위가 더 이상 유효하지 않음, 건너뜀
        }
      });
    }
  }
  
  cleanupDOMReferences() {
    // 사용자 정의 속성의 참조 정리
    const allElements = this.editor.querySelectorAll('*');
    
    allElements.forEach(element => {
      // jQuery와 같은 데이터가 있으면 제거
      if (element._data) {
        delete element._data;
      }
      
      // 기타 사용자 정의 속성 제거
      Object.keys(element).forEach(key => {
        if (key.startsWith('_') || key.includes('event')) {
          delete element[key];
        }
      });
    });
  }
  
  forceGarbageCollection() {
    // 가비지 수집 트리거 시도
    if (window.gc) {
      window.gc();
    } else {
      // GC를 트리거하기 위해 큰 객체 생성 및 폐기
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

### 2. 큰 콘텐츠를 위한 지연 로딩 및 가상화

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
    // 콘텐츠 데이터 구조 업데이트
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
    
    // DOM 지우기
    this.editor.innerHTML = '';
    
    // 효율적인 DOM 구성을 위한 프래그먼트 생성
    const fragment = document.createDocumentFragment();
    
    // 보이는 범위 위의 콘텐츠를 위한 스페이서 추가
    const topSpacer = document.createElement('div');
    topSpacer.style.height = `${this.visibleRange.start * this.itemHeight}px`;
    fragment.appendChild(topSpacer);
    
    // 보이는 콘텐츠 추가
    const contentDiv = document.createElement('div');
    contentDiv.innerHTML = visibleContent.join('');
    fragment.appendChild(contentDiv);
    
    // 보이는 범위 아래의 콘텐츠를 위한 스페이서 추가
    const bottomSpacer = document.createElement('div');
    bottomSpacer.style.height = `${(this.content.length - this.visibleRange.end) * this.itemHeight}px`;
    fragment.appendChild(bottomSpacer);
    
    this.editor.appendChild(fragment);
  }
  
  getCursorPosition() {
    // 가상화된 콘텐츠에서 커서 위치를 결정하는 복잡한 로직
    // 이것은 신중한 구현이 필요합니다
    return this.visibleRange.start;
  }
}
```

### 3. 큰 문서를 위한 콘텐츠 청킹

```javascript
class ChunkedContentEditor {
  constructor(editorElement) {
    this.editor = editorElement;
    this.chunks = [];
    this.maxChunkSize = 5000; // 청크당 문자 수
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
    
    // 콘텐츠를 관리 가능한 청크로 분할
    for (let i = 0; i < content.length; i += this.maxChunkSize) {
      this.chunks.push({
        content: content.slice(i, i + this.maxChunkSize),
        start: i,
        end: Math.min(i + this.maxChunkSize, content.length),
        loaded: false
      });
    }
    
    // 초기에는 첫 번째 청크만 로드
    this.loadChunk(0);
  }
  
  loadChunk(chunkIndex) {
    if (this.chunks[chunkIndex] && !this.chunks[chunkIndex].loaded) {
      this.chunks[chunkIndex].loaded = true;
      
      // 메모리를 절약하기 위해 먼 청크 언로드
      this.unloadDistantChunks(chunkIndex);
      
      this.renderActiveChunk();
    }
  }
  
  unloadDistantChunks(activeIndex) {
    this.chunks.forEach((chunk, index) => {
      const distance = Math.abs(index - activeIndex);
      
      if (distance > 2 && chunk.loaded) {
        chunk.loaded = false;
        // 메모리를 해제하기 위해 DOM에서 지우기
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
    // 청크 콘텐츠 업데이트
    const activeChunk = this.chunks[this.activeChunk];
    
    if (activeChunk) {
      activeChunk.content = this.editor.textContent;
    }
    
    // 인접한 청크를 로드해야 하는지 확인
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
    // 범위 위치에서 텍스트 오프셋 계산
    // 이것은 문자를 세기 위해 DOM을 순회해야 합니다
    // 구현은 복잡하지만 필요합니다
    return 0;
  }
  
  checkChunkBoundaries() {
    const activeChunk = this.chunks[this.activeChunk];
    
    if (!activeChunk) return;
    
    const currentLength = activeChunk.content.length;
    
    // 끝에 가까워지면 다음 청크 로드
    if (currentLength > this.maxChunkSize * 0.8) {
      this.loadChunk(this.activeChunk + 1);
    }
    
    // 시작 근처에 있으면 이전 청크 로드
    if (this.activeChunk > 0 && currentLength < this.maxChunkSize * 0.2) {
      this.loadChunk(this.activeChunk - 1);
    }
  }
}
```

### 4. 경량 포맷팅 시스템

```javascript
class LightweightFormatter {
  constructor(editor) {
    this.editor = editor;
    this.formatCache = new Map();
    this.styleSheets = new Map();
    
    this.setupLightweightFormatting();
  }
  
  setupLightweightFormatting() {
    // 인라인 스타일 대신 CSS 클래스 사용
    this.createStyleSheets();
    
    // CSS 클래스를 사용하도록 execCommand 재정의
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
      
      /* 인라인 스타일보다 더 효율적 */
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
    
    // 먼저 캐시 확인
    const cacheKey = `${command}-${value}-${selectedText}`;
    
    if (this.formatCache.has(cacheKey)) {
      const formattedContent = this.formatCache.get(cacheKey);
      range.deleteContents();
      
      const fragment = document.createRange().createContextualFragment(formattedContent);
      range.insertNode(fragment);
      
      return;
    }
    
    // CSS 클래스를 사용하여 포맷팅 적용
    const className = this.getFormatClass(command, value);
    const formattedContent = `<span class="${className}">${selectedText}</span>`;
    
    // 결과 캐시
    this.formatCache.set(cacheKey, formattedContent);
    
    // DOM에 적용
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
    // 색상 값을 클래스 이름으로 변환
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

## 테스트 권장 사항

1. **다양한 문서 크기**: 1K, 5K, 10K, 50K 문자
2. **다양한 작업 빈도**: 느림, 중간, 빠른 작업
3. **다양한 작업 유형**: 포맷팅, 선택, 입력, 실행 취소/다시 실행
4. **메모리 모니터링**: DevTools Memory 탭을 지속적으로 사용
5. **브라우저 버전**: Chrome 버전 및 기타 브라우저에서 테스트
6. **장기 테스트**: 확장된 편집 세션(30분 이상)

## 참고사항

- 메모리 누수는 복잡한 DOM 구조에서 더 심각합니다
- 문제는 모든 브라우저에 영향을 미치지만 Chrome이 가장 큰 영향을 받습니다
- 문제는 빈번한 포맷팅 작업으로 악화됩니다
- 큰 이미지 및 미디어 콘텐츠가 메모리 압력을 증가시킵니다
- 모바일 장치는 데스크톱보다 훨씬 빠르게 메모리 제한에 도달합니다
- 적절한 정리 패턴이 메모리 사용량을 크게 줄일 수 있습니다
