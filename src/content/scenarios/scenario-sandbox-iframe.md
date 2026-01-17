---
id: scenario-sandbox-iframe
title: contenteditable behavior is restricted inside sandboxed iframes
description: "When contenteditable elements are inside an iframe with the sandbox attribute, their behavior may be restricted or broken depending on which sandbox tokens are enabled. Without allow-scripts or allow-same-origin, many contenteditable features (like rich text editing, clipboard access, or event handling) may not work properly."
category: other
tags:
  - sandbox
  - iframe
  - security
  - restrictions
  - scripting
status: draft
locale: en
---

When `contenteditable` elements are inside an iframe with the `sandbox` attribute, their behavior may be restricted or broken depending on which sandbox tokens are enabled. Without `allow-scripts` or `allow-same-origin`, many contenteditable features may not work properly.

## Observed Behavior

- **Basic editing works**: Simple typing and deleting may work without scripts
- **Script-based features fail**: Rich text editors, formatting toolbars, paste handlers don't work without `allow-scripts`
- **Origin isolation**: Without `allow-same-origin`, scripts cannot access storage or communicate with parent
- **Event handling limited**: Advanced event handling may be restricted
- **Clipboard access blocked**: Clipboard API may not work without proper permissions

## Sandbox Token Effects

| Sandbox Setup | contenteditable Behavior |
|---------------|-------------------------|
| `sandbox` (no tokens) | Basic editing works, but no scripts or origin access |
| `sandbox="allow-scripts"` | Editing works, but origin isolation limits features |
| `sandbox="allow-same-origin"` | Origin access, but scripts disabled |
| `sandbox="allow-scripts allow-same-origin"` | Full functionality, but security risks |

## Impact

- **Limited functionality**: Rich text editing features don't work
- **Security vs functionality trade-off**: More security means less functionality
- **Development complexity**: Must design around sandbox restrictions
- **User experience**: Users may experience broken or limited editing

## Workarounds

### 1. Enable Required Sandbox Tokens

Grant minimum necessary permissions:

```html
<iframe 
  sandbox="allow-scripts allow-same-origin allow-forms"
  src="editor.html"
></iframe>
```

### 2. Use postMessage for Communication

When same-origin is blocked:

```javascript
// Parent window
iframe.contentWindow.postMessage({
  type: 'updateContent',
  content: '...'
}, '*');

// Iframe
window.addEventListener('message', (e) => {
  if (e.data.type === 'updateContent') {
    editableElement.textContent = e.data.content;
  }
});
```

### 3. Serve Iframe from Separate Domain

For better security with same-origin:

```html
<iframe 
  sandbox="allow-scripts allow-same-origin"
  src="https://editor.example.com"
></iframe>
```

### 4. Sanitize Content

Always sanitize content inside sandboxed iframe:

```javascript
function sanitizeContent(html) {
  const div = document.createElement('div');
  div.innerHTML = html;
  
  // Remove script tags
  div.querySelectorAll('script').forEach(s => s.remove());
  
  // Remove event handlers
  div.querySelectorAll('*').forEach(el => {
    Array.from(el.attributes).forEach(attr => {
      if (attr.name.startsWith('on')) {
        el.removeAttribute(attr.name);
      }
    });
  });
  
  return div.innerHTML;
}
```

### 5. Avoid Sandbox Breakout

Never allow iframe to modify sandbox attribute:

```javascript
// DON'T DO THIS
iframe.contentWindow.document.querySelector('iframe').removeAttribute('sandbox');
```

## Security Considerations

- **Sandbox breakout risk**: When both `allow-same-origin` and `allow-scripts` are set, iframe can potentially escape sandbox
- **XSS risks**: Untrusted content with scripts enabled can run malicious code
- **Content injection**: Proper sanitization is critical
- **CSP integration**: Use Content Security Policy alongside sandbox

## References

- [MDN: iframe sandbox attribute](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Attributes/sandbox) - Sandbox documentation
- [GeeksforGeeks: HTML iframe sandbox attribute](https://www.geeksforgeeks.org/html/html-iframe-sandbox-attribute/) - Sandbox tokens explained
- [W3C: iframe sandbox security](https://www.w3.org/TR/2013/CR-html5-20130806/embedded-content-0.html) - Sandbox breakout warnings
- [PHP.cn: iframe sandbox contenteditable](https://m.php.cn/en/faq/1796887913.html) - Sandbox restrictions
