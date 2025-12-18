import React, { useState } from 'react';

type CaseData = {
  id: string;
  caseTitle: string;
  description: string;
  os: string;
  osVersion?: string;
  device: string;
  deviceVersion?: string;
  browser: string;
  browserVersion?: string;
  keyboard: string;
  reproductionSteps: string[];
  initialHtml: string;
  scenarioId: string;
  tags?: string[];
  status: string;
  content?: string;
};

type CaseExportProps = {
  caseData: CaseData;
};

export function CaseExport({ caseData }: CaseExportProps) {
  const [showMenu, setShowMenu] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);

  const generateJSON = () => {
    const exportData = {
      id: caseData.id,
      title: caseData.caseTitle,
      description: caseData.description,
      environment: {
        os: caseData.os,
        osVersion: caseData.osVersion,
        device: caseData.device,
        deviceVersion: caseData.deviceVersion,
        browser: caseData.browser,
        browserVersion: caseData.browserVersion,
        keyboard: caseData.keyboard,
      },
      reproductionSteps: caseData.reproductionSteps,
      initialHtml: caseData.initialHtml,
      scenarioId: caseData.scenarioId,
      tags: caseData.tags,
      status: caseData.status,
    };
    return JSON.stringify(exportData, null, 2);
  };

  const generateMarkdown = () => {
    const lines = [
      `# ${caseData.caseTitle}`,
      '',
      `**ID:** \`${caseData.id}\``,
      `**Status:** ${caseData.status}`,
      `**Scenario:** ${caseData.scenarioId}`,
      '',
      '## Environment',
      '',
      `| Property | Value |`,
      `| --- | --- |`,
      `| OS | ${caseData.os}${caseData.osVersion ? ` ${caseData.osVersion}` : ''} |`,
      `| Device | ${caseData.device}${caseData.deviceVersion ? ` ${caseData.deviceVersion}` : ''} |`,
      `| Browser | ${caseData.browser}${caseData.browserVersion ? ` ${caseData.browserVersion}` : ''} |`,
      `| Keyboard | ${caseData.keyboard} |`,
      '',
      '## Description',
      '',
      caseData.description,
      '',
      '## Reproduction Steps',
      '',
      ...caseData.reproductionSteps.map((step, i) => `${i + 1}. ${step}`),
      '',
    ];

    if (caseData.tags && caseData.tags.length > 0) {
      lines.push('## Tags', '', caseData.tags.map((t) => `\`${t}\``).join(' '), '');
    }

    if (caseData.initialHtml) {
      lines.push('## Initial HTML', '', '```html', caseData.initialHtml, '```', '');
    }

    return lines.join('\n');
  };

  const handleExport = async (format: 'json' | 'markdown') => {
    const content = format === 'json' ? generateJSON() : generateMarkdown();
    const filename = `${caseData.id}.${format === 'json' ? 'json' : 'md'}`;

    try {
      // Try to download as file
      const blob = new Blob([content], { type: format === 'json' ? 'application/json' : 'text/markdown' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      // Fallback to clipboard
      await navigator.clipboard.writeText(content);
      setCopied(format);
      setTimeout(() => setCopied(null), 2000);
    }

    setShowMenu(false);
  };

  const handleCopyLink = async () => {
    const url = window.location.href;
    await navigator.clipboard.writeText(url);
    setCopied('link');
    setTimeout(() => setCopied(null), 2000);
    setShowMenu(false);
  };

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setShowMenu(!showMenu)}
        className="flex items-center gap-1.5 px-3 py-1.5 bg-bg-muted border border-border-light rounded-md cursor-pointer text-xs font-medium text-text-secondary transition-all hover:bg-bg-surface"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
          <polyline points="16 6 12 2 8 6" />
          <line x1="12" y1="2" x2="12" y2="15" />
        </svg>
        Export
        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M6 9l6 6 6-6" />
        </svg>
      </button>

      {showMenu && (
        <>
          <div
            className="fixed inset-0 z-[99]"
            onClick={() => setShowMenu(false)}
          />
          <div className="absolute top-[calc(100%+4px)] right-0 min-w-[180px] bg-bg-surface border border-border-light rounded-lg shadow-[0_10px_40px_rgba(0,0,0,0.12)] z-[100] overflow-hidden">
            <button
              type="button"
              onClick={() => handleExport('json')}
              className="flex items-center gap-2 w-full px-3 py-2.5 bg-transparent border-none cursor-pointer text-sm text-text-secondary text-left hover:bg-bg-muted transition-colors"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
              </svg>
              Download JSON
              {copied === 'json' && <span className="text-status-confirmed ml-auto">✓</span>}
            </button>
            <button
              type="button"
              onClick={() => handleExport('markdown')}
              className="flex items-center gap-2 w-full px-3 py-2.5 bg-transparent border-none cursor-pointer text-sm text-text-secondary text-left hover:bg-bg-muted transition-colors"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
                <line x1="16" y1="13" x2="8" y2="13" />
                <line x1="16" y1="17" x2="8" y2="17" />
              </svg>
              Download Markdown
              {copied === 'markdown' && <span className="text-status-confirmed ml-auto">✓</span>}
            </button>
            <div className="h-px bg-border-light my-1" />
            <button
              type="button"
              onClick={handleCopyLink}
              className="flex items-center gap-2 w-full px-3 py-2.5 bg-transparent border-none cursor-pointer text-sm text-text-secondary text-left hover:bg-bg-muted transition-colors"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
              </svg>
              Copy link
              {copied === 'link' && <span className="text-status-confirmed ml-auto">✓</span>}
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default CaseExport;

