import React, { useEffect, useMemo, useRef, useState, useCallback } from 'react';
import { EDITOR_PRESETS, type EditorPreset } from '../data/presets';

// ============================================================
// Types
// ============================================================

type SiblingInfo = {
  nodeName: string;
  id?: string;
  className?: string;
  textPreview?: string;
};

type NodeInfo = { nodeName: string; id?: string; className?: string; textContent?: string };

type EventLog = {
  id: number;
  timestamp: number;
  type: 'selectionchange' | 'compositionstart' | 'compositionupdate' | 'compositionend' | 'beforeinput' | 'input';
  inputType?: string;
  data?: string | null;
  isComposing?: boolean;
  // Start container info
  parent: { nodeName: string; id?: string; className?: string } | null;
  node: NodeInfo | null;
  startOffset: number;
  startContainerText?: string;
  // End container info (for range selections)
  endParent?: { nodeName: string; id?: string; className?: string } | null;
  endNode?: NodeInfo | null;
  endOffset: number;
  endContainerText?: string;
  range?: Range | null;
  // Boundary info
  startBoundary?: { type: 'start' | 'end'; element: string } | null;
  endBoundary?: { type: 'start' | 'end'; element: string } | null;
  // Sibling info
  leftSibling?: SiblingInfo | null;
  rightSibling?: SiblingInfo | null;
  childIndex?: number;
  childCount?: number;
};

type PhaseBlock = {
  title: string;
  type: string;
  log: EventLog | null;
  delta: number;
  highlight?: 'error' | 'warning';
};

type Environment = {
  os: string;
  osVersion: string;
  browser: string;
  browserVersion: string;
  device: string;
  isMobile: boolean;
};

type Anomaly = {
  type: string;
  description: string;
  detail: string;
};

type RangeDrawInfo = {
  range: Range;
  fill: string;
  stroke: string;
  heightScale?: number;
};


// ============================================================
// RangeVisualizer Class (uses external overlay container)
// ============================================================

class RangeVisualizer {
  private editorEl: HTMLElement;
  private overlayEl: HTMLElement;

  constructor(editorEl: HTMLElement, overlayEl: HTMLElement) {
    this.editorEl = editorEl;
    this.overlayEl = overlayEl;
  }

  private ensureSvg(): SVGSVGElement {
    let svg = this.overlayEl.querySelector('.range-overlay') as SVGSVGElement;
    if (!svg) {
      svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      svg.classList.add('range-overlay');
      Object.assign(svg.style, {
        position: 'absolute',
        inset: '0',
        zIndex: '10',
        pointerEvents: 'none',
        userSelect: 'none',
        overflow: 'visible',
      });
      svg.setAttribute('width', '100%');
      svg.setAttribute('height', '100%');
      this.overlayEl.appendChild(svg);
    }
    return svg;
  }

  public drawRanges(ranges: RangeDrawInfo[]): void {
    if (!ranges || ranges.length === 0) {
      this.clear();
      return;
    }

    const svg = this.ensureSvg();
    svg.querySelector('g[data-layer="rects"]')?.remove();
    const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    g.dataset.layer = 'rects';
    svg.appendChild(g);

    const base = this.overlayEl.getBoundingClientRect();

    for (const item of ranges) {
      const { range, fill, stroke, heightScale = 1 } = item;
      let clientRects: DOMRectList | DOMRect[] = range.getClientRects();

      if (range.collapsed) {
        try {
          const container = range.startContainer;
          const offset = range.startOffset;
          if (container.nodeType === Node.TEXT_NODE) {
            const textNode = container as Text;
            const start = Math.max(0, Math.min(textNode.length, offset));
            const end = Math.min(textNode.length, start + 1);
            if (end > start) {
              const tempRange = document.createRange();
              tempRange.setStart(textNode, start);
              tempRange.setEnd(textNode, end);
              clientRects = tempRange.getClientRects();
            }
          }
        } catch { /* fallback */ }
      }

      for (const r of clientRects) {
        if (r.width === 0 && r.height === 0) continue;

        let x = r.left - base.left + this.editorEl.scrollLeft;
        let y = r.top - base.top + this.editorEl.scrollTop;
        let height = r.height;

        if (heightScale !== 1) {
          const newHeight = r.height * heightScale;
          y -= (newHeight - r.height) / 2;
          height = newHeight;
        }

        const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
        rect.setAttribute('x', x.toString());
        rect.setAttribute('y', y.toString());
        rect.setAttribute('width', Math.max(r.width, 2).toString());
        rect.setAttribute('height', height.toString());
        rect.setAttribute('rx', '2');
        rect.setAttribute('fill', fill);
        rect.setAttribute('stroke', stroke);
        rect.setAttribute('stroke-width', '1');
        g.appendChild(rect);
      }
    }
  }

  public drawBoundaryMarkers(markers: { x: number; y: number; height: number; type: 'start' | 'end'; color: string }[]): void {
    const svg = this.ensureSvg();
    svg.querySelector('g[data-layer="boundary"]')?.remove();
    if (markers.length === 0) return;

    const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    g.dataset.layer = 'boundary';
    svg.appendChild(g);

    for (const marker of markers) {
      const { x, y, height, type, color } = marker;
      const triangle = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      const size = 6;
      
      if (type === 'start') {
        triangle.setAttribute('d', `M${x - size},${y - size - 2} L${x + size},${y - size - 2} L${x},${y - 2} Z`);
      } else {
        triangle.setAttribute('d', `M${x - size},${y + height + size + 2} L${x + size},${y + height + size + 2} L${x},${y + height + 2} Z`);
      }
      
      triangle.setAttribute('fill', color);
      g.appendChild(triangle);
    }
  }

  public clear(): void {
    const svg = this.overlayEl.querySelector('.range-overlay');
    if (svg) {
      svg.querySelector('g[data-layer="rects"]')?.remove();
      svg.querySelector('g[data-layer="boundary"]')?.remove();
    }
  }

  public destroy(): void {
    this.overlayEl.querySelector('.range-overlay')?.remove();
  }
}

// ============================================================
// Utility Functions
// ============================================================

function detectEnvironment(): Environment {
  if (typeof navigator === 'undefined') {
    return { os: 'Unknown', osVersion: '', browser: 'Unknown', browserVersion: '', device: 'Unknown', isMobile: false };
  }
  const ua = navigator.userAgent;
  let os = 'Unknown', osVersion = '', browser = 'Unknown', browserVersion = '', device = 'Desktop';
  const isMobile = /Mobile|Android|iPhone|iPad/i.test(ua);

  if (/Windows NT 10/i.test(ua)) { os = 'Windows'; osVersion = '10/11'; }
  else if (/Windows/i.test(ua)) { os = 'Windows'; osVersion = ua.match(/Windows NT (\d+\.\d+)/)?.[1] || ''; }
  else if (/Mac OS X/i.test(ua)) { os = 'macOS'; osVersion = ua.match(/Mac OS X (\d+[._]\d+)/)?.[1]?.replace('_', '.') || ''; }
  else if (/Android/i.test(ua)) { os = 'Android'; osVersion = ua.match(/Android (\d+(\.\d+)?)/)?.[1] || ''; }
  else if (/iPhone|iPad/i.test(ua)) { os = 'iOS'; osVersion = ua.match(/OS (\d+[._]\d+)/)?.[1]?.replace('_', '.') || ''; }
  else if (/Linux/i.test(ua)) { os = 'Linux'; }

  if (/Edg\//i.test(ua)) { browser = 'Edge'; browserVersion = ua.match(/Edg\/(\d+(\.\d+)?)/)?.[1] || ''; }
  else if (/Chrome\//.test(ua) && !/Edg\//.test(ua)) { browser = 'Chrome'; browserVersion = ua.match(/Chrome\/(\d+(\.\d+)?)/)?.[1] || ''; }
  else if (/Safari\//.test(ua) && !/Chrome\//.test(ua)) { browser = 'Safari'; browserVersion = ua.match(/Version\/(\d+(\.\d+)?)/)?.[1] || ''; }
  else if (/Firefox\//.test(ua)) { browser = 'Firefox'; browserVersion = ua.match(/Firefox\/(\d+(\.\d+)?)/)?.[1] || ''; }

  if (/iPhone/i.test(ua)) device = 'iPhone';
  else if (/iPad/i.test(ua)) device = 'iPad';
  else if (isMobile) device = 'Mobile';

  return { os, osVersion, browser, browserVersion, device, isMobile };
}

function getNodeInfo(node: Node | null): EventLog['node'] {
  if (!node) return null;
  const el = node.nodeType === Node.ELEMENT_NODE ? (node as Element) : node.parentElement;
  return {
    nodeName: node.nodeName,
    id: el?.id || undefined,
    className: el?.className || undefined,
    textContent: node.textContent?.substring(0, 50) || undefined,
  };
}

function getParentInfo(node: Node | null): EventLog['parent'] {
  if (!node) return null;
  const parent = node.nodeType === Node.ELEMENT_NODE ? (node as Element) : node.parentElement;
  if (!parent) return null;
  return {
    nodeName: parent.nodeName,
    id: parent.id || undefined,
    className: parent.className || undefined,
  };
}

function getSiblingInfo(sibling: Node | null): SiblingInfo | null {
  if (!sibling) return null;
  const info: SiblingInfo = { nodeName: sibling.nodeName };
  if (sibling.nodeType === Node.ELEMENT_NODE) {
    const el = sibling as Element;
    if (el.id) info.id = el.id;
    if (el.className) info.className = el.className;
  } else if (sibling.nodeType === Node.TEXT_NODE) {
    const text = sibling.textContent || '';
    info.textPreview = text.length > 20 ? text.substring(0, 20) + '...' : text;
  }
  return info;
}

function getChildPosition(node: Node): { index: number; count: number } | null {
  const parent = node.parentNode;
  if (!parent) return null;
  const children = parent.childNodes;
  for (let i = 0; i < children.length; i++) {
    if (children[i] === node) {
      return { index: i, count: children.length };
    }
  }
  return null;
}

function checkBoundaryAtNode(node: Node, offset: number): { type: 'start' | 'end'; element: string } | null {
  const parent = node.parentElement;
  if (!parent) return null;
  const blockElements = ['P', 'DIV', 'SECTION', 'ARTICLE', 'MAIN', 'HEADER', 'FOOTER'];
  if (blockElements.includes(parent.nodeName)) return null;
  const textLength = node.textContent?.length || 0;
  if (offset === 0) return { type: 'start', element: parent.nodeName };
  if (offset === textLength && textLength > 0) return { type: 'end', element: parent.nodeName };
  return null;
}

// Format node as NODENAME#id.className (skip id/className for #text nodes)
function formatNodePath(nodeName: string, id?: string, className?: string): string {
  // #text nodes don't have id or className, just return the node name
  if (nodeName === '#text') return '#text';
  
  const idPart = id ? `#${id}` : '';
  const clsPart = className ? `.${className.split(' ')[0]}` : '';
  return `${nodeName}${idPart}${clsPart}`;
}

// Normalize special characters to visible tokens for debugging
function normalizeDebugText(value: string | null | undefined): string {
  if (!value) return '';
  return value
    .replace(/\uFEFF/g, '<zwnbsp>')    // Zero Width No-Break Space
    .replace(/\u00A0/g, '<nbsp>')      // Non-Breaking Space
    .replace(/\n/g, '<lf>')            // Line Feed
    .replace(/\r/g, '<cr>')            // Carriage Return
    .replace(/\t/g, '<tab>')           // Tab
    .replace(/ /g, '<space>');         // Regular Space (last to avoid double-replacement)
}

// Special character token class names
const specialCharClasses: Record<string, string> = {
  zwnbsp: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200 px-1 rounded text-[0.65rem]',
  nbsp: 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 px-1 rounded text-[0.65rem]',
  space: 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 px-1 rounded text-[0.65rem]',
  lf: 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 px-1 rounded text-[0.65rem]',
  cr: 'bg-pink-100 dark:bg-pink-900/30 text-pink-800 dark:text-pink-200 px-1 rounded text-[0.65rem]',
  tab: 'bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-200 px-1 rounded text-[0.65rem]',
};

// Render text with special character highlighting
function DebugText({ text }: { text: string | null | undefined }) {
  if (!text) return <span className="text-text-muted">-</span>;
  
  const normalized = normalizeDebugText(text);
  const parts: React.ReactNode[] = [];
  let key = 0;
  
  // Split by special character tokens
  const regex = /<(zwnbsp|nbsp|space|lf|cr|tab)>/g;
  let lastIndex = 0;
  let match;
  
  while ((match = regex.exec(normalized)) !== null) {
    // Add text before the token
    if (match.index > lastIndex) {
      parts.push(<span key={key++}>{normalized.slice(lastIndex, match.index)}</span>);
    }
    // Add the styled token
    const tokenType = match[1] as keyof typeof specialCharClasses;
    parts.push(
      <span key={key++} className={specialCharClasses[tokenType]}>
        {`<${tokenType}>`}
      </span>
    );
    lastIndex = regex.lastIndex;
  }
  
  // Add remaining text
  if (lastIndex < normalized.length) {
    parts.push(<span key={key++}>{normalized.slice(lastIndex)}</span>);
  }
  
  return <>{parts}</>;
}

// Render text with cursor/selection position visualization
function TextWithCursor({ 
  text, 
  startOffset, 
  endOffset 
}: { 
  text: string | null | undefined; 
  startOffset: number; 
  endOffset: number;
}) {
  if (!text) return <span className="text-text-muted">-</span>;
  
  const isCollapsed = startOffset === endOffset;
  const start = Math.min(startOffset, text.length);
  const end = Math.min(endOffset, text.length);
  
  const beforeText = text.slice(0, start);
  const selectedText = text.slice(start, end);
  const afterText = text.slice(end);
  
  return (
    <span className="font-mono text-sm leading-relaxed">
      "<DebugText text={beforeText} />
      {isCollapsed ? (
        <span className="text-red-500 font-bold text-base">|</span>
      ) : (
        <span className="bg-blue-200 dark:bg-blue-900/40 text-blue-800 dark:text-blue-200 rounded px-1 py-0.5 font-medium">[<DebugText text={selectedText} />]</span>
      )}
      <DebugText text={afterText} />"
    </span>
  );
}

// Simple diff algorithm - finds common prefix and suffix, marks the difference
function computeDiff(before: string, after: string): { commonPrefix: string; removed: string; added: string; commonSuffix: string } {
  let i = 0;
  while (i < before.length && i < after.length && before[i] === after[i]) {
    i++;
  }
  const commonPrefix = before.slice(0, i);
  
  let j = 0;
  const beforeRest = before.slice(i);
  const afterRest = after.slice(i);
  while (j < beforeRest.length && j < afterRest.length && 
         beforeRest[beforeRest.length - 1 - j] === afterRest[afterRest.length - 1 - j]) {
    j++;
  }
  
  const commonSuffix = j > 0 ? beforeRest.slice(-j) : '';
  const removed = j > 0 ? beforeRest.slice(0, -j) : beforeRest;
  const added = j > 0 ? afterRest.slice(0, -j) : afterRest;
  
  return { commonPrefix, removed, added, commonSuffix };
}

// HTML Syntax Highlighter
function highlightHtml(html: string): React.ReactNode {
  if (!html) return null;
  
  const parts: React.ReactNode[] = [];
  let key = 0;
  
  // Simple regex-based tokenizer
  const regex = /(<\/?)([\w-]+)([^>]*?)(\/?>)|([^<]+)/g;
  let match;
  
  while ((match = regex.exec(html)) !== null) {
    if (match[5]) {
      // Text content
      parts.push(<span key={key++} className="text-text-primary">{match[5]}</span>);
    } else {
      // Tag
      const [, open, tagName, attrs, close] = match;
      parts.push(
        <span key={key++}>
          <span className="text-gray-500">{open}</span>
          <span className="text-red-500">{tagName}</span>
          {attrs && <span className="text-blue-500">{attrs}</span>}
          <span className="text-gray-500">{close}</span>
        </span>
      );
    }
  }
  
  return parts;
}

// HTML Syntax Highlighter with diff marks
function highlightHtmlWithDiff(html: string, diffParts: string[], diffType: 'removed' | 'added'): React.ReactNode {
  if (!html) return null;
  
  const parts: React.ReactNode[] = [];
  let key = 0;
  
  const diffClass = diffType === 'removed' 
    ? 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200 line-through'
    : 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200';
  
  // Simple regex-based tokenizer
  const regex = /(<\/?)([\w-]+)([^>]*?)(\/?>)|([^<]+)/g;
  let match;
  let currentPos = 0;
  
  while ((match = regex.exec(html)) !== null) {
    const matchStart = match.index;
    const matchEnd = matchStart + match[0].length;
    
    // Check if this part contains diff
    const isDiffPart = diffParts.some(dp => {
      if (!dp) return false;
      const dpStart = html.indexOf(dp);
      return dpStart !== -1 && dpStart < matchEnd && dpStart + dp.length > matchStart;
    });
    
    if (match[5]) {
      // Text content
      const textContent = match[5];
      // Check if this text contains the diff
      let hasRenderedDiff = false;
      for (const dp of diffParts) {
        if (dp && textContent.includes(dp)) {
          const idx = textContent.indexOf(dp);
          parts.push(<span key={key++} className="text-text-primary">{textContent.slice(0, idx)}</span>);
          parts.push(<span key={key++} className={diffClass}>{dp}</span>);
          parts.push(<span key={key++} className="text-text-primary">{textContent.slice(idx + dp.length)}</span>);
          hasRenderedDiff = true;
          break;
        }
      }
      if (!hasRenderedDiff) {
        parts.push(<span key={key++} className="text-text-primary">{textContent}</span>);
      }
    } else {
      // Tag
      const [, open, tagName, attrs, close] = match;
      const tagIsDiff = isDiffPart;
      parts.push(
        <span key={key++} className={tagIsDiff ? diffClass : undefined}>
          <span className={tagIsDiff ? undefined : 'text-gray-500'}>{open}</span>
          <span className={tagIsDiff ? undefined : 'text-red-500'}>{tagName}</span>
          {attrs && <span className={tagIsDiff ? undefined : 'text-blue-500'}>{attrs}</span>}
          <span className={tagIsDiff ? undefined : 'text-gray-500'}>{close}</span>
        </span>
      );
    }
    currentPos = matchEnd;
  }
  
  return parts;
}

// Render HTML with diff highlighting
function DomDiffView({ before, after, type }: { before: string; after: string; type: 'before' | 'after' }) {
  const diff = useMemo(() => computeDiff(before || '', after || ''), [before, after]);
  const html = type === 'before' ? before : after;
  
  if (!html) {
    return <span className="text-text-muted">{type === 'before' ? '(입력 전 DOM)' : '(입력 후 DOM)'}</span>;
  }
  
  // If no difference or same
  if (!diff.removed && !diff.added) {
    return <>{highlightHtml(html)}</>;
  }
  
  const parts: React.ReactNode[] = [];
  let key = 0;
  
  // Common prefix (no highlighting)
  if (diff.commonPrefix) {
    parts.push(<span key={key++}>{highlightHtml(diff.commonPrefix)}</span>);
  }
  
  // Diff part - make it more visible
  if (type === 'before' && diff.removed) {
    parts.push(
      <span key={key++} className="bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200 line-through rounded px-1.5 py-0.5 font-semibold inline-block mx-0.5 border border-red-300 dark:border-red-700">
        {diff.removed}
      </span>
    );
  } else if (type === 'after' && diff.added) {
    parts.push(
      <span key={key++} className="bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 rounded px-1.5 py-0.5 font-semibold inline-block mx-0.5 border border-green-300 dark:border-green-700">
        {diff.added}
      </span>
    );
  }
  
  // Common suffix (no highlighting)
  if (diff.commonSuffix) {
    parts.push(<span key={key++}>{highlightHtml(diff.commonSuffix)}</span>);
  }
  
  return <>{parts}</>;
}

// ============================================================
// Main Component
// ============================================================

export function Playground() {
  const editorRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const visualizerRef = useRef<RangeVisualizer | null>(null);
  const logsRef = useRef<EventLog[]>([]);
  const rangesRef = useRef<{ sel?: Range; comp?: Range; bi?: Range; input?: Range }>({});
  const startTimeRef = useRef<number>(Date.now());
  const [phases, setPhases] = useState<PhaseBlock[]>([]);
  const [anomalies, setAnomalies] = useState<Anomaly[]>([]);
  const [domBefore, setDomBefore] = useState<string>('');
  const [domAfter, setDomAfter] = useState<string>('');
  const environment = useMemo(() => detectEnvironment(), []);
  const [uiLocale, setUiLocale] = useState<'en' | 'ko'>('en');
  const [selectedPresetId, setSelectedPresetId] = useState<string>('rich-inline-list-previous-default');
  const selectedPreset = useMemo(
    () => EDITOR_PRESETS.find((p) => p.id === selectedPresetId) ?? EDITOR_PRESETS[0],
    [selectedPresetId],
  );

  // Initialize visualizer once
  useEffect(() => {
    if (editorRef.current && overlayRef.current) {
      visualizerRef.current = new RangeVisualizer(editorRef.current, overlayRef.current);
    }
    return () => {
      visualizerRef.current?.destroy();
    };
  }, []);

  // Detect UI locale (for preset labels)
  useEffect(() => {
    if (typeof navigator !== 'undefined' && navigator.language) {
      if (navigator.language.toLowerCase().startsWith('ko')) {
        setUiLocale('ko');
      } else {
        setUiLocale('en');
      }
    }
  }, []);

  const applyPreset = useCallback(
    (preset: EditorPreset) => {
      logsRef.current = [];
      rangesRef.current = {};
      setPhases([]);
      setAnomalies([]);
      setDomBefore('');
      setDomAfter('');
      startTimeRef.current = Date.now();
      visualizerRef.current?.clear();
      if (editorRef.current) {
        editorRef.current.innerHTML = preset.html;
        editorRef.current.scrollTop = 0;
      }
    },
    [],
  );

  // Apply preset when selection changes (including initial mount)
  useEffect(() => {
    if (selectedPreset) {
      applyPreset(selectedPreset);
    }
  }, [selectedPreset, applyPreset]);

  const drawVisualization = useCallback(() => {
    if (!visualizerRef.current || !editorRef.current || !overlayRef.current) return;

    const ranges: RangeDrawInfo[] = [];
    const r = rangesRef.current;
    const base = overlayRef.current.getBoundingClientRect();
    const boundaryMarkers: { x: number; y: number; height: number; type: 'start' | 'end'; color: string }[] = [];

    if (r.sel && !r.sel.collapsed) {
      ranges.push({ range: r.sel, fill: 'rgba(59, 130, 246, 0.3)', stroke: 'rgba(59, 130, 246, 1)', heightScale: 1 });
    }
    if (r.comp) {
      ranges.push({ range: r.comp, fill: 'rgba(139, 92, 246, 0.3)', stroke: 'rgba(139, 92, 246, 1)', heightScale: 1.3 });
    }
    if (r.bi) {
      ranges.push({ range: r.bi, fill: 'rgba(249, 115, 22, 0.3)', stroke: 'rgba(249, 115, 22, 1)', heightScale: 1.5 });
    }
    if (r.input) {
      ranges.push({ range: r.input, fill: 'rgba(34, 197, 94, 0.3)', stroke: 'rgba(34, 197, 94, 1)', heightScale: 1.7 });
    }

    visualizerRef.current.drawRanges(ranges);

    if (r.sel) {
      const startBoundary = checkBoundaryAtNode(r.sel.startContainer, r.sel.startOffset);
      const endBoundary = checkBoundaryAtNode(r.sel.endContainer, r.sel.endOffset);

      if (startBoundary) {
        try {
          const tempRange = document.createRange();
          tempRange.setStart(r.sel.startContainer, r.sel.startOffset);
          tempRange.setEnd(r.sel.startContainer, Math.min(r.sel.startOffset + 1, r.sel.startContainer.textContent?.length || 0));
          const rect = tempRange.getBoundingClientRect();
          if (rect.width > 0 || rect.height > 0) {
            boundaryMarkers.push({
              x: rect.left - base.left + editorRef.current!.scrollLeft,
              y: rect.top - base.top + editorRef.current!.scrollTop,
              height: rect.height,
              type: startBoundary.type,
              color: '#f59e0b',
            });
          }
        } catch { /* ignore */ }
      }

      if (endBoundary && !r.sel.collapsed) {
        try {
          const tempRange = document.createRange();
          tempRange.setStart(r.sel.endContainer, Math.max(0, r.sel.endOffset - 1));
          tempRange.setEnd(r.sel.endContainer, r.sel.endOffset);
          const rect = tempRange.getBoundingClientRect();
          if (rect.width > 0 || rect.height > 0) {
            boundaryMarkers.push({
              x: rect.right - base.left + editorRef.current!.scrollLeft,
              y: rect.top - base.top + editorRef.current!.scrollTop,
              height: rect.height,
              type: endBoundary.type,
              color: '#ef4444',
            });
          }
        } catch { /* ignore */ }
      }

      visualizerRef.current.drawBoundaryMarkers(boundaryMarkers);
    } else {
      visualizerRef.current.drawBoundaryMarkers([]);
    }
  }, []);

  const updatePhaseView = useCallback(() => {
    const logs = logsRef.current;
    if (logs.length === 0) return;

    let lastSel: EventLog | null = null;
    let lastComp: EventLog | null = null;
    let lastBi: EventLog | null = null;
    let lastIn: EventLog | null = null;

    for (let i = logs.length - 1; i >= 0; i--) {
      const log = logs[i];
      if (log.type === 'selectionchange' && !lastSel) lastSel = log;
      else if ((log.type === 'compositionstart' || log.type === 'compositionupdate' || log.type === 'compositionend') && !lastComp) lastComp = log;
      else if (log.type === 'beforeinput' && !lastBi) lastBi = log;
      else if (log.type === 'input' && !lastIn) lastIn = log;
      if (lastSel && lastComp && lastBi && lastIn) break;
    }

    const timestamps = [lastSel?.timestamp, lastComp?.timestamp, lastBi?.timestamp, lastIn?.timestamp].filter(Boolean) as number[];
    const baseTs = timestamps.length > 0 ? Math.min(...timestamps) : startTimeRef.current;

    const newAnomalies: Anomaly[] = [];
    
    // 1. Parent mismatch detection
    if (lastBi && lastIn) {
      const biParent = lastBi.parent;
      const inParent = lastIn.parent;
      if (biParent && inParent) {
        const biKey = `${biParent.nodeName}${biParent.id ? '#' + biParent.id : ''}`;
        const inKey = `${inParent.nodeName}${inParent.id ? '#' + inParent.id : ''}`;
        if (biKey !== inKey) {
          newAnomalies.push({
            type: 'parent-mismatch',
            description: 'beforeinput과 input의 parent 요소가 다름',
            detail: `${biKey} → ${inKey}`,
          });
        }
      }
    }

    // 2. Boundary input detection
    if (lastBi && lastBi.startBoundary) {
      newAnomalies.push({
        type: 'boundary-input',
        description: '인라인 요소 경계에서 입력 발생',
        detail: `${lastBi.startBoundary.element} ${lastBi.startBoundary.type} 경계 (offset: ${lastBi.startOffset})`,
      });
    }

    // 3. Node type change detection
    if (lastBi && lastIn) {
      const biNode = lastBi.node?.nodeName;
      const inNode = lastIn.node?.nodeName;
      if (biNode && inNode && biNode !== inNode) {
        newAnomalies.push({
          type: 'node-type-change',
          description: '노드 타입이 변경됨',
          detail: `${biNode} → ${inNode}`,
        });
      }
    }

    // 4. Text leak detection (text moved outside its container)
    if (lastBi && lastIn && lastBi.parent && lastIn.parent) {
      // If beforeinput was in an inline element but input landed in a block parent
      const biParentName = lastBi.parent.nodeName;
      const inParentName = lastIn.parent.nodeName;
      const inlineElements = ['A', 'B', 'I', 'STRONG', 'EM', 'SPAN', 'CODE', 'MARK', 'U', 'S'];
      const blockElements = ['P', 'DIV', 'LI', 'TD', 'TH', 'BLOCKQUOTE', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6'];
      
      if (inlineElements.includes(biParentName) && blockElements.includes(inParentName)) {
        newAnomalies.push({
          type: 'text-leak',
          description: '텍스트가 인라인 요소 밖으로 이동함',
          detail: `${biParentName} → ${inParentName}`,
        });
      }
    }

    // 5. Sibling created detection
    if (lastBi && lastIn) {
      const biChildCount = lastBi.childCount;
      const inChildCount = lastIn.childCount;
      if (biChildCount !== undefined && inChildCount !== undefined && inChildCount > biChildCount) {
        newAnomalies.push({
          type: 'sibling-created',
          description: '새로운 sibling 노드가 생성됨',
          detail: `childCount: ${biChildCount} → ${inChildCount}`,
        });
      }
    }

    // 6. Selection jump detection
    if (lastSel && lastIn) {
      const selParent = lastSel.parent;
      const inParent = lastIn.parent;
      if (selParent && inParent && selParent.id && inParent.id && selParent.id !== inParent.id) {
        // Selection was in a different element before input
        newAnomalies.push({
          type: 'selection-jump',
          description: '선택 영역이 다른 요소로 점프함',
          detail: `${selParent.nodeName}#${selParent.id} → ${inParent.nodeName}#${inParent.id}`,
        });
      }
    }

    // 7. Composition data mismatch
    if (lastComp && lastIn && lastComp.data && lastIn.data) {
      // Check if composition data doesn't end with input data (indicates unexpected change)
      if (!lastComp.data.includes(lastIn.data) && !lastIn.data.includes(lastComp.data)) {
        newAnomalies.push({
          type: 'composition-mismatch',
          description: 'composition과 input 데이터가 다름',
          detail: `comp: "${lastComp.data}" vs input: "${lastIn.data}"`,
        });
      }
    }

    // 8. Missing beforeinput detection
    if (lastIn && !lastBi) {
      newAnomalies.push({
        type: 'missing-beforeinput',
        description: 'beforeinput 없이 input만 발생',
        detail: `inputType: ${lastIn.inputType || 'unknown'}, data: "${lastIn.data || ''}"`,
      });
    }

    setAnomalies(newAnomalies);

    const blocks: PhaseBlock[] = [];
    if (lastSel) blocks.push({ title: 'SELECTION', type: 'selectionchange', log: lastSel, delta: lastSel.timestamp - baseTs });
    if (lastComp) blocks.push({ title: 'COMPOSITION', type: lastComp.type, log: lastComp, delta: lastComp.timestamp - baseTs });
    if (lastBi) blocks.push({
      title: 'BEFOREINPUT',
      type: 'beforeinput',
      log: lastBi,
      delta: lastBi.timestamp - baseTs,
      highlight: newAnomalies.some(a => a.type === 'boundary-input') ? 'warning' : undefined,
    });
    if (lastIn) blocks.push({
      title: 'INPUT',
      type: 'input',
      log: lastIn,
      delta: lastIn.timestamp - baseTs,
      highlight: newAnomalies.some(a => ['parent-mismatch', 'text-leak', 'node-type-change', 'sibling-created', 'missing-beforeinput'].includes(a.type)) ? 'error' : undefined,
    });

    setPhases(blocks);
    drawVisualization();
  }, [drawVisualization]);

  const createLog = useCallback((
    type: EventLog['type'],
    range: Range | null,
    extra: Partial<EventLog> = {}
  ): Omit<EventLog, 'id'> => {
    const startContainer = range?.startContainer || null;
    const startBoundary = startContainer ? checkBoundaryAtNode(startContainer, range?.startOffset || 0) : null;
    const endBoundary = range?.endContainer ? checkBoundaryAtNode(range.endContainer, range?.endOffset || 0) : null;
    
    // Get sibling info
    let leftSibling: SiblingInfo | null = null;
    let rightSibling: SiblingInfo | null = null;
    let childIndex: number | undefined;
    let childCount: number | undefined;
    
    if (startContainer) {
      leftSibling = getSiblingInfo(startContainer.previousSibling);
      rightSibling = getSiblingInfo(startContainer.nextSibling);
      const pos = getChildPosition(startContainer);
      if (pos) {
        childIndex = pos.index;
        childCount = pos.count;
      }
    }

    // Check if start and end containers are different
    const endContainer = range?.endContainer || null;
    const isDifferentContainer = range && range.startContainer !== range.endContainer;

    return {
      timestamp: Date.now(),
      type,
      // Start container info
      parent: range ? getParentInfo(range.startContainer) : null,
      node: range ? getNodeInfo(range.startContainer) : null,
      startOffset: range?.startOffset ?? 0,
      startContainerText: range?.startContainer.textContent || undefined,
      // End container info (only if different from start)
      endParent: isDifferentContainer && endContainer ? getParentInfo(endContainer) : null,
      endNode: isDifferentContainer && endContainer ? getNodeInfo(endContainer) : null,
      endOffset: range?.endOffset ?? 0,
      endContainerText: isDifferentContainer ? range?.endContainer.textContent || undefined : undefined,
      range,
      startBoundary,
      endBoundary,
      leftSibling,
      rightSibling,
      childIndex,
      childCount,
      ...extra,
    };
  }, []);

  const pushLog = useCallback((log: Omit<EventLog, 'id'>) => {
    logsRef.current = [...logsRef.current.slice(-49), { ...log, id: Date.now() + Math.random() }];
    
    if (log.range) {
      if (log.type === 'selectionchange') rangesRef.current.sel = log.range;
      else if (log.type.startsWith('composition')) rangesRef.current.comp = log.range;
      else if (log.type === 'beforeinput') rangesRef.current.bi = log.range;
      else if (log.type === 'input') rangesRef.current.input = log.range;
    }

    updatePhaseView();
  }, [updatePhaseView]);

  useEffect(() => {
    const handleSelectionChange = () => {
      if (!editorRef.current?.contains(document.activeElement)) return;
      const sel = window.getSelection();
      if (!sel || sel.rangeCount === 0) return;
      const range = sel.getRangeAt(0).cloneRange();
      pushLog(createLog('selectionchange', range));
    };

    document.addEventListener('selectionchange', handleSelectionChange);
    return () => document.removeEventListener('selectionchange', handleSelectionChange);
  }, [pushLog, createLog]);

  // Use native event listeners for more reliable event capture
  useEffect(() => {
    const editor = editorRef.current;
    if (!editor) return;

    const handleBeforeInput = (e: InputEvent) => {
      setDomBefore(editor.innerHTML);
      const sel = window.getSelection();
      const range = sel && sel.rangeCount > 0 ? sel.getRangeAt(0).cloneRange() : null;
      pushLog(createLog('beforeinput', range, { inputType: e.inputType, data: e.data, isComposing: e.isComposing }));
    };

    const handleInput = (e: Event) => {
      const inputEvent = e as InputEvent;
      setDomAfter(editor.innerHTML);
      const sel = window.getSelection();
      const range = sel && sel.rangeCount > 0 ? sel.getRangeAt(0).cloneRange() : null;
      pushLog(createLog('input', range, { inputType: inputEvent.inputType, data: inputEvent.data }));
    };

    const handleCompositionStart = (e: CompositionEvent) => {
      const sel = window.getSelection();
      const range = sel && sel.rangeCount > 0 ? sel.getRangeAt(0).cloneRange() : null;
      pushLog(createLog('compositionstart', range, { data: e.data }));
    };

    const handleCompositionUpdate = (e: CompositionEvent) => {
      const sel = window.getSelection();
      const range = sel && sel.rangeCount > 0 ? sel.getRangeAt(0).cloneRange() : null;
      pushLog(createLog('compositionupdate', range, { data: e.data }));
    };

    const handleCompositionEnd = (e: CompositionEvent) => {
      const sel = window.getSelection();
      const range = sel && sel.rangeCount > 0 ? sel.getRangeAt(0).cloneRange() : null;
      pushLog(createLog('compositionend', range, { data: e.data }));
    };

    // Use native event listeners with capture phase for better reliability
    editor.addEventListener('beforeinput', handleBeforeInput, { capture: true });
    editor.addEventListener('input', handleInput, { capture: true });
    editor.addEventListener('compositionstart', handleCompositionStart, { capture: true });
    editor.addEventListener('compositionupdate', handleCompositionUpdate, { capture: true });
    editor.addEventListener('compositionend', handleCompositionEnd, { capture: true });

    return () => {
      editor.removeEventListener('beforeinput', handleBeforeInput, { capture: true });
      editor.removeEventListener('input', handleInput, { capture: true });
      editor.removeEventListener('compositionstart', handleCompositionStart, { capture: true });
      editor.removeEventListener('compositionupdate', handleCompositionUpdate, { capture: true });
      editor.removeEventListener('compositionend', handleCompositionEnd, { capture: true });
    };
  }, [pushLog, createLog]);

  const resetAll = useCallback(() => {
    if (selectedPreset) {
      applyPreset(selectedPreset);
    }
  }, [selectedPreset, applyPreset]);

  const copyReport = useCallback(() => {
    const lines: string[] = [
      '# ContentEditable 이벤트 분석',
      '',
      '## 환경 정보',
      `- OS: ${environment.os} ${environment.osVersion}`,
      `- Browser: ${environment.browser} ${environment.browserVersion}`,
      `- Device: ${environment.device}`,
      '',
    ];

    if (anomalies.length > 0) {
      lines.push('## ⚠️ 감지된 비정상 동작');
      anomalies.forEach(a => lines.push(`- **${a.type}**: ${a.description}\n  - ${a.detail}`));
      lines.push('');
    }

    lines.push('## 이벤트 로그', '```');
    phases.forEach(phase => {
      if (!phase.log) return;
      const log = phase.log;
      lines.push(`=== ${phase.title} (Δ=${phase.delta}ms) ===`);
      lines.push(`type: ${log.type} (${log.inputType || '-'})`);
      lines.push(`parent: ${log.parent?.nodeName || '-'}${log.parent?.id ? '#' + log.parent.id : ''}`);
      lines.push(`  node: ${log.node?.nodeName || '-'}`);
      lines.push(`offset: start=${log.startOffset}, end=${log.endOffset}`);
      if (log.childIndex !== undefined) lines.push(`index: ${log.childIndex} / ${log.childCount}`);
      if (log.leftSibling) lines.push(`left: ${log.leftSibling.nodeName}${log.leftSibling.id ? '#' + log.leftSibling.id : ''}`);
      if (log.rightSibling) lines.push(`right: ${log.rightSibling.nodeName}${log.rightSibling.id ? '#' + log.rightSibling.id : ''}`);
      if (log.data) lines.push(`data: "${normalizeDebugText(log.data)}"`);
      lines.push('');
    });
    lines.push('```', '', '## DOM Before', '```html', domBefore || '(empty)', '```', '', '## DOM After', '```html', domAfter || '(empty)', '```');

    navigator.clipboard.writeText(lines.join('\n')).catch(() => {});
  }, [environment, anomalies, phases, domBefore, domAfter]);

  return (
    <div className="grid grid-cols-2 gap-4 flex-1 min-h-0">
      {/* Left: Editor */}
      <div className="flex flex-col gap-2 min-h-0">
        {/* Environment */}
        <div className="flex items-center gap-2 px-3 py-2 bg-accent-primary-light border border-accent-primary rounded-md text-sm">
          <span className="font-semibold">🔍</span>
          <span>{environment.os} {environment.osVersion}</span>
          <span className="text-text-muted">•</span>
          <span>{environment.browser} {environment.browserVersion}</span>
          <span className="text-text-muted">•</span>
          <span>{environment.device}</span>
        </div>

        {/* Preset selector + Actions */}
        <div className="flex items-center justify-between gap-3 px-3 py-1.5 bg-bg-muted rounded-md text-xs text-text-secondary flex-wrap">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-[0.7rem] text-text-muted">
              {uiLocale === 'ko' ? '샘플 HTML' : 'Sample HTML'}
            </span>
            <select
              value={selectedPresetId}
              onChange={(e) => setSelectedPresetId(e.target.value)}
              className="h-7 px-2 rounded-md border border-border-light bg-bg-surface text-[0.75rem] text-text-primary cursor-pointer"
            >
              {EDITOR_PRESETS.map((preset) => (
                <option key={preset.id} value={preset.id}>
                  {preset.labels[uiLocale] ?? preset.labels.en}
                </option>
              ))}
            </select>
          </div>
          <div className="flex gap-1.5">
            <button 
              type="button" 
              onClick={resetAll}
              className="px-2.5 py-1.5 text-xs rounded-md border border-border-light bg-bg-surface text-text-primary cursor-pointer hover:bg-bg-muted transition-colors"
            >
              🗑️ 초기화
            </button>
            <button 
              type="button" 
              onClick={copyReport}
              className="px-2.5 py-1.5 text-xs rounded-md border-none bg-accent-primary text-white cursor-pointer hover:bg-accent-primary-hover transition-colors"
            >
              📋 리포트 복사
            </button>
          </div>
        </div>

        {/* Editor & DOM Diff */}
        <div className="flex-1 grid grid-rows-[0.9fr_1.1fr] gap-2 min-h-0">
          {/* Editor with overlay wrapper */}
          <div ref={overlayRef} className="relative min-h-0">
            <div
              ref={editorRef}
              contentEditable
              suppressContentEditableWarning
              className="h-full p-3 text-base leading-[1.8] outline-none focus:outline-none focus-visible:outline-none bg-bg-surface border-2 border-accent-primary rounded-lg overflow-y-auto box-border"
            />
          </div>

          {/* DOM Diff with syntax highlighting - larger size */}
          <div className="grid grid-cols-2 gap-2.5 min-h-0">
            <div className="flex flex-col min-h-0">
              <div className="text-sm font-semibold text-text-muted mb-1.5">
                Before {domBefore && domAfter && domBefore !== domAfter && <span className="text-red-600 text-xs">(-)</span>}
              </div>
              <div className="flex-1 text-sm p-2.5 bg-bg-muted rounded overflow-auto font-mono leading-relaxed border border-border-light whitespace-pre-wrap break-all max-h-full">
                <DomDiffView before={domBefore} after={domAfter} type="before" />
              </div>
            </div>
            <div className="flex flex-col min-h-0">
              <div className="text-sm font-semibold text-text-muted mb-1.5">
                After {domBefore && domAfter && domBefore !== domAfter && <span className="text-green-600 text-xs">(+)</span>}
              </div>
              <div className="flex-1 text-sm p-2.5 bg-bg-muted rounded overflow-auto font-mono leading-relaxed border border-border-light whitespace-pre-wrap break-all max-h-full">
                <DomDiffView before={domBefore} after={domAfter} type="after" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right: Event Phases */}
      <div className="flex flex-col gap-1.5 overflow-y-auto overflow-x-hidden min-h-0 flex-1">
        {/* Anomalies */}
        {anomalies.length > 0 && (
          <div className="flex flex-col gap-1">
            {anomalies.map((a, i) => (
              <div key={i} className="p-1.5 bg-red-50 dark:bg-red-950/20 border border-red-500 dark:border-red-600 rounded">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-red-600 dark:text-red-400 text-sm whitespace-nowrap">
                    ⚠️ {a.type}
                  </span>
                  <span className="text-xs text-red-800 dark:text-red-300">{a.description}</span>
                </div>
                <code className="text-xs text-red-900 dark:text-red-200 block mt-1.5">
                  {a.detail}
                </code>
              </div>
            ))}
          </div>
        )}

        {/* Phase Blocks */}
        {phases.length === 0 ? (
          <div className="p-6 text-center text-text-muted bg-bg-muted rounded-lg text-sm">
            에디터에 입력하면 이벤트가 여기에 표시됩니다.
          </div>
        ) : (
          phases.map((phase, i) => <PhaseBlockView key={i} phase={phase} />)
        )}
      </div>
    </div>
  );
}

// ============================================================
// Phase Block Component
// ============================================================

function buildSelectionSegmentsFromLog(log: EventLog): { path: string; start: number; end: number; text: string }[] {
  const segments: { path: string; start: number; end: number; text: string }[] = [];
  if (!log.range) return segments;
  const range = log.range;
  if (range.collapsed) return segments;

  try {
    const root = range.commonAncestorContainer || range.startContainer;
    const doc = (root as Node).ownerDocument || document;
    
    // First, collect text nodes
    const textWalker = doc.createTreeWalker(
      root,
      NodeFilter.SHOW_TEXT,
      {
        acceptNode(node: Node) {
          try {
            // Some browsers may throw for intersectsNode on detached nodes
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            return (range as any).intersectsNode && (range as any).intersectsNode(node)
              ? NodeFilter.FILTER_ACCEPT
              : NodeFilter.FILTER_REJECT;
          } catch {
            return NodeFilter.FILTER_REJECT;
          }
        },
      } as unknown as NodeFilter,
    );

    let textNode: Node | null = textWalker.currentNode;
    if (!textNode || textNode.nodeType !== Node.TEXT_NODE) {
      textNode = textWalker.nextNode();
    }

    while (textNode) {
      const text = (textNode as Text).data ?? '';
      let segStart = 0;
      let segEnd = text.length;

      if (textNode === range.startContainer) {
        segStart = range.startOffset;
      }
      if (textNode === range.endContainer) {
        segEnd = range.endOffset;
      }

      if (segStart < 0) segStart = 0;
      if (segEnd > text.length) segEnd = text.length;

      if (segStart < segEnd) {
        const selectedText = text.slice(segStart, segEnd);
        const parent = textNode.parentNode as Element | null;
        const parentName = parent ? parent.nodeName : '#text';
        const parentId = parent instanceof Element ? parent.id || undefined : undefined;
        const parentClass = parent instanceof Element ? (parent.className as string) || undefined : undefined;
        const path = formatNodePath(parentName, parentId, parentClass);

        segments.push({
          path,
          start: segStart,
          end: segEnd,
          text: selectedText,
        });
      }

      textNode = textWalker.nextNode();
    }

    // Then, collect element nodes (images, etc.) that are fully or partially selected
    const elementWalker = doc.createTreeWalker(
      root,
      NodeFilter.SHOW_ELEMENT,
      {
        acceptNode(node: Node) {
          try {
            if (node.nodeType !== Node.ELEMENT_NODE) return NodeFilter.FILTER_REJECT;
            // Check if the element is fully contained or intersects with the range
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            if (!(range as any).intersectsNode) return NodeFilter.FILTER_REJECT;
            
            // For element nodes, we need to check if they're within the range
            const element = node as Element;
            const elementRange = doc.createRange();
            try {
              elementRange.selectNodeContents(element);
              // Check if element range intersects with selection range
              const intersects = 
                elementRange.compareBoundaryPoints(Range.START_TO_END, range) > 0 &&
                elementRange.compareBoundaryPoints(Range.END_TO_START, range) < 0;
              
              // Also check if the element itself is the start or end container
              const isStartContainer = element === range.startContainer;
              const isEndContainer = element === range.endContainer;
              const isContained = 
                range.compareBoundaryPoints(Range.START_TO_START, elementRange) <= 0 &&
                range.compareBoundaryPoints(Range.END_TO_END, elementRange) >= 0;
              
              return (intersects || isStartContainer || isEndContainer || isContained)
                ? NodeFilter.FILTER_ACCEPT
                : NodeFilter.FILTER_REJECT;
            } catch {
              // Fallback: use intersectsNode
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              return (range as any).intersectsNode(element)
                ? NodeFilter.FILTER_ACCEPT
                : NodeFilter.FILTER_REJECT;
            }
          } catch {
            return NodeFilter.FILTER_REJECT;
          }
        },
      } as unknown as NodeFilter,
    );

    const processedElements = new Set<Element>();
    let elementNode: Node | null = elementWalker.currentNode;
    if (!elementNode || elementNode.nodeType !== Node.ELEMENT_NODE) {
      elementNode = elementWalker.nextNode();
    }

    while (elementNode) {
      const element = elementNode as Element;
      
      // Skip if already processed (avoid duplicates)
      if (processedElements.has(element)) {
        elementNode = elementWalker.nextNode();
        continue;
      }
      
      // Skip if this element is just a container (has text children that we already processed)
      // Only include elements that are meaningful (img, br, etc.) or are directly selected
      const isDirectlySelected = 
        element === range.startContainer || 
        element === range.endContainer ||
        (range.startContainer.nodeType === Node.ELEMENT_NODE && 
         range.startContainer === element) ||
        (range.endContainer.nodeType === Node.ELEMENT_NODE && 
         range.endContainer === element);
      
      // Check if element is a leaf node (img, br, input, etc.) or is directly selected
      const isLeafElement = 
        element.tagName === 'IMG' ||
        element.tagName === 'BR' ||
        element.tagName === 'HR' ||
        element.tagName === 'INPUT' ||
        element.tagName === 'VIDEO' ||
        element.tagName === 'AUDIO' ||
        element.tagName === 'IFRAME' ||
        element.tagName === 'EMBED' ||
        element.tagName === 'OBJECT';
      
      // Check if element is fully contained in range (not just a parent container)
      let isFullyContained = false;
      try {
        const elementRange = doc.createRange();
        elementRange.selectNodeContents(element);
        isFullyContained = 
          range.compareBoundaryPoints(Range.START_TO_START, elementRange) <= 0 &&
          range.compareBoundaryPoints(Range.END_TO_END, elementRange) >= 0;
      } catch {
        // ignore
      }

      if (isDirectlySelected || (isLeafElement && isFullyContained)) {
        const elementName = element.tagName;
        const elementId = element.id || undefined;
        const elementClass = (element.className as string) || undefined;
        const path = formatNodePath(elementName, elementId, elementClass);
        
        // For element nodes, offset represents child index
        let segStart = 0;
        let segEnd = 1;
        
        if (element === range.startContainer) {
          segStart = range.startOffset;
        }
        if (element === range.endContainer) {
          segEnd = range.endOffset;
        }
        
        // Determine element type label
        let elementLabel = `[${elementName}]`;
        if (elementName === 'IMG') {
          const alt = (element as HTMLImageElement).alt || '';
          elementLabel = `[IMG${alt ? `: ${alt}` : ''}]`;
        } else if (elementName === 'BR') {
          elementLabel = '[BR]';
        } else if (elementName === 'VIDEO') {
          elementLabel = '[VIDEO]';
        } else if (elementName === 'AUDIO') {
          elementLabel = '[AUDIO]';
        }

        segments.push({
          path,
          start: segStart,
          end: segEnd,
          text: elementLabel,
        });
        
        processedElements.add(element);
      }

      elementNode = elementWalker.nextNode();
    }
  } catch {
    // ignore errors in segment construction
  }

  return segments;
}

function PhaseBlockView({ phase }: { phase: PhaseBlock }) {
  const log = phase.log;
  if (!log) return null;

  const isError = phase.highlight === 'error';
  const isWarning = phase.highlight === 'warning';
  const borderClass = isError ? 'border-red-500' : isWarning ? 'border-amber-500' : 'border-border-light';
  const headerBgClass = isError ? 'bg-red-100 dark:bg-red-950/30' : isWarning ? 'bg-amber-100 dark:bg-amber-950/30' : 'bg-bg-muted';
  const bodyBgClass = isError ? 'bg-red-50 dark:bg-red-950/20' : isWarning ? 'bg-amber-50 dark:bg-amber-950/20' : 'bg-bg-surface';

  const typeColorClass: Record<string, string> = {
    selectionchange: 'text-blue-500',
    compositionstart: 'text-purple-500',
    compositionupdate: 'text-purple-500',
    compositionend: 'text-purple-500',
    beforeinput: 'text-orange-500',
    input: 'text-green-500',
  };

  const formatSibling = (s: SiblingInfo | null | undefined, label: string) => {
    if (!s) return null;
    const path = formatNodePath(s.nodeName, s.id, s.className);
    const text = s.textPreview ? ` "${s.textPreview}"` : '';
    return <Line label={label} value={`${path}${text}`} />;
  };

  const selectionSegments =
    log.type === 'selectionchange'
      ? buildSelectionSegmentsFromLog(log)
      : [];

  return (
    <div className={`border-[1.5px] ${borderClass} rounded-md overflow-hidden ${bodyBgClass}`}>
      <div className={`px-2 py-1.5 ${headerBgClass} border-b ${borderClass} flex justify-between items-center`}>
        <span className={`font-bold text-sm ${typeColorClass[log.type] || 'text-text-primary'}`}>
          {phase.title}
        </span>
        <span className="text-xs text-text-muted">Δ={phase.delta}ms</span>
      </div>

      <div className="p-2 px-2.5 text-xs font-mono leading-relaxed">
        <Line label="type" value={`${log.type} (${log.inputType || '-'})`} />
        <Line 
          label="parent" 
          value={formatNodePath(log.parent?.nodeName || '-', log.parent?.id, log.parent?.className)} 
          color={typeColorClass[log.type]} 
        />
        <Line 
          label="  node" 
          value={formatNodePath(log.node?.nodeName || '-', log.node?.id, log.node?.className)} 
        />
        {/* Offset display */}
        {log.endNode ? (
          // Cross-node selection - show detailed Range Selection box
          <div className="bg-amber-100 dark:bg-amber-900/30 border border-amber-500 rounded px-2 py-1.5 mt-1 text-xs">
            <div className="flex gap-1.5">
              <span className="text-amber-900 dark:text-amber-200 min-w-[40px] text-xs">start:</span>
              <span className="text-amber-800 dark:text-amber-300 text-xs">
                {log.node?.nodeName === '#text' && log.parent ? (
                  <>{formatNodePath(log.parent.nodeName, log.parent.id, log.parent.className)} &gt; #text @ {log.startOffset}</>
                ) : (
                  <>{formatNodePath(log.node?.nodeName || '-', log.node?.id, log.node?.className)} @ {log.startOffset}</>
                )}
              </span>
            </div>
            <div className="flex gap-1.5 bg-orange-200 dark:bg-orange-900/40 px-1.5 py-1 rounded -mx-2 mt-1">
              <span className="text-amber-900 dark:text-amber-200 min-w-[40px] text-xs">end:</span>
              <span className="text-orange-800 dark:text-orange-200 font-semibold text-xs">
                {log.endNode.nodeName === '#text' && log.endParent ? (
                  <>{formatNodePath(log.endParent.nodeName, log.endParent.id, log.endParent.className)} &gt; #text @ {log.endOffset}</>
                ) : (
                  <>{formatNodePath(log.endNode.nodeName, log.endNode.id, log.endNode.className)} @ {log.endOffset}</>
                )}
              </span>
            </div>
          </div>
        ) : log.startOffset !== log.endOffset ? (
          // Same node range selection - simple format with range highlight
          <div className="flex gap-1.5">
            <span className="text-text-muted min-w-[45px]">offset:</span>
            <span className="bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-200 px-1 rounded">
              {log.startOffset}..{log.endOffset} <span className="text-[0.7rem]">(range: {log.endOffset - log.startOffset})</span>
            </span>
          </div>
        ) : (
          // Collapsed cursor
          <div className="flex gap-1.5">
            <span className="text-text-muted min-w-[45px]">offset:</span>
            <span className="text-text-primary">
              {log.startOffset} <span className="text-text-muted text-[0.7rem]">(collapsed)</span>
            </span>
          </div>
        )}
        {log.childIndex !== undefined && (
          <Line label="index" value={`${log.childIndex} / ${log.childCount}`} />
        )}
        {formatSibling(log.leftSibling, 'left')}
        {formatSibling(log.rightSibling, 'right')}
        {/* Selection segments: show only the actually selected ranges, not the entire text */}
        {log.type === 'selectionchange' && selectionSegments.length > 0 && (
          <div className="mt-1">
            {selectionSegments.map((seg, idx) => (
              <div key={idx} className="flex gap-2 text-xs">
                <span className="text-text-muted min-w-[55px] text-xs">
                  {idx === 0 ? 'segments:' : ''}
                </span>
                <span className="text-text-primary text-xs">
                  {`seg${idx}: ${seg.path} [${seg.start}..${seg.end}] "`}
                  <DebugText text={seg.text} />
                  {'"'}
                </span>
              </div>
            ))}
          </div>
        )}
        {/* Show data for beforeinput, input, and composition events */}
        {['beforeinput', 'input', 'compositionstart', 'compositionupdate', 'compositionend'].includes(log.type) && (
          <div className="flex gap-2 text-xs">
            <span className="text-text-muted min-w-[55px] text-xs">data:</span>
            <span className="text-green-600 dark:text-green-400 font-semibold text-xs">
              {log.data !== null && log.data !== undefined ? (
                <>"<DebugText text={log.data} />"</>
              ) : (
                <span className="text-gray-400 dark:text-gray-500 italic">null</span>
              )}
            </span>
          </div>
        )}
        {log.isComposing !== undefined && (
          <div className="flex gap-2 text-xs">
            <span className="text-text-muted min-w-[55px] text-xs">composing:</span>
            <span className={`font-medium text-xs ${log.isComposing ? 'text-purple-500' : 'text-gray-500'}`}>
              {log.isComposing ? 'true' : 'false'}
            </span>
          </div>
        )}
        {/* Show text content with cursor position for #text nodes in input-related events */}
        {['beforeinput', 'input', 'compositionstart', 'compositionupdate', 'compositionend'].includes(log.type) && 
         log.node?.nodeName === '#text' && log.startContainerText && (
          <div className="mt-1.5 p-1.5 px-2 bg-bg-muted rounded border border-border-light">
            <TextWithCursor 
              text={log.startContainerText} 
              startOffset={log.startOffset} 
              endOffset={log.endNode ? log.startContainerText.length : log.endOffset} 
            />
          </div>
        )}
        {log.startBoundary && <Line label="⚠️ start" value={`${log.startBoundary.element} ${log.startBoundary.type} 경계`} color="text-amber-600 dark:text-amber-400" />}
        {log.endBoundary && <Line label="⚠️ end" value={`${log.endBoundary.element} ${log.endBoundary.type} 경계`} color="text-red-600 dark:text-red-400" />}
      </div>
    </div>
  );
}

function Line({ label, value, color, highlight }: { label: string; value: string; color?: string; highlight?: boolean }) {
  const valueColorClass = highlight 
    ? 'text-green-600 dark:text-green-400 font-semibold' 
    : color 
      ? color 
      : 'text-text-primary';
  
  return (
    <div className="flex gap-2 text-xs">
      <span className="text-text-muted min-w-[55px] text-xs">{label}:</span>
      <span className={`${valueColorClass} text-xs`}>{value}</span>
    </div>
  );
}
