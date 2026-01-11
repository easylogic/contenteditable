---
id: ce-0221
scenarioId: scenario-edge-clipboard-linux
locale: en
os: Linux
osVersion: "22.04+"
device: Desktop
deviceVersion: Any
browser: Edge
browserVersion: "115.0+"
keyboard: US QWERTY
caseTitle: Edge on Linux strips all formatting on paste operations
description: "On Linux with Edge browser, paste operations into contenteditable elements strip all HTML formatting, including bold, italic, links, and images. This happens even when the clipboard contains valid HTML. The browser treats all pastes as plain text, ignoring clipboard format preferences."
tags:
  - linux
  - edge
  - clipboard
  - paste
  - formatting-loss
  - html-stripping
  - contenteditable
status: draft
domSteps:
  - label: "Clipboard content"
    html: '<p>This is <strong>bold</strong> text with a <a href="https://example.com">link</a> and an <em>italic</em> word.</p>'
    description: "Rich text copied to clipboard"
  - label: "Before paste"
    html: '<div contenteditable="true"><p>Paste here:</p></div>'
    description: "Target contenteditable element"
  - label: "After paste"
    html: '<div contenteditable="true"><p>Paste here: This is bold text with a link and an italic word.</p></div>'
    description: "All formatting stripped, only plain text remains"
---

## Phenomenon

On Linux with Edge browser, paste operations into contenteditable elements consistently strip all HTML formatting. Rich text from other sources (web pages, documents, emails) loses all styling, links, and structure, resulting in only plain text being inserted. This behavior occurs regardless of the source content's format.

## Reproduction example

1. Open Edge browser on Linux (Ubuntu 22.04+ or similar).
2. Copy rich text content from any source (web page, document, etc.).
3. Create a `contenteditable` element and focus it.
4. Paste using Ctrl+V or context menu.
5. Observe that all formatting is stripped, leaving only plain text.
6. Try with different types of content:
   - Bold/italic text
   - Links with href attributes
   - Images
   - Lists and tables
   - Text with custom styling

## Observed behavior

### Complete formatting stripping:

1. **Text styling**: Bold, italic, underline, colors all removed
2. **Links**: URLs stripped, only link text remains
3. **Images**: Completely removed, no image content inserted
4. **Lists**: Converted to plain text without list markers
5. **Tables**: Structure lost, only cell text content remains
6. **Custom HTML**: All tags stripped except basic text
7. **Line breaks**: May be converted to single spaces or basic breaks

### Clipboard format handling:

**Edge on Linux behavior:**
- Ignores `text/html` clipboard format
- Only processes `text/plain` format
- Discards rich content metadata
- No user choice in paste behavior

**Expected behavior:**
- Should check `text/html` format first
- Should preserve HTML structure
- Should offer paste options (plain text vs rich text)
- Should handle mixed clipboard content

### Event sequence analysis:

```javascript
// Edge Linux paste events
document.addEventListener('paste', (e) => {
  console.log('Clipboard data types:', e.clipboardData.types);
  // Output: ['text/plain'] - only plain text available
  
  console.log('HTML data:', e.clipboardData.getData('text/html'));
  // Output: '' - empty string
  
  console.log('Plain text:', e.clipboardData.getData('text/plain'));
  // Output: 'This is bold text with a link...' - plain text only
});
```

## Expected behavior

- Should preserve HTML formatting when available
- Should provide paste options (rich text vs plain text)
- Should handle images and media content
- Should maintain link structure and functionality
- Should respect list and table formatting
- Should offer user control over paste behavior

## Impact

- **User frustration**: Users lose formatting unexpectedly
- **Content quality**: Pasted content looks unprofessional
- **Workflow disruption**: Users must reformat content manually
- **Data loss**: Important structural information is lost
- **Accessibility**: Semantic structure (lists, headings) is lost
- **Cross-platform inconsistency**: Different behavior from other platforms

## Browser Comparison

- **Edge Linux**: Strips all formatting (most restrictive)
- **Chrome Linux**: Preserves most formatting correctly
- **Firefox Linux**: Preserves formatting with user confirmation
- **Edge Windows/Mac**: Preserves formatting correctly
- **Safari Mac**: Preserves formatting with rich paste options
- **Chrome Windows/Mac**: Preserves formatting correctly

## Workarounds

### 1. Custom paste handler with clipboard API

```javascript
class LinuxPasteHandler {
  constructor(editorElement) {
    this.editor = editorElement;
    this.isLinux = /Linux/.test(navigator.platform);
    this.isEdge = /Edg\//.test(navigator.userAgent);
    
    if (this.isLinux && this.isEdge) {
      this.setupCustomPasteHandling();
    }
  }
  
  setupCustomPasteHandling() {
    this.editor.addEventListener('paste', this.handlePaste.bind(this), true);
    this.editor.addEventListener('beforepaste', this.handleBeforePaste.bind(this), true);
  }
  
  async handlePaste(e) {
    e.preventDefault();
    e.stopPropagation();
    
    try {
      // Try to read clipboard with extended permissions
      const clipboardItems = await navigator.clipboard.read();
      
      for (const item of clipboardItems) {
        for (const type of item.types) {
          if (type === 'text/html') {
            const htmlBlob = await item.getType(type);
            const html = await htmlBlob.text();
            this.insertHTML(html);
            return;
          } else if (type === 'image/png' || type === 'image/jpeg') {
            const imageBlob = await item.getType(type);
            this.insertImage(imageBlob);
            return;
          }
        }
      }
      
      // Fallback to plain text
      const plainText = await this.getPlainClipboardText();
      this.insertText(plainText);
      
    } catch (error) {
      console.warn('Enhanced clipboard access failed:', error);
      this.handleFallbackPaste(e);
    }
  }
  
  async handleBeforePaste(e) {
    // Pre-paste handling to capture clipboard before browser processes it
    if (e.clipboardData && e.clipboardData.types.includes('text/html')) {
      e.preventDefault();
      const html = e.clipboardData.getData('text/html');
      this.insertHTML(html);
    }
  }
  
  async getPlainClipboardText() {
    try {
      return await navigator.clipboard.readText();
    } catch (error) {
      return '';
    }
  }
  
  insertHTML(html) {
    // Sanitize and insert HTML
    const sanitizedHTML = this.sanitizeHTML(html);
    
    const selection = window.getSelection();
    if (selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      range.deleteContents();
      
      const fragment = this.createFragmentFromHTML(sanitizedHTML);
      range.insertNode(fragment);
    }
  }
  
  insertImage(blob) {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = document.createElement('img');
      img.src = e.target.result;
      img.alt = 'Pasted image';
      
      this.insertAtCursor(img);
    };
    reader.readAsDataURL(blob);
  }
  
  insertText(text) {
    this.insertAtCursor(document.createTextNode(text));
  }
  
  insertAtCursor(node) {
    const selection = window.getSelection();
    if (selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      range.deleteContents();
      range.insertNode(node);
      range.collapse(false);
    }
  }
  
  sanitizeHTML(html) {
    // Basic HTML sanitization
    const temp = document.createElement('div');
    temp.innerHTML = html;
    
    // Remove script tags and dangerous attributes
    const scripts = temp.querySelectorAll('script');
    scripts.forEach(script => script.remove());
    
    const elements = temp.querySelectorAll('*');
    elements.forEach(el => {
      // Remove event handlers
      const attributes = el.attributes;
      for (let i = attributes.length - 1; i >= 0; i--) {
        const attr = attributes[i];
        if (attr.name.startsWith('on')) {
          el.removeAttribute(attr.name);
        }
      }
    });
    
    return temp.innerHTML;
  }
  
  createFragmentFromHTML(html) {
    const template = document.createElement('template');
    template.innerHTML = html.trim();
    return template.content.cloneNode(true);
  }
  
  handleFallbackPaste(e) {
    // Fallback to basic clipboardData
    if (e.clipboardData) {
      const items = e.clipboardData.items;
      
      for (let i = 0; i < items.length; i++) {
        const item = items[i];
        
        if (item.type === 'text/html') {
          const html = e.clipboardData.getData('text/html');
          if (html && html.trim()) {
            this.insertHTML(html);
            return;
          }
        }
        
        if (item.type.startsWith('image/')) {
          const blob = item.getAsFile();
          if (blob) {
            this.insertImage(blob);
            return;
          }
        }
      }
      
      // Final fallback to plain text
      const text = e.clipboardData.getData('text/plain');
      this.insertText(text);
    }
  }
}
```

### 2. User permission request for clipboard access

```javascript
async function requestClipboardPermission() {
  try {
    const permission = await navigator.permissions.query({ 
      name: 'clipboard-read' 
    });
    
    if (permission.state === 'granted') {
      return true;
    } else if (permission.state === 'prompt') {
      const granted = await requestUserPermission(
        'This site needs clipboard access to preserve formatting when pasting content in Edge on Linux. Allow clipboard access?'
      );
      return granted;
    }
    
    return false;
  } catch (error) {
    console.warn('Clipboard permission API not available');
    return false;
  }
}

function requestUserPermission(message) {
  return new Promise((resolve) => {
    const modal = document.createElement('div');
    modal.className = 'clipboard-permission-modal';
    modal.innerHTML = `
      <div class="modal-content">
        <h3>Clipboard Access Required</h3>
        <p>${message}</p>
        <div class="modal-buttons">
          <button id="allow-clipboard">Allow</button>
          <button id="deny-clipboard">Deny</button>
        </div>
      </div>
    `;
    
    document.body.appendChild(modal);
    
    modal.querySelector('#allow-clipboard').addEventListener('click', () => {
      document.body.removeChild(modal);
      resolve(true);
    });
    
    modal.querySelector('#deny-clipboard').addEventListener('click', () => {
      document.body.removeChild(modal);
      resolve(false);
    });
  });
}
```

### 3. Alternative paste methods

```javascript
function showPasteOptions() {
  const menu = document.createElement('div');
  menu.className = 'paste-options-menu';
  menu.innerHTML = `
    <div class="paste-option" data-type="rich">Paste with Formatting</div>
    <div class="paste-option" data-type="plain">Paste as Plain Text</div>
    <div class="paste-option" data-type="markdown">Paste as Markdown</div>
  `;
  
  // Position menu and handle selection
  document.body.appendChild(menu);
  
  menu.addEventListener('click', (e) => {
    const type = e.target.dataset.type;
    handlePasteChoice(type);
    document.body.removeChild(menu);
  });
}

async function handlePasteChoice(type) {
  try {
    const clipboardItems = await navigator.clipboard.read();
    
    for (const item of clipboardItems) {
      switch (type) {
        case 'rich':
          if (item.types.includes('text/html')) {
            const html = await item.getType('text/html');
            insertHTML(await html.text());
            return;
          }
          break;
          
        case 'plain':
          const text = await navigator.clipboard.readText();
          insertText(text);
          return;
          
        case 'markdown':
          // Convert HTML to Markdown
          if (item.types.includes('text/html')) {
            const html = await item.getType('text/html');
            const markdown = htmlToMarkdown(await html.text());
            insertText(markdown);
            return;
          }
          break;
      }
    }
    
    // Fallback
    insertText(await navigator.clipboard.readText());
    
  } catch (error) {
    console.error('Enhanced paste failed:', error);
  }
}
```

## Testing recommendations

1. **Different content types**: Text, images, tables, lists, links
2. **Various sources**: Web pages, documents, emails, other apps
3. **Different Linux distributions**: Ubuntu, Fedora, Arch, openSUSE
4. **Edge versions**: 115, 116, 117, latest
5. **Clipboard managers**: Test with and without system clipboard managers
6. **Security contexts**: HTTP vs HTTPS, different permission levels

## Notes

- This appears to be a security/compatibility decision by Edge on Linux
- May be related to Linux clipboard system differences
- Issue persists across different desktop environments
- Not related to Edge's content security policy - specific to Linux platform
- Workarounds require user permission for enhanced clipboard access