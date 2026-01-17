---
id: ce-0074-contenteditable-with-content-security-policy-ko
scenarioId: scenario-csp-restrictions
locale: ko
os: Windows
osVersion: "11"
device: Desktop or Laptop
deviceVersion: Any
browser: Chrome
browserVersion: "120.0"
keyboard: US
caseTitle: Content Security Policy가 contenteditable 동작을 제한할 수 있음
description: "페이지에 엄격한 Content Security Policy(CSP)가 있을 때 특정 contenteditable 작업이 제한될 수 있습니다. CSP 구성에 따라 콘텐츠 붙여넣기, 스크립트 실행 또는 HTML 삽입이 차단될 수 있습니다."
tags:
  - csp
  - security
  - chrome
  - windows
status: draft
---

## 현상

페이지에 엄격한 Content Security Policy(CSP)가 있을 때 특정 contenteditable 작업이 제한될 수 있습니다. CSP 지시문에 따라 콘텐츠 붙여넣기, 스크립트 실행 또는 HTML 삽입이 차단될 수 있습니다.

## 재현 예시

1. 엄격한 CSP 헤더가 있는 페이지를 만듭니다 (예: `default-src 'self'`).
2. 페이지에 contenteditable div를 만듭니다.
3. 클립보드에서 콘텐츠를 붙여넣으려고 시도합니다.
4. 프로그래밍 방식으로 HTML을 삽입하려고 시도합니다.
5. CSP 위반이나 차단된 작업을 관찰합니다.

## 관찰된 동작

- Windows의 Chrome에서 CSP가 특정 contenteditable 작업을 차단할 수 있습니다.
- `unsafe-inline`이 허용되지 않으면 붙여넣기가 제한될 수 있습니다.
- contenteditable 내의 스크립트 실행이 차단될 수 있습니다.
- CSP 위반이 콘솔에 기록될 수 있습니다.

## 예상 동작

- CSP가 기본 contenteditable 편집을 방해하지 않아야 합니다.
- 붙여넣기가 CSP 제약 내에서 작동해야 합니다.
- 또는 CSP와 contenteditable 상호작용에 대한 명확한 문서가 있어야 합니다.
