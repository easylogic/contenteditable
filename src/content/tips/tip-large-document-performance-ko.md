---
id: tip-large-document-performance-ko
title: "대용량 문서용 에디터 성능 최적화 방법"
category: "performance"
tags: ["performance", "virtualization", "optimization", "dom"]
status: "confirmed"
locale: "ko"
---

## 요약
수천 개의 노드가 포함된 문서를 `contenteditable` 영역에서 직접 처리하면 심각한 지연 현상이 발생할 수 있습니다. 이 팁은 대규모 콘텐츠를 위한 메모리 및 렌더링 최적화 기법을 다룹니다.

## 문제 상황
대형 `contenteditable` 영역에서 키를 누를 때마다 브라우저에서는 "스타일 재계산(Recalculate Style)" 및 "레이아웃(Layout)" 이벤트가 발생합니다. DOM의 깊이가 너무 깊거나 크기가 너무 크면 이벤트 루프가 차단되어, 사용자가 타이핑한 후 수백 밀리초 뒤에 글자가 나타나는 "타이핑 버벅임" 현상이 발생합니다.

## 모범 사례

### 1. 전역 리렌더링 피하기
변경이 있을 때마다 문서 전체를 다시 렌더링하지 마세요. 변이된 특정 DOM 노드만 업데이트하는 **부분 렌더링(Partial Rendering)**을 지원하는 프레임워크(Lexical, ProseMirror 등)를 사용해야 합니다.

### 2. UI 가상화 (무한 스크롤)
100페이지가 넘는 초대형 문서의 경우 **가상 선택(Virtual Selection)**을 구현하세요. 현재 뷰포트에 보이는 섹션만 렌더링하는 방식입니다.
- **과제**: 가상화된 에디터에서 선택 및 검색은 매우 복잡하며, 대개 브라우저의 기본 검색/선택 엔진을 위해 보이지 않는 가짜 DOM을 유지하는 "포털" 시스템이 필요합니다.

### 3. 모델 동기화 스로틀링 (Throttling)
에디터 상태를 데이터베이스나 협업 서버와 동기화할 때, "모델-JSON" 직렬화 과정을 스로틀링하세요.
```javascript
// 모든 'input' 이벤트마다 실행하지 마세요
const debouncedSync = debounce((editorState) => {
  saveToDatabase(editorState.toJSON());
}, 1000);
```

### 4. 노드 복잡도 최적화
DOM 구조를 최대한 평평하게 유지하세요. `<div><div><p>...</p></div></div>` 대신 가능한 한 평평한 `p` 노드 리스트를 사용하세요. 구조가 깊게 중첩될수록 브라우저의 BiDi 또는 레이아웃 계산 시간이 기하급수적으로 늘어납니다.

## 주의 사항
- **페이지 내 검색**: 가상화된 에디터는 브라우저 기본 `Cmd + F` 검색을 무력화합니다. 커스텀 검색 UI를 직접 구현해야 합니다.
- **블록을 가로지르는 선택**: 가상화가 적용되면 사용자가 렌더링되지 않은 부분까지 드래그하여 텍스트를 선택하는 것이 불가능해질 수 있습니다.

## 관련 링크
- [Lexical: 성능 벤치마크](https://lexical.dev/docs/performance)
- [ProseMirror: 협업 시 성능 관리](https://prosemirror.net/docs/guide/#collab)
- [Chrome DevTools: 레이아웃 이동 프로파일링](https://developer.chrome.com/docs/devtools/evaluate-performance/reference/)
