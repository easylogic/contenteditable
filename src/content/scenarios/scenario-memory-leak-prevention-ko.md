---
id: scenario-memory-leak-prevention-ko
title: contenteditable에서 이벤트 리스너 및 MutationObserver로 인한 메모리 누수
description: "contenteditable을 이벤트 리스너 및 MutationObserver와 함께 사용할 때, 리스너가 제거되지 않거나 관찰자가 연결 해제되지 않으면 메모리 누수가 발생할 수 있습니다. 이벤트 리스너가 있는 분리된 DOM 요소, 참조를 유지하는 클로저, 겹치는 관찰자가 모두 시간이 지나면서 성능을 저하시키는 메모리 누수를 일으킬 수 있습니다."
category: performance
tags:
  - memory-leak
  - event-listener
  - mutation-observer
  - performance
  - cleanup
status: draft
locale: ko
---

`contenteditable`을 이벤트 리스너 및 `MutationObserver`와 함께 사용할 때, 리스너가 제거되지 않거나 관찰자가 연결 해제되지 않으면 메모리 누수가 발생할 수 있습니다. 분리된 DOM 요소, 참조를 유지하는 클로저, 겹치는 관찰자가 모두 메모리 누수를 일으킬 수 있습니다.

## 관찰된 동작

- **메모리 증가**: 가비지 수집 없이 시간이 지나면서 메모리 사용량 증가
- **성능 저하**: 메모리 누수가 누적되면서 애플리케이션이 느려짐
- **이벤트 리스너 누적**: 제거된 요소에 리스너가 계속 연결됨
- **관찰자 누적**: MutationObserver가 요소가 제거된 후에도 계속 관찰함
- **클로저 참조**: 클로저가 제거 후에도 DOM 노드를 유지함

## 근본 원인

- **리스너가 있는 분리된 DOM**: DOM에서 제거되었지만 리스너가 여전히 연결된 요소
- **연결 해제되지 않은 관찰자**: 완료 시 MutationObserver가 연결 해제되지 않음
- **클로저 참조**: 클로저가 큰 객체나 DOM 노드를 캡처함
- **익명 함수**: 익명 함수로 연결된 리스너를 제거할 수 없음
- **겹치는 관찰자**: 같은 노드를 관찰하는 여러 관찰자

## 영향

- **성능 문제**: 시간이 지나면서 애플리케이션이 반응하지 않음
- **메모리 고갈**: 낮은 메모리 기기에서 브라우저 크래시를 일으킬 수 있음
- **사용자 경험**: 성능 저하가 사용자 경험에 영향
- **개발 오버헤드**: 신중한 리소스 관리 필요

## 해결 방법

### 1. 이벤트 리스너 제거

요소가 제거될 때 항상 리스너 제거:

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

항상 관찰자 연결 해제:

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

지속적인 리스너에 익명 함수 피하기:

```javascript
// 나쁨
element.addEventListener('input', () => {
  // 이것을 제거할 수 없음
});

// 좋음
function handleInput(e) {
  // removeEventListener로 제거 가능
}
element.addEventListener('input', handleInput);
element.removeEventListener('input', handleInput);
```

### 4. 일회성 리스너에 once: true 사용

트리거 후 자동으로 리스너 제거:

```javascript
element.addEventListener('click', handleClick, { once: true });
```

### 5. 부모 제거 모니터링

contenteditable이 제거될 때 감지하기 위해 MutationObserver 사용:

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

### 6. 참조 무효화

정리 후 참조를 null로 설정:

```javascript
dispose() {
  this.element.removeEventListener('input', this.handleInput);
  this.observer.disconnect();
  this.element = null;
  this.observer = null;
  this.handleInput = null;
}
```

## 모범 사례

- **addEventListener와 removeEventListener 매칭**: 추가한 것은 항상 제거
- **모든 관찰자 연결 해제**: 완료 시 disconnect() 호출
- **프레임워크 생명주기 사용**: componentWillUnmount, ngOnDestroy 등에 연결
- **메모리 프로파일링**: DevTools Memory 프로파일러로 누수 감지
- **정리 테스트**: 컴포넌트가 제거될 때 리소스가 해제되는지 확인

## 참고 자료

- [MDN: MutationObserver.disconnect](https://developer.mozilla.org/en-US/docs/Web/API/MutationObserver/disconnect) - 관찰자 정리
- [Rishan Digital: 분리된 DOM의 메모리 누수](https://rishandigital.com/java-script/memory-leaks-from-detached-dom-elements/) - 분리된 요소 문제
- [Medium: JavaScript의 메모리 누수](https://mdjamilkashemporosh.medium.com/memory-leaks-in-javascript-strategies-for-detecting-and-fixing-common-pitfalls-6521d0ceb123) - 일반적인 함정
- [Kite Metric: 이벤트 리스너 메모리 누수 방지](https://kitemetric.com/blogs/how-to-avoid-javascript-event-listener-memory-leaks) - 리스너 정리
- [Great Expectations: MutationObserver로 리소스 정리](https://blog.greatrexpectations.com/2017/01/05/cleaning-up-resources-using-mutationobserver/) - 관찰자 정리 패턴
- [Stack Overflow: MutationObserver 자동 연결 해제](https://stackoverflow.com/questions/65539791/mutationobserver-automatically-disconnect-when-dereferenced) - 관찰자 생명주기
