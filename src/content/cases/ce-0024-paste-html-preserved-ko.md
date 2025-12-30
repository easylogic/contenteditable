---
id: ce-0024
scenarioId: scenario-paste-formatting-loss
locale: ko
os: macOS
osVersion: "Ubuntu 22.04"
device: Desktop or Laptop
deviceVersion: Any
browser: Safari
browserVersion: "120.0"
keyboard: US
caseTitle: 리치 텍스트를 붙여넣을 때 원하지 않는 HTML 구조가 보존됨
description: "외부 소스(Word 문서나 웹 페이지 등)에서 콘텐츠를 Safari의 contenteditable 영역에 붙여넣을 때 인라인 스타일이 있는 span 태그와 같은 원하지 않는 요소를 포함하여 HTML 구조가 보존됩니다."
tags:
  - paste
  - formatting
  - html
  - safari
status: draft
domSteps:
  - label: "Clipboard"
    html: '<span style="color: red; font-size: 14px;">Text</span>'
    description: "복사된 서식이 있는 텍스트 (Word 문서 등)"
  - label: "❌ After Paste"
    html: '<span style="color: red; font-size: 14px;">Text</span>'
    description: "원하지 않는 HTML 구조가 보존됨 (span 태그, 인라인 스타일)"
  - label: "✅ Expected"
    html: '<strong>Text</strong>'
    description: "정규화된 HTML 구조 또는 선택 가능한 형식"
---

### 현상

외부 소스(Word 문서나 웹 페이지 등)에서 콘텐츠를 Safari의 contenteditable 영역에 붙여넣을 때 인라인 스타일이 있는 `<span>` 태그, `<div>` 요소 및 기타 서식 마크업과 같은 원하지 않는 요소를 포함하여 HTML 구조가 보존됩니다.

### 재현 예시

1. Word 문서나 웹 페이지에서 서식이 있는 텍스트를 복사합니다.
2. Safari의 contenteditable div에 붙여넣습니다.
3. 붙여넣은 콘텐츠의 DOM 구조를 검사합니다.

### 관찰된 동작

- Safari는 소스의 전체 HTML 구조를 보존합니다.
- `<span style="...">`, `<div>` 및 기타 서식 태그와 같은 원하지 않는 요소가 포함됩니다.
- 붙여넣은 콘텐츠의 스타일이 일관되지 않을 수 있습니다.

### 예상 동작

- 붙여넣기 작업이 HTML 구조를 정규화하거나 정리해야 합니다.
- 또는 붙여넣을 내용을 제어하는 방법이 있어야 합니다 (일반 텍스트 vs 서식).
