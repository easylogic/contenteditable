import type { NodeTypeDefinition } from './index';

export const fontFamily: NodeTypeDefinition = {
  name: 'Font Family',
  category: 'Formatting',
  schema: `{
  fontFamily: {
    attrs: {
      family: { default: 'Arial' }
    },
    parseDOM: [{
      tag: 'span[style*="font-family"]',
      getAttrs: (node) => ({
        family: extractFontFamily(node.style.fontFamily)
      })
    }],
    toDOM: (node) => ['span', { 
      style: 'font-family: ' + node.attrs.family 
    }, 0]
  }
}`,
  modelExample: `{
  type: 'text',
  text: 'Monospace text',
  marks: [{
    type: 'fontFamily',
    attrs: { family: 'monospace' }
  }]
}`,
  htmlSerialization: `function serializeFontFamilyMark(text, mark) {
  const family = mark.attrs?.family || 'Arial';
  return '<span style="font-family: ' + escapeHtml(family) + '">' + 
         text + '</span>';
}`,
  htmlDeserialization: `function extractFontFamilyMark(element) {
  if (element.tagName === 'SPAN' && element.style.fontFamily) {
    const family = extractFontFamily(element.style.fontFamily);
    return {
      type: 'fontFamily',
      attrs: { family }
    };
  }
  return null;
}

function extractFontFamily(fontFamilyString) {
  // Extract first font from font-family string
  // e.g., "Arial, sans-serif" -> "Arial"
  return fontFamilyString.split(',')[0].trim().replace(/['"]/g, '');
}`,
  viewIntegration: `// Setting font family
function setFontFamily(family) {
  addMark({
    type: 'fontFamily',
    attrs: { family }
  });
}

// Font family selector
function showFontFamilyPicker() {
  const families = ['Arial', 'Times New Roman', 'Courier New', 'monospace'];
  // Show font selector
}`,
  commonIssues: `// Issue: Font family with quotes
// Solution: Handle quoted font names
function normalizeFontFamily(family) {
  return family.replace(/['"]/g, '');
}

// Issue: Font fallback chain
// Solution: Extract primary font from fallback chain
function extractPrimaryFont(fontFamily) {
  return fontFamily.split(',')[0].trim();
}

// Issue: Web-safe fonts
// Solution: Validate font availability
function validateFontFamily(family) {
  const webSafeFonts = [
    'Arial', 'Times New Roman', 'Courier New', 
    'Verdana', 'Georgia', 'Palatino'
  ];
  return webSafeFonts.includes(family) || family === 'monospace';
}`,
  implementation: `class FontFamilyMark {
  constructor(attrs) {
    this.type = 'fontFamily';
    this.attrs = { family: attrs?.family || 'Arial' };
  }
  
  toDOM() {
    return ['span', { 
      style: 'font-family: ' + this.attrs.family 
    }, 0];
  }
  
  static fromDOM(element) {
    if (element.tagName === 'SPAN' && element.style.fontFamily) {
      return new FontFamilyMark({ 
        family: extractFontFamily(element.style.fontFamily) 
      });
    }
    return null;
  }
}`
};
