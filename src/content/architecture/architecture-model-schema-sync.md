---
id: architecture-model-schema-sync
title: "Modern Model-Schema Synchronization strategies"
description: "How to maintain a robust Source of Truth in 2025 editors using the Reconciler pattern."
category: "architecture"
tags: ["model", "schema", "reconciliation", "sourcetofocus", "immutability"]
status: "confirmed"
locale: "en"
---

## Overview
In modern rich-text editors (ProseMirror, Lexical, Slate), the DOM is no longer the Source of Truth. Instead, a structured **Model** (often an Immutable Tree or JSON) dictates what the document is, and a **Schema** defines the rules of that model. The core challenge is the bidirectional synchronization between this model and the browser's messy `contenteditable` DOM.

## The Reconciler Pattern
The most robust architecture uses a single-direction update loop, similar to React:

1.  **User Input**: Fires a `beforeinput` or `input` event.
2.  **Intercept**: The editor prevents the default browser action if possible.
3.  **Model Update**: A transaction is applied to the internal Model.
4.  **Reconcile**: The editor compares the new Model with the old DOM.
5.  **Render**: Only the specific parts of the DOM that changed are updated.

## Schema Best Practices (2025)

### 1. Granular Serialization
Avoid converting the entire document to HTML frequently. Use a schema that can serialize/deserialize individual "blocks" or "nodes" to optimize performance.

### 2. Strict Normalization
The Model should enforce valid structures (e.g., "A list must only contain list items"). If a user paste or mutation breaks this rule, the Schema must provide a `normalize` function to immediately "heal" the model.

```javascript
/* Schema Normalization Example */
{
  name: "ordered_list",
  content: "list_item+",
  normalize(node, transaction) {
    if (node.childCount === 0) {
      // Automatically remove empty lists
      transaction.remove(node); 
    }
  }
}
```

### 3. Selection Awareness
The Model must include the **Selection State** as part of its data. This ensures that undo/redo operations restore the cursor position perfectly, even across complex structural changes.

## Synchronization Challenges
- **IME Composition**: Never update the Model *during* an active composition session if it requires re-rendering the DOM, as this will kill the browser's IME buffer.
- **Collaborative Editing (OT/CRDT)**: Use an operational transform or CRDT to handle concurrent Model updates from other users.

## References
- [ProseMirror: The Document Model](https://prosemirror.net/docs/guide/#doc)
- [Lexical: State management](https://lexical.dev/docs/concepts/editor-state)
- [Slate.js: Principles](https://docs.slatejs.org/concepts/01-nodes)
