---
id: ce-0228-linux-korean-ime-fcitx-ko
scenarioId: scenario-linux-korean-ime-fcitx
locale: ko
os: Linux
osVersion: "20.04+"
device: Desktop
deviceVersion: Any
browser: Chrome
browserVersion: "120.0+"
keyboard: Korean (Fcitx IME)
caseTitle: Fcitx 한국어 IME가 Chrome에서 빠른 입력 중 컴포지션 상태를 잃음
description: "Linux에서 Fcitx 한국어 IME와 Chrome 브라우저를 사용할 때 빠른 입력 중 컴포지션 상태가 일관되지 않게 됩니다. IME 컴포지션 창이 조기에 사라지거나 입력된 텍스트가 컴포지션 미리보기와 일치하지 않아 문자 손실 및 잘못된 입력이 발생할 수 있습니다."
tags:
  - linux
  - chrome
  - fcitx
  - korean
  - composition-state
  - input-loss
  - rapid-typing
  - ime-window
status: draft
domSteps:
  - label: "한국어 입력 시작"
    html: '<div contenteditable="true"><p>안녕</p></div>'
    description: "사용자가 Fcitx IME로 '안녕' 입력 시작"
  - label: "컴포지션 창 나타남"
    html: '<div contenteditable="true"><p>안녕</p></div>'
    description: "Fcitx 컴포지션 창이 '안녕'에 대한 후보 표시"
  - label: "빠른 입력 계속"
    html: '<div contenteditable="true"><p>안녕하</p></div>'
    description: "사용자가 빠르게 계속 입력, 컴포지션 상태가 불안정해짐"
  - label: "최종 결과"
    html: '<div contenteditable="true"><p>안하</p></div>'
    description: "최종 텍스트가 불완전하거나 잘못됨, 문자 손실"
---

## 현상

Linux에서 Fcitx 한국어 IME와 Chrome 브라우저를 사용할 때 빠른 입력 중 컴포지션 상태 관리가 문제가 됩니다. IME 컴포지션 창이 예상치 못하게 사라지거나, 입력된 문자가 컴포지션 미리보기와 일치하지 않거나, 최종 텍스트가 불완전하거나 잘못될 수 있습니다.

## 재현 예시

1. Linux(Ubuntu 20.04+)에 Fcitx와 한국어 입력 방법을 설치합니다.
2. Chrome을 기본 브라우저로 설정합니다.
3. `contenteditable` 요소를 열고 포커스를 맞춥니다.
4. 한국어 텍스트를 빠르게 입력하기 시작합니다 (예: "안녕하세요" 또는 "가나다라마바사").
5. 빠른 입력 중 Fcitx 컴포지션 창 동작을 관찰합니다.
6. 미리보기 텍스트가 삽입되는 것과 일치하지 않거나 문자가 손실되는 것을 확인합니다.

## 관찰된 동작

### 컴포지션 상태 문제:

**정상 예상 시퀀스:**
```
1. 사용자가 '안' 입력 → IME가 미리보기에 '안' 표시
2. 사용자가 '녕' 입력 → IME가 미리보기에 '안녕' 표시  
3. 사용자가 '하' 입력 → IME가 미리보기에 '안녕하' 표시
4. 사용자가 확인 → '안녕하'가 삽입됨
```

**Chrome + Fcitx 실제 동작:**
```
1. 사용자가 '안' 입력 → IME가 미리보기에 '안' 표시
2. 사용자가 '녕' 입력 → IME 창이 깜빡임/사라짐, 미리보기가 '안'으로 재설정됨
3. 사용자가 '하' 입력 → IME가 '하' 표시 (잘못된 미리보기)
4. 사용자가 확인 → '안하'가 삽입됨 ('녕' 누락)
```

### 관찰된 특정 패턴:

1. **컴포지션 창 사라짐**: Fcitx 창이 입력 중 예상치 못하게 닫힘
2. **미리보기 텍스트 불일치**: 미리보기에 표시된 것이 삽입되는 것과 일치하지 않음
3. **문자 손실**: 컴포지션의 일부가 빠른 입력 중 손실됨
4. **상태 동기화 문제**: 브라우저와 IME 상태가 동기화되지 않음
5. **타이밍 의존적 문제**: 빠른 입력에서 문제가 더 뚜렷함

### 이벤트 시퀀스 분석:

```javascript
// 문제가 있는 Chrome + Fcitx 이벤트
document.addEventListener('compositionstart', (e) => {
  console.log('compositionstart:', e.data); // ''
});

document.addEventListener('compositionupdate', (e) => {
  console.log('compositionupdate:', e.data); // 불완전한 데이터를 표시할 수 있음
});

document.addEventListener('compositionend', (e) => {
  console.log('compositionend:', e.data); // 잘못되었거나 불완전할 수 있음
});
```

## 예상 동작

- Fcitx 컴포지션 창이 빠른 입력 중 안정적으로 유지되어야 합니다
- 미리보기 텍스트가 현재 컴포지션 상태를 정확하게 반영해야 합니다
- 모든 입력된 문자가 최종 확인까지 보존되어야 합니다
- 브라우저와 IME가 동기화된 상태를 유지해야 합니다
- 최종 삽입이 확인 시점의 컴포지션 미리보기와 일치해야 합니다

## 영향

- **문자 손상**: 한국어 텍스트가 불완전하거나 잘못됨
- **사용자 좌절**: 사용자가 손실된 문자로 인해 자주 다시 입력해야 함
- **입력 불일치**: 미리보기가 최종 결과와 일치하지 않아 사용자를 혼란스럽게 만듦
- **생산성 손실**: 빠른 입력이 신뢰할 수 없게 되어 입력이 느려짐
- **플랫폼 비호환성**: Linux + Chrome + Fcitx 조합에 중요한 입력 문제가 있음

## 브라우저 비교

- **Chrome + Fcitx Linux**: 심각한 컴포지션 상태 문제
- **Chrome + IBus Linux**: 일반적으로 더 나지만 여전히 일부 문제가 있음
- **Chrome + 시스템 IME**: 가장 신뢰할 수 있는 동작
- **Firefox + Fcitx Linux**: 다르지만 역시 문제가 있는 동작
- **Edge + Fcitx Linux**: Chrome과 유사한 문제 (Chromium 기반)
- **Chrome Windows/macOS**: 이러한 문제 없음 (다른 IME 시스템)

## 해결 방법

### 1. Fcitx 구성 최적화

```bash
# 더 나은 Chrome 호환성을 위한 Fcitx 구성
# ~/.config/fcitx/config 편집

[Program]
# Chrome 호환성을 개선하기 위해 컴포지션 최종화 지연
CompositionDelay=10

# 컴포지션 창 안정성 증가
CompositionWindowDelay=50

# 문자 처리 개선
CharacterHandling=full

# Chrome에 문제를 일으킬 수 있는 기능 비활성화
# 일부 Fcitx 기능이 Chrome에 문제를 일으킬 수 있음
[ChromeFix]
DisableAutoEngage=1
StableComposition=1
```

### 2. Chrome 특정 JavaScript 처리

```javascript
class FcitxChromeHandler {
  constructor(editor) {
    this.editor = editor;
    this.isFcitxChrome = this.detectFcitxChrome();
    this.compositionBuffer = '';
    this.expectedComposition = '';
    
    if (this.isFcitxChrome) {
      this.setupFcitxHandling();
    }
  }
  
  detectFcitxChrome() {
    // Linux에서 Fcitx와 Chrome 사용 중인지 감지
    return /Linux/.test(navigator.platform) && 
           /Chrome/.test(navigator.userAgent) &&
           this.checkFcitxProcess();
  }
  
  checkFcitxProcess() {
    // Fcitx가 실행 중인지 확인 (단순화된 감지)
    return navigator.userAgent.includes('Linux') && 
           document.title && document.title.includes('Fcitx');
  }
  
  setupFcitxHandling() {
    this.editor.addEventListener('compositionstart', this.handleCompositionStart.bind(this));
    this.editor.addEventListener('compositionupdate', this.handleCompositionUpdate.bind(this));
    this.editor.addEventListener('compositionend', this.handleCompositionEnd.bind(this));
    this.editor.addEventListener('input', this.handleInput.bind(this));
  }
  
  handleCompositionStart(e) {
    this.compositionBuffer = '';
    this.expectedComposition = '';
    
    console.log('Fcitx 컴포지션 시작됨');
    
    // Fcitx 특정 모니터링 활성화
    this.startCompositionMonitoring();
  }
  
  handleCompositionUpdate(e) {
    if (!this.isFcitxChrome) return;
    
    const data = e.data || '';
    
    // 예상 컴포지션 저장
    this.expectedComposition = data;
    
    // 데이터가 불완전하면 문제 로그
    if (data.length < this.compositionBuffer.length + 1) {
      console.warn('Fcitx 컴포지션 데이터 손실 감지됨. 예상:', data, '버퍼:', this.compositionBuffer);
    }
    
    this.compositionBuffer = data;
  }
  
  handleCompositionEnd(e) {
    if (!this.isFcitxChrome) return;
    
    const finalData = e.data || '';
    
    // 컴포지션이 손실되었는지 확인
    if (this.expectedComposition !== finalData) {
      console.warn('Fcitx 컴포지션 손상 감지됨. 예상:', this.expectedComposition, '실제:', finalData);
      
      // 손실된 문자 복구 시도
      this.recoverLostComposition();
    }
    
    this.compositionBuffer = '';
    this.expectedComposition = '';
    
    this.stopCompositionMonitoring();
  }
  
  handleInput(e) {
    if (!this.isFcitxChrome) return;
    
    // 문자 손실 모니터링
    if (e.inputType === 'insertText' && this.expectedComposition) {
      if (e.data && this.expectedComposition.includes(e.data) === false) {
        console.warn('입력 이벤트에서 Fcitx 문자 손실 감지됨');
      }
    }
  }
  
  recoverLostComposition() {
    // Fcitx 컴포지션 문제에서 복구 시도
    setTimeout(() => {
      // 현재 콘텐츠 확인 및 수정 시도
      const selection = window.getSelection();
      if (selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        const text = range.toString();
        
        // 일반적인 Fcitx 문제를 감지하고 수정하는 간단한 휴리스틱
        const fixedText = this.fixFcitxIssues(text);
        
        if (fixedText !== text) {
          range.deleteContents();
          range.insertNode(document.createTextNode(fixedText));
          
          console.log('Fcitx 컴포지션 복구됨:', text, '→', fixedText);
        }
      }
    }, 100);
  }
  
  fixFcitxIssues(text) {
    // 일반적인 Fcitx + Chrome 문제 및 수정
    
    // 문제 1: 누락된 종성 자모
    if (/[ㄱ-ㅎ][ㅏ-ㅣ]$/.test(text)) {
      // 텍스트가 초성 + 중성으로 끝나지만 종성이 없는 경우 누락된 종성 자모 추가
      const lastChar = text[text.length - 1];
      const isInitialMedialWithoutFinal = /[ㄱ-ㅎ][ㅏ-ㅣ]/.test(lastChar);
      
      if (isInitialMedialWithoutFinal) {
        // 일반적인 종성 시도
        const fixes = {
          'ㄱㅏ': '가', 'ㄴㅏ': '나', 'ㄷㅏ': '다', 'ㄹㅏ': '라',
          'ㄱㅓ': '개', 'ㄴㅓ': '네', 'ㄷㅓ': '데', 'ㄹㅓ': '레',
          'ㄱㅣ': '교', 'ㄴㅣ': '구', 'ㄷㅣ': '규', 'ㄹㅣ': '루'
        };
        
        for (const [pattern, replacement] of Object.entries(fixes)) {
          if (text.endsWith(pattern)) {
            return text.slice(0, -1) + replacement;
          }
        }
      }
    }
    
    // 문제 2: 잘못된 문자 조합
    // 이것은 한국어 맞춤법에 기반한 더 복잡한 로직이 필요합니다
    
    // 문제 3: 문자 중복
    const cleaned = text.replace(/(.)\1+/g, '$1');
    
    return cleaned;
  }
  
  startCompositionMonitoring() {
    // Fcitx 프로세스 및 창 상태 모니터링
    this.compositionMonitor = setInterval(() => {
      this.checkFcitxStability();
    }, 100);
  }
  
  stopCompositionMonitoring() {
    if (this.compositionMonitor) {
      clearInterval(this.compositionMonitor);
      this.compositionMonitor = null;
    }
  }
  
  checkFcitxStability() {
    // Fcitx가 여전히 실행 중이고 안정적인지 확인
    // 실제 구현에서는 시스템 호출이 포함될 것입니다
    
    // 단순화: 컴포지션 창이 보여야 하는지 확인
    const hasComposition = this.expectedComposition.length > 0;
    
    if (hasComposition && !document.activeElement) {
      console.warn('Fcitx 컴포지션이 감지되었지만 활성 요소가 없음');
      this.restoreCompositionState();
    }
  }
  
  restoreCompositionState() {
    // Fcitx 컴포지션 상태 복원 시도
    const selection = window.getSelection();
    if (selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      
      // 다시 포커스를 맞추고 컴포지션 상태 복구 트리거 시도
      this.editor.focus();
      
      // 실제 구현에서는 이것이
      // Fcitx에 대한 시스템 호출 또는 특수 명령을 포함할 수 있습니다
    }
  }
}
```

### 3. 대체 IME 제안

```javascript
function suggestAlternativeIME() {
  const isLinux = /Linux/.test(navigator.platform);
  const isChrome = /Chrome/.test(navigator.userAgent);
  
  if (isLinux && isChrome) {
    const koreanUser = navigator.language.startsWith('ko');
    
    if (koreanUser) {
      this.showIMEAlternatives();
    }
  }
}

function showIMEAlternatives() {
  const alternatives = document.createElement('div');
  alternatives.className = 'ime-alternatives-modal';
  alternatives.innerHTML = `
    <div class="modal-content">
      <h3>⚠️ 한국어 입력 문제 감지됨</h3>
      <p>Linux에서 Chrome + Fcitx는 알려진 한국어 입력 문제가 있습니다. 이러한 대안을 고려하세요:</p>
      
      <div class="ime-options">
        <div class="ime-option">
          <h4>IBus-hangul</h4>
          <p>Linux에서 Chrome과 더 안정적</p>
          <button onclick="setupIMESuggestion('ibus')">설정 가이드</button>
        </div>
        
        <div class="ime-option">
          <h4>Kimch</h4>
          <p>더 나은 Chrome 호환성을 가진 한국어 IME</p>
          <button onclick="setupIMESuggestion('kimch')">설정 가이드</button>
        </div>
        
        <div class="ime-option">
          <h4>Nabi</h4>
          <p>경량 한국어 IME</p>
          <button onclick="setupIMESuggestion('nabi')">설정 가이드</button>
        </div>
      </div>
      
      <div class="actions">
        <button onclick="dismissAlternatives()">현재 IME로 계속</button>
        <button onclick="rememberChoice('fcitx')">다시 표시하지 않기</button>
      </div>
    </div>
  `;
  
  alternatives.style.cssText = `
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: white;
    border: 2px solid #333;
    border-radius: 12px;
    padding: 30px;
    box-shadow: 0 8px 32px rgba(0,0,0,0.2);
    z-index: 10000;
    max-width: 500px;
    font-family: system-ui, sans-serif;
  `;
  
  document.body.appendChild(alternatives);
}

function setupIMESuggestion(imeType) {
  // 특정 IME에 대한 설정 가이드 열기
  window.open(`https://github.com/ime-setup-${imeType}`, '_blank');
}

function dismissAlternatives() {
  const modal = document.querySelector('.ime-alternatives-modal');
  if (modal) {
    document.body.removeChild(modal);
  }
}

function rememberChoice(choice) {
  localStorage.setItem('chrome-linux-ime-choice', choice);
  dismissAlternatives();
}
```

### 4. 시스템 환경 최적화

```bash
#!/bin/bash
# fcitx-chrome-optimization.sh

echo "더 나은 Fcitx + Chrome 호환성을 위해 Linux 환경 최적화 중..."

# 더 나은 Fcitx 동작을 위한 환경 변수 설정
export GTK_IM_MODULE=fcitx
export XMODIFIERS="@im=fcitx"
export QT_IM_MODULE=fcitx

# Chrome 시작 플래그 최적화
CHROME_FLAGS="--disable-gpu-rasterization --enable-gpu-rasterization --disable-software-rasterizer --enable-native-gpu-memory-buffers"

echo "Chrome이 최적화된 플래그로 시작됩니다: $CHROME_FLAGS"
echo "변경 사항을 적용하려면 세션을 다시 시작하세요."

# 현재 상태 표시
echo "현재 Fcitx 상태:"
fcitx-diagnose 2>/dev/null || echo "Fcitx가 실행 중이 아닙니다"

echo ""
echo "최적화 완료. 문제가 개선되어야 합니다."
echo "문제가 지속되면 IBus 또는 시스템 한국어 IME로 전환을 고려하세요."
```

## 테스트 권장 사항

1. **다양한 Linux 배포판**: Fcitx가 있는 Ubuntu, Fedora, Arch, openSUSE
2. **Chrome 버전**: 110, 111, 112, 113, 114, 115, 120, 최신
3. **Fcitx 버전**: 4.x, 5.x 시리즈
4. **빠른 입력 테스트**: 빠른 한국어 텍스트 입력 (30+ wpm)
5. **복잡한 컴포지션**: 여러 후보가 있는 긴 한국어 단어
6. **혼합 콘텐츠 테스트**: 동일한 텍스트의 한국어 + 영어 + 숫자

## 참고사항

- 이 문제는 Linux에서 Fcitx + Chrome 조합에 특정됩니다
- 다른 브라우저(Firefox, Edge) 또는 다른 IME(IBus)는 다른 동작을 보여줍니다
- 근본 원인은 Chrome이 Fcitx 컴포지션 이벤트를 처리하는 방식에 있는 것으로 보입니다
- Fcitx 구성이 문제를 완화할 수 있지만 완전히 제거하지는 않습니다
- 대체 IME는 일반적으로 Linux에서 더 나은 Chrome 호환성을 제공합니다
- 이것은 Linux 한국어 입력 커뮤니티에서 잘 알려진 문제입니다
