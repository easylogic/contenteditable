---
id: scenario-image-insertion-ko
title: 이미지 삽입 동작이 브라우저마다 다름
description: "contenteditable 요소에 이미지를 삽입할 때 동작이 브라우저마다 크게 다릅니다. 이미지가 <img> 태그로, base64 데이터 URL로 삽입되거나 전혀 지원되지 않을 수 있습니다. 크기, 위치 및 편집 동작도 다릅니다."
category: formatting
tags:
  - image
  - paste
  - drag-drop
  - file
status: draft
locale: ko
---

contenteditable 요소에 이미지를 삽입할 때 동작이 브라우저마다 크게 다릅니다. 이미지가 `<img>` 태그로, base64 데이터 URL로 삽입되거나 전혀 지원되지 않을 수 있습니다. 크기, 위치 및 편집 동작도 다릅니다.

## 관찰된 동작

### 시나리오 1: 클립보드에서 이미지 붙여넣기
- **Chrome/Edge**: base64 데이터 URL 또는 파일 참조가 있는 `<img>` 태그로 이미지 삽입
- **Firefox**: 이미지를 삽입하거나 이미지 붙여넣기를 지원하지 않을 수 있음
- **Safari**: 동작이 다양하며 이미지를 삽입하거나 다른 접근 방식이 필요할 수 있음

### 시나리오 2: 이미지 파일 드래그 앤 드롭
- **Chrome/Edge**: 드롭 위치에 이미지 삽입
- **Firefox**: 이미지를 삽입하거나 파일을 열 수 있음
- **Safari**: 동작이 일관되지 않음

### 시나리오 3: 이미지 크기 및 치수
- **Chrome/Edge**: 원본 크기를 보존하거나 기본 치수를 적용할 수 있음
- **Firefox**: 이미지를 자동으로 크기 조정할 수 있음
- **Safari**: 크기 처리가 다양함

### 시나리오 4: 삽입 후 이미지 편집
- **Chrome/Edge**: 이미지를 선택하고 삭제할 수 있지만 크기 조정이 제한될 수 있음
- **Firefox**: 유사한 동작
- **Safari**: 다른 선택 및 편집 동작을 가질 수 있음

## 영향

- 일관되지 않은 이미지 삽입 경험
- 큰 base64 데이터 URL이 HTML을 비대하게 만들 수 있음
- 이미지 크기 및 위치 제어 어려움
- 일부 브라우저는 이미지 삽입을 전혀 지원하지 않을 수 있음

## 브라우저 비교

- **Chrome/Edge**: 붙여넣기 및 드래그 앤 드롭을 통한 이미지 삽입에 대한 최상의 지원
- **Firefox**: 제한된 지원, 수동 처리가 필요할 수 있음
- **Safari**: 가장 일관되지 않은 동작

## 해결 방법

사용자 정의 이미지 처리 구현:

```javascript
element.addEventListener('paste', (e) => {
  const items = Array.from(e.clipboardData.items);
  const imageItem = items.find(item => item.type.startsWith('image/'));
  
  if (imageItem) {
    e.preventDefault();
    const file = imageItem.getAsFile();
    const reader = new FileReader();
    
    reader.onload = (event) => {
      const img = document.createElement('img');
      img.src = event.target.result;
      img.style.maxWidth = '100%';
      img.style.height = 'auto';
      
      const selection = window.getSelection();
      if (selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        range.deleteContents();
        range.insertNode(img);
      }
    };
    
    reader.readAsDataURL(file);
  }
});

element.addEventListener('drop', (e) => {
  e.preventDefault();
  const files = Array.from(e.dataTransfer.files);
  const imageFiles = files.filter(file => file.type.startsWith('image/'));
  
  imageFiles.forEach(file => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = document.createElement('img');
      img.src = event.target.result;
      img.style.maxWidth = '100%';
      img.style.height = 'auto';
      
      const range = document.caretRangeFromPoint?.(e.clientX, e.clientY) ||
                    document.createRange();
      range.insertNode(img);
    };
    reader.readAsDataURL(file);
  });
});
```

## 참고 자료

- [Stack Overflow: Drop image into contenteditable in Chrome to the cursor](https://stackoverflow.com/questions/10654262/drop-image-into-contenteditable-in-chrome-to-the-cursor) - Image drop handling
- [Froala Help: Can I insert images as base64?](https://wysiwyg-editor.froala.help/hc/en-us/articles/115000555949-Can-I-insert-images-as-base64) - Base64 image considerations
