---
id: ce-0155-font-family-inheritance-issue-ko
scenarioId: scenario-font-family-change
locale: ko
os: Windows
osVersion: "11"
device: Desktop or Laptop
deviceVersion: Any
browser: Firefox
browserVersion: "120.0"
keyboard: US
caseTitle: Firefox에서 글꼴 패밀리 상속이 예상치 못한 서식을 일으킴
description: "Firefox에서 텍스트에 글꼴 패밀리를 적용할 때 글꼴이 예상치 못하게 부모 요소로부터 상속될 수 있습니다. 이것은 일관되지 않은 글꼴 렌더링을 일으키고 타이포그래피 제어를 어렵게 만듭니다."
tags:
  - font
  - inheritance
  - typography
  - firefox
status: draft
domSteps:
  - label: "Before"
    html: '<div style="font-family: Arial;">Hello <span style="background: yellow;">World</span></div>'
    description: "Parent element has Arial font, World text selected"
  - label: "After Font Family (Bug)"
    html: '<div style="font-family: Arial;">Hello <span style="font-family: Times; background: yellow;">World</span></div>'
    description: "Attempting to apply Times font, not applied due to parent font inheritance"
  - label: "✅ Expected"
    html: '<div style="font-family: Arial;">Hello <span style="font-family: Times; background: yellow;">World</span></div>'
    description: "Expected: Times font overrides parent font and is applied"
---

## 현상

Firefox에서 텍스트에 글꼴 패밀리를 적용할 때 글꼴이 예상치 못하게 부모 요소로부터 상속될 수 있습니다. 이것은 일관되지 않은 글꼴 렌더링을 일으키고 타이포그래피 제어를 어렵게 만듭니다.

## 재현 예시

1. font-family가 있는 부모 요소가 있는 contenteditable을 만듭니다
2. 선택한 텍스트에 다른 글꼴을 적용합니다
3. 글꼴 렌더링을 관찰합니다

## 관찰된 동작

- 글꼴이 부모로부터 상속될 수 있습니다
- 적용된 글꼴이 효과를 발휘하지 않을 수 있습니다
- 글꼴 렌더링이 일관되지 않습니다
- 타이포그래피 제어가 어렵습니다

## 예상 동작

- 적용된 글꼴이 부모 글꼴을 재정의해야 합니다
- 글꼴이 지정된 대로 적용되어야 합니다
- 상속이 예측 가능해야 합니다
- 타이포그래피가 제어 가능해야 합니다

## 브라우저 비교

- **Chrome/Edge**: 글꼴 적용이 일반적으로 작동함
- **Firefox**: 글꼴 상속 문제 (이 케이스)
- **Safari**: 글꼴 상속이 다양함

## 참고 및 해결 방법 가능한 방향

- 더 구체적인 CSS 선택자 사용
- 필요한 경우 `!important`로 글꼴 적용
- 인라인 스타일이 부모 스타일을 재정의하도록 보장
- 글꼴 상속 동작 정규화
