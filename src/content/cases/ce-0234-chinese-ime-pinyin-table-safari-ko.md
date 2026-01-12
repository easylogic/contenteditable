---
id: ce-0234
scenarioId: scenario-ime-pinyin-visible-safari
locale: ko
os: macOS
osVersion: "13+"
device: Desktop (Mac)
deviceVersion: Any
browser: Safari
browserVersion: "17+"
keyboard: Chinese (IME) - macOS Chinese Input
caseTitle: Safari에서 테이블 셀에서 IME 입력 시 Pinyin 노출
description: "Safari에서 테이블 셀(`<td>`) 안에 중국어 IME로 텍스트를 입력할 때, 스페이스바로 컴포지션을 확정하면 원본 Pinyin 버퍼와 확정된 한자가 함께 표시됩니다. 예를 들어 'nihao 你好'처럼 불필요한 텍스트가 남아 있습니다."
tags:
  - composition
  - ime
  - table
  - chinese
  - safari
status: draft
initialHtml: |
  <table border="1" cellpadding="10" style="border-collapse: collapse;">
    <tr>
      <td contenteditable="true" style="width: 200px; border: 1px solid #ddd;">
        테이블 셀 1
      </td>
      <td contenteditable="true" style="width: 200px; border: 1px solid #ddd;">
        테이블 셀 2
      </td>
    </tr>
  </table>
domSteps:
  - label: "Before"
    html: '<td contenteditable="true"></td>'
    description: "빈 테이블 셀"
  - label: "Step 1: Type Pinyin 'nihao'"
    html: '<td contenteditable="true">nihao</td>'
    description: "IME로 Pinyin 'nihao' 입력 중 (후보 표시)"
  - label: "Step 2: Press Space to confirm"
    html: '<td contenteditable="true">nihao 你好</td>'
    description: "❌ 버그: Pinyin 'nihao'와 한자 '你好'가 함께 표시됨"
  - label: "✅ Expected"
    html: '<td contenteditable="true">你好</td>'
    description: "예상: 한자 '你好'만 표시되어야 함"
---

## 현상

Safari에서 테이블 셀(`<td>`) 안에 중국어 IME로 텍스트를 입력할 때, 컴포지션 확정 시 원본 Pinyin 버퍼가 노출되는 버그입니다.

## 재현 예시

1. 테이블 셀(`<td>` 요소)에 포커스합니다.
2. macOS 중국어 IME를 활성화합니다.
3. Pinyin "nihao"를 입력합니다 (한자 "你好"의 후보).
4. 스페이스바를 눌러 컴포지션을 확정합니다.

## 관찰된 동작

- **중복 텍스트**: Pinyin "nihao"와 한자 "你好"가 함께 표시됨 → "nihao 你好"
- **테이블 셀에서만 발생**: `<p>`, `<div>` 요소에서는 정상 작동
- **Safari 특유**: Chrome, Firefox에서는 발생하지 않음
- **WebKit 테이블 처리**: 테이블 구조에서 IME 처리가 복잡해질 수 있음

## 예상 동작

- Pinyin 버퍼("nihao")는 보이지 않아야 함
- 확정된 한자("你好")만 표시되어야 함

## 참고사항 및 가능한 해결 방향

- **테이블 셀 사용 피하기**: `<td>` 대신 `<div>`를 사용하여 셀 내용을 표현
- **compositionend 이벤트로 DOM 정리**: 컴포지션 완료 후 불필요한 Pinyin 텍스트 제거
- **모달/오버레이 사용**: 테이블 셀 편집 시 모달 창을 띄워서 직접 셀에서 IME 사용을 피함
- **contenteditable 속성 제어**: 테이블 구조를 단순화하여 IME 처리 안정성 확보

## 코드 예시

```javascript
const cell = document.querySelector('td[contenteditable]');
let isComposing = false;

cell.addEventListener('compositionstart', () => {
  isComposing = true;
});

cell.addEventListener('compositionend', () => {
  isComposing = false;
  // DOM 정리: Pinyin 제거
  setTimeout(() => {
    const text = cell.textContent;
    const cleaned = text.replace(/[a-z]+/g, '');
    cell.textContent = cleaned;
  }, 0);
});

cell.addEventListener('keydown', (e) => {
  if (isComposing && e.key === ' ') {
    e.preventDefault();
    // IME가 자연스럽게 완료되도록 대기
  }
});
```
