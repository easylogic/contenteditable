---
id: scenario-browser-autofill
title: Browser autofill and autocomplete do not work with contenteditable
description: "Browser autofill and autocomplete features are designed to work with form-associated elements like input and textarea, not with generic contenteditable elements. The autocomplete attribute is ignored on contenteditable elements, and browsers do not provide autofill suggestions when typing in contenteditable regions."
category: other
tags:
  - autofill
  - autocomplete
  - form
  - browser-feature
status: draft
locale: en
---

Browser autofill and autocomplete features are designed to work with form-associated elements like `<input>` and `<textarea>`, not with generic `contenteditable` elements. The `autocomplete` attribute is ignored on contenteditable elements, and browsers do not provide autofill suggestions when typing in contenteditable regions.

## Observed Behavior

- **Autocomplete ignored**: `autocomplete` attribute has no effect on contenteditable elements
- **No autofill suggestions**: Browsers don't show autofill dropdowns for contenteditable
- **Form integration missing**: contenteditable doesn't participate in form autofill heuristics
- **Limited functionality**: Cannot use browser's built-in password managers or address autofill

## Browser Comparison

- **Chrome**: Autocomplete attribute ignored, no autofill support
- **Firefox**: Similar behavior, no autofill support
- **Safari**: No autofill support for contenteditable
- **Edge**: Similar to Chrome
- **All browsers**: Autocomplete only works with input, textarea, select

## Impact

- **Poor user experience**: Users cannot use browser autofill features
- **Form-like limitations**: Cannot use contenteditable as form input replacement
- **Accessibility issues**: Users who rely on autofill are disadvantaged
- **Development overhead**: Must implement custom autocomplete solutions

## Workarounds

### 1. Use Hidden Input Element

Sync with hidden input for autofill:

```html
<form>
  <input 
    type="text" 
    autocomplete="email" 
    name="email"
    style="position: absolute; opacity: 0; pointer-events: none;"
    id="hidden-email"
  >
  <div 
    contenteditable="true" 
    id="email-editor"
    aria-label="Email"
  ></div>
</form>

<script>
const hiddenInput = document.getElementById('hidden-email');
const editor = document.getElementById('email-editor');

// Sync editor to hidden input
editor.addEventListener('input', () => {
  hiddenInput.value = editor.textContent;
});

// Sync hidden input to editor (for autofill)
hiddenInput.addEventListener('input', () => {
  if (hiddenInput.value !== editor.textContent) {
    editor.textContent = hiddenInput.value;
  }
});
</script>
```

### 2. Use textarea When Possible

For simple text editing:

```html
<textarea 
  autocomplete="email"
  name="email"
  style="resize: none; overflow: hidden;"
></textarea>
```

### 3. Implement Custom Autocomplete

Build JavaScript-based autocomplete:

```javascript
class ContentEditableAutocomplete {
  constructor(element, options) {
    this.element = element;
    this.options = options;
    this.setupAutocomplete();
  }
  
  setupAutocomplete() {
    this.element.addEventListener('input', (e) => {
      const text = e.currentTarget.textContent;
      const suggestions = this.getSuggestions(text);
      this.showSuggestions(suggestions);
    });
  }
  
  getSuggestions(text) {
    // Custom autocomplete logic
    return this.options.suggestions.filter(s => 
      s.toLowerCase().startsWith(text.toLowerCase())
    );
  }
  
  showSuggestions(suggestions) {
    // Display dropdown with suggestions
  }
}
```

### 4. Use Semantic autocomplete Tokens

When using input elements:

```html
<input 
  type="email" 
  autocomplete="email"
  name="email"
>

<input 
  type="text" 
  autocomplete="given-name"
  name="firstName"
>

<input 
  type="tel" 
  autocomplete="tel"
  name="phone"
>
```

## References

- [MDN: autocomplete attribute](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Attributes/autocomplete) - autocomplete documentation
- [Medium: Why browser autofill doesn't work as expected](https://diko-dev99.medium.com/why-browser-autofill-doesnt-work-the-way-you-expect-and-how-to-test-it-properly-0b5d86fcde0d) - Autofill heuristics
- [jQuery UI Bug #14917: Autocomplete doesn't recognize contenteditable](https://bugs.jqueryui.com/ticket/14917) - Library compatibility issues
- [GitHub: contenteditable-autocomplete](https://github.com/gr2m/contenteditable-autocomplete) - Custom autocomplete library
- [Contenteditable Autocomplete Demo](https://gr2m.github.io/contenteditable-autocomplete/) - Library example
