---
id: scenario-ime-ui-experience-ko
title: "IME UI 및 레이아웃: UX 동기화와 뷰포트 로직"
description: "후보 창, 캐럿 위치 및 모바일 뷰포트 변화를 포함한 IME 입력의 시각적 레이어에 대한 분석입니다."
category: "ux"
tags: ["ime", "ux", "scrolling", "viewport", "candidate-window"]
status: "confirmed"
locale: "ko"
---

## 문제 개요
IME 입력은 단순한 데이터 입력이 아니라 고유의 UI 상호작용입니다. 브라우저는 시스템의 "후보 창(Candidate Window)"(고정 UI)과 웹의 "캐럿 위치"(유동적인 DOM)를 정밀하게 연동해야 합니다. 정렬이 어긋나면 UI가 공중에 떠 있거나 텍스트를 가리는 현상이 발생합니다.

## 관찰된 동작

### 1. '유령' 후보 창
macOS에서 `contenteditable` 컨테이너가 `transform: translate`를 사용하여 배치된 경우, IME 후보 창이 엉뚱한 좌표(주로 화면 왼쪽 상단)에 나타날 수 있습니다. 이는 브라우저의 좌표 매핑 로직이 CSS transform 값을 제대로 계산하지 못하기 때문입니다.

### 2. 뷰포트 차단 (모바일)
모바일 키보드가 나타나면 뷰포트가 줄어들거나 스크롤됩니다.
- **안드로이드 '자동 스크롤' 버그**: 안드로이드용 Chrome은 캐럿을 화면에 보이게 하기 위해 에디터가 고정 높이 모달 내부에 있더라도 *인접한 전체 페이지*를 스크롤하여 레이아웃을 깨뜨리기도 합니다.

### 3. Pinyin 가시성 (Safari 18)
최신 Safari 버전에서는 중국어 병음(Pinyin) 버퍼가 조합 중에 텍스트 노드의 일부로 DOM에 직접 렌더링되는 경우가 많습니다. 에디터가 이 시점에 DOM을 리렌더링하면, 확정되지 않은 병음 텍스트가 사고로 문서 모델에 "구워져(baked)" 저장될 위험이 있습니다.

## 해결책

### 1. 좌표 프록싱(Proxying)
복잡한 레이아웃의 경우, 에디터의 포커스를 모방하지만 실제 문서 흐름에 남아 있는 보이지 않는 "캐럿 프록시"(표준 textarea)를 사용하여 OS가 올바른 후보 창 위치를 찾도록 도울 수 있습니다.

### 2. 뷰포트 안정화
**Visual Viewport API**를 사용하여 키보드가 레이아웃을 밀어내는 시점을 감지하고, 수동으로 여백(padding)이나 전환 로직을 조정하십시오.

```javascript
/* 뷰포트 변화 대응 */
window.visualViewport.addEventListener('resize', () => {
    const offset = window.innerHeight - window.visualViewport.height;
    document.body.style.paddingBottom = `${offset}px`;
});
```

## 관련 사례
- [ce-0568: 크롬 안드로이드 Placeholder/캐럿 동기화](file:///Users/user/github/barocss/contenteditable/src/content/cases/ce-0568-chrome-android-placeholder-korean-ime.md)
- [ce-0194: iOS Safari 일본어 IME 스크롤 취소](file:///Users/user/github/barocss/contenteditable/src/content/cases/ce-0194-japanese-ime-scroll-cancels-ios-safari.md)
---
id: scenario-ime-ui-experience-ko
title: "IME UI 및 레이아웃: UX 동기화와 뷰포트 로직"
description: "후보 창, 캐럿 위치 및 모바일 뷰포트 변화를 포함한 IME 입력의 시각적 레이어에 대한 분석입니다."
category: "ux"
tags: ["ime", "ux", "scrolling", "viewport", "candidate-window"]
status: "confirmed"
locale: "ko"
---

## 문제 개요
IME 입력은 단순한 데이터 입력이 아니라 고유의 UI 상호작용입니다. 브라우저는 시스템의 "후보 창(Candidate Window)"(고정 UI)과 웹의 "캐럿 위치"(유동적인 DOM)를 정밀하게 연동해야 합니다. 정렬이 어긋나면 UI가 공중에 떠 있거나 텍스트를 가리는 현상이 발생합니다.

## 관찰된 동작

### 1. '유령' 후보 창
macOS에서 `contenteditable` 컨테이너가 `transform: translate`를 사용하여 배치된 경우, IME 후보 창이 엉뚱한 좌표(주로 화면 왼쪽 상단)에 나타날 수 있습니다. 이는 브라우저의 좌표 매핑 로직이 CSS transform 값을 제대로 계산하지 못하기 때문입니다.

### 2. 뷰포트 차단 (모바일)
모바일 키보드가 나타나면 뷰포트가 줄어들거나 스크롤됩니다.
- **안드로이드 '자동 스크롤' 버그**: 안드로이드용 Chrome은 캐럿을 화면에 보이게 하기 위해 에디터가 고정 높이 모달 내부에 있더라도 *인접한 전체 페이지*를 스크롤하여 레이아웃을 깨뜨리기도 합니다.

### 3. Pinyin 가시성 (Safari 18)
최신 Safari 버전에서는 중국어 병음(Pinyin) 버퍼가 조합 중에 텍스트 노드의 일부로 DOM에 직접 렌더링되는 경우가 많습니다. 에디터가 이 시점에 DOM을 리렌더링하면, 확정되지 않은 병음 텍스트가 사고로 문서 모델에 "구워져(baked)" 저장될 위험이 있습니다.

## 해결책

### 1. 좌표 프록싱(Proxying)
복잡한 레이아웃의 경우, 에디터의 포커스를 모방하지만 실제 문서 흐름에 남아 있는 보이지 않는 "캐럿 프록시"(표준 textarea)를 사용하여 OS가 올바른 후보 창 위치를 찾도록 도울 수 있습니다.

### 2. 뷰포트 안정화
**Visual Viewport API**를 사용하여 키보드가 레이아웃을 밀어내는 시점을 감지하고, 수동으로 여백(padding)이나 전환 로직을 조정하십시오.

```javascript
/* 뷰포트 변화 대응 */
window.visualViewport.addEventListener('resize', () => {
    const offset = window.innerHeight - window.visualViewport.height;
    document.body.style.paddingBottom = `${offset}px`;
});
```

## 관련 사례
- [ce-0568: 크롬 안드로이드 Placeholder/캐럿 동기화](file:///Users/user/github/barocss/contenteditable/src/content/cases/ce-0568-chrome-android-placeholder-korean-ime.md)
- [ce-0194: iOS Safari 일본어 IME 스크롤 취소](file:///Users/user/github/barocss/contenteditable/src/content/cases/ce-0194-japanese-ime-scroll-cancels-ios-safari.md)
