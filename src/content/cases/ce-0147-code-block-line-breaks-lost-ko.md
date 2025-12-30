---
id: ce-0147
scenarioId: scenario-code-block-editing
locale: ko
os: Windows
osVersion: "11"
device: Desktop or Laptop
deviceVersion: Any
browser: Chrome
browserVersion: "120.0"
keyboard: US
caseTitle: 코드 블록 편집 시 줄바꿈이 손실됨
description: "Chrome에서 코드 블록 내에서 텍스트를 편집할 때 줄바꿈이 손실되거나 새줄로 보존되는 대신 <br> 태그로 변환될 수 있습니다. 이것은 코드 서식과 구조를 깨뜨립니다."
tags:
  - code
  - pre
  - line-break
  - chrome
status: draft
domSteps:
  - label: "Before"
    html: '<pre><code>function test() {<br>    return true;<br>}</code></pre>'
    description: "Code block with multiple lines"
  - label: "After Editing (Bug)"
    html: '<pre><code>function test() { return true; }</code></pre>'
    description: "After editing, line breaks lost, merged into single line"
  - label: "✅ Expected"
    html: '<pre><code>function test() {<br>    return true;<br>}</code></pre>'
    description: "Expected: Line breaks preserved"
---

## 현상

Chrome에서 코드 블록 내에서 텍스트를 편집할 때 줄바꿈이 손실되거나 새줄로 보존되는 대신 `<br>` 태그로 변환될 수 있습니다. 이것은 코드 서식과 구조를 깨뜨립니다.

## 재현 예시

1. 여러 줄이 있는 코드 블록을 만듭니다
2. 코드를 편집합니다 (줄 추가, 삭제, 수정)
3. 줄바꿈 보존을 관찰합니다

## 관찰된 동작

- 줄바꿈이 손실됩니다
- 또는 줄바꿈이 `<br>` 태그로 변환됩니다
- 코드 구조가 깨집니다
- 서식이 손실됩니다

## 예상 동작

- 줄바꿈이 보존되어야 합니다
- 코드 구조가 유지되어야 합니다
- 서식이 그대로 유지되어야 합니다
- 동작이 코드 편집기와 일치해야 합니다

## 브라우저 비교

- **Chrome/Edge**: 줄바꿈이 손실될 수 있음 (이 케이스)
- **Firefox**: 유사한 줄바꿈 문제
- **Safari**: 줄바꿈 보존이 일관되지 않음

## 참고 및 해결 방법 가능한 방향

- `white-space: pre` CSS가 적용되도록 보장
- 새줄을 올바르게 삽입하기 위해 Enter 키 가로채기
- 편집 중 줄바꿈 보존
- 손실된 경우 줄바꿈 모니터링 및 복원
