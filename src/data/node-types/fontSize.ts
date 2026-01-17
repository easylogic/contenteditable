import type { NodeTypeDefinition } from './index';

export const fontSize: NodeTypeDefinition = {
  name: 'Font Size',
  category: 'Formatting',
  schema: `{
  fontSize: {
    attrs: {
      size: { default: 16 }
    },
    parseDOM: [{
      tag: 'span[style*="font-size"]',
      getAttrs: (node) => ({
        size: parseInt(node.style.fontSize) || 16
      })
    }],
    toDOM: (node) => ['span', { 
      style: 'font-size: ' + node.attrs.size + 'px' 
    }, 0]
  }
}`,
  modelExample: `{
  type: 'text',
  text: 'Large text',
  marks: [{
    type: 'fontSize',
    attrs: { size: 24 }
  }]
}`,
  htmlSerialization: `function serializeFontSizeMark(text, mark) {
  const size = mark.attrs?.size || 16;
  return '<span style="font-size: ' + size + 'px">' + text + '</span>';
}`,
  htmlDeserialization: `function extractFontSizeMark(element) {
  if (element.tagName === 'SPAN' && element.style.fontSize) {
    const size = parseInt(element.style.fontSize) || 16;
    return {
      type: 'fontSize',
      attrs: { size }
    };
  }
  return null;
}`,
  viewIntegration: `// Setting font size
function setFontSize(size) {
  addMark({
    type: 'fontSize',
    attrs: { size }
  });
}

// Font size picker
function showFontSizePicker() {
  const sizes = [12, 14, 16, 18, 20, 24, 28, 32];
  // Show size selector
}`,
  commonIssues: `// Issue: Font size units (px, em, rem)
// Solution: Normalize to px
function normalizeFontSize(size) {
  if (typeof size === 'string') {
    if (size.endsWith('px')) {
      return parseInt(size);
    }
    if (size.endsWith('em')) {
      return parseFloat(size) * 16; // Assume 16px base
    }
  }
  return size;
}

// Issue: Font size validation
// Solution: Clamp to valid range
function validateFontSize(size) {
  return Math.max(8, Math.min(72, size));
}`,
  implementation: `class FontSizeMark {
  constructor(attrs) {
    this.type = 'fontSize';
    this.attrs = { size: attrs?.size || 16 };
  }
  
  toDOM() {
    return ['span', { 
      style: 'font-size: ' + this.attrs.size + 'px' 
    }, 0];
  }
  
  static fromDOM(element) {
    if (element.tagName === 'SPAN' && element.style.fontSize) {
      return new FontSizeMark({ 
        size: parseInt(element.style.fontSize) || 16 
      });
    }
    return null;
  }
}`
};
