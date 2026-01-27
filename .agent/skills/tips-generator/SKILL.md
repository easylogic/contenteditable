# Tips Generator Skill

This skill defines the process for creating "Tips" - high-level, actionable advice for developers building rich-text editors. Tips should focus on common traps, performance optimizations, and UX patterns.

## Tip Structure

Every tip must be documented in both English (`.md`) and Korean (`-ko.md`).

### Frontmatter (YAML)
- `id`: Unique slug (e.g., `tip-selection-restoration`)
- `title`: Catchy, descriptive title
- `category`: "performance" | "ux" | "accessibility" | "api" | "testing"
- `tags`: Specific sub-topics
- `status`: "confirmed"
- `locale`: `en` or `ko`

## Document Body Sections

### 1. 요약 / Summary
A 1-2 sentence overview of the advice.

### 2. 문제 상황 / The Problem
What is the common mistake or difficult situation this tip addresses? Use non-wrapped `javascript` to show the "bad" way if necessary.

### 3. 모범 사례 / Best Practice
The recommended solution. 
- Use **Code Examples**: High-quality, framework-agnostic code.
- Explain the **logic** behind the solution.

### 4. 주의 사항 / Caveats
When should this tip *not* be used? What are the potential side effects?

### 5. 관련 링크 / References
Links to MDN, specifications, or community discussions.

## Quality Guidelines
- **Actionable**: A developer should be able to read the tip and immediately improve their code.
- **Visuals**: Use diagrams or code diffs to contrast "Before" and "After" states.
- **Narrative**: Keep the tone professional but helpful, like a senior engineer mentor.
