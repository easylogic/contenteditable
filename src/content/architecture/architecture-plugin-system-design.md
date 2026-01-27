---
id: architecture-plugin-system-design
title: "Designing an Extensible Plugin Architecture"
description: "How to build an internal API that allows horizontal feature expansion without bloating the core editor."
category: "architecture"
tags: ["plugins", "middleware", "extensibility", "events"]
status: "confirmed"
locale: "en"
---

## Overview
A monolithic editor is a maintenance nightmare. A **Plugin-based architecture** decouples features (like Link detection, Mention pickers, and History) from the core rendering engine. This guide outlines the "Middleware Table" approach used by modern editors.

## Core Concepts

### 1. The Command Bus
Plugins should communicate via **Commands** rather than direct function calls.
- `editor.dispatch(UNDO_COMMAND)`
- `editor.dispatch(INSERT_LINK_COMMAND, { url: '...' })`

### 2. Transform Hooks
Plugins should have access to the transformation pipeline. For example, a "Link Plugin" can register a hook that runs after every `input` event to scan for URLs.

### 3. The Decoration System (Overlay Logic)
Plugins often need to highlight text without changing the document model (e.g., misspelled words, search results).
- **ProseMirror Strategy**: `Decorations` are calculated and painted onto the DOM separate from the node tree.
- **Lexical Strategy**: `TextNode` properties or `DecoratorNodes` are used to inject UI widgets.

## Recommended Plugin Interface

```javascript
/* Typical Plugin Definition */
export const MyPlugin = {
  // 1. Initial State
  init(editor) {
    editor.registerCommand(MY_COMMAND, () => { ... });
  },
  
  // 2. Event Interception
  handleEvent(event, editor) {
    if (event.type === 'paste') {
      return this.interceptPaste(event, editor);
    }
  },
  
  // 3. Cleanup
  destroy(editor) {
    editor.unregisterAll(this);
  }
};
```

## Best Practices
- **Prioritized Middleware**: Allow plugins to register with a priority (e.g., a "History Plugin" should probably capture "Undo" before any generic keyboard plugin).
- **Lazy Loading**: If a plugin is only needed for a specific feature (like a Table Editor), load it on-demand to keep the initial JS bundle small.
- **Sandboxed state**: Maintain plugin-specific state in a dedicated store within the `EditorState`.

## References
- [ProseMirror: Plugin guide](https://prosemirror.net/docs/guide/#plugin)
- [Slate.js: Using plugins](https://docs.slatejs.org/concepts/08-plugins)
- [Lexical: Plugin system](https://lexical.dev/docs/concepts/plugins)
