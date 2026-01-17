---
id: scenario-blockquote-behavior-ko
title: Blockquote 편집 동작이 브라우저마다 다름
description: "contenteditable에서 blockquote 요소 내에서 텍스트를 편집하는 것이 브라우저마다 일관되지 않게 동작합니다. Enter를 누르거나, 서식을 적용하거나, 콘텐츠를 붙여넣으면 blockquote 구조가 깨지거나, 중첩 blockquote가 생성되거나, 예상치 못하게 동작할 수 있습니다."
category: formatting
tags:
  - blockquote
  - quote
  - indentation
  - structure
status: draft
locale: ko
---

contenteditable에서 blockquote 요소 내에서 텍스트를 편집하는 것이 브라우저마다 일관되지 않게 동작합니다. Enter를 누르거나, 서식을 적용하거나, 콘텐츠를 붙여넣으면 blockquote 구조가 깨지거나, 중첩 blockquote가 생성되거나, 예상치 못하게 동작할 수 있습니다.

## 관찰된 동작

### 시나리오 1: blockquote에서 Enter 누르기
- **Chrome/Edge**: blockquote 내에 새 단락 생성
- **Firefox**: 새 단락을 만들거나 blockquote 구조를 깨뜨릴 수 있음
- **Safari**: 동작이 다양하며 중첩 blockquote를 만들 수 있음

### 시나리오 2: blockquote에서 서식 적용
- **Chrome/Edge**: 서식이 적용되지만 구조를 깨뜨릴 수 있음
- **Firefox**: 서식 시 blockquote 구조를 깨뜨릴 가능성이 더 높음
- **Safari**: 구조를 깨뜨릴 가능성이 가장 높음

### 시나리오 3: blockquote에 콘텐츠 붙여넣기
- **Chrome/Edge**: blockquote를 보존하거나 깨뜨릴 수 있음
- **Firefox**: blockquote 구조를 깨뜨릴 가능성이 더 높음
- **Safari**: 예상치 못한 중첩 구조를 만들 수 있음

### 시나리오 4: blockquote 종료
- **Chrome/Edge**: 여러 번 Enter를 누르거나 수동 종료가 필요할 수 있음
- **Firefox**: 유사한 동작
- **Safari**: 종료 동작이 일관되지 않음

## 영향

- blockquote 구조 유지 어려움
- 예상치 못한 중첩 blockquote
- 편집 중 구조 깨짐
- 인용문 작업 시 나쁜 사용자 경험

## 브라우저 비교

- **Chrome/Edge**: 일반적으로 더 나은 blockquote 처리
- **Firefox**: 구조를 깨뜨릴 가능성이 더 높음
- **Safari**: 가장 일관되지 않은 동작

## 해결 방법

사용자 정의 blockquote 처리 구현:

```javascript
element.addEventListener('beforeinput', (e) => {
  if (e.inputType === 'insertParagraph') {
    const selection = window.getSelection();
    if (selection.rangeCount === 0) return;
    
    const range = selection.getRangeAt(0);
    const blockquote = range.startContainer.closest('blockquote');
    
    if (blockquote) {
      e.preventDefault();
      
      // blockquote 내에 새 단락 생성
      const p = document.createElement('p');
      const br = document.createElement('br');
      p.appendChild(br);
      
      range.deleteContents();
      range.insertNode(p);
      range.setStartBefore(br);
      range.collapse(true);
      
      selection.removeAllRanges();
      selection.addRange(range);
    }
  }
});

// 붙여넣기 시 blockquote 구조 깨짐 방지
element.addEventListener('paste', (e) => {
  const selection = window.getSelection();
  if (selection.rangeCount === 0) return;
  
  const range = selection.getRangeAt(0);
  const blockquote = range.startContainer.closest('blockquote');
  
  if (blockquote) {
    e.preventDefault();
    const html = e.clipboardData.getData('text/html');
    const text = e.clipboardData.getData('text/plain');
    
    // 중첩을 피하기 위해 붙여넣은 콘텐츠에서 blockquote 태그 제거
    const temp = document.createElement('div');
    temp.innerHTML = html;
    const blockquotes = temp.querySelectorAll('blockquote');
    blockquotes.forEach(bq => {
      const parent = bq.parentNode;
      while (bq.firstChild) {
        parent.insertBefore(bq.firstChild, bq);
      }
      parent.removeChild(bq);
    });
    
    range.deleteContents();
    range.insertNode(document.createRange().createContextualFragment(temp.innerHTML));
  }
});
```

## 참고 자료

- [W3C Community: ContentEditable specification](https://www.w3.org/community/editing/wiki/ContentEditable) - Enter key behavior in blocks
- [WHATWG Lists: Blockquote Enter behavior](https://lists.whatwg.org/pipermail/whatwg-whatwg.org/2009-December/024627.html) - Specification discussion
- [Stack Overflow: Add paragraph after blockquote on Enter](https://stackoverflow.com/questions/14667764/in-contenteditable-how-do-you-add-a-paragraph-after-blockquote-on-enter-key-pres) - Exit blockquote solutions
- [ProseMirror Discuss: Strange behaviour when pasting inside blockquote](https://discuss.prosemirror.net/t/strange-behaviour-when-pasting-inside-blockquote/1200) - Paste behavior in blockquotes
