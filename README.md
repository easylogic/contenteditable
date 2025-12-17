# ⌨️ contenteditable.lab

> **A living catalog of `contenteditable` behavior across browsers, operating systems, and input methods.**

---

## Why This Project Exists

The `contenteditable` attribute is deceptively simple—add it to any HTML element and users can edit its contents. But beneath this simplicity lies a minefield of browser-specific quirks, OS-dependent behaviors, and IME complications that have frustrated developers for decades.

**contenteditable.lab** exists to document these behaviors systematically:

- 🔍 **Observe** — Real-world edge cases captured with precise reproduction steps
- 📚 **Catalog** — Organized by environment (OS × Browser × Input Method)
- 🧪 **Reproduce** — Interactive playground to verify behaviors yourself
- 📖 **Learn** — Documentation on events, Selection API, and modern alternatives

---

## What You'll Find Here

### 📋 Cases

Each case documents a specific `contenteditable` behavior:

```
Case: ce-0002-ime-enter-breaks
├── Environment: Windows × Chrome × Korean IME
├── Title: Composition is cancelled when pressing Enter
├── Description: What happens and why
├── Reproduction Steps: How to trigger it
└── Status: confirmed / draft
```

Cases are searchable by OS, browser, device, keyboard layout, and tags.

### 🎭 Scenarios

Scenarios group related cases that describe the same phenomenon across different environments. For example:

> "IME composition cancelled on Enter"
> - Windows + Chrome + Korean IME ✓
> - macOS + Safari + Japanese IME ✓
> - Linux + Firefox + Chinese IME ?

This helps you see which environments are affected and which need testing.

### 🧪 Playground

An interactive testing ground where you can:

- Type in a `contenteditable` region
- Watch events fire in real-time (`keydown`, `beforeinput`, `input`, `compositionstart/update/end`)
- Copy a pre-filled GitHub issue template with your event logs
- Reproduce documented cases in your own environment

### 📖 Documentation

Guides covering:

- **What is contenteditable?** — Fundamentals and use cases
- **Events** — The event lifecycle and browser differences
- **IME & Composition** — How input methods interact with contenteditable
- **Selection API** — Working with ranges and selections
- **execCommand alternatives** — Modern approaches to rich text editing
- **Browser compatibility** — Support matrix across browsers

---

## The Problem We're Solving

Building a rich text editor? You'll encounter questions like:

- *"Why does Enter behave differently in Safari?"*
- *"Why does my Korean IME lose characters on certain key combos?"*
- *"Why does paste formatting vary between browsers?"*
- *"Why does undo/redo break after programmatic DOM changes?"*

These aren't theoretical—they're real issues developers face daily. **contenteditable.lab** collects these "incidents" so you don't have to rediscover them the hard way.

---

## Who This Is For

- **Rich text editor developers** — ProseMirror, Slate, Lexical, Tiptap users
- **Web application developers** — Anyone using `contenteditable` in production
- **Browser engineers** — Understanding cross-browser behavior differences
- **Accessibility specialists** — Documenting input method behaviors
- **Curious developers** — Learning how the web platform really works

---

## Contributing

### Report a New Case

Found a weird `contenteditable` behavior? 

1. Go to the [Playground](/playground)
2. Reproduce the issue and observe the event log
3. Click "Copy GitHub issue template"
4. [Open an issue](https://github.com/user/contenteditable/issues/new) with your findings

### Verify Existing Cases

Many cases need confirmation across different environments. Pick a case marked as "draft" and test it in your environment.

### Translate

The UI supports multiple languages. See [TRANSLATION.md](./TRANSLATION.md) for contribution guidelines.

---

## Philosophy

**Precision over assumptions.** Each case documents exactly what happens, not what "should" happen according to specs.

**Environment matters.** The same code produces different results on Windows Chrome vs macOS Safari vs mobile browsers. We capture these differences.

**Reproducibility is key.** Every case includes steps to reproduce. If you can't reproduce it, we refine the case until you can.

**Community-driven.** No single person has tested every OS × Browser × IME combination. This catalog grows through collective documentation.

---

## Links

- 🌐 [Live Site](https://contenteditable.realerror.com)
- 📖 [Translation Guide](./TRANSLATION.md)
- 🤝 [Contributing Guide](./CONTRIBUTING.md)
- 🐛 [Report an Issue](https://github.com/user/contenteditable/issues)
