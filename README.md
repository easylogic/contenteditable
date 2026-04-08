# ⌨️ contenteditable.lab

> **A living catalog of `contenteditable` behavior across browsers, operating systems, and input methods.**

---

## Why This Project Exists

The `contenteditable` attribute is deceptively simple—add it to any HTML element and users can edit its contents. But beneath this simplicity lies a minefield of browser-specific quirks, OS-dependent behaviors, and IME complications that have frustrated developers for decades.

### The Reality of contenteditable

When you use `contenteditable` in production, you quickly discover that:

- **The same code behaves differently** across Chrome, Firefox, Safari, and Edge
- **IME (Input Method Editor) behavior** varies dramatically between Windows, macOS, and Linux
- **Event sequences** (`beforeinput`, `input`, `compositionstart`, etc.) fire in different orders depending on the browser
- **Selection and Range APIs** have subtle but critical differences that break editor features
- **Undo/redo stacks** are cleared unexpectedly or don't include programmatic changes
- **Paste behavior** is inconsistent, sometimes preserving formatting, sometimes stripping it
- **Mobile browsers** introduce entirely new sets of quirks with touch interactions

These aren't edge cases—they're the daily reality of building rich text editors. Major projects like ProseMirror, Slate, and Lexical have spent years working around these issues, but their solutions are often proprietary or too complex for smaller projects.

**contenteditable.lab** exists to document these behaviors systematically so that:

- 🔍 **You can observe** — Real-world edge cases captured with precise reproduction steps and environment details
- 📚 **You can search** — Cases organized by environment (OS × Browser × Input Method) so you can find issues specific to your users
- 🧪 **You can reproduce** — Interactive playground to verify behaviors in your own environment before shipping code
- 📖 **You can learn** — Comprehensive documentation on events, Selection API, and proven workarounds

---

## What You'll Find Here

### 📋 Cases

Each case documents a specific `contenteditable` behavior observed in a particular environment. A case includes:

```
Case: ce-0002-ime-enter-breaks
├── Environment: Windows × Chrome × Korean IME
├── Title: Composition is cancelled when pressing Enter
├── Description: Detailed explanation of what happens and why
├── Reproduction Steps: Step-by-step instructions to trigger it
├── Expected Behavior: What should happen according to specs
├── Observed Behavior: What actually happens in this environment
├── Analysis: Technical explanation if known
├── DOM Steps: Visual representation of DOM changes
└── Status: confirmed (verified) / draft (needs verification)
```

**Why cases matter:** When a user reports "the editor breaks when I type Korean," you can search for cases with `Korean IME` tag and find the exact scenario, reproduction steps, and potential workarounds. Cases are searchable by:

- **OS** (Windows, macOS, Linux, iOS, Android)
- **Browser** (Chrome, Firefox, Safari, Edge)
- **Device** (Desktop, Mobile, Tablet)
- **Keyboard layout** (US QWERTY, Korean IME, Japanese IME, etc.)
- **Tags** (ime, composition, selection, paste, undo, etc.)

### 🎭 Scenarios

Scenarios group related cases that describe the same phenomenon across different environments. This helps you understand:

1. **Which environments are affected** — Is this a Chrome-only issue or does it affect all browsers?
2. **Which environments need testing** — Are there gaps in our coverage?
3. **The scope of the problem** — Is this a universal issue or environment-specific?

**Example scenario:**

> **"IME composition cancelled on Enter"**
> 
> This scenario groups cases where pressing Enter during IME composition cancels the composition unexpectedly:
> - Windows + Chrome + Korean IME ✓ (confirmed)
> - macOS + Safari + Japanese IME ✓ (confirmed)
> - Linux + Firefox + Chinese IME ? (needs testing)
> - iOS Safari + Chinese IME ? (needs testing)

Each scenario page includes:
- **Description** of the phenomenon
- **Impact** on user experience and development
- **Browser comparison** showing which browsers are most/least affected
- **Workarounds** and solutions that have been tested
- **Related cases** with links to specific environment combinations
- **Graph visualization** showing relationships between cases, scenarios, and tags

### 🧪 Playground

An interactive testing ground where you can:

- **Type and observe** — Type in a `contenteditable` region and watch events fire in real-time
- **Visualize ranges** — See selection, composition, and `beforeinput` ranges overlaid on the editor
- **Track DOM changes** — Visualize deleted and added text regions with color-coded highlights
- **Detect invisible characters** — See ZWNBSP, NBSP, LF, CR, TAB, and other invisible characters
- **Identify non-editable areas** — Highlight `contenteditable="false"` regions within selections
- **Capture snapshots** — Automatically save snapshots when anomalies are detected, with full event logs and environment info
- **Browse event history** — View detailed event logs with timing, DOM structure, and `getTargetRanges()` data
- **Test with presets** — Choose from 23+ sample HTML presets covering various scenarios (CJK, RTL, tables, code blocks, emoji, etc.)
- **Export reports** — Copy comprehensive event analysis reports for GitHub issues

### 📖 Documentation

Comprehensive guides covering all aspects of `contenteditable`:

- **What is contenteditable?** — Fundamentals, use cases, and when to use (or avoid) it
- **Events** — Deep dive into the event lifecycle (`beforeinput`, `input`, `compositionstart/update/end`, `selectionchange`) and how they differ across browsers
- **IME & Composition** — How input methods (Korean, Japanese, Chinese, etc.) interact with contenteditable, common issues, and solutions
- **Selection API** — Working with `Selection` and `Range` objects, common pitfalls, and reliable patterns
- **Range API** — Advanced range manipulation, boundary detection, and cross-browser compatibility
- **Clipboard API** — Copy, paste, and clipboard event handling
- **execCommand alternatives** — Why `execCommand` is deprecated and modern approaches (Input Events, Selection API, custom implementations)
- **Practical Patterns** — Real-world patterns for building editors, with code examples
- **Common Pitfalls & Debugging** — Frequent mistakes and how to debug contenteditable issues
- **Performance** — Optimizing contenteditable performance for large documents
- **Accessibility** — Making contenteditable accessible to screen readers and keyboard navigation
- **Browser compatibility** — Detailed support matrix and known issues per browser

---

## The Problem We're Solving

Building a rich text editor? You'll encounter questions like:

- *"Why does Enter behave differently in Safari?"* — Safari inserts `<div>` while Chrome inserts `<br>`, breaking your formatting logic
- *"Why does my Korean IME lose characters on certain key combos?"* — Composition events fire in different orders, causing character loss
- *"Why does paste formatting vary between browsers?"* — Chrome preserves HTML structure, Firefox strips it, Safari does something else entirely
- *"Why does undo/redo break after programmatic DOM changes?"* — The undo stack is cleared or doesn't include your changes, making undo/redo unreliable
- *"Why does my selection disappear after I wrap text in a `<strong>` tag?"* — Selection restoration is inconsistent across browsers
- *"Why does typing in a table cell break the table structure?"* — Table editing behavior varies dramatically between browsers
- *"Why does my code block lose indentation when users type?"* — Whitespace preservation in `<pre><code>` is unreliable

These aren't theoretical—they're real issues developers face daily. Each one can take hours or days to debug, often requiring:

1. **Reproducing the issue** in multiple browsers and OS combinations
2. **Understanding the event sequence** by adding extensive logging
3. **Finding workarounds** through trial and error or reading obscure forum posts
4. **Testing edge cases** to ensure the workaround doesn't break other features

**contenteditable.lab** collects these "incidents" with:
- **Exact reproduction steps** so you can verify the issue immediately
- **Environment details** so you know if it affects your users
- **Event logs** showing the exact sequence of events
- **Proven workarounds** that have been tested across environments
- **Related cases** so you can see if similar issues exist in other environments

You don't have to rediscover these problems the hard way.

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
2. Select an appropriate sample HTML preset or use your own content
3. Reproduce the issue and observe the event log, range visualizations, and DOM changes
4. If an anomaly is detected, a snapshot will be automatically saved
5. Click "📋 Copy report" to get a comprehensive event analysis
6. [Open an issue](https://github.com/easylogic/contenteditable/issues/new) with your findings

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

## Features

### Playground Capabilities

- **Real-time event monitoring** — Track `selectionchange`, `compositionstart/update/end`, `beforeinput`, and `input` events
- **Visual range indicators** — Color-coded overlays for selection (blue), composition (purple), beforeinput (orange), deleted areas (yellow), and added areas (green)
- **DOM change tracking** — Compare text node states before and after input events
- **Invisible character detection** — Visual markers for ZWNBSP, NBSP, line breaks, tabs, and other non-visible characters
- **Automatic snapshot capture** — Snapshots are saved when anomalies are detected, preserving full event context
- **Comprehensive event logs** — Detailed information including:
  - Event timing and sequence
  - DOM node structure and hierarchy
  - Selection ranges and offsets
  - `getTargetRanges()` data from `beforeinput` events
  - Boundary detection (inline element boundaries)
  - Sibling node information
- **Sample HTML presets** — 23+ presets covering:
  - Language-specific IME testing (Korean, Japanese, Chinese, Thai, Vietnamese, Arabic, Hindi)
  - Complex structures (nested inline, tables, code blocks)
  - Edge cases (HTML entities, RTL/LTR mixed, emoji, empty elements, long text wrapping)
  - Special characters and invisible characters

---

## Tech Stack

This project is built with modern web technologies chosen for performance, developer experience, and maintainability:

- **[Astro](https://astro.build/)** — Static site generator that generates fast, SEO-friendly pages. Perfect for documentation sites with minimal JavaScript by default, while allowing React components where needed (like the Playground).

- **[React](https://react.dev/)** — Used for interactive components, specifically the Playground where real-time event monitoring and visualization require dynamic updates. React's component model makes it easy to manage complex state (event logs, snapshots, visualizations).

- **[Tailwind CSS](https://tailwindcss.com/)** — Utility-first CSS framework for rapid UI development. Enables consistent styling across the site and makes dark mode theming straightforward with CSS variables.

- **[React Flow](https://reactflow.dev/)** + **[Dagre](https://github.com/dagrejs/dagre)** — Graph visualization library for displaying relationships between cases, scenarios, tags, and environments. Dagre provides automatic layout algorithms so the graphs are readable without manual positioning.

- **TypeScript** — Type safety across the entire codebase. Critical for maintaining correctness in a project with complex data structures (event logs, DOM snapshots, case metadata).

- **IndexedDB** — Client-side database for storing Playground snapshots. Allows users to save and restore editor states with full event context, even after page reloads. Snapshots are stored locally and don't require server infrastructure.

## Quick Start

### Local Development

```bash
# Clone the repository
git clone https://github.com/easylogic/contenteditable.git
cd contenteditable

# Install dependencies
pnpm install

# Start development server
pnpm dev
```

The dev server runs at `http://localhost:4321` with hot module replacement enabled.

### Available Commands

- `pnpm dev` — Start development server at `http://localhost:4321`
- `pnpm build` — Build production site to `./dist/`
- `pnpm preview` — Preview the production build locally before deploying
- `pnpm astro ...` — Run Astro CLI commands directly

### Project Structure

```
src/
├── components/       # Astro & React components
│   ├── Playground.tsx    # Interactive testing playground
│   ├── ScenarioFlow.tsx  # Graph visualization
│   └── ...
├── content/         # Markdown content
│   ├── cases/       # Individual case files
│   └── scenarios/   # Scenario files
├── data/
│   └── presets/     # Sample HTML presets for Playground
├── i18n/
│   └── translations.ts  # UI translations for 7 languages
├── pages/           # Route pages
│   ├── cases/       # Case detail pages
│   ├── scenarios/   # Scenario detail pages
│   ├── docs/        # Documentation pages
│   └── [locale]/    # Localized routes
└── styles/
    └── global.css   # Global styles with CSS variables
```

See [DEVELOPMENT.md](./DEVELOPMENT.md) for detailed development setup, content management, and deployment instructions.

## Internationalization

The site is fully internationalized to serve a global audience of developers working with `contenteditable` across different languages and input methods.

### Supported Languages

- 🇺🇸 **English** (default) — Primary language, all content available
- 🇰🇷 **Korean** — Full UI translation, important for Korean IME testing
- 🇯🇵 **Japanese** — Full UI translation, important for Japanese IME testing
- 🇨🇳 **Chinese** — Full UI translation, important for Chinese IME testing
- 🇪🇸 **Spanish** — Full UI translation
- 🇩🇪 **German** — Full UI translation
- 🇫🇷 **French** — Full UI translation

### What's Translated

- **UI elements** — Navigation, buttons, labels, tooltips
- **Navigation** — Menu items, breadcrumbs, page titles
- **Documentation** — All documentation pages are available in all languages
- **Case and scenario content** — Cases and scenarios can be written in any supported language

### Language Detection

The site automatically detects the user's browser language and serves content in the appropriate locale. Users can also manually switch languages using the language selector in the navigation.

### Contributing Translations

See [TRANSLATION.md](./TRANSLATION.md) for detailed guidelines on:
- Adding new languages
- Translating UI strings
- Translating content (cases, scenarios, documentation)
- Maintaining translation quality

## Links

- 🌐 [Live Site](https://contenteditable.realerror.com)
- 🤖 [AGENTS.md](./AGENTS.md) — conventions for AI agents (knowledge base layout, cross-refs)
- 📖 [Translation Guide](./TRANSLATION.md)
- 🤝 [Contributing Guide](./CONTRIBUTING.md)
- 🛠️ [Development Guide](./DEVELOPMENT.md)
- 🐛 [Report an Issue](https://github.com/easylogic/contenteditable/issues)
- 💬 [GitHub Discussions](https://github.com/easylogic/contenteditable/discussions)
