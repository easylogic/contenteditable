# Case Generator Skill

This skill defines the high-standard process for documenting a specific `contenteditable` incident or "Case".

## Case Structure & Metadata

Every case must be documented in both English (`.md`) and Korean (`-ko.md`).

### Frontmatter (YAML)
All fields are mandatory for confirmed cases.
- `id`: Unique ID (e.g., `ce-0565`)
- `scenarioId`: ID of the parent scenario (e.g., `scenario-input-missing`)
- `locale`: `en` or `ko`
- `os`: "macOS" | "Windows" | "iOS" | "Android" | "Linux"
- `osVersion`: Specific version if known (e.g., "14.4")
- `browser`: "Chrome" | "Safari" | "Firefox" | "Edge" | "Samsung Internet"
- `browserVersion`: Major or specific version (e.g., "121.0")
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
Detailed technical explanation of the bug. Mention event names, CSS properties, or API calls involved.

### 2. 재현 단계 / Reproduction Steps
A clear, step-by-step numbered list that any developer can follow to verify the bug.

### 3. 관찰된 동작 / Observed Behavior
Deep dive into the lifecycle of the bug. 
- List exact event sequences (e.g., `keydown` -> `beforeinput` -> `input`).
- Mention event properties like `inputType`, `data`, `getTargetRanges()`.
- Identify the exact point of failure.

### 4. 예상 동작 / Expected Behavior
Contrast the bug with how a spec-compliant or regular browser should behave.

### 5. 영향 / Impact
Real-world consequences for:
- Framework state synchronization (React/Vue/Slate).
- Undo/Redo stack reliability.
- UI/UX (Focus loss, caret jumping, layout breaking).

### 6. 브라우저 비교 / Browser Comparison
Briefly list how other major browsers handle the same situation to highlight it's a browser-specific quirk.

### 7. 참고 및 해결 방법 / References & Solutions
- **Code Snippets**: Provide actionable JavaScript/CSS workarounds.
- **Reference Links**: Link to W3C specs, Bugzilla, WebKit bugs, or community issues (GitHub/SO).

## Quality Guidelines
- **DOM Visuals**: `domSteps` are used to render static previews. Ensure the HTML is simple but representative.
- **Bi-lingual Sync**: Ensure the English and Korean versions are technically identical in their data points.
- **Precision**: Use exact browser version numbers when possible.
