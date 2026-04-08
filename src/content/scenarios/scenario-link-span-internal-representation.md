---
id: scenario-link-span-internal-representation
title: Link as non-anchor markup during editing (e.g. span + data-href)
description: "Some editors keep URLs on a span (or other non-anchor inline) with data-* attributes while the user edits, then serialize to semantic <a href> for publish or clipboard. Mainstream framework defaults still use <a> in the live DOM; span-based linking is a deliberate product/engineering choice with distinct trade-offs."
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
locale: en
---

Some editors keep URLs on a **`span`** (or other non-anchor inline) with **`data-*` attributes** while the user edits, then **serialize to semantic `<a href>`** for publish or clipboard. Mainstream framework defaults still use **`<a>`** in the live DOM; span-based linking is a **deliberate** product/engineering choice with distinct trade-offs.

## Problem Overview

Native `<a>` inside `contenteditable` participates in navigation, default `click` behavior, and selection quirks ([link click / editing](scenario-link-click-editing)). Teams that want “click places caret, Ctrl+click opens URL” or that fight nested-anchor normalization sometimes **avoid `<a>` until export**.

## Observed patterns

| Approach | Typical DOM while editing | Notes |
|----------|---------------------------|--------|
| **Default (most libraries)** | `<a href="…">text</a>` | Lexical `LinkNode`, Tiptap `Link`, ProseMirror `link` mark, Slate examples — see references. |
| **Internal span** | `<span data-href="…" class="…">text</span>` (or similar) | URL stored on data attribute; **click**/`keydown` handled in JS; export pipeline emits `<a>`. |
| **Hybrid** | `<a contenteditable="false">` wrappers | Used for widgets; different trade-offs than span+link. |

## Impact

- **Accessibility**: A live `span` is **not** a link in the accessibility tree until you expose role/name or export to `<a>`.
- **Clipboard**: Copy may produce HTML without native link semantics unless you customize `copy` / `serialize`.
- **Paste**: Pasted `<a>` may need normalization into your internal representation.
- **Maintenance**: You own URL validation, `rel`, `target`, and security (`javascript:` URLs, etc.).

## When teams choose span (or non-`<a>`) internally

- Strong control over **caret placement** at link boundaries without browser default navigation.
- Avoiding **invalid nested `<a>`** during partial edits before merge/sanitization.
- Matching a **CMS** or **design tool** pipeline that already uses `data-*` for internal references.

## Browser comparison

This is less “browser A vs B” than **your DOM contract vs native editing**. The same browser behaves differently if the node is `<a>` vs `<span>` (e.g. `closest('a')`, default link styling).

## Solutions

- **Serialize at boundaries**: On blur, save, or publish, convert internal spans to `<a href>` (or Markdown) with tests.
- **Optional decoration**: `role="link"` + `tabIndex={0}` on span **only** if you intentionally mirror link semantics for a11y while editing (still not the same as native navigation).
- **Reuse library defaults**: If you do not need span semantics, **Lexical / Tiptap / ProseMirror** defaults are battle-tested `<a>`-based paths.

## Related cases

- [ce-0587](ce-0587-link-span-data-href-editing-pattern) — pattern summary and checklist (English)
- [ce-0587 (ko)](ce-0587-link-span-data-href-editing-pattern-ko) — Korean locale

## References (external)

### Mainstream editors: default is `<a>`

- **Lexical** — [`@lexical/link`](https://lexical.dev/docs/api/modules/lexical_link): `LinkNode` / `AutoLinkNode` build a link element (`<a>`) in the DOM (`createDOM`).
- **Tiptap** — [Link extension](https://tiptap.dev/docs/editor/extensions/marks/link): mark that renders as `<a>` with configurable `HTMLAttributes`.
- **Slate** — [Inlines example](https://www.slatejs.org/examples/inlines): inline links are typically rendered as `<a {...attributes}>` in `renderElement`.
- **ProseMirror** — link marks in schema usually [`toDOM`](https://prosemirror.net/docs/ref/#model.MarkSpec.toDOM) to `["a", attrs, 0]` (see also this repo’s [model-schema link](/model-schema/node-types/link)).

### Discussions of editing difficulty and workarounds

- [GrapesJS #610 — Inserting/Editing links is hard](https://github.com/GrapesJS/grapesjs/issues/610) — real-world pain in a WYSIWYG builder around link UX.
- [Stack Overflow — Firefox / span inside hyperlink](https://stackoverflow.com/questions/37962939/problems-with-contenteditable-span-inside-hyperlink-in-firefox) — nested structure issues when mixing spans and anchors (already linked from [scenario-link-insertion](scenario-link-insertion)).

### Related reading in this project

- [tip-011-link-insertion-editing](tip-011-link-insertion-editing) — optional span + `data-href` subsection
- [scenario-link-insertion](scenario-link-insertion)
- [scenario-browser-hyperlink-detection](scenario-browser-hyperlink-detection)
