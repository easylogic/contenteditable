# Case Generator Skill

This skill defines the high-standard process for documenting a specific `contenteditable` incident or "Case".

## Case Structure & Metadata

Every case must be documented in both English (`.md`) and Korean (`-ko.md`).

### Frontmatter (YAML)
All fields are mandatory for confirmed cases. 
> [!IMPORTANT]
> **Pre-flight Check**: Always verify the current schema in [config.ts](file:///Users/user/github/barocss/contenteditable/src/content/config.ts) before creating or editing cases.

- `id`: Unique ID (e.g., `ce-0565`)
- `scenarioId`: ID of the parent scenario (e.g., `scenario-input-missing`)
- `locale`: `en` or `ko`
- `os`: `string | string[]` (e.g., "macOS" or ["Windows", "Linux"])
- `osVersion`: `string | string[]` (e.g., "14.4" or "Any")
- `device`: `string | string[]` (e.g., "Desktop" or ["Phone", "Tablet"])
- `deviceVersion`: `string | string[]` (e.g., "iPhone 15" or "Any")
- `browser`: `string | string[]` (e.g., "Chrome" or ["Edge", "Safari"])
- `browserVersion`: `string | string[]` (e.g., "121.0" or "Latest")
- `keyboard`: IME used (e.g., "Korean (IME)", "US QWERTY")
- `caseTitle`: Brief descriptive title
- `description`: 1-2 sentence summary
- `tags`: List including category and environment
- `status`: "draft" | "confirmed"
- `domSteps`: **CRITICAL**. A list of DOM state snapshots:
  ```yaml
  domSteps:
    - label: "Step Name"
      html: '<tag>Content</tag>'
      description: "What changed in this step"
  ```

## Document Body Sections

### 1. 현상 / Phenomenon
**MAXIMUM DETAIL REQUIRED**. Provide a deep technical explanation of the bug. Mention:
- Involved event names (e.g., `beforeinput`, `compositionupdate`).
- Relevant CSS properties (e.g., `white-space`, `user-select`).
- Specific DOM structures or API calls (`getSelection`, `execCommand`) that trigger the issue.
- Explain *why* the browser is failing at a low level.

### 2. 재현 단계 / Reproduction Steps
A clear, step-by-step numbered list. **Be specific**:
- Exactly what to type (e.g., "type '한', then '글' without pressing Enter").
- Exact mouse/keyboard interactions.
- Any specific hardware or OS settings required.

### 3. 관찰된 동작 / Observed Behavior
Deep dive into the lifecycle of the bug. Do not just say "it fails".
- List exact **event sequences** (e.g., `keydown (229)` -> `beforeinput (insertCompositionText)` -> `input`).
- Reference specific event properties like `data`, `dataTransfer`, or `getTargetRanges()`.
- Identify the exact millisecond or event where the deviation from expected behavior occurs.

### 4. 예상 동작 / Expected Behavior
Contrast the bug with how a spec-compliant browser or native text field should behave. Reference W3C specs if applicable.

### 5. 영향 / Impact
Real-world consequences for engineering:
- **State Corruption**: How it breaks React/Vue/Svelte reconciliation.
- **History/Undo**: How it leads to inconsistent undo/redo stacks.
- **UX**: Mention caret jumping, layout flickering, or keyboard dismissal.

### 6. 브라우저 비교 / Browser Comparison
Detailed comparison between Blink, WebKit, and Gecko. Identify if it's a regression in a specific engine version.

### 7. 해결 방법 / Solutions
**Actionable and Robust**. 
- Provide high-quality code snippets (JS/TS/CSS).
- Offer multiple levels of workarounds (e.g., "Level 1: Quick CSS fix", "Level 2: Robust Event Normalization").
- Link to official bug trackers (Bugzilla, WebKit, Chromium).

## Quality Guidelines
- **No Sparse Content**: Cases with less than 3-4 paragraphs of technical description will be considered "draft" or "incomplete".
- **Technical Rigor**: Use precise terminology (e.g., "Grapheme Cluster", "Zero Width Space", "Normalization Form D").
- **Bi-lingual Sync**: Ensure both versions are equally detailed and technically identical.
