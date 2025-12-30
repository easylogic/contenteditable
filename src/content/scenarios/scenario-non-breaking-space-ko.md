---
id: scenario-non-breaking-space
title: 줄바꿈 없는 공백이 일반 공백과 다르게 동작함
description: "줄바꿈 없는 공백(`&nbsp;` 또는 `\u00A0`)은 HTML에서 간격을 보존하는 데 사용되지만, contenteditable 요소에서 일반 공백과 다르게 동작합니다. 편집 중에 일반 공백으로 변환되거나 예상치 못한 방식으로 줄바꿈을 방지할 수 있습니다."
category: formatting
tags:
  - whitespace
  - nbsp
  - space
  - line-break
status: draft
locale: ko
---

줄바꿈 없는 공백(`&nbsp;` 또는 `\u00A0`)은 HTML에서 간격을 보존하는 데 사용되지만, contenteditable 요소에서 일반 공백과 다르게 동작합니다. 편집 중에 일반 공백으로 변환되거나 예상치 못한 방식으로 줄바꿈을 방지할 수 있습니다.

## 관찰된 동작

### 시나리오 1: 줄바꿈 없는 공백 다음에 입력
- **Chrome/Edge**: 줄바꿈 없는 공백이 일반 공백으로 변환될 수 있습니다
- **Firefox**: 줄바꿈 없는 공백을 보존하거나 변환할 수 있습니다
- **Safari**: 동작이 다릅니다

### 시나리오 2: 줄바꿈 없는 공백이 있는 텍스트 복사
- **Chrome/Edge**: 복사할 때 줄바꿈 없는 공백이 일반 공백으로 변환될 수 있습니다
- **Firefox**: 유사한 동작입니다
- **Safari**: 보존하거나 변환할 수 있습니다

### 시나리오 3: 줄바꿈 없는 공백이 있는 텍스트 붙여넣기
- **Chrome/Edge**: 소스에 따라 일반 공백으로 변환하거나 보존할 수 있습니다
- **Firefox**: 유사한 동작입니다
- **Safari**: 동작이 일관되지 않습니다

### 시나리오 4: 줄바꿈 없는 공백이 있는 줄바꿈
- **Chrome/Edge**: 줄바꿈 없는 공백이 줄바꿈을 방지하며, 이는 예상치 못할 수 있습니다
- **Firefox**: 유사한 동작입니다
- **Safari**: 다르게 처리할 수 있습니다

## 영향

- 편집 중 줄바꿈 없는 공백이 손실될 수 있습니다
- 예상치 못한 줄바꿈 동작
- 복사/붙여넣기 시 일관되지 않은 동작
- 특정 간격 요구사항 유지의 어려움

## 브라우저 비교

- **Chrome/Edge**: 일반적으로 편집 중 줄바꿈 없는 공백을 일반 공백으로 변환합니다
- **Firefox**: Chrome과 유사합니다
- **Safari**: 더 일관되지 않은 동작입니다

## 해결 방법

줄바꿈 없는 공백을 모니터링하고 보존합니다:

```javascript
element.addEventListener('input', (e) => {
  // 줄바꿈 없는 공백이 변환되었는지 확인
  const walker = document.createTreeWalker(
    element,
    NodeFilter.SHOW_TEXT,
    null
  );
  
  let node;
  while (node = walker.nextNode()) {
    // 줄바꿈 없는 공백이어야 하는 일반 공백 교체
    // (이것은 단순화된 예제입니다 - 실제 로직은 더 복잡할 것입니다)
    if (node.textContent.includes('  ')) {
      // 여러 공백 처리
    }
  }
});

// 붙여넣기 시 줄바꿈 없는 공백 보존
element.addEventListener('paste', (e) => {
  e.preventDefault();
  const text = e.clipboardData.getData('text/plain');
  const html = e.clipboardData.getData('text/html');
  
  // 필요한 경우 여러 공백을 줄바꿈 없는 공백으로 변환
  const processedText = text.replace(/  +/g, (match) => {
    return '\u00A0'.repeat(match.length);
  });
  
  const selection = window.getSelection();
  if (selection.rangeCount > 0) {
    const range = selection.getRangeAt(0);
    range.deleteContents();
    range.insertNode(document.createTextNode(processedText));
  }
});
```
