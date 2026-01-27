# Content Deduplicator Skill

## Purpose
This skill provides a systematic approach to reducing documentation debt without losing technical research. It focuses on **Merging and Preserving** micro-scenarios into authoritative technical whitepapers.

## Philosophy: Merge & Preserve
1.  **Never delete unique insights**: If a small file contains a browser version or a specific reproduction step not in the parent, MOVE it, don't drop it.
2.  **Authoritative Parents**: All micro-scenarios must point to a "Mega-Whitepaper" (Interaction, UI, Performance, etc.).
3.  **Surgical Consolidation**:
    *   Identify semantic overlap.
    *   Append unique sections of the child to the parent.
    *   Update all case files (`scenarioId`) before considering child deletion.

## Workflow

### 1. Semantic Audit
Use `grep` and semantic search to find files with overlapping tags or keywords (e.g., 'scrolling', 'caret').

### 2. The Merge Procedure
*   **Context**: Copy the "Phenomenon" or "Cause" from the micro-document.
*   **Integration**: Add a new sub-header in the Mega-Whitepaper or integrate into an existing one.
*   **References**: Move the "Related Cases" links to the Mega-Whitepaper's reference section.

### 3. File Decommissioning
ONLY after verifying that:
1.  All content exists in the parent.
2.  All cases point to the parent.
3.  The parent build is valid.

## mega-whitepaper registry
- `scenario-ime-interaction-patterns`: Functional keys, beforeinput sequences, composition start/end.
- `scenario-ime-ui-experience`: Viewport, keyboard, candidate windows, scrolling.
- `scenario-ime-language-specifics`: CJK, RTL, Thai, Indic unique behaviors.
- `scenario-performance-foundations`: RuleSet invalidation, memory leaks, large doc lag.
- `scenario-accessibility-foundations`: ARIA-Tree, screen readers, roles.
- `scenario-content-normalization`: Paste, whitespace, DOM hygiene.
