---
id: scenario-content-normalization
title: "Content Normalization: Paste, Whitespace, and DOM Hygiene"
description: "Architecting a consistent document state by neutralizing browser inconsistencies in HTML insertion and character encoding."
category: "architecture"
tags: ["paste", "normalization", "whitespace", "html-hygiene", "plaintext-only"]
status: "confirmed"
locale: "en"
---

## Overview
Every browser inserts different HTML when a user pastes or hits "Enter." A robust editor must normalize this "Browser Soup" into a predictable internal schema to prevent data corruption and layout breakage.

## Critical Normalization Zones

### 1. Paste Filter & Cleansing
When pasting from external sources (Word, Excel, Web), browsers inject massive amounts of hidden meta-data and proprietary CSS inside `<style>` blocks. Strict sanitization is required to strip non-standard attributes.

### 2. Whitespace & &nbsp; Management
Browsers follow HTML rules, which collapse consecutive spaces into one. To maintain visual fidelity, editors often use Non-breaking spaces (`&nbsp;`).
- **Contamination**: `&nbsp;` blocks CSS line-wrapping, causing layout overflows. This is severe in `plaintext-only` mode.
- **Conversion**: Chrome/Edge frequently convert non-breaking spaces back to regular spaces during editing, causing intended alignment to collapse.

### 3. Empty Node Pruning
Rapid editing often leaves empty `<span>`, `<b>`, or `<div>` tags in the DOM. These "Ghost Tags" don't affect visuals but break selection logic and node-count based features.

## Normalization Strategy

### The Parser Pipeline
Interrupt the `paste` or `beforeinput` event and run the incoming HTML through a DOMParser. Apply a strict whitelist of tags and attributes before allowing the insertion.

### Whitespace Preservation (CSS over entities)
Prefer `white-space: pre-wrap` for preserving layouts rather than relying on `&nbsp;` chains. If manual intervention is required, use a `beforeinput` handler to insert `\u00A0` only when a trailing space is detected.

## Related Cases
- [ce-0572: plaintext-only nbsp bug](file:///Users/user/github/barocss/contenteditable/src/content/cases/ce-0572-plaintext-only-nbsp-layout-broken.md)
- [ce-0153: nbsp line break prevention](file:///Users/user/github/barocss/contenteditable/src/content/cases/ce-0153-nbsp-line-break-prevention.md)
- [ce-0102: consecutive spaces collapsed](file:///Users/user/github/barocss/contenteditable/src/content/cases/ce-0102-consecutive-spaces-collapsed.md)
- [ce-0111: empty elements accumulate](file:///Users/user/github/barocss/contenteditable/src/content/cases/ce-0111-empty-elements-accumulate.md)
