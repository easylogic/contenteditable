---
id: scenario-firefox-drag-drop-issues-ko
title: "Firefox의 contenteditable 내 드래그 앤 드롭 동작 불일치"
description: "편집 가능한 컨테이너 내에서 기본 드래그 앤 드롭 작업을 처리할 때 발생하는 Firefox의 일관성 없는 동작에 대한 분석입니다."
category: "drag-drop"
tags: ["firefox", "drag-drop", "ux", "reliability"]
status: "confirmed"
locale: "ko"
---

## 문제 개요
`contenteditable` 내에서의 드래그 앤 드롭(DnD)은 `DataTransfer` API와 내부 DOM 변이가 결합된 복잡한 상호작용입니다. Chromium과 WebKit 엔진은 특정 `beforeinput` 타입(`deleteByDrag` 등)을 디스패치하며 "이동(move)" 동작으로 수렴된 반면, Firefox는 종종 기본 동작을 실행하지 못하는 경우가 발생합니다. 이로 인해 텍스트가 원본 위치에 그대로 남게 되며, 목적지로의 자동 이동이 이루어지지 않습니다.

## 관찰된 동작
### 시나리오 1: 에디터 내부 이동 실패
최신 버전(v130+)에서 텍스트 조각을 선택하여 동일한 에디터 내로 드래그할 때, 시각적인 잔상(ghost)은 나타나지만 드롭 시 실제 DOM 변이가 일어나지 않습니다.

```javascript
/* 이벤트 관찰 시퀀스 */
element.addEventListener('dragstart', (e) => {
    console.log('1. 드래그 시작'); // 발생함
});
element.addEventListener('drop', (e) => {
    console.log('2. 드롭 발생'); // 발생하지만, 엔진에 의해 기본 동작이 생략됨
});
```

### 시나리오 2: 중첩 구조 파손
중첩된 `<span>` 요소 안팎으로 콘텐츠를 드래그할 때, Firefox가 불필요한 래퍼(wrapper) 노드를 생성하여 에디터의 논리적 트리를 깨뜨리는 경우가 빈번합니다.

## 영향
- **사용자 직관 위배**: 현대적인 웹 사용자는 에디터가 네이티브 워드 프로세서(Word, Pages 등)처럼 동작하기를 기대합니다.
- **히스토리 불일치**: 프레임워크가 드롭을 수동으로 처리했으나 브라우저가 나중에 부분적인 이동을 수행할 경우, 실행 취소(Undo) 데이터가 오염됩니다.

## 브라우저 비교
- **Gecko (Firefox)**: 심각한 불일치가 관찰됩니다. `DataTransfer`를 통한 "이동" 로직의 수동 구현이 권장됩니다.
- **Blink (Chrome/Edge)**: 높은 신뢰성을 보입니다. `beforeinput` 기반의 이동을 네이티브하게 지원합니다.
- **WebKit (Safari)**: 데스크톱에서는 안정적이나, iOS의 복잡한 DnD 시나리오에서는 지원이 제한적일 수 있습니다.

## 해결 방법
### 1. "수동 이동(Manual Teleport)" 전략
교차 플랫폼 호환성을 보장하기 위해 데이터 전송 객체에 일반 텍스트 및 HTML을 명시적으로 설정하고 읽어옵니다.

```javascript
element.addEventListener('dragstart', (e) => {
    const range = window.getSelection().getRangeAt(0);
    e.dataTransfer.setData('text/plain', range.toString());
    e.dataTransfer.effectAllowed = 'move';
});

element.addEventListener('drop', (e) => {
    e.preventDefault();
    const data = e.dataTransfer.getData('text/plain');
    const targetRange = document.caretRangeFromPoint(e.clientX, e.clientY);
    
    // 원본 삭제 및 목적지 삽입을 명시적으로 수행
    // 주의: Lexical 등의 프레임워크에서는 커스텀 트랜잭션 처리가 필요합니다.
    moveFragment(sourceRange, targetRange, data);
});
```

## 관련 사례
- [ce-0569: 텍스트 드래그 앤 드롭 시 콘텐츠 이동 실패](file:///Users/user/github/barocss/contenteditable/src/content/cases/ce-0569-firefox-drag-drop-text-failure-ko.md)

## 참고 자료
- [Mozilla Bugzilla #1898711](https://bugzilla.mozilla.org/show_bug.cgi?id=1898711)
- [Lexical 이슈 #8014](https://github.com/facebook/lexical/issues/8014)
---
id: scenario-firefox-drag-drop-issues-ko
title: "Firefox의 contenteditable 내 드래그 앤 드롭 동작 불일치"
description: "편집 가능한 컨테이너 내에서 기본 드래그 앤 드롭 작업을 처리할 때 발생하는 Firefox의 일관성 없는 동작에 대한 분석입니다."
category: "drag-drop"
tags: ["firefox", "drag-drop", "ux", "reliability"]
status: "confirmed"
locale: "ko"
---

## 문제 개요
`contenteditable` 내에서의 드래그 앤 드롭(DnD)은 `DataTransfer` API와 내부 DOM 변이가 결합된 복잡한 상호작용입니다. Chromium과 WebKit 엔진은 특정 `beforeinput` 타입(`deleteByDrag` 등)을 디스패치하며 "이동(move)" 동작으로 수렴된 반면, Firefox는 종종 기본 동작을 실행하지 못하는 경우가 발생합니다. 이로 인해 텍스트가 원본 위치에 그대로 남게 되며, 목적지로의 자동 이동이 이루어지지 않습니다.

## 관찰된 동작
### 시나리오 1: 에디터 내부 이동 실패
최신 버전(v130+)에서 텍스트 조각을 선택하여 동일한 에디터 내로 드래그할 때, 시각적인 잔상(ghost)은 나타나지만 드롭 시 실제 DOM 변이가 일어나지 않습니다.

```javascript
/* 이벤트 관찰 시퀀스 */
element.addEventListener('dragstart', (e) => {
    console.log('1. 드래그 시작'); // 발생함
});
element.addEventListener('drop', (e) => {
    console.log('2. 드롭 발생'); // 발생하지만, 엔진에 의해 기본 동작이 생략됨
});
```

### 시나리오 2: 중첩 구조 파손
중첩된 `<span>` 요소 안팎으로 콘텐츠를 드래그할 때, Firefox가 불필요한 래퍼(wrapper) 노드를 생성하여 에디터의 논리적 트리를 깨뜨리는 경우가 빈번합니다.

## 영향
- **사용자 경험 단절**: 현대적인 웹 사용자는 에디터가 네이티브 워드 프로세서(Word, Pages 등)처럼 동작하기를 기대합니다.
- **히스토리 데이터 파손**: 프레임워크가 드롭을 수동으로 처리했으나 브라우저가 나중에 부분적인 이동을 수행할 경우, 실행 취소(Undo) 데이터가 꼬이게 됩니다.

## 브라우저 비교
- **Gecko (Firefox)**: 높은 불일치가 관찰됩니다. `DataTransfer`를 통한 "이동" 로직의 직접 구현이 필요할 수 있습니다.
- **Blink (Chrome/Edge)**: 가장 신뢰성이 높습니다. `beforeinput` 기반의 이동을 네이티브하게 지원합니다.
- **WebKit (Safari)**: 데스크톱에서는 안정적이나, iOS의 복잡한 DnD 시나리오에서는 지원이 제한적일 수 있습니다.

## 해결 방법
### 1. "수동 이동(Manual Teleport)" 전략
교차 플랫폼 호환성을 위해 데이터 전송 객체에 데이터를 명시적으로 설정합니다.

```javascript
element.addEventListener('dragstart', (e) => {
    const range = window.getSelection().getRangeAt(0);
    e.dataTransfer.setData('text/plain', range.toString());
    e.dataTransfer.effectAllowed = 'move';
});

element.addEventListener('drop', (e) => {
    e.preventDefault();
    const data = e.dataTransfer.getData('text/plain');
    const targetRange = document.caretRangeFromPoint(e.clientX, e.clientY);
    
    // 명시적으로 원본을 제거하고 신규 범위에 삽입
    moveFragment(sourceRange, targetRange, data);
});
```

## 관련 사례
- [ce-0569: 텍스트 드래그 앤 드롭 시 콘텐츠 이동 실패](file:///Users/user/github/barocss/contenteditable/src/content/cases/ce-0569-firefox-drag-drop-text-failure-ko.md)

## 참고 자료
- [Mozilla Bugzilla #1898711](https://bugzilla.mozilla.org/show_bug.cgi?id=1898711)
- [Lexical 이슈 #8014](https://github.com/facebook/lexical/issues/8014)
