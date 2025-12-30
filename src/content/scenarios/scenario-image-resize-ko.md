---
id: scenario-image-resize
title: contenteditable에서 이미지 크기 조정이 제한되거나 일관되지 않음
description: "contenteditable 요소 내에서 이미지 크기 조정이 제한되거나 브라우저마다 일관되지 않게 동작합니다. 일부 브라우저는 네이티브 크기 조정 핸들을 지원하지만 다른 브라우저는 수동 구현이 필요합니다. 크기 조정 동작이 예상치 못하게 DOM 구조에 영향을 줄 수도 있습니다."
category: formatting
tags:
  - image
  - resize
  - drag
  - dimensions
status: draft
locale: ko
---

contenteditable 요소 내에서 이미지 크기 조정이 제한되거나 브라우저마다 일관되지 않게 동작합니다. 일부 브라우저는 네이티브 크기 조정 핸들을 지원하지만 다른 브라우저는 수동 구현이 필요합니다. 크기 조정 동작이 예상치 못하게 DOM 구조에 영향을 줄 수도 있습니다.

## 관찰된 동작

### 시나리오 1: 네이티브 크기 조정 핸들
- **Chrome/Edge**: 선택한 이미지에 크기 조정 핸들을 표시할 수 있지만 동작이 일관되지 않음
- **Firefox**: 제한적이거나 네이티브 크기 조정 지원 없음
- **Safari**: 다른 크기 조정 동작을 가질 수 있음

### 시나리오 2: CSS를 통한 크기 조정
- **Chrome/Edge**: 크기 조정 중 width/height 속성이 추가되거나 제거될 수 있음
- **Firefox**: 유사한 동작
- **Safari**: 속성을 다르게 처리할 수 있음

### 시나리오 3: 종횡비 보존
- **Chrome/Edge**: 종횡비를 보존하거나 보존하지 않을 수 있음
- **Firefox**: 동작이 다양함
- **Safari**: 다른 종횡비 처리를 가질 수 있음

### 시나리오 4: 크기 조정 이벤트 및 DOM 변경
- **Chrome/Edge**: 크기 조정이 예상치 못한 DOM 변이를 트리거할 수 있음
- **Firefox**: 유사한 문제
- **Safari**: 다른 변이 동작을 가질 수 있음

## 영향

- 일관된 이미지 크기 조정 구현 어려움
- 예상치 못한 DOM 구조 변경
- 크기 조정 중 이미지 속성 손실
- 사용자 정의 크기 조정 구현 필요

## 브라우저 비교

- **Chrome/Edge**: 일부 네이티브 지원이지만 일관되지 않음
- **Firefox**: 제한된 네이티브 지원
- **Safari**: 다른 동작, 사용자 정의 구현이 필요할 수 있음

## 해결 방법

사용자 정의 크기 조정 핸들 구현:

```javascript
function addResizeHandles(img) {
  const handle = document.createElement('div');
  handle.className = 'resize-handle';
  handle.style.cssText = `
    position: absolute;
    width: 10px;
    height: 10px;
    background: blue;
    cursor: se-resize;
    bottom: 0;
    right: 0;
  `;
  
  let isResizing = false;
  let startX, startY, startWidth, startHeight;
  
  handle.addEventListener('mousedown', (e) => {
    isResizing = true;
    startX = e.clientX;
    startY = e.clientY;
    startWidth = img.offsetWidth;
    startHeight = img.offsetHeight;
    e.preventDefault();
  });
  
  document.addEventListener('mousemove', (e) => {
    if (!isResizing) return;
    
    const deltaX = e.clientX - startX;
    const deltaY = e.clientY - startY;
    
    img.style.width = (startWidth + deltaX) + 'px';
    img.style.height = (startHeight + deltaY) + 'px';
  });
  
  document.addEventListener('mouseup', () => {
    isResizing = false;
  });
  
  // 이미지에 대해 핸들 위치 지정
  const wrapper = document.createElement('div');
  wrapper.style.position = 'relative';
  wrapper.style.display = 'inline-block';
  img.parentNode.insertBefore(wrapper, img);
  wrapper.appendChild(img);
  wrapper.appendChild(handle);
}
```
