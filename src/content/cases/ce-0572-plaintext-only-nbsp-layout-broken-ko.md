---
id: ce-0572-ko
scenarioId: scenario-paste-plain-text
locale: ko
os: Linux
osVersion: "Ubuntu 22.04"
device: Desktop
deviceVersion: Any
browser: Chrome
browserVersion: "121.0"
keyboard: US QWERTY
caseTitle: "plaintext-only 모드에서 붙여넣기 시 &nbsp; 잔류 현상"
description: "2024년 초 Chromium 버전에서 contenteditable='plaintext-only' 사용 시 붙여넣기 과정에서 불필요하게 줄바꿈 방지 공백(&nbsp;)이 보존되어 CSS 텍스트 줄바꿈이 깨지는 현상입니다."
tags: ["plaintext-only", "paste", "nbsp", "layout", "chrome-121"]
status: confirmed
domSteps:
  - label: "1단계: 에디터 설정"
    html: '<div contenteditable="plaintext-only" style="width: 100px;">|</div>'
    description: "네이티브 plaintext-only 모드가 적용된 에디터를 초기화합니다."
  - label: "2단계: 콘텐츠 붙여넣기"
    html: '<div contenteditable="plaintext-only" style="width: 100px;">long text message|</div>'
    description: "앞뒤에 공백이 포함된 'long text message'를 붙여넣습니다."
  - label: "3단계: 버그 발생"
    html: '<div contenteditable="plaintext-only" style="width: 100px;">long&nbsp;text&nbsp;message|</div>'
    description: "Chromium이 공백을 &nbsp;로 보존합니다. 이들은 줄바꿈을 방지하므로, 텍스트가 100px 컨테이너에서 줄바꿈되지 않고 가로로 넘칩니다."
  - label: "✅ 예상 동작"
    html: '<div contenteditable="plaintext-only" style="width: 100px;">long text message|</div>'
    description: "예상: 모든 공백은 표준 줄바꿈 가능 공백(U+0020)으로 정규화되어야 합니다."
---

## 현상
`contenteditable="plaintext-only"` 속성은 수동으로 `paste` 이벤트를 가로챌 필요를 없애기 위해 고안되었습니다. 하지만 2024년 초(Chrome 121), 엔진이 붙여넣기 시 문장 앞뒤나 중간의 공백을 표준 공백(U+0020)이 아닌 줄바꿈 방지 공백인 `&nbsp;`(U+00A0)로 잘못 변환하거나 보존하는 현상이 발견되었습니다. `&nbsp;`는 CSS의 자동 줄바꿈을 막기 때문에, 붙여넣은 텍스트가 컨테이너를 뚫고 나가는 등 레이아웃을 파괴하게 됩니다.

## 재현 단계
1. `contenteditable="plaintext-only"`와 고정 너비(예: `200px`)를 가진 `<div>`를 생성합니다.
2. 여러 개의 공백이나 포맷이 포함된 긴 문장을 복사합니다.
3. 브라우저 기본 동작을 사용하여 해당 div에 텍스트를 붙여넣습니다.
4. 결과 DOM 문자열을 검사하거나 줄바꿈 동작을 관찰합니다.

## 관찰된 동작
1. **DOM 구조**: 태그는 없지만, 문자 수준에서 검사하면 `&nbsp;` 엔티티가 다수 확인됩니다.
2. **레이아웃**: 텍스트가 단일 행으로 유지되어 가로 스크롤을 유발하거나 부모 레이아웃을 깨뜨립니다.
3. **선택 영역**: 해당 행을 트리플 클릭하여 선택할 때 보이지 않는 `&nbsp;` 문자까지 포함되어, 이후의 URL 감지 로직 등이 실패할 수 있습니다.

## 예상 동작
모든 공백 문자 시퀀스는 컨테이너의 CSS `white-space` 속성을 존중하며, 표준 줄바꿈 가능 공백(U+0020)으로 정규화되어야 합니다.

## 영향
- **UI 레이아웃 파손**: 사이드바, 채팅 버블, 댓글창 등이 예상치 못하게 가로로 넘칩니다.
- **검색 실패**: 애플리케이션 내부의 검색 로직이 표준 공백을 찾을 때 `&nbsp;`와 매칭되지 않아 검색 결과에 누락될 수 있습니다.
- **데이터 오염 전파**: 해당 텍스트를 다시 복사하여 다른 곳에 붙여넣으면 `&nbsp;` 오염이 다른 애플리케이션으로 전파됩니다.

## 브라우저 비교
- **Chrome / Edge (v121-122)**: `plaintext-only` 모드에서 확인된 회귀 버그.
- **Safari**: 표준 공백으로 정규화하여 붙여넣기를 처리함.
- **Firefox**: 평문 추출 과정에서 정확하게 정규화를 수행함.

## 참고 및 해결 방법
### 해결책: 수동 정규화
`plaintext-only`를 사용하더라도 해당 기능이 오작동하는 Chromium 버전을 지원해야 한다면, 단기 필터를 두어 브라우저 출력을 정리해야 합니다.

```javascript
element.addEventListener('input', (e) => {
    if (element.innerHTML.includes('&nbsp;')) {
        // 주의: 캐럿 위치를 유지하기 위한 정교한 처리가 필요할 수 있습니다.
        element.innerHTML = element.innerHTML.replace(/&nbsp;/g, ' ');
    }
});
```

- [Chromium 이슈 #1521404 (관련 이슈)](https://issues.chromium.org/issues/41492025)
- [Baseline 2025: contenteditable="plaintext-only"](https://web.dev/blog/baseline-contenteditable-plaintext-only)
