---
id: tip-003-memory-leak-prevention-ko
title: contenteditable에서 메모리 누수 방지하기
description: "이벤트 리스너와 MutationObserver를 사용할 때 메모리 누수를 방지하는 방법"
category: performance
tags:
  - memory-leak
  - event-listener
  - mutation-observer
  - cleanup
  - performance
difficulty: intermediate
relatedScenarios:
  - scenario-memory-leak-prevention
relatedCases:
  - ce-0225-memory-leak-large-docs
locale: ko
---

## 문제

contenteditable에서 이벤트 리스너와 MutationObserver를 사용할 때, 제대로 정리하지 않으면 메모리 누수가 발생합니다.

메모리 누수는 시간이 지나면서 애플리케이션이 느려지고, 결국 브라우저 크래시를 일으킬 수 있습니다.

## 해결 방법

### 1. 이벤트 리스너 정리

요소가 제거될 때 항상 리스너를 제거합니다.

```javascript
class EditableComponent {
  constructor(element) {
    this.element = element;
    this.handleInput = this.handleInput.bind(this);
    this.handleFocus = this.handleFocus.bind(this);
    
    this.element.addEventListener('input', this.handleInput);
    this.element.addEventListener('focus', this.handleFocus);
  }
  
  handleInput(e) {
    // 입력 처리
  }
  
  handleFocus(e) {
    // 포커스 처리
  }
  
  dispose() {
    // 리스너 제거
    this.element.removeEventListener('input', this.handleInput);
    this.element.removeEventListener('focus', this.handleFocus);
    this.element = null;
  }
}
```

### 2. MutationObserver 연결 해제

관찰자가 더 이상 필요하지 않을 때 연결을 해제합니다.

```javascript
class EditableComponent {
  constructor(element) {
    this.element = element;
    this.observer = new MutationObserver((mutations) => {
      // 변형 처리
    });
    
    this.observer.observe(this.element, {
      childList: true,
      subtree: true
    });
  }
  
  dispose() {
    if (this.observer) {
      this.observer.disconnect();
      this.observer = null;
    }
    this.element = null;
  }
}
```

### 3. 명명된 함수 사용

익명 함수 대신 명명된 함수를 사용하여 나중에 제거할 수 있게 합니다.

```javascript
// 나쁨 - 제거할 수 없음
element.addEventListener('input', () => {
  // 처리
});

// 좋음 - 제거 가능
function handleInput(e) {
  // 처리
}
element.addEventListener('input', handleInput);
element.removeEventListener('input', handleInput);
```

### 4. once 옵션 사용

일회성 리스너의 경우 `once: true` 옵션을 사용합니다.

```javascript
element.addEventListener('click', handleClick, { once: true });
```

### 5. 부모 제거 감지

부모 요소가 제거될 때 정리 작업을 수행합니다.

```javascript
const parentObserver = new MutationObserver((mutations) => {
  mutations.forEach((mutation) => {
    mutation.removedNodes.forEach((node) => {
      if (node === editableElement || node.contains(editableElement)) {
        // 정리
        component.dispose();
      }
    });
  });
});

parentObserver.observe(document.body, {
  childList: true,
  subtree: true
});
```

## 모범 사례

- `addEventListener`와 `removeEventListener`를 항상 쌍으로 사용
- 모든 MutationObserver를 완료 시 `disconnect()` 호출
- 프레임워크 생명주기 메서드 활용 (componentWillUnmount, ngOnDestroy 등)
- DevTools Memory 프로파일러로 누수 감지
- 정기적으로 메모리 프로파일링 수행

## 디버깅 팁

### DevTools로 메모리 누수 확인

1. Chrome DevTools 열기
2. Memory 탭으로 이동
3. "Take heap snapshot" 클릭
4. 작업 수행 (편집, 포맷팅 등)
5. 다시 스냅샷 찍기
6. 비교하여 메모리 증가 확인

### 일반적인 누수 패턴

- 분리된 DOM 노드 (Detached DOM tree)
- 클로저가 참조하는 큰 객체
- 연결 해제되지 않은 이벤트 리스너
- 연결 해제되지 않은 MutationObserver

## 관련 자료

- [시나리오: 메모리 누수 방지](/scenarios/scenario-memory-leak-prevention)
- [케이스: ce-0225](/cases/ce-0225-memory-leak-large-docs)
