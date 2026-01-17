---
id: scenario-autocomplete-behavior
title: Autocomplete suggestions do not appear for contenteditable
description: "Browser autocomplete suggestions (for forms, addresses, etc.) do not appear when typing in contenteditable regions, even when appropriate autocomplete attributes are set. This limits the usefulness of contenteditable for form-like inputs."
category: other
tags:
  - autocomplete
  - suggestions
  - chrome
status: draft
locale: en
---

Browser autocomplete suggestions (for forms, addresses, etc.) do not appear when typing in contenteditable regions, even when appropriate `autocomplete` attributes are set. This limits the usefulness of contenteditable for form-like inputs.

## References

- [MDN: HTMLTextAreaElement.autocomplete](https://developer.mozilla.org/en-US/docs/Web/API/HTMLTextAreaElement/autocomplete) - autocomplete attribute documentation
- [MDN: autocorrect global attribute](https://developer.mozilla.org/docs/Web/HTML/Reference/Global_attributes/autocorrect) - autocorrect for contenteditable
- [jQuery UI Bug #14917: Autocomplete does not recognize contenteditable](https://bugs.jqueryui.com/ticket/14917/) - Library compatibility issues
- [GitHub: contenteditable-autocomplete](https://github.com/gr2m/contenteditable-autocomplete) - Custom autocomplete library
- [Contenteditable Autocomplete Demo](https://gr2m.github.io/contenteditable-autocomplete/) - Library example
