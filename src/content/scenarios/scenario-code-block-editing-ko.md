---
id: scenario-code-block-editing
title: 코드 블록 편집 동작이 브라우저마다 다름
description: "contenteditable 요소에서 코드 블록(<pre><code>) 내에서 텍스트를 편집하는 것이 브라우저마다 일관되지 않게 동작합니다. 줄바꿈, 들여쓰기, 공백 보존 및 서식이 다르게 처리될 수 있어 코드 서식을 유지하기 어렵습니다."
category: formatting
tags:
  - code
  - pre
  - whitespace
  - formatting
status: draft
locale: ko
---

contenteditable 요소에서 코드 블록(`<pre><code>`) 내에서 텍스트를 편집하는 것이 브라우저마다 일관되지 않게 동작합니다. 줄바꿈, 들여쓰기, 공백 보존 및 서식이 다르게 처리될 수 있어 코드 서식을 유지하기 어렵습니다.

## 관찰된 동작

### 시나리오 1: 코드 블록의 줄바꿈
- **Chrome/Edge**: 줄바꿈이 보존되거나 `<br>` 태그로 변환될 수 있음
- **Firefox**: 유사한 동작이지만 다르게 처리할 수 있음
- **Safari**: 줄바꿈을 올바르게 보존하지 않을 수 있음

### 시나리오 2: 들여쓰기 및 공백
- **Chrome/Edge**: `<pre>` 태그에도 불구하고 여러 공백이 축소될 수 있음
- **Firefox**: 유사한 공백 처리 문제
- **Safari**: 공백 보존이 일관되지 않음

### 시나리오 3: 코드 블록에서 입력
- **Chrome/Edge**: 텍스트가 삽입되지만 서식이 손실될 수 있음
- **Firefox**: 유사한 문제
- **Safari**: 동작이 다양함

### 시나리오 4: 코드 블록에 코드 붙여넣기
- **Chrome/Edge**: 서식을 보존하거나 손실할 수 있음
- **Firefox**: 서식을 잃을 가능성이 더 높음
- **Safari**: 가장 일관되지 않은 동작

## 영향

- 코드 서식 유지 어려움
- 들여쓰기 및 공백 손실
- 일관되지 않은 코드 블록 편집 경험
- 코드 구조를 보존하기 위한 해결 방법 필요

## 브라우저 비교

- **Chrome/Edge**: 일반적으로 더 나은 코드 블록 처리
- **Firefox**: 서식을 잃을 가능성이 더 높음
- **Safari**: 가장 일관되지 않은 동작

## 해결 방법

사용자 정의 코드 블록 처리 구현:

```javascript
element.addEventListener('input', (e) => {
  const codeBlocks = element.querySelectorAll('pre code, code');
  codeBlocks.forEach(code => {
    // 공백 보존
    if (!code.style.whiteSpace) {
      code.style.whiteSpace = 'pre';
    }
    
    // 코드 내에서 서식 방지
    code.addEventListener('beforeinput', (e) => {
      if (e.inputType.startsWith('format')) {
        e.preventDefault();
      }
    });
  });
});

// 코드 블록에서 붙여넣기 처리
element.addEventListener('paste', (e) => {
  const selection = window.getSelection();
  if (selection.rangeCount === 0) return;
  
  const range = selection.getRangeAt(0);
  const code = range.startContainer.closest('code, pre');
  
  if (code) {
    e.preventDefault();
    const text = e.clipboardData.getData('text/plain');
    
    // 공백과 줄바꿈 보존
    const lines = text.split('\n');
    const fragment = document.createDocumentFragment();
    
    lines.forEach((line, index) => {
      fragment.appendChild(document.createTextNode(line));
      if (index < lines.length - 1) {
        fragment.appendChild(document.createElement('br'));
      }
    });
    
    range.deleteContents();
    range.insertNode(fragment);
  }
});
```
