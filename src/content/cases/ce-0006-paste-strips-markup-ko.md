---
id: ce-0006
scenarioId: scenario-paste-formatting-loss
locale: ko
os: Windows
osVersion: "11"
device: Desktop or Laptop
deviceVersion: Any
browser: Chrome
browserVersion: "120.0"
keyboard: US
caseTitle: contenteditable에 리치 텍스트를 붙여넣을 때 마크업이 예상치 못하게 제거됨
description: "리치 텍스트 소스(워드 프로세서나 웹 페이지 등)에서 콘텐츠를 contenteditable 요소에 붙여넣을 때 결과 DOM에서 소스에 있던 제목, 목록 또는 인라인 서식이 손실됩니다."
tags:
  - paste
  - clipboard
  - formatting
status: draft
domSteps:
  - label: "Clipboard"
    html: '<h3>Title</h3><ul><li><strong>Bold</strong></li><li><em>Italic</em></li></ul>'
    description: "복사된 서식이 있는 콘텐츠"
  - label: "❌ After Paste"
    html: 'Title<br>Bold<br>Italic'
    description: "서식 손실, 텍스트만 남음"
  - label: "✅ Expected"
    html: '<h3>Title</h3><ul><li><strong>Bold</strong></li><li><em>Italic</em></li></ul>'
    description: "서식 유지됨"
---

## 현상

리치 텍스트 소스(워드 프로세서나 웹 페이지 등)에서 콘텐츠를 `contenteditable` 요소에 붙여넣을 때 결과 DOM에서 소스에 있던 제목, 목록 또는 인라인 서식이 손실됩니다.

## 재현 예시

1. 다른 애플리케이션이나 웹 페이지에서 짧은 서식이 있는 스니펫을 복사합니다:
   - 제목
   - 글머리 기호 또는 번호가 있는 목록
   - 굵게 또는 기울임꼴 텍스트가 있는 줄
2. 편집 가능한 영역에 포커스합니다.
3. 키보드 단축키나 컨텍스트 메뉴를 사용하여 콘텐츠를 붙여넣습니다.

## 관찰된 동작

- 붙여넣은 콘텐츠가 일반 텍스트로 나타납니다.
- 목록 마커가 일반 문자로 변하거나 여러 줄이 하나로 축소됩니다.
- DOM에서 굵게 또는 기울임꼴과 같은 인라인 스타일이 보존되지 않습니다.

## 예상 동작

- 최소한 일부 구조적 마크업(제목, 목록, 단락)이 보존되어야 합니다.
- 인라인 서식이 보존되거나 문서화된 방식으로 의도적으로 정규화되어야 합니다.

## 참고사항

- 동일한 소스 콘텐츠를 사용하여 브라우저와 OS 조합 전체에서 동작을 비교합니다.
- 제품이 외부 마크업을 보존해야 하는지, 제한된 내부 모델로 정규화해야 하는지, 또는 항상 일반 텍스트로 제거해야 하는지 결정합니다.
