---
id: ce-0223-japanese-ime-candidate-firefox-ko
scenarioId: scenario-japanese-ime-convertion-firefox
locale: ko
os: macOS
osVersion: "12.0+"
device: Desktop
deviceVersion: Any
browser: Firefox
browserVersion: "115.0+"
keyboard: Japanese (IME)
caseTitle: Firefox 일본어 IME 변환 후보 선택이 contenteditable 선택을 방해함
description: "macOS에서 Firefox와 일본어 IME를 사용할 때 변환 후보를 선택하면 IME 후보 창이 contenteditable 선택 및 커서 위치 지정을 방해할 수 있습니다. 후보 창이 편집기 위에 나타나 시각적 충돌과 잠재적인 선택 손실을 일으킬 수 있습니다."
tags:
  - firefox
  - japanese
  - ime
  - conversion-candidates
  - selection-interference
  - macos
  - candidate-window
  - visual-conflict
status: draft
domSteps:
  - label: "컴포지션 시작"
    html: '<p>こんにちは</p>'
    description: "사용자가 일본어 텍스트 입력 시작"
  - label: "후보 선택"
    html: '<p>こんにちは</p>'
    description: "IME 후보 창이 나타나 편집기를 덮을 수 있음"
  - label: "선택 후"
    html: '<p>今日は</p>'
    description: "후보를 선택한 후 선택이 손실되거나 잘못 배치될 수 있음"
---

## 현상

macOS에서 Firefox와 일본어 IME를 사용할 때 변환 후보 창이 contenteditable 선택 및 커서 위치 지정을 방해할 수 있습니다. 사용자가 IME 드롭다운에서 변환 후보를 선택할 때 후보 창이 편집기 콘텐츠 위에 나타나 시각적 충돌과 잠재적인 선택 손실을 일으킬 수 있습니다.

## 재현 예시

1. macOS에서 일본어 IME가 활성화된 Firefox를 엽니다.
2. 일부 콘텐츠가 있는 `contenteditable` 요소에 포커스를 맞춥니다.
3. 일본어 텍스트 입력을 시작합니다 (예: 今日를 위해 "kyou" 입력).
4. 공백 또는 변환 키를 눌러 후보 창을 표시합니다.
5. 드롭다운에서 다른 후보를 선택합니다.
6. 후보 창 위치 지정 및 선택 동작을 관찰합니다.
7. 더 긴 컴포지션과 여러 후보 선택으로 시도합니다.

## 관찰된 동작

### 후보 창 간섭:

1. **시각적 겹침**: 후보 창이 편집기 콘텐츠 위에 나타날 수 있음
2. **선택 손실**: 후보가 나타날 때 기존 선택이 손실될 수 있음
3. **커서 변위**: 커서 위치가 예상치 못하게 이동할 수 있음
4. **스크롤 문제**: 편집기가 후보 창을 수용하기 위해 스크롤될 수 있음
5. **포커스 충돌**: 포커스가 편집기와 후보 창 사이에서 이동할 수 있음

### 관찰된 특정 패턴:

- **고정 위치 지정**: 고정 위치 지정이 있는 편집기가 더 큰 영향을 받음
- **작은 화면**: 후보 창 겹침 가능성이 더 높음
- **긴 컴포지션**: 더 많은 후보 = 더 큰 창 = 더 많은 간섭
- **가장자리 근처**: 화면 가장자리 근처에서 컴포지션하면 후보 위치 변경이 발생함
- **여러 선택**: 복잡한 선택이 손실될 가능성이 더 높음

### 이벤트 시퀀스 분석:

```javascript
// 후보 선택 이벤트가 있는 Firefox 일본어 IME
document.addEventListener('compositionstart', (e) => {
  console.log('compositionstart:', e.data);
});

document.addEventListener('compositionupdate', (e) => {
  console.log('compositionupdate:', e.data);
  // 후보 선택이 compositionupdate를 트리거함
});

document.addEventListener('compositionend', (e) => {
  console.log('compositionend:', e.data);
  // 이 시점에서 선택이 손실될 수 있음
});

document.addEventListener('selectionchange', (e) => {
  console.log('selectionchange');
  // 후보 선택 중 예상치 못하게 발생할 수 있음
});
```

## 예상 동작

- 후보 창이 편집기 선택을 방해하지 않아야 합니다
- 커서가 후보 선택 중 예상된 위치에 유지되어야 합니다
- 시각적 레이아웃이 콘텐츠를 잃지 않고 후보 창을 수용해야 합니다
- 포커스가 전체 컴포지션 프로세스 동안 편집기에 유지되어야 합니다
- 선택이 후보 선택 전체에 걸쳐 보존되어야 합니다

## 영향

- **사용자 경험 방해**: 텍스트 입력 중 시각적 충돌
- **선택 불일치**: 사용자가 텍스트에서 위치를 잃음
- **입력 중단**: 복잡한 컴포지션이 어려워짐
- **접근성 문제**: 스크린 리더 사용자가 컨텍스트를 잃을 수 있음
- **크로스 브라우저 불일치**: 다른 브라우저와 다른 동작

## 브라우저 비교

- **Firefox macOS**: 후보 창이 선택을 방해할 수 있음
- **Chrome macOS**: 더 나은 처리, 최소한의 간섭
- **Safari macOS**: 좋은 통합, 드문 충돌
- **Firefox Windows**: 다른 IME 시스템, 더 나은 동작
- **Chrome Windows**: 후보 창에 문제 없음
- **Edge macOS**: Chrome과 유사, 좋은 동작

## 해결 방법

### 1. 후보 창 위치 지정 관리

```javascript
class JapaneseIMECandidateHandler {
  constructor(editorElement) {
    this.editor = editorElement;
    this.isFirefox = /Firefox/.test(navigator.userAgent);
    this.isMac = /Mac/.test(navigator.platform);
    this.isJapaneseIME = false;
    
    if (this.isFirefox && this.isMac) {
      this.setupCandidateHandling();
    }
  }
  
  setupCandidateHandling() {
    this.editor.addEventListener('compositionstart', this.handleCompositionStart.bind(this));
    this.editor.addEventListener('compositionupdate', this.handleCompositionUpdate.bind(this));
    this.editor.addEventListener('compositionend', this.handleCompositionEnd.bind(this));
    this.editor.addEventListener('focus', this.handleFocus.bind(this));
    
    // 일본어 IME 사용 감지
    this.detectJapaneseIME();
  }
  
  detectJapaneseIME() {
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Process' || e.keyCode === 229) {
        this.isJapaneseIME = this.checkLocaleJapanese();
      }
    });
  }
  
  checkLocaleJapanese() {
    const locale = navigator.language || navigator.userLanguage;
    return locale.startsWith('ja');
  }
  
  handleCompositionStart(e) {
    this.preserveSelection();
    this.adjustEditorPositioning();
  }
  
  handleCompositionUpdate(e) {
    // 이것이 후보 선택인지 확인
    if (this.isCandidateSelection(e)) {
      this.handleCandidateSelection(e);
    }
  }
  
  handleCompositionEnd(e) {
    this.restoreSelection();
    this.resetEditorPositioning();
  }
  
  handleFocus(e) {
    this.setupCandidateObserver();
  }
  
  isCandidateSelection(e) {
    // 휴리스틱: 사용자 입력 없이 빠른 compositionupdate
    // 후보 선택을 나타낼 가능성이 높음
    return e.data && this.lastCompositionData && 
           e.data !== this.lastCompositionData &&
           this.isRapidEvent();
  }
  
  isRapidEvent() {
    const now = Date.now();
    const isRapid = this.lastEventTime && (now - this.lastEventTime) < 100;
    this.lastEventTime = now;
    return isRapid;
  }
  
  handleCandidateSelection(e) {
    // 잠재적 간섭 전에 현재 선택 저장
    this.savedSelection = this.saveSelection();
    
    // 후보 창 겹침을 피하기 위해 편집기 조정
    this.adjustForCandidateWindow();
    
    // 후보 창 표시 처리
    setTimeout(() => {
      this.checkCandidateWindowOverlap();
    }, 50);
  }
  
  saveSelection() {
    const selection = window.getSelection();
    if (selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      return {
        startContainer: range.startContainer,
        startOffset: range.startOffset,
        endContainer: range.endContainer,
        endOffset: range.endOffset
      };
    }
    return null;
  }
  
  restoreSelection() {
    if (this.savedSelection) {
      try {
        const selection = window.getSelection();
        const range = document.createRange();
        
        range.setStart(this.savedSelection.startContainer, this.savedSelection.startOffset);
        range.setEnd(this.savedSelection.endContainer, this.savedSelection.endOffset);
        
        selection.removeAllRanges();
        selection.addRange(range);
      } catch (e) {
        console.warn('선택을 복원할 수 없습니다:', e);
      }
    }
  }
  
  adjustForCandidateWindow() {
    const rect = this.editor.getBoundingClientRect();
    const viewportHeight = window.innerHeight;
    
    // 편집기가 후보 창에 가려질 수 있는 경우
    if (rect.bottom > viewportHeight - 200) {
      // 후보 창을 수용하기 위해 편집기를 위로 이동
      const originalTop = this.editor.style.top;
      this.originalPosition = { top: originalTop };
      
      this.editor.style.position = 'relative';
      this.editor.style.top = `${Math.max(0, rect.top - 150)}px`;
      
      // 부드러운 전환
      this.editor.style.transition = 'top 0.2s ease-out';
    }
  }
  
  resetEditorPositioning() {
    if (this.originalPosition) {
      this.editor.style.top = this.originalPosition.top;
      this.editor.style.position = '';
      this.editor.style.transition = '';
      this.originalPosition = null;
    }
  }
  
  adjustEditorPositioning() {
    // 컴포지션 중 편집기가 보이도록 보장
    this.editor.style.overflow = 'visible';
    this.editor.style.zIndex = '10';
  }
  
  preserveSelection() {
    // 나중에 복원하기 위해 선택 저장
    this.initialSelection = this.saveSelection();
  }
  
  checkCandidateWindowOverlap() {
    // 후보 창을 감지하고 필요시 조정 시도
    // IME 창에 직접 액세스할 수 없으므로 이것은 휴리스틱입니다
    const activeElements = document.activeElement;
    const editorRect = this.editor.getBoundingClientRect();
    
    // 편집기가 여전히 포커스되고 보이는지 확인
    if (document.activeElement !== this.editor) {
      // 포커스 손실, 복원
      this.editor.focus();
      this.restoreSelection();
    }
  }
  
  setupCandidateObserver() {
    // 컴포지션 중 포커스 변경 모니터링
    let compositionInProgress = false;
    
    document.addEventListener('compositionstart', () => {
      compositionInProgress = true;
    });
    
    document.addEventListener('compositionend', () => {
      compositionInProgress = false;
    });
    
    document.addEventListener('blur', (e) => {
      if (compositionInProgress && e.target !== this.editor) {
        // 컴포지션 중 포커스 손실, 복원
        setTimeout(() => {
          this.editor.focus();
          this.restoreSelection();
        }, 10);
      }
    }, true);
  }
}
```

### 2. 후보 창 수용을 위한 CSS 위치 지정

```css
.japanese-ime-editor {
  /* 편집기가 후보 창 위에 유지되도록 보장 */
  position: relative;
  z-index: 100;
  
  /* 컴포지션 중 원하지 않는 스크롤 방지 */
  overflow-anchor: none;
  overscroll-behavior: contain;
  
  /* 일관된 위치 지정 보장 */
  transform: translateZ(0); /* 하드웨어 가속 */
  will-change: transform;
}

.japanese-ime-editor.composing {
  /* 컴포지션 중 특수 스타일링 */
  outline: 2px solid #007acc;
  outline-offset: 2px;
  
  /* 레이아웃 이동 방지 */
  min-height: 100px;
  resize: vertical;
}

/* Firefox 특정 수정 */
@supports (-moz-appearance: none) {
  .japanese-ime-editor {
    /* Firefox 특정 위치 지정 */
    position: sticky;
    top: 0;
    
    /* IME와의 더 나은 통합 */
    ime-mode: auto;
  }
}

/* macOS 특정 수정 */
@media (min-resolution: 2dppx) {
  .japanese-ime-editor {
    /* 고해상도 Mac 특정 조정 */
    font-smoothing: antialiased;
    -webkit-font-smoothing: antialiased;
  }
}
```

### 3. 대체 입력 방법 처리

```javascript
class AlternativeJapaneseInput {
  constructor(editor) {
    this.editor = editor;
    this.mode = 'standard'; // 'standard' 또는 'alternative'
    
    this.setupModeToggle();
  }
  
  setupModeToggle() {
    // 일본어를 위한 대체 입력 방법 제공
    const toggle = document.createElement('button');
    toggle.textContent = '일본어 입력 모드';
    toggle.style.cssText = `
      position: absolute;
      top: 10px;
      right: 10px;
      z-index: 1000;
      padding: 5px 10px;
      background: #007acc;
      color: white;
      border: none;
      border-radius: 3px;
      cursor: pointer;
    `;
    
    toggle.addEventListener('click', () => {
      this.toggleMode();
    });
    
    this.editor.parentElement.style.position = 'relative';
    this.editor.parentElement.appendChild(toggle);
  }
  
  toggleMode() {
    if (this.mode === 'standard') {
      this.mode = 'alternative';
      this.enableAlternativeMode();
    } else {
      this.mode = 'standard';
      this.disableAlternativeMode();
    }
  }
  
  enableAlternativeMode() {
    // 후보 창 없이 로마자-히라가나 변환 사용
    this.editor.addEventListener('keydown', this.handleAlternativeInput.bind(this));
    
    // 인라인 변환 패널 표시
    this.showInlineConversionPanel();
  }
  
  disableAlternativeMode() {
    this.editor.removeEventListener('keydown', this.handleAlternativeInput);
    this.hideInlineConversionPanel();
  }
  
  handleAlternativeInput(e) {
    // 사용자 정의 일본어 입력 로직 구현
    // 이것은 복잡한 구현이 될 것이지만
    // 후보 선택에 대한 더 많은 제어를 제공합니다
  }
  
  showInlineConversionPanel() {
    // 시스템 IME 후보 창 대신 편집기 내 인라인 후보 선택 생성
    const panel = document.createElement('div');
    panel.className = 'inline-candidate-panel';
    panel.style.cssText = `
      position: absolute;
      background: white;
      border: 1px solid #ccc;
      border-radius: 3px;
      padding: 5px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.2);
      z-index: 1001;
    `;
    
    this.editor.parentElement.appendChild(panel);
  }
  
  hideInlineConversionPanel() {
    const panel = this.editor.parentElement.querySelector('.inline-candidate-panel');
    if (panel) {
      panel.remove();
    }
  }
}
```

## 테스트 권장 사항

1. **다양한 일본어 IME**: Microsoft IME, Google Japanese Input, ATOK
2. **다양한 텍스트 패턴**: 히라가나, 가타카나, 한자, 혼합
3. **다양한 편집기 위치**: 페이지 상단, 중간, 하단
4. **다양한 화면 크기**: 작은 노트북, 큰 모니터
5. **여러 후보**: 많은 변환 옵션이 있는 긴 단어
6. **빠른 vs 느린 입력**: 다양한 입력 속도

## 참고사항

- 이것은 macOS에서 Firefox의 IME 통합에 특정된 것으로 보입니다
- 문제는 Firefox의 창 관리 및 포커스 처리와 관련이 있습니다
- 후보 창 위치 지정은 다른 일본어 IME 간에 다릅니다
- 문제는 특정 IME 구현에서 더 뚜렷합니다
- 일부 사용자는 Firefox의 개발자 에디션에서 더 나은 동작을 보고합니다
