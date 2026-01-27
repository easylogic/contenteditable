---
id: ce-0063-contenteditable-with-required-ko
scenarioId: scenario-required-validation
locale: ko
os: Windows
osVersion: "11"
device: Desktop
deviceVersion: Any
browser: Chrome
browserVersion: "120.0"
keyboard: US
caseTitle: required 속성이 검증을 위해 지원되지 않음
description: "브라우저는 contenteditable 요소에 설정된 HTML5 'required' 속성을 무시하며, 이로 인해 네이티브 폼 검증이 빈 내용의 제출을 차단하지 못합니다."
tags: ["required", "validation", "form", "chrome"]
status: confirmed
---

## 현상
`contenteditable` 컨테이너를 `required`로 표시하더라도, 브라우저의 폼 검증 엔진은 그 내용을 확인하지 않습니다. 사용자는 논리적으로 '필수'인 에디터가 비어 있어도 폼을 제출할 수 있습니다.

## 재현 단계
1. `<form>`을 생성합니다.
2. `<div contenteditable="true" required></div>`를 추가합니다.
3. 제출 버튼을 추가합니다.
4. div를 비워둔 채 제출을 클릭합니다.
5. "이 필드를 입력하세요"와 같은 툴팁 없이 폼이 전송되는 것을 확인합니다.

## 해결 방법
`required` 속성이 있는 숨겨진 `input`을 사용하여 값을 동기화하거나, 폼 제출 시 수동으로 `checkValidity()` API를 사용하십시오.
