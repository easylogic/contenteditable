---
id: ce-0587-link-span-data-href-editing-pattern-ko
scenarioId: scenario-link-span-internal-representation
locale: ko
os: Any
osVersion: Any
device: Desktop or Laptop
deviceVersion: Any
browser: Any
browserVersion: Any
keyboard: US
caseTitle: 패턴 — 편집 중 span + data-href, 내보내기 시 <a>
description: "엔지니어링 패턴(단일 브라우저 버그 아님): 일부 제품은 편집 DOM에서 하이퍼링크를 data-* URL이 있는 span으로 두고, 저장·발행 시 <a href>로 변환합니다. Lexical·Tiptap·ProseMirror 기본값은 라이브 DOM에 <a>를 쓰는 경우가 많습니다."
tags:
  - link
  - span
  - data-href
  - architecture
  - serialization
  - pattern
status: draft
---

## Phenomenon

이 항목은 **반복되는 구현 전략**을 정리한 것이며, 특정 벤더의 결함 하나를 다루지 않습니다. 일부 팀은 `contenteditable` 안에서 **살아 있는 `<a>`**를 피하고, 편집 중에는 **`span[data-href]`** 등으로 URL을 두었다가 **출력 HTML·메일·정적 페이지**에 **`<a href>`**로 직렬화합니다.

주류 에디터 패키지는 편집 중에도 DOM에 **`<a>`를 기본**으로 씁니다 — [Lexical `@lexical/link`](https://lexical.dev/docs/api/modules/lexical_link), [Tiptap Link](https://tiptap.dev/docs/editor/extensions/marks/link), 일반적인 ProseMirror `link` 마크 `toDOM` 등 — span을 쓰는 것은 **명시적인** 선택입니다.

## 이 패턴이 나올 때

- **클릭은 캐럿**, 이동은 수정 키와 함께만 하고 싶을 때.
- 새니타이즈·병합 전까지 **시맨틱 링크 마크업을 미루고** 싶을 때.
- **CMS·디자인 도구**가 내부 참조를 `data-*`로 쓰는 경우.

## 트레이드오프 (요약)

| 주제 | 편집기에 span만 둘 때의 리스크 |
|------|-------------------------------|
| 접근성 | 내보내기 전까지 네이티브 링크 의미 없음(ARIA 보강은 별도 정책) |
| 클립보드 | `<a>`를 내보내려면 `copy`/`cut` 등 커스터마이즈 필요할 수 있음 |
| 보안 | `href`와 동일한 수준으로 URL 검증 필요 |

## 관련 시나리오

- [scenario-link-span-internal-representation-ko](scenario-link-span-internal-representation-ko) — 외부 참조·Lexical/Tiptap/Slate 기본 동작 포함 전체 설명

## 참고

- [팁: 링크 삽입·편집](tip-011-link-insertion-editing-ko) — span 선택 절
- [GrapesJS #610](https://github.com/GrapesJS/grapesjs/issues/610) — WYSIWYG에서 링크 UX 난이도 논의
