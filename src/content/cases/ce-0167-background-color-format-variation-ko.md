---
id: ce-0167
scenarioId: scenario-background-color-change
locale: ko
os: Windows
osVersion: "11"
device: Desktop or Laptop
deviceVersion: Any
browser: Chrome
browserVersion: "120.0"
keyboard: US
caseTitle: 배경색 형식이 다양함 (hex, rgb, rgba)
description: "Chrome에서 배경색을 적용할 때 색상 형식(hex, rgb, rgba)이 일관되지 않게 다양할 수 있습니다. 같은 색상이 다른 형식으로 저장될 수 있어 프로그래밍 방식으로 작업하기 어렵습니다."
tags:
  - color
  - background
  - format
  - chrome
status: draft
domSteps:
  - label: "Before"
    html: 'Hello World'
    description: "Basic text"
  - label: "After Color Picker (Bug)"
    html: 'Hello <span style="background-color: rgb(255,255,0);">World</span>'
    description: "When applied via color picker, rgb format"
  - label: "After Text Input (Bug)"
    html: 'Hello <span style="background-color: #ffff00;">World</span>'
    description: "When applied via text input, hex format (inconsistent)"
  - label: "✅ Expected"
    html: 'Hello <span style="background-color: #ffff00;">World</span>'
    description: "Expected: Consistent color format (hex or rgb)"
---

## 현상

Chrome에서 배경색을 적용할 때 색상 형식(hex, rgb, rgba)이 일관되지 않게 다양할 수 있습니다. 같은 색상이 다른 형식으로 저장될 수 있어 프로그래밍 방식으로 작업하기 어렵습니다.

## 재현 예시

1. 색상 선택기를 통해 노란색 배경을 적용합니다
2. 텍스트 입력을 통해 노란색 배경을 적용합니다
3. DOM 색상 값을 관찰합니다

## 관찰된 동작

- 색상 형식이 다양함: `#ffff00`, `rgb(255,255,0)`, `rgba(255,255,0,1)`
- 같은 색상이 다른 형식으로 저장됨
- 일관되지 않은 색상 표현
- 색상을 쿼리하거나 수정하기 어려움

## 예상 동작

- 색상 형식이 일관되어야 합니다
- 또는 형식이 예측 가능해야 합니다
- 같은 색상이 같은 형식을 사용해야 합니다
- 형식이 작업하기 쉬워야 합니다

## 브라우저 비교

- **Chrome/Edge**: 형식이 다양함 (이 케이스)
- **Firefox**: 유사한 형식 불일치
- **Safari**: 형식 처리가 다양함

## 참고 및 해결 방법 가능한 방향

- 적용 후 색상 형식 정규화
- 모든 색상을 일관된 형식으로 변환 (예: hex 또는 rgba)
- 필요한 경우 원본 형식 저장
- 색상 형식 동작 문서화
