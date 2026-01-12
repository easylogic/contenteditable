---
id: ce-0292
scenarioId: scenario-samsung-backspace-crash
locale: ko
os: Android
osVersion: "10-14"
device: Mobile (Pixel, Motorola, etc.)
deviceVersion: Any
browser: Firefox for Android
browserVersion: "120+"
keyboard: Korean (IME) - Gboard
caseTitle: Gboard에서 백스페이스 정상 작동
description: "안드로이드에서 Gboard(구글 키보드)를 사용할 때, 백스페이스 키를 길게 눌러도 contenteditable 에디터가 크래시되지 않고 정상적으로 삭제됩니다. 이것은 삼성 키보드 이슈가 삼성 키보드 특유임을 보여주는 대조 케이스입니다."
tags:
  - backspace
  - crash
  - android
  - gboard
  - working-correctly
status: confirmed
initialHtml: |
  <div contenteditable="true" style="padding: 20px; border: 1px solid #ccc; min-height: 100px;">
    여기에 텍스트를 입력하세요.
    <br><br>
    백스페이스 키를 길게 눌러보세요. Gboard에서는 정상 작동합니다.
  </div>
domSteps:
  - label: "Before"
    html: '<div contenteditable="true">안녕하세요</div>'
    description: "빈 에디터"
  - label: "Step 1: Type text"
    html: '<div contenteditable="true">안녕하세요 테스트입니다</div>'
    description: "텍스트 입력됨"
  - label: "Step 2: Hold backspace to delete"
    html: '<div contenteditable="true">안녕하세요|</div>'
    description: "✅ 정상: 백스페이스로 텍스트 삭제됨, 에디터 크래시 없음"
  - label: "Observation"
    html: '<div contenteditable="true">안녕하세요|</div>'
    description: "Gboard에서는 삼성 키보드와 달리 정상 작동, 이것은 대조 케이스"
---

## 현상

안드로이드에서 Gboard(구글 키보드)를 사용할 때, 백스페이스 키를 길게 눌러도 contenteditable 에디터가 크래시되지 않고 정상적으로 삭제됩니다.

## 재현 예시

1. 픽셀, 모토로라, 또는 Gboard가 설치된 안드로이드 기기에서 Firefox 브라우저를 엽니다.
2. contenteditable 요소에 텍스트를 입력합니다 (예: "안녕하세요 테스트입니다").
3. 백스페이스 키를 길게 누릅니다.

## 관찰된 동작

- **정상 삭제**: 백스페이스로 텍스트가 정상적으로 빠르게 삭제됨
- **에디터 안정**: 에디터가 크래시되지 않고 계속 작동함
- **자바스크립트 정상**: 스크립트 실행이 중단되지 않음
- **Gboard 특유 정상**: 삼성 키보드와 달리 이슈가 없음

## 참고사항

This is a **control case** demonstrating that Gboard works correctly while Samsung Keyboard causes crashes, showing the issue is Samsung Keyboard-specific.
