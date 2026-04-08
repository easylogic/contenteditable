# AGENTS.md — contenteditable.lab

Instructions for AI coding agents (Cursor, Codex, Claude Code, etc.) working in this repository.

## Knowledge model

The **markdown under `src/content/` is the canonical knowledge base.** We do **not** maintain a separate immutable “raw sources” folder or a parallel ingest archive. Git history is the audit trail.

## Read first

| Resource | Use |
|----------|-----|
| `README.md` | Project goals and structure |
| `CONTRIBUTING.md` | Case frontmatter, PR flow, dev setup |
| `TRANSLATION.md` | i18n contribution rules |
| `src/content/config.ts` | Zod schemas for `cases`, `scenarios`, `tips` |

Discovery in the browser is handled by the site (lists, filters, search). **No hand-maintained `index.md` of every page**—that would duplicate the site and go stale.

## Where content lives

| Kind | Path |
|------|------|
| Cases | `src/content/cases/` (`ce-*-*.md`) |
| Scenarios | `src/content/scenarios/` |
| Tips | `src/content/tips/` |
| Architecture / long-form | `src/content/architecture/` |

## Compounding rules (keep the wiki coherent)

When adding or editing content:

1. **Cases** must include valid frontmatter (see `CONTRIBUTING.md`). Use **`scenarioId`** to tie a case to its scenario when one exists.
2. **Cross-link** in prose: related cases, scenarios, tips, or architecture pages—so knowledge compounds by navigation, not only search.
3. If a phenomenon spans environments, prefer **updating the scenario** (and linking cases) rather than duplicating long explanations in every case.
4. **Do not contradict** a `status: confirmed` case without clear scope (environment, browser version) or an explicit “supersedes / exception” note.

## Optional maintenance (when asked)

- Scenarios with no linked cases: note gaps or add placeholders.
- Tags: align with existing tags in nearby files.

## Specialized skills

Workflow details live under `.agent/skills/` (e.g. case-generator, scenario-generator, documentation-pro). Use them when the task matches their scope.

## What we intentionally skip

- **`raw/`** — not used.
- **`log.md`** — not required; use commits/issues for notable changes if needed.
- **Embedding/RAG infra** — not part of this repo’s docs workflow unless added later for another purpose.
