---
id: scenario-link-span-internal-representation-ko
title: "편집 중 비-앵커 마크업으로 링크 표현 (예: span + data-href)"
description: "일부 에디터는 편집 중에는 URL을 span 등 data-* 속성으로 두고, 발행·클립보드·저장 시에만 시맨틱 <a href>로 직렬화합니다. 주류 프레임워크 기본값은 여전히 라이브 DOM에 <a>를 쓰는 경우가 많고, span 기반은 의도적인 선택입니다."
category: formatting
tags:
  - link
  - span
  - data-href
  - serialization
  - accessibility
  - tiptap
  - lexical
  - prosemirror
status: draft
locale: ko
---

일부 에디터는 편집 중에는 URL을 **`span`** 등 **`data-*` 속성**으로 두고, 발행·클립보드·저장 시에만 **시맨틱 `<a href>`**로 직렬화합니다. 주류 프레임워크 기본값은 여전히 라이브 DOM에 **`<a>`**를 쓰는 경우가 많고, span 기반은 **의도적인** 제품/엔지니어링 선택입니다.

## 문제 개요

`contenteditable` 안의 네이티브 `<a>`는 클릭 시 이동, 기본 `click` 동작, 선택 이슈([링크 클릭·편집](scenario-link-click-editing-ko))에 연결됩니다. “클릭은 캐럿, Ctrl+클릭만 이동”처럼 쓰거나 중첩 `<a>` 정규화와 싸우려는 팀은 **export 전까지 `<a>`를 피하는** 선택을 할 수 있습니다.

## 관찰되는 패턴

| 접근 | 편집 중 DOM 일반적 형태 | 비고 |
|------|-------------------------|------|
| **기본(많은 라이브러리)** | `<a href="…">text</a>` | Lexical `LinkNode`, Tiptap `Link`, ProseMirror `link` 마크, Slate 예시 등 — 참고 자료 참조. |
| **내부 span** | `<span data-href="…" class="…">text</span>` 등 | URL은 data 속성; **클릭**/`keydown`은 JS; 내보내기 파이프라인에서 `<a>` 생성. |
| **하이브리드** | `<a contenteditable="false">` 래핑 | 위젯에 가깝고, span+링크와 트레이드오프가 다름. |

## 영향

- **접근성**: 살아 있는 `span`만으로는 링크가 아니며, 역할/이름을 노출하거나 `<a>`로 내보내기 전까지 보조 기술에 링크로 안 보일 수 있음.
- **클립보드**: 복사 HTML에 네이티브 링크 의미가 없을 수 있음 — `copy`/`serialize` 커스터마이즈 필요.
- **붙여넣기**: 붙여온 `<a>`를 내부 표현으로 정규화해야 할 수 있음.
- **유지보수**: URL 검증, `rel`, `target`, `javascript:` 같은 보안을 직접 책임짐.

## span(비-`<a>`)을 고르는 경우

- 링크 경계 **캐럿 배치**를 브라우저 기본 이동과 분리하고 싶을 때.
- 병합/새니타이즈 전 **중첩 `<a>`**를 DOM에 남기고 싶지 않을 때.
- **CMS·디자인 도구** 파이프라인이 내부 참조를 `data-*`로 쓰는 경우.

## 브라우저 비교

엔진 A vs B보다 **“당신의 DOM 계약 vs 네이티브 편집”** 문제에 가깝습니다. 같은 브라우저도 노드가 `<a>`인지 `<span>`인지에 따라 `closest('a')`, 기본 링크 스타일이 달라집니다.

## 해결 방법

- **경계에서 직렬화**: blur, 저장, 발행 시 span을 `<a href>`(또는 Markdown)로 변환하고 테스트.
- **의도적 장식만**: 편집 중에만 `role="link"` 등을 쓸지는 팀 정책과 감사 요구에 따름.
- **기본값 재사용**: span 의미가 꼭 필요 없으면 **Lexical / Tiptap / ProseMirror** 기본 `<a>` 경로가 검증된 선택입니다.

## 관련 케이스

- [ce-0587](ce-0587-link-span-data-href-editing-pattern-ko) — 패턴 요약·체크리스트 (한국어)
- [ce-0587 (en)](ce-0587-link-span-data-href-editing-pattern) — English locale

## 참고 자료 (외부)

### 주류 에디터: 기본은 `<a>`

- **Lexical** — [`@lexical/link`](https://lexical.dev/docs/api/modules/lexical_link): `LinkNode` / `AutoLinkNode`가 DOM에 링크 요소(`<a>`)를 만듦 (`createDOM`).
- **Tiptap** — [Link extension](https://tiptap.dev/docs/editor/extensions/marks/link): `<a>`로 렌더링, `HTMLAttributes` 설정 가능.
- **Slate** — [Inlines 예시](https://www.slatejs.org/examples/inlines): 인라인 링크를 보통 `<a {...attributes}>`로 `renderElement`에 매핑.
- **ProseMirror** — 스키마의 링크 마크는 보통 [`toDOM`](https://prosemirror.net/docs/ref/#model.MarkSpec.toDOM)으로 `["a", attrs, 0]` (이 레포 [model-schema link](/model-schema/node-types/link) 참고).

### 편집 난이도·우회 논의

- [GrapesJS #610 — 링크 삽입/편집이 어렵다](https://github.com/GrapesJS/grapesjs/issues/610)
- [Stack Overflow — Firefox / 하이퍼링크 안의 span](https://stackoverflow.com/questions/37962939/problems-with-contenteditable-span-inside-hyperlink-in-firefox) — [scenario-link-insertion](scenario-link-insertion-ko)에서도 인용

### 이 프로젝트

- [tip-011-link-insertion-editing-ko](tip-011-link-insertion-editing-ko) — span + `data-href` 선택 절
- [scenario-link-insertion-ko](scenario-link-insertion-ko)
- [scenario-browser-hyperlink-detection-ko](scenario-browser-hyperlink-detection-ko)
