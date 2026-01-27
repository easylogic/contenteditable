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
- **Content Schema Synchronization**: **CRITICAL**. When adding or enriching content for Astro collections, first consult `src/content/config.ts`. Ensure all frontmatter fields align with the Zod schema to prevent build-time validation errors.

## Implementation Patterns
1. **The Reverse Lookup Map**: `private domToModel = new WeakMap<HTMLElement, NodeID>();` for O(1) event target resolution.
2. **Atomic History**: Every transaction MUST record `beforeSelection` and `afterSelection` for exact UI restoration.
3. **Hybrid Addressing**: Use Node IDs for long-term storage/reconciliation and Paths for ephemeral/local selection logic.

## Advanced Schema Implementation Patterns (New)
1. **Nested Parent Validation**: Use a `canContain(childType)` method in node definitions to enforce hierarchy (e.g., `TableCell` only inside `TableRow`).
2. **Atomic Node Boundaries**: For "Atomic" widgets (Images, Embeds), wrap them in a `contenteditable="false"` container but ensure it has a `data-node-id` for model mapping.
3. **Ghost Nodes for Selection**: Use Zero-Width Spaces (`\u200B`) inside empty blocks or at the boundaries of non-editable nodes to provide a valid DOM TextNode for the browser's Caret to land on.
4. **Layout Normalization**: Implement a `normalize()` method that automatically fixes broken hierarchies (e.g., a loose `TableRow` without a `Table`) during every transaction commit.
5. **Partial Rendering with Dirty Flags**: Track `isDirty` at the node level. Only re-render nodes (and their parents if necessary) that have changed to maintain high performance in deep trees.

## Design Rules
1. **Nesting Restrictions**: Blocks cannot be nested inside inlines. Link marks may exclude each other. Define strict parent-child relationships for complex structures (e.g., `Table` -> `TableRow` -> `TableCell`).
2. **HTML Mapping**: Define clear serialization/parsing rules for every node type. Handle multi-mapping (one model node to multiple DOM elements for technical reasons).
3. **Normalization**: Automatically convert legacy HTML (`<b>`, `<i>`, `<div>`) to standard schema nodes (`<strong>`, `<em>`, `<p>`).
4. **Collision Math**: Use 122-bit randomness (NanoID/UUIDv4) for distributed ID safety. Avoid auto-increment integers.

## Advanced Schema Expansion (New)
To support a wider range of document types, the model should accommodate:
- **Layout Nodes**: Multi-column wraps, grid systems, and flex containers that manage flow without containing text directly.
- **Interactive Widgets**: Non-editable "Atomic" nodes that behave as a single character (e.g., Image, Math formula, Code Sandbox, Tweet embed).
- **Metadata Nodes**: Invisible or sidebar-only nodes that store document-level settings or version history within the same tree.
- **Complex Lists**: Support for tasks (checkboxes), nested varied types (bullet inside numbered), and custom prefixes.
- **Table Variations**: Support for merged cells (colspan/rowspan), header rows/cols, and fixed-width columns.

## Advanced Content Constraints
- **Leaf-Only Rules**: Ensure certain nodes (like images or horizontal rules) cannot have children even if the DOM allows it.
- **Void Element Handling**: Define how the model handles elements with no content (e.g., `<br>`, `<img>`) during reconciliation.
- **Invisible Marker Nodes**: Using Zero-Width characters or specifically typed empty Spans to anchor selection in difficult layouts.

## Documentation Reference
Refer to `src/pages/editor/model-schema.astro` for the primary technical reference and implementation patterns.
