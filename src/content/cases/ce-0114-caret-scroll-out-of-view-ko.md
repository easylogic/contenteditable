---
id: ce-0114-caret-scroll-out-of-view-ko
scenarioId: scenario-caret-out-of-viewport
locale: ko
os: Windows
osVersion: "11"
device: Desktop or Laptop
deviceVersion: Any
browser: Chrome
browserVersion: "120.0"
keyboard: US
caseTitle: 붙여넣기 작업 중 캐럿이 뷰포트 밖으로 이동함
description: "contenteditable 요소에 큰 콘텐츠를 붙여넣을 때 캐럿(커서)이 보이는 뷰포트 밖으로 끝날 수 있습니다. 사용자는 입력하는 위치를 볼 수 없으며 커서를 찾기 위해 수동으로 스크롤해야 합니다."
tags:
  - caret
  - cursor
  - viewport
  - paste
  - chrome
status: draft
domSteps:
  - label: "Before Paste"
    html: 'Hello World'
    description: "Basic text, cursor at visible position"
  - label: "Clipboard"
    html: '[Large content: 100+ lines of text...]'
    description: "Large content copied"
  - label: "After Paste (Bug)"
    html: 'Hello World<br>[Large content...]<br>|'
    description: "After paste, cursor moves outside viewport (| = cursor)"
  - label: "✅ Expected"
    html: 'Hello World<br>[Large content...]<br>|'
    description: "Expected: Cursor maintained inside viewport or auto-scroll"
---

## 현상

contenteditable 요소에 큰 콘텐츠를 붙여넣을 때 캐럿(커서)이 보이는 뷰포트 밖으로 끝날 수 있습니다. 사용자는 입력하는 위치를 볼 수 없으며 커서를 찾기 위해 수동으로 스크롤해야 합니다.

## 재현 예시

1. 일부 콘텐츠가 있는 contenteditable 요소를 만듭니다
2. 커서가 보이는 위치로 스크롤합니다
3. 큰 콘텐츠를 붙여넣습니다
4. 커서 위치를 확인합니다

## 관찰된 동작

- 커서가 보이는 뷰포트 밖으로 끝납니다
- 사용자가 입력 위치를 볼 수 없습니다
- 커서를 찾기 위해 수동으로 스크롤해야 합니다
- 사용자 경험이 나쁩니다

## 예상 동작

- 붙여넣기 후 커서가 보이게 유지되어야 합니다
- 뷰포트가 커서를 표시하도록 스크롤되어야 합니다
- 사용자가 항상 입력하는 위치를 볼 수 있어야 합니다
- 동작이 자동이어야 합니다

## 브라우저 비교

- **Chrome/Edge**: 캐럿이 보이지 않게 될 수 있음 (이 케이스)
- **Firefox**: 캐럿 위치를 잃을 가능성이 더 높음
- **Safari**: 캐럿 위치가 가장 예측 불가능함

## 참고 및 해결 방법 가능한 방향

- 붙여넣기 후 캐럿을 보이게 스크롤
- 선택에 `scrollIntoView()` 사용
- 캐럿이 뷰포트에 있는지 확인
- 필요한 경우 자동 스크롤
- 부드러운 스크롤을 위해 `requestAnimationFrame` 사용
