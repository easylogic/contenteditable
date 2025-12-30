---
id: ce-0045
scenarioId: scenario-insertHTML-behavior
locale: ko
os: Windows
osVersion: "11"
device: Desktop or Laptop
deviceVersion: Any
browser: Chrome
browserVersion: "120.0"
keyboard: US
caseTitle: insertHTML이 DOM 구조와 서식을 손상시킴
description: "document.execCommand('insertHTML', ...)를 사용하여 contenteditable 영역에 HTML 콘텐츠를 삽입할 때 DOM 구조가 손상되거나 예상치 못하게 재서식될 수 있습니다. 중첩된 요소가 평탄화되거나 재서식될 수 있습니다."
tags:
  - insertHTML
  - dom
  - formatting
  - chrome
status: draft
domSteps:
  - label: "Before"
    html: 'Hello World'
    description: "기본 텍스트"
  - label: "Insert HTML"
    html: '<p><strong>Bold text</strong></p>'
    description: "insertHTML을 통해 삽입할 HTML"
  - label: "❌ After insertHTML (Bug)"
    html: 'Hello <strong>Bold text</strong> World'
    description: "DOM 구조 손상, &lt;p&gt; 태그 손실, 중첩 구조 평탄화됨"
  - label: "✅ Expected"
    html: 'Hello <p><strong>Bold text</strong></p> World'
    description: "예상: HTML 구조 보존, 중첩 요소 유지됨"
---

### 현상

`document.execCommand('insertHTML', ...)`를 사용하여 contenteditable 영역에 HTML 콘텐츠를 삽입할 때 DOM 구조가 손상되거나 예상치 못하게 재서식될 수 있습니다. 중첩된 요소가 평탄화되거나 재구성될 수 있습니다.

### 재현 예시

1. contenteditable div를 만듭니다.
2. 그 안에서 위치를 선택합니다.
3. `document.execCommand('insertHTML', false, '<p><strong>Bold text</strong></p>')`를 사용합니다.
4. 결과 DOM 구조를 검사합니다.

### 관찰된 동작

- Windows의 Chrome에서 `insertHTML`이 DOM 구조를 손상시킬 수 있습니다.
- 중첩된 요소가 평탄화되거나 재구성될 수 있습니다.
- 서식이 손실되거나 예상치 못하게 변경될 수 있습니다.

### 예상 동작

- `insertHTML`은 제공된 HTML 구조를 보존해야 합니다.
- 중첩된 요소는 중첩 상태를 유지해야 합니다.
- 서식이 유지되어야 합니다.
