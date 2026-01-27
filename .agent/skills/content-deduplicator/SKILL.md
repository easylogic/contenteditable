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

### 1. structural & logical Audit
Before merging content, perform a deep audit to detect non-semantic duplication:
- **Agent-Led Manual Comparison**: Select a candidate file and surgically compare its technical sections (Phenomenon, Cause, Solution) against other files in the same category. Focus on technical nuance rather than just text overlap.
- **Cross-File Shadowing**: Search for exact technical snippets (e.g., same code blocks) across different file categories.

### 2. The Merge Procedure
*   **Context**: Copy the "Phenomenon" or "Cause" from the micro-document.
*   **Integration**: Add a new sub-header in the Mega-Whitepaper or integrate into an existing one.
*   **References**: Move the "Related Cases" links to the Mega-Whitepaper's reference section.
*   **Normalization**: When merging bilingual content, ensure both EN and KO versions are updated simultaneously to maintain parity.

### 3. File Decommissioning
ONLY after verifying that:
1.  All content exists in the parent.
2.  All cases point to the parent.
3.  The parent build is valid (zero "Duplicate ID" warnings).

## mega-whitepaper registry
- `scenario-ime-interaction-patterns`: Functional keys, beforeinput sequences, composition start/end, auto-input behaviors.
- `scenario-ime-ui-experience`: Viewport, keyboard, candidate windows, scrolling, anchoring.
- `scenario-ime-language-specifics`: CJK, RTL, Thai, Indic unique behaviors.
- `scenario-performance-foundations`: RuleSet invalidation, memory leaks, large doc lag, CSS complexity.
- `scenario-accessibility-foundations`: ARIA-Tree, screen readers, roles, spellcheck interference.
- `scenario-content-normalization`: Paste, whitespace, DOM hygiene, &nbsp; management.
