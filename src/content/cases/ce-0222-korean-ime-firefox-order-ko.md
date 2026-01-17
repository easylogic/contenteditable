---
id: ce-0222-korean-ime-firefox-order-ko
scenarioId: scenario-korean-ime-composition-firefox
locale: ko
os: Windows
osVersion: "10/11"
device: Desktop
deviceVersion: Any
browser: Firefox
browserVersion: "115.0+"
keyboard: Korean (IME)
caseTitle: Firefox 한국어 IME 컴포지션 이벤트가 빠른 입력 시 잘못된 순서로 발생함
description: "Firefox에서 한국어 IME를 사용할 때 빠르게 입력하면 컴포지션 이벤트가 잘못된 순서로 발생합니다. compositionend가 compositionupdate 전에 발생하거나, 여러 compositionend 이벤트가 해당 compositionstart 없이 발생할 수 있습니다. 이것은 컴포지션 상태 추적을 깨뜨립니다."
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
  - label: "빠른 입력 시작"
    html: '<p>안녕</p>'
    description: "사용자가 '안녕'을 빠르게 입력"
  - label: "예상 이벤트 시퀀스"
    html: '<p>안녕</p>'
    description: "compositionstart → compositionupdate → compositionend (반복)"
  - label: "실제 Firefox 시퀀스"
    html: '<p>안녕</p>'
    description: "compositionstart → compositionend → compositionupdate (잘못된 순서)"
  - label: "중복 이벤트"
    html: '<p>안녕하세요</p>'
    description: "적절한 시작 없이 여러 compositionend 이벤트"
---

## 현상

Windows에서 Firefox와 한국어 IME를 사용할 때 빠른 입력으로 인해 컴포지션 이벤트가 잘못된 순서로 발생합니다. 각 문자에 대해 예상되는 `compositionstart → compositionupdate → compositionend` 시퀀스 대신, Firefox는 `compositionupdate` 전에 `compositionend`를 발생시키거나, 여러 `compositionend` 이벤트를 발생시키거나, 이벤트를 완전히 건너뛸 수 있습니다.

## 재현 예시

1. Windows에서 한국어 IME가 활성화된 Firefox를 엽니다.
2. `contenteditable` 요소에 포커스를 맞춥니다.
3. 컴포지션 이벤트 로깅을 활성화합니다.
4. 한국어 텍스트를 빠르게 입력합니다 (예: "안녕하세요" 또는 "가나다라마바사").
5. 컴포지션 이벤트의 시퀀스를 관찰합니다.
6. 이벤트 순서와 중복 이벤트에 주의를 기울입니다.

## 관찰된 동작

### 잘못된 이벤트 시퀀스:

**각 문자에 대한 예상 시퀀스:**
```
compositionstart → compositionupdate → compositionend
```

**빠른 입력 중 Firefox 실제 시퀀스:**

1. **이벤트 순서 반전**:
   ```
   compositionstart → compositionend → compositionupdate
   ```

2. **누락된 이벤트**:
   ```
   compositionstart → compositionend (compositionupdate 없음)
   ```

3. **중복 이벤트**:
   ```
   compositionstart → compositionupdate → compositionend → compositionend
   ```

4. **이벤트 클러스터링**:
   ```
   compositionstart → (여러 compositionupdate) → compositionend → compositionend
   ```

### 관찰된 특정 패턴:

- **빠른 문자 입력**: 잘못된 순서를 트리거할 가능성이 가장 높음
- **복잡한 컴포지션**: 여러 자모 조합이 확률을 증가시킴
- **시스템 부하**: 높은 CPU 사용량이 이벤트 순서 오류를 증가시킴
- **Firefox 버전**: 최신 버전은 개선되었지만 여전히 불완전한 동작을 보임
- **IME 유형**: 다른 한국어 IME(Microsoft, Naver, Google)는 동작이 다름

### 이벤트 데이터 불일치:

```javascript
// 문제가 있는 이벤트 시퀀스 예시
[
  { type: 'compositionstart', data: '' },
  { type: 'compositionend', data: '가' },
  { type: 'compositionupdate', data: '가' }, // 잘못된 순서!
  { type: 'compositionstart', data: '' },
  { type: 'compositionupdate', data: '나' },
  { type: 'compositionend', data: '나' },
  { type: 'compositionend', data: '나' } // 중복!
]
```

## 예상 동작

- 컴포지션 이벤트는 모든 문자에 대해 일관된 순서를 따라야 합니다
- 각 문자는 정확히 하나의 시작, 업데이트(들), 종료 이벤트를 가져야 합니다
- 이벤트 타이밍은 예측 가능하고 신뢰할 수 있어야 합니다
- 빠른 입력이 이벤트 순서를 깨뜨리지 않아야 합니다
- 이벤트 데이터는 일관되고 신뢰할 수 있어야 합니다

## 영향

- **상태 추적 깨짐**: 컴포지션 상태가 신뢰할 수 없게 됨
- **입력 처리 실패**: 애플리케이션이 IME 상태를 제대로 추적할 수 없음
- **텍스트 손상**: 문자가 중복되거나 손실될 수 있음
- **성능 문제**: 애플리케이션이 복잡한 해결 방법을 추가해야 함
- **크로스 브라우저 호환성**: Firefox 특정 처리가 필요함

## 브라우저 비교

- **Firefox Windows**: 한국어 IME와 함께 뚜렷한 이벤트 순서 문제
- **Firefox macOS**: 더 나은 동작이지만 여전히 가끔 문제가 있음
- **Firefox Linux**: 일반적으로 올바른 동작
- **Chrome Windows**: 올바른 이벤트 순서, 신뢰할 수 있는 동작
- **Edge Windows**: 올바른 이벤트 순서, Chrome과 동일
- **Safari macOS**: 올바른 이벤트 순서

## 해결 방법

### 1. 견고한 컴포지션 상태 추적

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
    // 순서대로 처리하기 위해 큐에 추가
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
    
    // 관련 이벤트를 수집하기 위해 조금 대기
    await this.wait(10);
    
    const events = this.compositionState.eventQueue.splice(0);
    const normalizedEvents = this.normalizeEventSequence(events);
    
    // 정규화된 이벤트 처리
    for (const event of normalizedEvents) {
      this.processNormalizedEvent(event);
    }
    
    this.compositionState.processingEvents = false;
  }
  
  normalizeEventSequence(events) {
    // Firefox 이벤트 순서 문제 수정
    const normalized = [];
    let currentComposition = null;
    
    for (let i = 0; i < events.length; i++) {
      const event = events[i];
      
      switch (event.type) {
        case 'compositionstart':
          // 새 컴포지션 시작
          if (currentComposition) {
            // 이전 컴포지션 강제 종료
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
            // 누락된 시작 이벤트 - 삽입
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
            // 누락된 시작 이벤트 - 삽입
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
          
          // 중복 종료 이벤트 제거
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
    // 사용자 정의 처리
    console.log('컴포지션 시작:', e);
  }
  
  onCompositionUpdate(e) {
    // 사용자 정의 처리
    console.log('컴포지션 업데이트:', e.data);
  }
  
  onCompositionEnd(e) {
    // 사용자 정의 처리
    console.log('컴포지션 종료:', e.data);
  }
  
  handleInput(e) {
    // 입력 이벤트에 대한 추가 검증
    if (this.compositionState.isComposing !== e.isComposing) {
      // 일치하지 않는 컴포지션 상태 수정
      this.compositionState.isComposing = e.isComposing;
    }
  }
  
  wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}
```

### 2. Firefox 특정 감지 및 처리

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
    // 한국어 IME 사용 패턴 감지
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
    
    // Firefox 특정 정규화 적용
    return super.normalizeEventSequence(events);
  }
}
```

### 3. 대안: 대신 beforeinput 이벤트 사용

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
        // 컴포지션 업데이트 처리
        this.handleCompositionUpdate(e.data);
      } else {
        // 최종 문자 삽입 처리
        this.handleCompositionEnd(e.data);
      }
    } else if (e.inputType === 'deleteContentBackward') {
      // 컴포지션 중 Backspace 처리
      this.handleCompositionBackspace();
    }
  }
  
  handleCompositionUpdate(data) {
    // Firefox에 대해 컴포지션 이벤트보다 더 신뢰할 수 있음
    this.compositionState.currentText = data || '';
    this.compositionState.isComposing = true;
    
    // 현재 컴포지션을 기반으로 UI 업데이트
    this.updateCompositionDisplay(data);
  }
  
  handleCompositionEnd(data) {
    this.compositionState.isComposing = false;
    this.compositionState.currentText = '';
    
    // 문자 최종화
    this.finalizeCharacter(data);
  }
  
  handleCompositionBackspace() {
    if (this.compositionState.currentText.length > 0) {
      // 컴포지션에서 마지막 문자 제거
      const newText = this.compositionState.currentText.slice(0, -1);
      this.compositionState.currentText = newText;
      this.updateCompositionDisplay(newText);
    }
  }
}
```

## 테스트 권장 사항

1. **다양한 입력 속도**: 느림, 중간, 빠름, 매우 빠름
2. **다양한 한국어 IME**: Microsoft, Naver, Google, Danbee
3. **다양한 텍스트 패턴**: 간단한 단어, 복잡한 복합어, 혼합 한국어/영어
4. **다양한 Firefox 버전**: 110, 111, 112, 113, 114, 115, 최신
5. **시스템 조건**: 낮은 vs 높은 CPU 부하
6. **타이밍 테스트**: 이벤트 간격 및 순서 측정

## 참고사항

- 이것은 한국어 IME와의 오래된 Firefox 문제입니다
- 문제는 Firefox의 이벤트 처리 아키텍처와 관련이 있는 것으로 보입니다
- 다른 한국어 IME 구현은 문제의 수준이 다릅니다
- 해결 방법은 복잡성을 추가하지만 더 신뢰할 수 있는 동작을 제공합니다
- 문제는 최신 Firefox 버전에서 덜 뚜렷하지만 여전히 존재합니다
