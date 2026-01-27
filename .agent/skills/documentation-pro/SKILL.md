# Documentation Pro Skill

This skill guides the creation and maintenance of high-quality, professional technical documentation for the `contenteditable.lab` ecosystem.

## Goals
- Maintain "whitepaper-grade" technical depth.
- Ensure clarity and accessibility for complex topics.
- Use consistent terminology and formatting.

## Standards
1. **Visual Clarity**: Use Diagrams (Mermaid preferred) for state machines, event flows, and architectures.
2. **Deep Dives**: Don't shy away from browser internals or spec details.
3. **Cross-Reference**: Link to related cases, scenarios, and external specs (W3C, MDN).
4. **Actionable Insights**: Always provide workarounds or recommended patterns for developers.

## File Locations
- Core Docs: `src/pages/editor/*.astro` (Astro-based docs)
- Case Studies: `src/content/cases/*.md`

## Structure for new Whitepapers
When creating a new technical reference:
1. **Abstract/Introduction**: Why this topic matters.
2. **The Problem**: What makes this specific area of `contenteditable` hard.
3. **Technical Architecture**: Detailed breakdown of how the solution/system works.
4. **Comparison/Ecosystem**: How it relates to other editors or technologies.
5. **Security/Performance**: Analysis of trade-offs.
6. **Summary/Takeaways**.
