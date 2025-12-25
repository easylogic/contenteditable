---
id: ce-0103
scenarioId: scenario-image-insertion
locale: en
os: Windows
osVersion: "11"
device: Desktop or Laptop
deviceVersion: Any
browser: Chrome
browserVersion: "120.0"
keyboard: US
caseTitle: Pasting image from clipboard inserts as base64 data URL in Chrome
description: "When pasting an image from clipboard in Chrome, the image is inserted as an <img> tag with a base64 data URL. This can create very large HTML and may cause performance issues."
tags:
  - image
  - paste
  - base64
  - chrome
status: draft
domSteps:
  - label: "Clipboard"
    html: '[Image: screenshot.png]'
    description: "클립보드의 이미지"
  - label: "❌ After Paste (Bug)"
    html: '<img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA...">'
    description: "Base64 data URL로 삽입, HTML이 매우 큼 (수백 KB ~ MB)"
  - label: "✅ Expected"
    html: '<img src="/uploads/image.png">'
    description: "정상: 서버 URL 사용 또는 적절한 크기 관리"
---

### Phenomenon

When pasting an image from clipboard in Chrome, the image is inserted as an `<img>` tag with a base64 data URL. This can create very large HTML and may cause performance issues.

### Reproduction example

1. Copy an image to clipboard (e.g., screenshot)
2. Focus a contenteditable element
3. Paste (Ctrl+V)

### Observed behavior

- Image is inserted as `<img src="data:image/png;base64,...">`
- Base64 data URL can be very long (hundreds of KB to MB)
- HTML becomes bloated
- May cause performance issues with large images

### Expected behavior

- Image should be inserted but data URL size should be manageable
- Or option to upload image to server instead
- HTML should not become excessively large

### Browser Comparison

- **Chrome/Edge**: Inserts as base64 data URL (this case)
- **Firefox**: May not support image pasting or handle differently
- **Safari**: Behavior varies

### Notes and possible direction for workarounds

- Intercept paste event and handle images separately
- Upload image to server and use URL instead of data URL
- Compress image before inserting
- Limit image size or prompt user for upload option

