# Content Deduplicator Skill

This skill defines the process for auditing the technical library to identify and resolve redundant Scenarios, Cases, and Architecture documents.

## Objectives
- **Maintain Lean Content**: Prevent fragmentation of information across multiple files with overlapping themes.
- **Merge Logic**: Combine the "Historical Context" of old bugs with the "Modern Regressions" of new bugs into a single, high-quality document when applicable.
- **Consistency**: Ensure that localized pairs (EN/KO) are synchronized during the deduplication process.

## Deduplication Workflow

### 1. Identify Candidates
- **Title Scrutiny**: Look for identical or highly similar titles (e.g., "IME Composition" vs "Composition Events").
- **ID overlap**: Check if different IDs (e.g., `ce-0012` and `ce-0570`) address the same browser ENGINE bug (e.g., Chromium RTL behavior).
- **Tag Clusters**: Scan for files sharing 100% of their tags and locale.

### 2. Decision Matrix
- **Merge**: If Case A is a legacy bug and Case B is a 2025 regression of the SAME issue, merge them into one Case, documenting BOTH historical and modern versions.
- **Delete**: If Case B is an exact duplicate of Case A with no new technical depth, delete Case B.
- **Re-link**: If a Scenario is redundant but has unique related Cases, move those Case links to the primary Scenario and delete the redundant one.

### 3. Execution
- Use `render_diffs` to show the merged content clearly.
- Update the `task.md` to reflect the cleanup.
- Ensure that if an English file is deleted, its Korean counterpart is also handled.

## Quality Standards
- **Source of Truth**: The merged document must mention the original Case IDs (e.g., "Formerly ce-0123 and ce-0567") to preserve historical references.
- **Clean Registry**: No broken links in `scenarios` after a Case is deleted.
