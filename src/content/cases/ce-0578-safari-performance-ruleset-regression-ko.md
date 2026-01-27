---
id: ce-0578-ko
scenarioId: scenario-performance-foundations
locale: ko
os: macOS
osVersion: "15.0"
device: Desktop
deviceVersion: Any
browser: Safari
browserVersion: "18.6"
keyboard: Any
caseTitle: "Safari 18.6: 대규모 스타일시트 환경에서 편집 시 레이아웃 쓰레싱"
description: "WebKit의 RuleSet 빌드 로직 회귀 버그로 인해, 다량의 속성 기반 CSS 규칙이 있는 페이지에서 contenteditable 영역 내부 편집 시 O(n^2) 수준의 성능 저하가 발생하는 현상입니다."
tags: ["performance", "safari-18", "css", "regression", "layout-thrashing"]
status: confirmed
domSteps:
  - label: "1. 대규모 스타일시트 로드"
    html: '<style> [class*="attr-"] { color: red; } /* 20,000개 이상의 규칙 */ </style>'
    description: "방대한 양의 속성 선택자(Attribute Selector)가 포함된 스타일시트를 적용합니다."
  - label: "2. 속성 변경 유발"
    html: '<div contenteditable="true" class="editor active">|</div>'
    description: "타이핑 중 에디터 프레임워크가 컨테이너에 클래스를 추가/제거합니다 (예: '.active')."
  - label: "3. 결과 (버그)"
    html: '<!-- UI가 2초 이상 멈춤 -->'
    description: "브라우저가 RuleSet을 비효율적으로 병합($O(n^2)$)하면서 AttributeChangeInvalidation 단계에서 과도한 시간을 소모합니다."
  - label: "✅ 예상 결과"
    html: '<!-- 즉각적인 업데이트 -->'
    description: "단순한 문자 입력 시 메인 스레드를 차단하지 않도록 스타일 무효화 로직이 최적화되어 있어야 합니다."
---

## 현상
Safari 18.6(및 관련 WebKit 빌드)에서 내부 `CSSSelectorList::makeJoining` 메서드가 극심한 성능 병목을 일으키는 회귀 버그가 도입되었습니다. `contenteditable` 에디터에서 포커스 클래스 추가나 하이라이트 스팬 생성 등으로 인해 스타일 변경이 트리거되면, 엔진은 속성 선택자에 대한 무효화 세트(Invalidation sets)를 다시 구축하려 시도합니다. 속성 선택자를 다용하는 대규모 CSS 프레임워크가 포함된 페이지에서는 이 과정이 제곱 비례($O(n^2)$) 형식으로 늘어나, 타이핑 도중 UI가 완전히 멈추는 현상이 발생합니다.

## 재현 단계
1. 10,000개 이상의 속성 규칙을 가진 매우 큰 CSS 파일(예: 복잡한 Tailwind 또는 CSS-in-JS 설정) 코드가 포함된 페이지로 이동합니다.
2. 포커스나 입력 시 `contenteditable` 컨테이너 또는 그 부모 요소에 동적으로 클래스를 적용하는 에디터를 사용합니다.
3. 키 입력과 화면에 글자가 나타나는 사이의 지연 시간을 관찰합니다.
4. Safari 웹 조사관(Web Inspector)의 타임라인을 통해 `AttributeChangeInvalidation` 또는 `RuleSet` 빌드 작업 시간을 분석합니다.

## 관찰된 동작
- **심각한 타이핑 지연**: DOM 속성을 수정하는 모든 이벤트 발생 시 메인 스레드가 수백 밀리초(심한 경우 수 초) 동안 차단됩니다.
- **마이크로 프리징**: 에디터에 포커스가 있는 상태에서 스크롤만 해도 레이아웃 무효화가 트리거되어 화면이 "버벅"거리는 느낌을 줍니다.

## 영향
- **성능 저하**: 사용자는 애플리케이션이 무겁고 응답이 없다고 느끼게 됩니다.
- **복잡한 앱 사용 불가**: 고사양 CMS나 IDE 스타일의 웹 에디터들은 대규모 CSS 테마를 사용하므로 이 버그로 인해 정상적인 편집이 불가능해집니다.

## 브라우저 비교
- **Safari 18.6**: $O(n^2)$ 복잡도 회귀 현상 확인.
- **Chrome / Firefox**: 속성 선택자에 대해 더 효율적인 무효화 버케팅(Invalidation bucketing)을 구현하여 $O(n \log n)$ 이상의 성능을 유지합니다.

## 참고 및 해결 방법
### 해결책: CSS 규칙 평탄화
꼭 필요한 경우가 아니라면 전역적으로 중첩된 속성 선택자(예: `[class*="..."]`)를 피하십시오. 규칙을 단순한 클래스 네임으로 평탄화(Flattening)하면 비용이 많이 드는 Joining 로직을 우회할 수 있습니다.

- [WebKit 이슈 #297591: 대규모 스타일 적용 시 극도로 느려짐](https://bugs.webkit.org/show_bug.cgi?id=297591)
- [WebKit 커밋 294191@main (회귀 원인)](https://github.com/WebKit/WebKit/commit/294191)
