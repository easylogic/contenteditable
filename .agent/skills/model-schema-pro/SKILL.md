# Model & Schema Pro Skill

This skill guides the design, implementation, and documentation of document models and schemas for the editor.

## Core Concepts
- **Schema**: The contract defining node types (block vs inline), marks, and content rules (e.g., `block+`, `inline*`).
- **Model**: An abstract, validated tree representation that is position-based (paths) but identified by stable IDs.
- **Marks**: In-node formatting (bold, italic, link) that can have attributes (e.g., `href`) and exclusivity rules.

## Key Focus Areas
- **Transaction Management**: Implementing atomic changes with a Begin-Commit-Rollback lifecycle.
- **Model-View Separation**: Treating the DOM as a projection (View) and the internal tree as the Source of Truth (Model).
- **Node ID System**: Using stable, unique identifiers (e.g., NanoID) to solve the "Index Divergence" problem in mutable trees.
- **Model-DOM Sync**: Efficiently updating the DOM using Node IDs for stable mapping and WeakMap for O(1) reverse lookups.

## Architectural Integrity
- **Immutability/Versioning**: Prefer immutable model updates (e.g., structural sharing) to enable reliable history.
- **Node Stability**: Always use `WeakMap<HTMLElement, NodeID>` for mapping DOM to Model to prevent memory leaks.
- **Transaction Boundaries**: Group related operations (e.g., rapid keystrokes or complex paste) into a single history entry.

## Implementation Patterns
1. **The Reverse Lookup Map**: `private domToModel = new WeakMap<HTMLElement, NodeID>();` for O(1) event target resolution.
2. **Atomic History**: Every transaction MUST record `beforeSelection` and `afterSelection` for exact UI restoration.
3. **Hybrid Addressing**: Use Node IDs for long-term storage/reconciliation and Paths for ephemeral/local selection logic.

## Design Rules
1. **Nesting Restrictions**: Blocks cannot be nested inside inlines. Link marks may exclude each other.
2. **HTML Mapping**: Define clear serialization/parsing rules for every node type.
3. **Normalization**: Automatically convert legacy HTML (`<b>`, `<i>`, `<div>`) to standard schema nodes (`<strong>`, `<em>`, `<p>`).
4. **Collision Math**: Use 122-bit randomness (NanoID/UUIDv4) for distributed ID safety. Avoid auto-increment integers.

## Documentation Reference
Refer to `src/pages/editor/model-schema.astro` for the primary technical reference and implementation patterns.
