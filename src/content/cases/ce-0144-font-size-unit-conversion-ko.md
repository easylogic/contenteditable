---
id: ce-0144-font-size-unit-conversion-ko
scenarioId: scenario-font-size-change
locale: ko
os: Windows
osVersion: "11"
device: Desktop or Laptop
deviceVersion: Any
browser: Chrome
browserVersion: "120.0"
keyboard: US
caseTitle: 글꼴 크기 단위가 일관되지 않게 변환됨 (px to em)
description: "Chrome에서 글꼴 크기를 적용할 때 단위(px, em, rem)가 일관되지 않게 변환될 수 있습니다. 상대 단위가 절대 단위로 변환되거나 그 반대일 수 있어 일관된 크기 유지가 어렵습니다."
tags:
  - font
  - size
  - unit
  - conversion
  - chrome
status: draft
domSteps:
  - label: "Before"
    html: '<span style="font-size: 1.2em;">Text</span>'
    description: "Font size applied with relative unit (em)"
  - label: "After Conversion (Bug)"
    html: '<span style="font-size: 19.2px;">Text</span>'
    description: "After editing, relative unit converted to absolute unit (px)"
  - label: "✅ Expected"
    html: '<span style="font-size: 1.2em;">Text</span>'
    description: "Expected: Original unit (em) preserved"
---

## 현상

Chrome에서 글꼴 크기를 적용할 때 단위(px, em, rem)가 일관되지 않게 변환될 수 있습니다. 상대 단위가 절대 단위로 변환되거나 그 반대일 수 있어 일관된 크기 유지가 어렵습니다.

## 재현 예시

1. em 단위로 글꼴 크기를 적용합니다: `font-size: 1.2em`
2. 텍스트를 편집하거나 다른 서식을 적용합니다
3. font-size 값을 관찰합니다

## 관찰된 동작

- 단위가 변환될 수 있습니다: `1.2em`이 `19.2px`가 됨
- 또는 단위가 보존될 수 있습니다
- 변환이 일관되지 않습니다
- 상대 크기가 손실됩니다

## 예상 동작

- 단위가 지정된 대로 보존되어야 합니다
- 또는 변환이 예측 가능해야 합니다
- 상대 단위가 상대적으로 유지되어야 합니다
- 동작이 일관되어야 합니다

## 브라우저 비교

- **Chrome/Edge**: 단위를 변환할 수 있음 (이 케이스)
- **Firefox**: 유사한 변환 동작
- **Safari**: 단위 처리가 다양함

## 참고 및 해결 방법 가능한 방향

- 원본 단위를 명시적으로 보존
- 필요한 경우에만 단위 변환
- 단위 변환 동작 문서화
- 원본 단위를 저장하기 위해 데이터 속성 사용 고려
