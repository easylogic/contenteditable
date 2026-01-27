# Scenario Generator Skill

This skill defines the process for creating a "Scenario" - a group of related Cases that reflect a universal web phenomenon.

## Scenario Structure

Every scenario must have an English version (`.md`) and a Korean version (`-ko.md`).

### Frontmatter (YAML)
- `id`: Unique slug (e.g., `scenario-composition-mismatch`)
- `title`: Universal name of the phenomenon
- `description`: High-level technical summary
- `category`: "ime" | "selection" | "input" | "clipboard" | "ui" | "accessibility" | "css" | "performance"
- `tags`: Sub-topics
- `status`: "draft" | "confirmed"
- `locale`: `en` or `ko`

## Document Body Sections

### 1. 문제 개요 / Problem Overview
Explain the technical challenge or bug category. Why is this problematic for editor developers?

### 2. 관찰된 동작 / Observed Behavior
Describe the phenomenon as it happens across multiple environments. 
- Use **Code Examples**: Provide non-wrapped `javascript` blocks showing event listeners and the output logic.
- Divide into sub-scenarios if necessary (e.g., "Scenario 1: Input at boundary", "Scenario 2: Input in table").

### 3. 영향 / Impact
List the high-level risks, such as state divergence, layout breakage, or accessibility failures.

### 4. 브라우저 비교 / Browser Comparison
A section detailing how different engines (Blink, WebKit, Gecko) diverge in this scenario.

### 5. 해결 방법 / Solutions
**This is the most important section.**
- Provide multiple mitigation strategies.
- Include robust code examples using best practices (e.g., using `getTargetRanges()` before falling back to `getSelection()`).
- Add logic for normalization or state reconciliation.

### 6. 모범 사례 / Best Practices
Bullet points summarizing the "Do's and Don'ts" for the community.

### 7. 관련 케이스 / Related Cases
Link to actual `ce-XXXX` case files that belong to this scenario.

### 8. 참고 자료 / References
Links to specs (W3C), official MDN docs, and relevant bug trackers.

## Quality Guidelines
- **Universal Focus**: A scenario should not just be about one browser bug; it should be about the *type* of bug.
- **Code Portability**: The code snippets provided in "Solutions" should be easy to adapt into various editor frameworks.
- **Narrative Depth**: Use technical but accessible language to explain *why* the browser behaves the way it does.
