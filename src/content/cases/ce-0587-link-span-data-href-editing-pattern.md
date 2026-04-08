---
id: ce-0587-link-span-data-href-editing-pattern
scenarioId: scenario-link-span-internal-representation
locale: en
os: Any
osVersion: Any
device: Desktop or Laptop
deviceVersion: Any
browser: Any
browserVersion: Any
keyboard: US
caseTitle: Pattern — span + data-href for links during edit, <a> on export
description: "Engineering pattern (not a single-browser bug): some products represent hyperlinks as spans with data-* URLs in the editable DOM, then convert to <a href> when saving or publishing. Contrast with Lexical, Tiptap, and ProseMirror defaults that use <a> in the live DOM."
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

This entry documents a **recurring implementation strategy**, not one vendor’s defect. Some teams avoid live `<a>` nodes inside `contenteditable` and instead store the URL on **`span[data-href]`** (or similar) while editing, then **serialize to `<a href>`** for output HTML, email, or static pages.

Mainstream editor packages **default to `<a>` in the DOM** while editing—see [Lexical `@lexical/link`](https://lexical.dev/docs/api/modules/lexical_link), [Tiptap Link](https://tiptap.dev/docs/editor/extensions/marks/link), and typical ProseMirror `link` mark `toDOM`—so choosing spans is an explicit trade-off.

## When this pattern appears

- Need **click-to-caret** without navigation unless modified (e.g. Ctrl/Cmd+click).
- Want to **delay** semantic link markup until a sanitization / merge pass.
- CMS or design tools that already use **`data-*`** for internal references.

## Trade-offs (summary)

| Topic | Risk if only span in the editor |
|--------|----------------------------------|
| Accessibility | Native link semantics missing until export or ARIA decoration |
| Clipboard | May need custom `copy` / `cut` handlers to emit `<a>` |
| Security | Must validate URLs on the same rules as `href` |

## Related scenario

- [scenario-link-span-internal-representation](scenario-link-span-internal-representation) — full write-up, external references, and links to Lexical/Tiptap/Slate defaults

## References

- [Tip: Link insertion and editing](tip-011-link-insertion-editing) — optional span subsection
- [GrapesJS #610](https://github.com/GrapesJS/grapesjs/issues/610) — discussion of difficult link UX in WYSIWYG builders
