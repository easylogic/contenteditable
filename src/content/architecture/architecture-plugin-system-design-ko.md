---
id: architecture-plugin-system-design-ko
title: "확장 가능한 플러그인 아키텍처 설계"
description: "핵심 에디터 모델을 오염시키지 않으면서 수평적으로 기능을 확장할 수 있는 내부 API 설계 방법."
category: "architecture"
tags: ["plugins", "middleware", "extensibility", "events"]
status: "confirmed"
locale: "ko"
---

## 개요
기능이 거대하게 뭉쳐진 모놀리식(Monolithic) 에디터는 유지보수의 재앙이 됩니다. **플러그인 기반 아키텍처**는 링크 감지, 멘션 선택기, 히스토리 관리와 같은 개별 기능을 에디터 코어로부터 분리합니다. 이 가이드는 현대적인 에디터들이 채택하고 있는 "미들웨어 테이블" 접근 방식을 설명합니다.

## 핵심 개념

### 1. 커맨드 버스 (The Command Bus)
플러그인은 직접적인 함수 호출 대신 **커맨드(Command)**를 통해 소통해야 합니다.
- `editor.dispatch(UNDO_COMMAND)`
- `editor.dispatch(INSERT_LINK_COMMAND, { url: '...' })`

### 2. 변환 훅 (Transform Hooks)
플러그인은 데이터 변환 파이프라인에 접근할 수 있어야 합니다. 예를 들어, "링크 플러그인"은 모든 `input` 이벤트 직후에 텍스트를 스캔하여 URL을 찾아내는 훅을 등록할 수 있습니다.

### 3. 데코레이션 시스템 (Overlay Logic)
내부 문서 모델을 변경하지 않으면서 텍스트를 하이라이트해야 하는 경우가 많습니다(예: 오타 표시, 검색 결과 강조).
- **ProseMirror 전략**: `Decorations`를 노드 트리와 별개로 계산하여 DOM 위에 칠합니다.
- **Lexical 전략**: `TextNode` 속성이나 `DecoratorNodes`를 사용하여 UI 위젯을 주입합니다.

## 권장되는 플러그인 인터페이스

```javascript
/* 전형적인 플러그인 정의 예시 */
export const MyPlugin = {
  // 1. 초기화 단계
  init(editor) {
    editor.registerCommand(MY_COMMAND, () => { ... });
  },
  
  // 2. 이벤트 가로채기
  handleEvent(event, editor) {
    if (event.type === 'paste') {
      return this.interceptPaste(event, editor);
    }
  },
  
  // 3. 정리 단계 (Cleanup)
  destroy(editor) {
    editor.unregisterAll(this);
  }
};
```

## 모범 사례
- **우선순위가 지정된 미들웨어**: 플러그인 등록 시 우선순위를 부여하세요 (예: "히스토리 플러그인"은 일반적인 키보드 플러그인보다 먼저 'Undo' 단축키를 잡아내야 함).
- **지연 로딩 (Lazy Loading)**: 특정 기능(예: 표 에디터)이 필요할 때만 플러그인을 로드하여 초기 자바스크립트 번들 크기를 줄이세요.
- **샌드박스 상태(Sandboxed state)**: 플러그인 전용 상태는 `EditorState` 내의 지정된 저장소에서 별도로 관리해야 합니다.

## 참고 자료
- [ProseMirror: 플러그인 가이드](https://prosemirror.net/docs/guide/#plugin)
- [Slate.js: 플러그인 사용법](https://docs.slatejs.org/concepts/08-plugins)
- [Lexical: 플러그인 시스템](https://lexical.dev/docs/concepts/plugins)
