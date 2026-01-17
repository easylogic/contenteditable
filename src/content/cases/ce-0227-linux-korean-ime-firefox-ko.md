---
id: ce-0227-linux-korean-ime-firefox-ko
scenarioId: scenario-linux-korean-ime-hangul
locale: ko
os: Linux
osVersion: "22.04+"
device: Desktop
deviceVersion: Any
browser: Firefox
browserVersion: "115.0+"
keyboard: Korean (Hangul IME)
caseTitle: Firefox Linux 한국어 한글 IME가 문자를 잘못 결합함
description: "Linux에서 Firefox를 사용할 때 한국어 한글 IME가 빠른 입력 중 자모(한국어 문자 구성 요소)를 잘못 결합합니다. 초성과 모음이 제대로 결합되지 않거나 전혀 결합되지 않아 자모 문자가 별도로 나타나거나 잘못된 문자로 결합되는 손상된 한국어 텍스트가 생성됩니다."
tags:
  - linux
  - firefox
  - korean
  - hangul-ime
  - character-combination
  - input-corruption
  - rapid-typing
status: draft
domSteps:
  - label: "'가' 입력"
    html: '<p>가</p>'
    description: "사용자가 '가' 입력 - ㄱ + ㅏ"
  - label: "예상 결합"
    html: '<p>가</p>'
    description: "올바른 한글 결합: ㄱ + ㅏ = 가"
  - label: "실제 동작"
    html: '<p>가ㅏ</p>'
    description: "실패한 결합: ㄱ + ㅏ = 가ㅏ (손상됨)"
  - label: "'나' 입력"
    html: '<p>가나</p>'
    description: "사용자가 '나' 입력 - ㄴ + ㅏ"
  - label: "예상 결합"
    html: '<p>가나</p>'
    description: "올바른 결합: ㄴ + ㅏ = 나"
  - label: "실제 동작"
    html: '<p>가나ㅏ</p>'
    description: "실패한 결합: ㄴ + ㅏ = 가나ㅏ (손상됨)"
---

## 현상

Linux에서 Firefox를 사용할 때 한국어 한글 IME가 빠른 입력 중 자모(한국어 문자 구성 요소)를 잘못 결합합니다. 초성과 모음이 제대로 결합되지 않아 자모 문자가 별도로 나타나거나 잘못된 문자로 결합되는 손상된 한국어 텍스트가 생성됩니다.

## 재현 예시

1. Linux 시스템을 사용합니다 (Ubuntu 22.04+ 또는 유사).
2. 한국어 한글 IME(기본 시스템 한국어 IME)를 설치하고 활성화합니다.
3. Firefox 브라우저를 열고 `contenteditable` 요소에 포커스를 맞춥니다.
4. 한국어 문자를 빠르게 입력합니다:
   - "가" 입력 (ㄱ 다음에 ㅏ)
   - "나" 입력 (ㄴ 다음에 ㅏ)
   - "다" 입력 (ㄷ 다음에 ㅏ)
   - 일반적인 한국어 단어 입력: "안녕하세요", "감사합니다"
5. 자모 문자가 제대로 결합되지 않거나 잘못 결합되는 것을 관찰합니다.
6. 동일한 시스템에서 다른 브라우저와 동작을 비교합니다.

## 관찰된 동작

### 문자 결합 실패:

**올바른 한글 결합 프로세스:**
```
ㄱ (초성) + ㅏ (모음) = 가
ㄴ (초성) + ㅏ (모음) = 나
ㄷ (초성) + ㅏ (모음) = 다
```

**Firefox Linux 실제 동작:**
```
ㄱ + ㅏ = 가ㅏ (실패한 결합 - 자모를 별도로 표시)
ㄴ + ㅏ = 가나ㅏ (잘못된 결합)
ㄷ + ㅏ = 다ㅏ (실패한 결합)
```

### 관찰된 특정 패턴:

1. **실패한 결합**: 자모 문자가 결합되지 않은 상태로 유지됨
2. **잘못된 결합**: 문자가 존재하지 않는 한국어 문자로 결합됨
3. **타이밍 의존적**: 빠른 입력으로 동작이 악화됨
4. **일관되지 않은 결과**: 동일한 입력이 다른 출력을 생성함
5. **복구 문제**: 손상이 발생하면 이후 입력이 계속 영향을 받음

### 이벤트 시퀀스 분석:

```javascript
// Firefox Linux 한국어 한글 IME 이벤트
[
  { type: 'compositionstart', data: '' },
  { type: 'compositionupdate', data: 'ㄱ' },
  { type: 'compositionupdate', data: 'ㄱㅏ' }, // '가'로 결합되어야 함
  { type: 'compositionend', data: '가ㅏ' }, // 잘못된 결과
]
```

## 예상 동작

- 한글 IME가 초성과 모음을 제대로 결합해야 합니다
- 각 음절이 단일 한국어 문자로 결과를 내야 합니다
- 문자 결합이 일관되고 신뢰할 수 있어야 합니다
- 빠른 입력이 결합 정확도에 영향을 주지 않아야 합니다
- 동작이 동일한 시스템의 다른 브라우저와 일치해야 합니다

## 영향

- **텍스트 손상**: 한국어 텍스트가 읽을 수 없거나 잘못됨
- **사용자 좌절**: 사용자가 한국어를 신뢰할 수 있게 입력할 수 없음
- **생산성 손실**: 사용자가 지속적으로 입력 오류를 수정해야 함
- **플랫폼 불일치**: Firefox가 Linux에서 Chrome/Edge와 다르게 동작함
- **접근성 영향**: 스크린 리더가 잘못된 텍스트 콘텐츠를 받음

## 브라우저 비교

- **Firefox Linux**: 한글 IME와 함께 심각한 문자 결합 실패
- **Chrome Linux**: 올바른 문자 결합 동작
- **Edge Linux**: 올바른 문자 결합 동작  
- **Firefox Windows**: 올바른 문자 결합 동작
- **Firefox macOS**: 올바른 문자 결합 동작
- **기타 모든 플랫폼**: 문자 결합 문제 없음

## 해결 방법

### 1. 사용자 정의 한국어 입력 처리기

```javascript
class LinuxKoreanIMEHandler {
  constructor(editor) {
    this.editor = editor;
    this.isFirefoxLinux = /Firefox/.test(navigator.userAgent) && /Linux/.test(navigator.platform);
    this.isKoreanIME = false;
    this.pendingJamo = [];
    
    if (this.isFirefoxLinux) {
      this.setupKoreanInputHandler();
    }
  }
  
  setupKoreanInputHandler() {
    this.editor.addEventListener('compositionstart', this.handleCompositionStart.bind(this));
    this.editor.addEventListener('compositionupdate', this.handleCompositionUpdate.bind(this));
    this.editor.addEventListener('compositionend', this.handleCompositionEnd.bind(this));
    this.editor.addEventListener('input', this.handleInput.bind(this));
  }
  
  handleCompositionStart(e) {
    this.isKoreanIME = true;
    this.pendingJamo = [];
    console.log('한국어 컴포지션 시작됨');
  }
  
  handleCompositionUpdate(e) {
    if (!this.isKoreanIME) return;
    
    const data = e.data || '';
    
    // 한국어 자모 문자 감지
    const jamoPattern = /[ㄱ-ㅎㅏ-ㅣ]/;
    
    if (jamoPattern.test(data)) {
      this.pendingJamo.push(...data.split(''));
      
      // 디버깅을 위해 대기 중인 자모 로그
      console.log('대기 중인 자모:', this.pendingJamo);
    } else {
      // 비자모 문자, 정상적으로 처리
      this.pendingJamo.push(...data.split(''));
    }
  }
  
  handleCompositionEnd(e) {
    if (!this.isKoreanIME) return;
    
    // 대기 중인 자모를 처리하여 올바른 한국어 문자 생성
    const correctedText = this.combineKoreanJamo(this.pendingJamo);
    
    // 현재 선택을 가져와 수정된 텍스트로 교체
    const selection = window.getSelection();
    if (selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      
      // 잘못된 컴포지션 제거
      range.deleteContents();
      
      // 수정된 텍스트 삽입
      const textNode = document.createTextNode(correctedText);
      range.insertNode(textNode);
      
      // 삽입된 텍스트 뒤에 커서 배치
      range.selectNodeContents(textNode);
      range.collapse(false);
      selection.removeAllRanges();
      selection.addRange(range);
    }
    
    this.pendingJamo = [];
    this.isKoreanIME = false;
    
    console.log('한국어 컴포지션 종료됨. 원본:', e.data, '수정됨:', correctedText);
  }
  
  handleInput(e) {
    if (this.isKoreanIME) {
      // 컴포지션 중 Firefox의 잘못된 입력 방지
      e.preventDefault();
      return;
    }
  }
  
  combineKoreanJamo(jamoArray) {
    // 한국어 한글 결합 규칙
    const result = [];
    let i = 0;
    
    while (i < jamoArray.length) {
      const jamo = jamoArray[i];
      
      // 이것이 유효한 한국어 결합인지 확인
      const combined = this.tryKoreanCombination(jamoArray, i);
      
      if (combined) {
        result.push(combined.character);
        i += combined.skip;
      } else {
        // 유효한 결합이 없으면 자모를 그대로 사용
        result.push(jamo);
        i++;
      }
    }
    
    return result.join('');
  }
  
  tryKoreanCombination(jamoArray, startIndex) {
    // 일반적인 한국어 음절 패턴
    const patterns = [
      { initial: 'ㄱ', medial: 'ㅏ', result: '가', skip: 2 },
      { initial: 'ㄴ', medial: 'ㅏ', result: '나', skip: 2 },
      { initial: 'ㄷ', medial: 'ㅏ', result: '다', skip: 2 },
      { initial: 'ㅁ', medial: 'ㅏ', result: '마', skip: 2 },
      { initial: 'ㅂ', medial: 'ㅏ', result: '바', skip: 2 },
      { initial: 'ㅅ', medial: 'ㅏ', result: '사', skip: 2 }
    ];
    
    if (startIndex + 1 >= jamoArray.length) return null;
    
    const firstJamo = jamoArray[startIndex];
    const secondJamo = jamoArray[startIndex + 1];
    
    for (const pattern of patterns) {
      if (firstJamo === pattern.initial && secondJamo === pattern.medial) {
        return {
          character: pattern.result,
          skip: pattern.skip
        };
      }
    }
    
    return null;
  }
}
```

### 2. 대체 한국어 IME 제안

```javascript
function suggestAlternativeIME() {
  const isFirefoxLinux = /Firefox/.test(navigator.userAgent) && /Linux/.test(navigator.platform);
  
  if (isFirefoxLinux) {
    const userLanguage = navigator.language || 'en';
    
    if (userLanguage.startsWith('ko')) {
      // Linux에서 Firefox를 위한 한국어 IME 대안 표시
      const alternatives = document.createElement('div');
      alternatives.className = 'korean-ime-alternatives';
      alternatives.innerHTML = `
        <h3>한국어 IME 문제 감지됨</h3>
        <p>Linux에서 Firefox는 한국어 한글 IME 문자 결합에 알려진 문제가 있습니다.</p>
        <h4>권장 솔루션:</h4>
        <ul>
          <li><strong>Chrome 또는 Edge 사용:</strong> Linux에서 더 나은 한국어 IME 지원</li>
          <li><strong>Naver Hangul 시도:</strong> 더 나은 Firefox 호환성을 가진 대체 한국어 IME</li>
          <li><strong>fcitx-hangul 사용:</strong> 개선된 한국어 지원을 가진 Linux 입력 방법 프레임워크</li>
          <li><strong>IBus Korean 활성화:</strong> 시스템 입력 방법 대안</li>
        </ul>
        <button id="dismiss-ime-warning">이해함</button>
      `;
      
      alternatives.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #fff3cd;
        border: 1px solid #ffeaa7;
        border-radius: 8px;
        padding: 20px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 10000;
        max-width: 400px;
        font-family: system-ui, sans-serif;
      `;
      
      document.body.appendChild(alternatives);
      
      document.getElementById('dismiss-ime-warning').addEventListener('click', () => {
        document.body.removeChild(alternatives);
      });
    }
  }
}
```

### 3. Linux 특정 한국어 IME 구성

```javascript
class LinuxKoreanIMEConfig {
  constructor() {
    this.detectEnvironment();
  }
  
  detectEnvironment() {
    const isLinux = /Linux/.test(navigator.platform);
    const isFirefox = /Firefox/.test(navigator.userAgent);
    
    if (isLinux && isFirefox) {
      this.setupFirefoxLinuxFix();
    }
  }
  
  setupFirefoxLinuxFix() {
    // 시스템 한국어 IME 사용 중인지 확인
    this.checkSystemIME();
    
    // Firefox의 컴포지션 처리 재정의
    this.overrideCompositionEvents();
    
    // 사용자 구성 옵션 제공
    this.showConfigurationDialog();
  }
  
  checkSystemIME() {
    // 시스템 한국어 IME가 활성화되어 있는지 감지 시도
    const testInput = document.createElement('input');
    testInput.style.position = 'absolute';
    testInput.style.left = '-9999px';
    document.body.appendChild(testInput);
    
    testInput.focus();
    
    // IME 동작을 감지하기 위해 한국어 입력 시뮬레이션
    setTimeout(() => {
      const hasKoreanIME = this.detectKoreanIMEBehavior(testInput);
      
      if (hasKoreanIME) {
        this.enableKoreanMode();
      }
      
      document.body.removeChild(testInput);
    }, 100);
  }
  
  detectKoreanIMEBehavior(input) {
    // 이벤트 패턴을 기반으로 한 휴리스틱 감지
    let hasCompositionEvents = false;
    
    input.addEventListener('compositionstart', () => {
      hasCompositionEvents = true;
    }, { once: true });
    
    // 컴포지션 트리거
    input.dispatchEvent(new KeyboardEvent('keydown', {
      key: 'Process',
      keyCode: 229
    }));
    
    return hasCompositionEvents;
  }
  
  enableKoreanMode() {
    // 한국어 모드에 대한 기본 설정 저장
    localStorage.setItem('firefox-linux-korean-mode', 'enabled');
    
    // 사용자 정의 한국어 입력 처리 활성화
    window.koreanModeEnabled = true;
  }
  
  showConfigurationDialog() {
    const configDialog = document.createElement('div');
    configDialog.innerHTML = `
      <div class="korean-config-dialog">
        <h2>Firefox Linux 한국어 IME 구성</h2>
        <div class="config-option">
          <label>
            <input type="checkbox" id="enable-korean-fix" checked>
            한국어 IME 문자 결합 수정 활성화
          </label>
        </div>
        <div class="config-option">
          <label>
            <select id="korean-ime-type">
              <option value="system">시스템 한국어 IME</option>
              <option value="fcitx">Fcitx-hangul</option>
              <option value="ibus">IBus-hangul</option>
            </select>
            한국어 IME 유형
          </label>
        </div>
        <div class="config-actions">
          <button id="save-config">구성 저장</button>
          <button id="test-config">구성 테스트</button>
        </div>
      </div>
    `;
    
    configDialog.style.cssText = `
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background: white;
      border: 2px solid #333;
      border-radius: 12px;
      padding: 30px;
      box-shadow: 0 8px 32px rgba(0,0,0,0.2);
      z-index: 10001;
      font-family: system-ui, sans-serif;
    `;
    
    document.body.appendChild(configDialog);
    
    // 구성 대화 상자 상호작용 처리
    this.setupConfigDialogEvents(configDialog);
  }
  
  setupConfigDialogEvents(dialog) {
    document.getElementById('save-config').addEventListener('click', () => {
      const enabled = document.getElementById('enable-korean-fix').checked;
      const imeType = document.getElementById('korean-ime-type').value;
      
      localStorage.setItem('firefox-korean-config', JSON.stringify({
        enabled,
        imeType
      }));
      
      alert('구성이 저장되었습니다! 페이지를 새로고침하세요.');
      document.body.removeChild(dialog);
    });
    
    document.getElementById('test-config').addEventListener('click', () => {
      window.open('https://example.com/korean-ime-test', '_blank');
    });
  }
}
```

### 4. 브라우저 호환성 경고

```css
/* Firefox Linux 특정 CSS 경고 */
@supports (-moz-appearance: none) {
  @media (any-hover: none) and (any-pointer: coarse) {
    .firefox-linux-korean-warning::before {
      content: "⚠️ Linux에서 Firefox는 한국어 IME 문제가 있습니다. 더 나은 한국어 입력 지원을 위해 Chrome 또는 Edge 사용을 고려하세요.";
      display: block;
      background: #fff3cd;
      color: #856404;
      padding: 12px;
      margin: 10px 0;
      border: 1px solid #ffeaa7;
      border-radius: 6px;
      font-family: system-ui, sans-serif;
      font-size: 14px;
    }
  }
}
```

## 테스트 권장 사항

1. **다양한 Linux 배포판**: Ubuntu, Fedora, Arch, openSUSE
2. **다양한 Firefox 버전**: 110, 111, 112, 113, 114, 115, 최신
3. **다양한 한국어 IME**: 시스템 IME, fcitx-hangul, ibus-hangul
4. **빠른 입력 테스트**: 빠른 한국어 텍스트 입력
5. **혼합 콘텐츠 테스트**: 한국어 + 영어 + 숫자
6. **긴 문서 테스트**: 큰 문서의 한국어 텍스트

## 참고사항

- 이것은 Linux에서 Firefox의 한국어 IME 처리에 특정된 것으로 보입니다
- 문제는 Firefox Windows/macOS 또는 Linux에서 Chrome/Edge에서 발생하지 않습니다
- 문제는 Linux에서 Firefox의 컴포지션 이벤트 처리와 관련이 있습니다
- 다른 한국어 IME 구현은 문제의 수준이 다릅니다
- fcitx 및 ibus 입력 프레임워크가 더 나은 한국어 입력 지원을 제공할 수 있습니다
- 문제는 Linux에서 Firefox를 사용하는 모든 한국어 사용자에게 영향을 미치며, 중요한 플랫폼 특정 문제입니다
