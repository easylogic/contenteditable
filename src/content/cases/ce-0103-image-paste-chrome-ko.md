---
id: ce-0103
scenarioId: scenario-image-insertion
locale: ko
os: Windows
osVersion: "11"
device: Desktop or Laptop
deviceVersion: Any
browser: Chrome
browserVersion: "120.0"
keyboard: US
caseTitle: 클립보드에서 이미지 붙여넣기가 Chrome에서 base64 데이터 URL로 삽입됨
description: "Chrome에서 클립보드에서 이미지를 붙여넣을 때 이미지가 base64 데이터 URL이 있는 <img> 태그로 삽입됩니다. 이것은 매우 큰 HTML을 만들 수 있으며 성능 문제를 일으킬 수 있습니다."
tags:
  - image
  - paste
  - base64
  - chrome
status: draft
domSteps:
  - label: "Clipboard"
    html: '[Image: screenshot.png]'
    description: "Image in clipboard"
  - label: "❌ After Paste (Bug)"
    html: '<img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA...">'
    description: "Inserted as Base64 data URL, HTML very large (hundreds of KB ~ MB)"
  - label: "✅ Expected"
    html: '<img src="/uploads/image.png">'
    description: "Expected: Use server URL or appropriate size management"
---

### 현상

Chrome에서 클립보드에서 이미지를 붙여넣을 때 이미지가 base64 데이터 URL이 있는 `<img>` 태그로 삽입됩니다. 이것은 매우 큰 HTML을 만들 수 있으며 성능 문제를 일으킬 수 있습니다.

### 재현 예시

1. 클립보드에 이미지를 복사합니다 (예: 스크린샷)
2. contenteditable 요소에 포커스합니다
3. 붙여넣기 (Ctrl+V)

### 관찰된 동작

- 이미지가 `<img src="data:image/png;base64,...">`로 삽입됩니다
- Base64 데이터 URL이 매우 길 수 있습니다 (수백 KB ~ MB)
- HTML이 비대해집니다
- 큰 이미지로 인해 성능 문제가 발생할 수 있습니다

### 예상 동작

- 이미지가 삽입되어야 하지만 데이터 URL 크기가 관리 가능해야 합니다
- 또는 이미지를 서버에 업로드하는 옵션
- HTML이 과도하게 커지지 않아야 합니다

### 브라우저 비교

- **Chrome/Edge**: base64 데이터 URL로 삽입 (이 케이스)
- **Firefox**: 이미지 붙여넣기를 지원하지 않거나 다르게 처리할 수 있음
- **Safari**: 동작이 다양함

### 참고 및 해결 방법 가능한 방향

- 붙여넣기 이벤트를 가로채고 이미지를 별도로 처리
- 이미지를 서버에 업로드하고 데이터 URL 대신 URL 사용
- 삽입 전 이미지 압축
- 이미지 크기 제한 또는 업로드 옵션에 대한 사용자 프롬프트
