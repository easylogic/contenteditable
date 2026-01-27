# Editor Architect Skill

This skill focuses on maintaining and evolving the core architecture of the `contenteditable` editor system.

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

## Documentation
Maintain the whitepapers in `src/pages/editor/` (e.g., `architecture.astro`, `transaction.astro`) to reflect the current state of the engine.
