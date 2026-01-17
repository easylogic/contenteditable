---
id: ce-0221-edge-clipboard-linux-ko
scenarioId: scenario-edge-clipboard-linux
locale: ko
os: Linux
osVersion: "22.04+"
device: Desktop
deviceVersion: Any
browser: Edge
browserVersion: "115.0+"
keyboard: US QWERTY
caseTitle: Linux에서 Edge가 붙여넣기 작업 시 모든 포맷팅을 제거함
description: "Linux에서 Edge 브라우저를 사용할 때 contenteditable 요소에 붙여넣기 작업을 수행하면 굵게, 기울임꼴, 링크, 이미지를 포함한 모든 HTML 포맷팅이 제거됩니다. 클립보드에 유효한 HTML이 포함되어 있어도 발생합니다. 브라우저는 모든 붙여넣기를 일반 텍스트로 처리하여 클립보드 형식 기본 설정을 무시합니다."
tags:
  - linux
  - edge
  - clipboard
  - paste
  - formatting-loss
  - html-stripping
  - contenteditable
status: draft
domSteps:
  - label: "클립보드 콘텐츠"
    html: '<p>This is <strong>bold</strong> text with a <a href="https://example.com">link</a> and an <em>italic</em> word.</p>'
    description: "클립보드에 복사된 리치 텍스트"
  - label: "붙여넣기 전"
    html: '<div contenteditable="true"><p>Paste here:</p></div>'
    description: "대상 contenteditable 요소"
  - label: "붙여넣기 후"
    html: '<div contenteditable="true"><p>Paste here: This is bold text with a link and an italic word.</p></div>'
    description: "모든 포맷팅이 제거되고 일반 텍스트만 남음"
---

## 현상

Linux에서 Edge 브라우저를 사용할 때 contenteditable 요소에 붙여넣기 작업을 수행하면 모든 HTML 포맷팅이 일관되게 제거됩니다. 다른 소스(웹 페이지, 문서, 이메일)의 리치 텍스트가 모든 스타일, 링크, 구조를 잃어 일반 텍스트만 삽입됩니다. 이 동작은 소스 콘텐츠의 형식과 관계없이 발생합니다.

## 재현 예시

1. Linux에서 Edge 브라우저를 엽니다 (Ubuntu 22.04+ 또는 유사).
2. 모든 소스(웹 페이지, 문서 등)에서 리치 텍스트 콘텐츠를 복사합니다.
3. `contenteditable` 요소를 만들고 포커스를 맞춥니다.
4. Ctrl+V 또는 컨텍스트 메뉴를 사용하여 붙여넣습니다.
5. 모든 포맷팅이 제거되고 일반 텍스트만 남는 것을 관찰합니다.
6. 다양한 유형의 콘텐츠로 시도합니다:
   - 굵게/기울임꼴 텍스트
   - href 속성이 있는 링크
   - 이미지
   - 목록 및 테이블
   - 사용자 정의 스타일이 있는 텍스트

## 관찰된 동작

### 완전한 포맷팅 제거:

1. **텍스트 스타일링**: 굵게, 기울임꼴, 밑줄, 색상이 모두 제거됩니다
2. **링크**: URL이 제거되고 링크 텍스트만 남습니다
3. **이미지**: 완전히 제거되고 이미지 콘텐츠가 삽입되지 않습니다
4. **목록**: 목록 마커 없이 일반 텍스트로 변환됩니다
5. **테이블**: 구조가 손실되고 셀 텍스트 콘텐츠만 남습니다
6. **사용자 정의 HTML**: 기본 텍스트를 제외한 모든 태그가 제거됩니다
7. **줄바꿈**: 단일 공백 또는 기본 줄바꿈으로 변환될 수 있습니다

### 클립보드 형식 처리:

**Linux에서 Edge 동작:**
- `text/html` 클립보드 형식을 무시합니다
- `text/plain` 형식만 처리합니다
- 리치 콘텐츠 메타데이터를 버립니다
- 붙여넣기 동작에 대한 사용자 선택이 없습니다

**예상 동작:**
- `text/html` 형식을 먼저 확인해야 합니다
- HTML 구조를 보존해야 합니다
- 붙여넣기 옵션(일반 텍스트 vs 리치 텍스트)을 제공해야 합니다
- 혼합 클립보드 콘텐츠를 처리해야 합니다

### 이벤트 시퀀스 분석:

```javascript
// Edge Linux 붙여넣기 이벤트
document.addEventListener('paste', (e) => {
  console.log('Clipboard data types:', e.clipboardData.types);
  // 출력: ['text/plain'] - 일반 텍스트만 사용 가능
  
  console.log('HTML data:', e.clipboardData.getData('text/html'));
  // 출력: '' - 빈 문자열
  
  console.log('Plain text:', e.clipboardData.getData('text/plain'));
  // 출력: 'This is bold text with a link...' - 일반 텍스트만
});
```

## 예상 동작

- 사용 가능할 때 HTML 포맷팅을 보존해야 합니다
- 붙여넣기 옵션(리치 텍스트 vs 일반 텍스트)을 제공해야 합니다
- 이미지 및 미디어 콘텐츠를 처리해야 합니다
- 링크 구조 및 기능을 유지해야 합니다
- 목록 및 테이블 포맷팅을 존중해야 합니다
- 붙여넣기 동작에 대한 사용자 제어를 제공해야 합니다

## 영향

- **사용자 좌절**: 사용자가 예상치 못하게 포맷팅을 잃습니다
- **콘텐츠 품질**: 붙여넣은 콘텐츠가 전문적이지 않게 보입니다
- **워크플로우 중단**: 사용자가 콘텐츠를 수동으로 다시 포맷팅해야 합니다
- **데이터 손실**: 중요한 구조적 정보가 손실됩니다
- **접근성**: 의미론적 구조(목록, 제목)가 손실됩니다
- **크로스 플랫폼 불일치**: 다른 플랫폼과 다른 동작

## 브라우저 비교

- **Edge Linux**: 모든 포맷팅 제거 (가장 제한적)
- **Chrome Linux**: 대부분의 포맷팅을 올바르게 보존
- **Firefox Linux**: 사용자 확인과 함께 포맷팅 보존
- **Edge Windows/Mac**: 포맷팅을 올바르게 보존
- **Safari Mac**: 리치 붙여넣기 옵션과 함께 포맷팅 보존
- **Chrome Windows/Mac**: 포맷팅을 올바르게 보존

## 해결 방법

### 1. 클립보드 API를 사용한 사용자 정의 붙여넣기 처리기

```javascript
class LinuxPasteHandler {
  constructor(editorElement) {
    this.editor = editorElement;
    this.isLinux = /Linux/.test(navigator.platform);
    this.isEdge = /Edg\//.test(navigator.userAgent);
    
    if (this.isLinux && this.isEdge) {
      this.setupCustomPasteHandling();
    }
  }
  
  setupCustomPasteHandling() {
    this.editor.addEventListener('paste', this.handlePaste.bind(this), true);
    this.editor.addEventListener('beforepaste', this.handleBeforePaste.bind(this), true);
  }
  
  async handlePaste(e) {
    e.preventDefault();
    e.stopPropagation();
    
    try {
      // 확장 권한으로 클립보드 읽기 시도
      const clipboardItems = await navigator.clipboard.read();
      
      for (const item of clipboardItems) {
        for (const type of item.types) {
          if (type === 'text/html') {
            const htmlBlob = await item.getType(type);
            const html = await htmlBlob.text();
            this.insertHTML(html);
            return;
          } else if (type === 'image/png' || type === 'image/jpeg') {
            const imageBlob = await item.getType(type);
            this.insertImage(imageBlob);
            return;
          }
        }
      }
      
      // 일반 텍스트로 폴백
      const plainText = await this.getPlainClipboardText();
      this.insertText(plainText);
      
    } catch (error) {
      console.warn('향상된 클립보드 액세스 실패:', error);
      this.handleFallbackPaste(e);
    }
  }
  
  async handleBeforePaste(e) {
    // 브라우저가 처리하기 전에 클립보드를 캡처하는 사전 붙여넣기 처리
    if (e.clipboardData && e.clipboardData.types.includes('text/html')) {
      e.preventDefault();
      const html = e.clipboardData.getData('text/html');
      this.insertHTML(html);
    }
  }
  
  async getPlainClipboardText() {
    try {
      return await navigator.clipboard.readText();
    } catch (error) {
      return '';
    }
  }
  
  insertHTML(html) {
    // HTML 정리 및 삽입
    const sanitizedHTML = this.sanitizeHTML(html);
    
    const selection = window.getSelection();
    if (selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      range.deleteContents();
      
      const fragment = this.createFragmentFromHTML(sanitizedHTML);
      range.insertNode(fragment);
    }
  }
  
  insertImage(blob) {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = document.createElement('img');
      img.src = e.target.result;
      img.alt = '붙여넣은 이미지';
      
      this.insertAtCursor(img);
    };
    reader.readAsDataURL(blob);
  }
  
  insertText(text) {
    this.insertAtCursor(document.createTextNode(text));
  }
  
  insertAtCursor(node) {
    const selection = window.getSelection();
    if (selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      range.deleteContents();
      range.insertNode(node);
      range.collapse(false);
    }
  }
  
  sanitizeHTML(html) {
    // 기본 HTML 정리
    const temp = document.createElement('div');
    temp.innerHTML = html;
    
    // 스크립트 태그 및 위험한 속성 제거
    const scripts = temp.querySelectorAll('script');
    scripts.forEach(script => script.remove());
    
    const elements = temp.querySelectorAll('*');
    elements.forEach(el => {
      // 이벤트 핸들러 제거
      const attributes = el.attributes;
      for (let i = attributes.length - 1; i >= 0; i--) {
        const attr = attributes[i];
        if (attr.name.startsWith('on')) {
          el.removeAttribute(attr.name);
        }
      }
    });
    
    return temp.innerHTML;
  }
  
  createFragmentFromHTML(html) {
    const template = document.createElement('template');
    template.innerHTML = html.trim();
    return template.content.cloneNode(true);
  }
  
  handleFallbackPaste(e) {
    // 기본 clipboardData로 폴백
    if (e.clipboardData) {
      const items = e.clipboardData.items;
      
      for (let i = 0; i < items.length; i++) {
        const item = items[i];
        
        if (item.type === 'text/html') {
          const html = e.clipboardData.getData('text/html');
          if (html && html.trim()) {
            this.insertHTML(html);
            return;
          }
        }
        
        if (item.type.startsWith('image/')) {
          const blob = item.getAsFile();
          if (blob) {
            this.insertImage(blob);
            return;
          }
        }
      }
      
      // 최종 폴백: 일반 텍스트
      const text = e.clipboardData.getData('text/plain');
      this.insertText(text);
    }
  }
}
```

### 2. 클립보드 액세스를 위한 사용자 권한 요청

```javascript
async function requestClipboardPermission() {
  try {
    const permission = await navigator.permissions.query({ 
      name: 'clipboard-read' 
    });
    
    if (permission.state === 'granted') {
      return true;
    } else if (permission.state === 'prompt') {
      const granted = await requestUserPermission(
        '이 사이트는 Linux에서 Edge로 콘텐츠를 붙여넣을 때 포맷팅을 보존하기 위해 클립보드 액세스가 필요합니다. 클립보드 액세스를 허용하시겠습니까?'
      );
      return granted;
    }
    
    return false;
  } catch (error) {
    console.warn('클립보드 권한 API를 사용할 수 없습니다');
    return false;
  }
}

function requestUserPermission(message) {
  return new Promise((resolve) => {
    const modal = document.createElement('div');
    modal.className = 'clipboard-permission-modal';
    modal.innerHTML = `
      <div class="modal-content">
        <h3>클립보드 액세스 필요</h3>
        <p>${message}</p>
        <div class="modal-buttons">
          <button id="allow-clipboard">허용</button>
          <button id="deny-clipboard">거부</button>
        </div>
      </div>
    `;
    
    document.body.appendChild(modal);
    
    modal.querySelector('#allow-clipboard').addEventListener('click', () => {
      document.body.removeChild(modal);
      resolve(true);
    });
    
    modal.querySelector('#deny-clipboard').addEventListener('click', () => {
      document.body.removeChild(modal);
      resolve(false);
    });
  });
}
```

### 3. 대체 붙여넣기 방법

```javascript
function showPasteOptions() {
  const menu = document.createElement('div');
  menu.className = 'paste-options-menu';
  menu.innerHTML = `
    <div class="paste-option" data-type="rich">포맷팅과 함께 붙여넣기</div>
    <div class="paste-option" data-type="plain">일반 텍스트로 붙여넣기</div>
    <div class="paste-option" data-type="markdown">Markdown으로 붙여넣기</div>
  `;
  
  // 메뉴 위치 지정 및 선택 처리
  document.body.appendChild(menu);
  
  menu.addEventListener('click', (e) => {
    const type = e.target.dataset.type;
    handlePasteChoice(type);
    document.body.removeChild(menu);
  });
}

async function handlePasteChoice(type) {
  try {
    const clipboardItems = await navigator.clipboard.read();
    
    for (const item of clipboardItems) {
      switch (type) {
        case 'rich':
          if (item.types.includes('text/html')) {
            const html = await item.getType('text/html');
            insertHTML(await html.text());
            return;
          }
          break;
          
        case 'plain':
          const text = await navigator.clipboard.readText();
          insertText(text);
          return;
          
        case 'markdown':
          // HTML을 Markdown으로 변환
          if (item.types.includes('text/html')) {
            const html = await item.getType('text/html');
            const markdown = htmlToMarkdown(await html.text());
            insertText(markdown);
            return;
          }
          break;
      }
    }
    
    // 폴백
    insertText(await navigator.clipboard.readText());
    
  } catch (error) {
    console.error('향상된 붙여넣기 실패:', error);
  }
}
```

## 테스트 권장 사항

1. **다양한 콘텐츠 유형**: 텍스트, 이미지, 테이블, 목록, 링크
2. **다양한 소스**: 웹 페이지, 문서, 이메일, 기타 앱
3. **다양한 Linux 배포판**: Ubuntu, Fedora, Arch, openSUSE
4. **Edge 버전**: 115, 116, 117, 최신
5. **클립보드 관리자**: 시스템 클립보드 관리자 유무로 테스트
6. **보안 컨텍스트**: HTTP vs HTTPS, 다양한 권한 수준

## 참고사항

- 이것은 Linux에서 Edge의 보안/호환성 결정으로 보입니다
- Linux 클립보드 시스템 차이와 관련이 있을 수 있습니다
- 문제는 다양한 데스크톱 환경에서 지속됩니다
- Edge의 콘텐츠 보안 정책과 관련 없음 - Linux 플랫폼에 특정됨
- 해결 방법은 향상된 클립보드 액세스를 위한 사용자 권한이 필요합니다
