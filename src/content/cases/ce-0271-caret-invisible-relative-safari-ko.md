---
id: ce-0271
scenarioId: scenario-caret-invisible-relative
locale: ko
os: macOS
osVersion: "13+"
device: Desktop (Mac)
deviceVersion: Any
browser: Safari
browserVersion: "17+"
keyboard: English (QWERTY)
caseTitle: position:relative 요소에서 캐럿이 보이지 않음 (Safari)
description: "position:relative 속성을 가진 요소 안에 contenteditable 요소가 있을 때, 텍스트 캐럿(커서)가 완전히 보이지 않습니다. 텍스트는 입력되지만, 삽입점의 시각적 피드백이 없어 편집이 어렵습니다."
tags:
  - caret
  - cursor
  - css
  - position-relative
  - safari
  - webkit
status: draft
initialHtml: |
  <div style="position: relative; padding: 20px; border: 1px solid #ccc;">
    <div contenteditable="true" style="min-height: 100px;">
      여기에 텍스트를 입력하세요. 캐럿이 보이는지 확인하세요.
    </div>
  </div>
domSteps:
  - label: "Before"
    html: '<div style="position: relative;"><div contenteditable="true"></div></div>'
    description: "position:relative 컨테이너 안에 빈 contenteditable"
  - label: "Step 1: Focus on editor"
    html: '<div style="position: relative;"><div contenteditable="true"></div></div>'
    description: "❌ 캐럿이 보이지 않음! 입력점을 알 수 없음"
  - label: "Step 2: Type text"
    html: '<div style="position: relative;"><div contenteditable="true">안녕하세요</div></div>'
    description: "텍스트는 나타나지만 캐럿은 여전히 안보임"
  - label: "✅ Expected"
    html: '<div style="position: relative;"><div contenteditable="true">안녕하세요|</div></div>'
    description: "예상: 캐럿이 깜빡이거나 다른 형태로 보여야 함"
---

## 현상

position:relative 속성을 가진 요소 안에 contenteditable 요소가 있을 때, 텍스트 캐럿이 보이지 않습니다.

## 재현 예시

1. position:relative 속성을 가진 컨테이너 요소를 만듭니다.
2. 그 안에 contenteditable 요소를 둡니다.
3. contenteditable 요소에 포커스합니다.
4. ❌ 캐럿이 아무것도 보이지 않습니다!

## 관찰된 동작

- **캐럿 보이지 않음**: 삽입점을 시각적으로 알 수 없음
- **텍스트 입력됨**: 타이핑한 텍스트는 정상적으로 나타남
- **편집 어려움**: 사용자가 어디에 타이핑되고 있는지 추적하기 어려움
- **WebKit 기반 브라우저**: Safari, Chrome, Firefox(macOS)에서 발생
- **position:relative 유발**: 이 속성이 문제의 원인

## 예상 동작

- 캐럿이 깜빡이거나 다른 형태로 보여야 함
- 삽입점의 시각적 피드백이 제공되어야 함
- position:relative가 캐럿 렌더링에 영향을 미치지 않아야 함

## 참고사항 및 가능한 해결 방향

- **position:relative 제거**: 부모 요소에서 position:relative 속성 제거
- **position:static 사용**: position:static으로 변경
- **래퍼 요소 사용**: position:relative를 래퍼 요소로 옮기고 contenteditable은 static 유지
- **커스텀 캐럿 구현**: CSS 애니메이션으로 깜빡이는 캐럿 직접 만듭니다
- **caret-color 테스트**: 일부 브라우저에서 caret-color가 도움이 될 수 있음

## 코드 예시

### CSS 해결책 1: position:relative 제거
```css
/* 문제의 원인 제거 */
.editable-container {
  position: static; /* 또는 position 속성 완전 제거 */
}

[contenteditable] {
  min-height: 100px;
  outline: 2px solid #ddd; /* 편집 영역 표시 */
}
```

### CSS 해결책 2: 래퍼 요소
```css
/* position:relative를 래퍼로 옮기기 */
.wrapper {
  position: relative;
  padding: 20px;
  border: 1px solid #ccc;
}

[contenteditable] {
  position: static; /* contenteditable은 static 유지 */
  min-height: 100px;
}
```

### CSS 해결책 3: 커스텀 캐럿 구현
```css
/* 커스텀 캐럿 애니메이션 */
@keyframes caret-blink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0; }
}

.custom-caret {
  position: absolute;
  width: 2px;
  height: 20px;
  background: black;
  animation: caret-blink 1s infinite;
  pointer-events: none; /* 캐럿이 클릭 불가 */
}
```

```javascript
// 커스텀 캐럿 위치 제어
const editor = document.querySelector('[contenteditable]');
const caret = document.createElement('span');
caret.className = 'custom-caret';
document.body.appendChild(caret);

editor.addEventListener('input', (e) => {
  const selection = window.getSelection();
  if (selection.rangeCount > 0) {
    const range = selection.getRangeAt(0);
    const rect = range.getBoundingClientRect();
    
    // 캐럿 위치 업데이트
    caret.style.top = rect.top + 'px';
    caret.style.left = rect.left + 'px';
  }
});
```
