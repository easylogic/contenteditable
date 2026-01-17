---
id: ce-0019-paste-plain-text-only-ko
scenarioId: scenario-paste-plain-text
locale: ko
os: macOS
osVersion: "Ubuntu 22.04"
device: Desktop or Laptop
deviceVersion: Any
browser: Safari
browserVersion: "120.0"
keyboard: US
caseTitle: 리치 텍스트를 붙여넣을 때 원하지 않는 서식이 포함됨
description: "외부 소스(Word 문서나 웹 페이지 등)에서 콘텐츠를 contenteditable 영역에 붙여넣을 때 원하지 않는 서식이 종종 포함됩니다. 서식을 수동으로 제거하지 않고 일반 텍스트로 붙여넣는 간단한 방법이 없습니다."
tags:
  - paste
  - formatting
  - plain-text
  - safari
status: draft
domSteps:
  - label: "Clipboard"
    html: '<span style="color: red; font-weight: bold;">Formatted Text</span>'
    description: "복사된 서식이 있는 텍스트 (Word 문서 등)"
  - label: "After Paste (Bug)"
    html: '<span style="color: red; font-weight: bold;">Formatted Text</span>'
    description: "붙여넣기에 원하지 않는 서식(색상, 굵게 등)이 포함됨"
  - label: "✅ Expected"
    html: 'Formatted Text'
    description: "예상: 일반 텍스트로 붙여넣거나 선택 가능한 형식으로 붙여넣기"
---

## 현상

외부 소스(Word 문서나 웹 페이지 등)에서 콘텐츠를 contenteditable 영역에 붙여넣을 때 원하지 않는 서식이 종종 포함됩니다. 서식을 수동으로 제거하지 않고 일반 텍스트로 붙여넣는 간단한 방법이 없습니다.

## 재현 예시

1. Word 문서나 웹 페이지에서 서식이 있는 텍스트를 복사합니다 (굵게, 색상, 글꼴 등 포함).
2. contenteditable div에 붙여넣습니다.
3. 모든 서식이 포함되어 있는 것을 관찰합니다.

## 관찰된 동작

- Safari는 기본적으로 모든 서식이 포함된 리치 텍스트를 붙여넣습니다.
- 내장된 "일반 텍스트로 붙여넣기" 옵션이 없습니다.
- 서식을 제거하려면 수동 개입이 필요합니다.

## 예상 동작

- 일반 텍스트로 붙여넣는 방법이 있어야 합니다 (예: Cmd+Shift+V 또는 컨텍스트 메뉴 옵션).
- 붙여넣기 동작은 애플리케이션에서 제어할 수 있어야 합니다.
- `beforeinput` 이벤트가 붙여넣기 작업을 가로채고 수정할 수 있어야 합니다.
