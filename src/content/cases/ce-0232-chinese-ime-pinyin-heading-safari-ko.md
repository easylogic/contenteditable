---
id: ce-0232
scenarioId: scenario-ime-duplicate-text-heading
locale: ko
os: macOS
osVersion: "13+"
device: Desktop (Mac)
deviceVersion: Any
browser: Safari
browserVersion: "17+"
keyboard: Chinese (IME) - macOS Chinese Input
caseTitle: WebKit에서 제목(H1-H6)에서 IME 컴포지션 시 Pinyin 노출
description: "Safari에서 중국어 IME를 사용하여 제목 요소(H1-H6) 안에 텍스트를 입력할 때, 스페이스바로 컴포지션을 확정하면 원본 Pinyin 버퍼와 확정된 한자가 함께 표시됩니다. 예를 들어 'nihao 你好'처럼 불필요한 텍스트가 남아 있습니다."
tags:
  - composition
  - ime
  - heading
  - chinese
  - webkit
  - duplicate-text
status: draft
initialHtml: |
  <h2 contenteditable="true" style="padding: 20px; border: 1px solid #ccc;">중국어 IME로 입력하세요</h2>
domSteps:
  - label: "Before"
    html: '<h2 contenteditable="true"></h2>'
    description: "빈 제목 요소"
  - label: "Step 1: Type Pinyin 'nihao'"
    html: '<h2 contenteditable="true">nihao</h2>'
    description: "IME로 Pinyin 'nihao' 입력 중 (후보 표시)"
  - label: "Step 2: Press Space to confirm"
    html: '<h2 contenteditable="true">nihao 你好</h2>'
    description: "❌ 버그: Pinyin 'nihao'와 한자 '你好'가 함께 표시됨"
  - label: "✅ Expected"
    html: '<h2 contenteditable="true">你好</h2>'
    description: "예상: 한자 '你好'만 표시되어야 함"
---

## 현상

Safari(WebKit)에서 제목 요소(H1-H6)에 중국어 IME로 텍스트를 입력할 때, 컴포지션 확정 시 원본 Pinyin 버퍼가 노출되는 버그입니다.

## 재현 예시

1. H2 또는 다른 제목 요소에 포커스합니다.
2. macOS 중국어 IME를 활성화합니다.
3. Pinyin "nihao"를 입력합니다 (한자 "你好"의 후보).
4. Space 키를 눌러 컴포지션을 확정합니다.

## 관찰된 동작

- **중복 텍스트**: Pinyin "nihao"와 한자 "你好"가 함께 표시됨 → "nihao 你好"
- **제목 요소에서만 발생**: P 요소(`<p>`, `<div>`)에서는 정상 작동
- **WebKit 특유**: Chrome에서도 발생할 수 있으나, Safari에서 명확하게 확인됨
- **Firefox에서는 정상**: Firefox에서는 Pinyin 버퍼가 노출되지 않음

## 예상 동작

- Pinyin 버퍼("nihao")는 보이지 않아야 함
- 확정된 한자("你好")만 표시되어야 함

## 참고사항 및 가능한 해결 방향

- **제목 요소 사용 피하기**: `<h1>`~`<h6>` 대신 `<p>` + CSS 스타일링(`font-size`, `font-weight`) 사용
- **compositionend 이벤트로 DOM 정리**: 컴포지션 완료 후 불필요한 Pinyin 텍스트 제거
- **Space 키 가로채기**: 컴포지션 중 Space 키를 막아서 IME가 자연스럽게 완료되도록 함

## 코드 예시

```javascript
const heading = document.querySelector('h2[contenteditable]');
let isComposing = false;

heading.addEventListener('compositionstart', () => {
  isComposing = true;
});

heading.addEventListener('compositionend', () => {
  isComposing = false;
  // DOM 정리: Pinyin 제거
  setTimeout(() => {
    const text = heading.textContent;
    // 알파벳만 제거 (Pinyin 버퍼)
    const cleaned = text.replace(/[a-z]+/g, '');
    heading.textContent = cleaned;
  }, 0);
});

heading.addEventListener('keydown', (e) => {
  if (isComposing && e.key === ' ') {
    e.preventDefault();
    // IME가 컴포지션 완료하도록 대기
  }
});
```
