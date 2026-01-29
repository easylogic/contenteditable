---
id: scenario-rtl-text-direction-inconsistent-ko
title: contenteditable에서 RTL 텍스트 방향 및 선택 동작 불일치
description: contenteditable 내 우측에서 좌측으로 쓰는(RTL) 텍스트 또는 혼합 방향 텍스트에서 캐럿 정렬 오류, 스크롤 실패, 전체 선택 동작이 LTR 및 스펙과 다르게 나타남.
category: selection
tags:
  - rtl
  - bidi
  - selection
  - scroll
  - caret
status: draft
locale: ko
---

## 문제 개요

`contenteditable`에 RTL(아랍어, 히브리어) 또는 LTR/RTL 혼합 텍스트가 있을 때, 캐럿 위치, 자동 스크롤, 선택 방향, Ctrl+A(전체 선택) 처리 방식이 브라우저마다 다릅니다. RTL 언어를 지원하는 에디터는 Blink, WebKit, Gecko 간 일관된 동작을 가정할 수 없습니다.

## 관찰된 동작

- **스크롤**: `overflow: auto`인 좁은 컨테이너에서 캐럿이 보이는 영역 밖으로 나가며, RTL 텍스트의 논리적 “끝”(시각적으로 왼쪽)에 대한 `scrollLeft`가 올바르게 갱신되지 않음.
- **캐럿 위치**: 시각적 캐럿이 해당 문자에서 몇 픽셀 떨어진 곳에 나타나거나, 잘못된 스크롤 영역에 들어가 사라질 수 있음.
- **선택 방향**: Shift+화살표 또는 드래그로 선택을 확장할 때 혼합 방향 내용에서 방향이 뒤바뀌거나 “들쭉날쭉”한 범위가 생김.
- **전체 선택**: 비편집 블록이 첫/끝 자식일 때 Ctrl+A가 전체 선택 대신 잘못된 방향으로 선택을 접을 수 있음(관련 시나리오 참고).

RTL에서 스크롤/캐럿을 관찰하는 코드:

```javascript
const editor = document.querySelector('[contenteditable="true"]');
editor.addEventListener('input', () => {
  const sel = window.getSelection();
  if (!sel.rangeCount) return;
  const range = sel.getRangeAt(0);
  const rect = range.getBoundingClientRect();
  const containerRect = editor.getBoundingClientRect();
  // RTL에서 논리적 끝은 왼쪽; 스크롤이 따라가지 않을 수 있음
  if (rect.left < containerRect.left) {
    editor.scrollLeft += (rect.left - containerRect.left) - 10;
  }
});
```

## 영향

- **RTL 에디터**: 좁은 패널이나 댓글 입력란에서 사용자가 삽입 위치를 볼 수 없음.
- **상태 불일치**: 캐럿/선택이 잘못되면 React/Vue 등 프레임워크 상태가 DOM과 어긋날 수 있음.
- **접근성**: 스크린 리더와 키보드 사용자는 올바른 논리적 위치에 의존함.

## 브라우저 비교

- **Chrome 124+ (Blink)**: RTL 오버플로에서 스크롤 및 캐럿 배치 회귀; 시각–논리 매핑 깨짐.
- **Safari (WebKit)**: BiDi 일관성은 대체로 양호; 비편집 블록이 있을 때 전체 선택은 여전히 실패.
- **Firefox (Gecko)**: RTL에서 가장 안정적; 시각 오프셋을 논리 인덱스로 올바르게 매핑.

## 해결 방법

1. **input 후 수동 스크롤**: 위 코드처럼 `getBoundingClientRect()`로 캐럿이 보이는 영역을 벗어나면 `scrollLeft`를 조정.
2. **dir 명시**: 편집 가능한 컨테이너와 블록에 `dir="rtl"`(또는 `auto`)를 지정해 엔진이 BiDi를 올바르게 계산하도록 함.
3. **input 후 선택 정규화**: `input` 또는 `selectionchange` 후 `getRangeAt(0)`을 읽고, 휴리스틱으로 잘못된 배치로 판단되면 알려진 안전한 위치로 접을 수 있음.

## 모범 사례

- RTL을 지원할 때는 contenteditable 루트에 항상 `dir`을 설정.
- RTL에서 `scrollLeft === 0`이 “시작”을 의미한다고 가정하지 말 것; 논리적 시작은 오른쪽.
- 비편집 블록이 맨 앞/맨 뒤에 있을 때 Ctrl+A를 테스트하고, 필요하면 전용 핸들러 사용.

## 관련 케이스

- [ce-0570](ce-0570-chromium-rtl-scroll-alignment-bug) – Chromium RTL 스크롤 및 캐럿 정렬 오류

## 참고 자료

- [Chromium Issue: RTL scrolling broken in contenteditable](https://issues.chromium.org/issues/333630733)
- [W3C I18N: Structural markup and right-to-left text](https://www.w3.org/International/questions/qa-html-dir)
- [MDN: dir attribute](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/dir)
