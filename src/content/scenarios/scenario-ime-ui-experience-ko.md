---
id: scenario-ime-ui-experience-ko
title: "IME UI 및 경험: 뷰포트, 후보창 및 레이아웃"
description: "브라우저 UI 충돌, 가상 키보드 리사이징 및 IME 후보창 위치 제어 전략입니다."
category: "ui"
tags: ["viewport", "keyboard", "candidates", "scroll", "anchoring"]
status: "confirmed"
locale: "ko"
---

## 개요
"IME 경험"은 단순한 데이터 처리를 넘어 에디터의 물리적 안정성에 관한 것입니다. 모바일 브라우저와 플로팅 후보창은 애플리케이션 UI와 빈번하게 충돌합니다.

## 핵심 사용자 경험 장벽

### 1. '뷰포트 점프' (스크롤 고정 오류)
IME가 활성화되면 브라우저의 "가상 뷰포트(Visual Viewport)"가 변합니다. 
- **회귀 버그 (iOS 18)**: 긴 문서를 작성하던 중 포커스를 주면 캐럿 위치를 고정하지 못하고, 뷰포트가 에디터 최상단으로 갑자기 튀어 오르는 현상이 발생합니다.
- **안드로이드**: Chrome은 전체 콘텐츠 영역을 리사이징하는 경우가 많아, 요소 크기를 `dv` 단위로 지정하지 않으면 레이아웃이 덜컥거릴 수 있습니다.

### 2. 후보창(Candidate Window) 위치 문제
일본어 간지 선택창과 같은 플로팅 윈도우는 OS가 렌더링하지만 위치는 브라우저가 결정합니다.
- **버그**: `Fixed` 또는 `Absolute` 컨테이너 내부에서 WebKit은 종종 후보창을 캐럿 옆이 아닌 화면 절대 좌표 0,0에 배치하는 오류를 범합니다.

### 3. 대화형 위젯(Interactive Widget) 동작
최신 뷰포트는 `interactive-widget=resizes-content` 설정을 정의할 수 있습니다. `resizes-content`와 `resizes-visual` 중 무엇을 선택하느냐에 따라 에디터 높이가 줄어들지, 아니면 키보드에 단순히 가려질지가 결정됩니다.

## 최적화 전략: 뷰포트 동기화

```javascript
/* Visual Viewport API를 사용한 위치 보정 */
window.visualViewport.addEventListener('resize', () => {
  if (isFocused && isIMEActive) {
      // 강제로 캐럿을 중앙으로 스크롤하여 점프 현상 방지
      ensureCaretInCenter();
  }
});
```

## 관련 사례
- [ce-0580: iOS 스크롤 고정 점프 오류](file:///Users/user/github/barocss/contenteditable/src/content/cases/ce-0580-ios-scroll-anchoring-jump-ko.md)
- [ce-0049: 일본어 IME 후보창 위치 오류](file:///Users/user/github/barocss/contenteditable/src/content/cases/ce-0049-ime-candidate-window-position-ko.md)
