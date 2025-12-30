import React, { useMemo, useState, useRef, useEffect } from 'react';

type CasePlaygroundProps = {
  id: string;
  caseTitle: string;
  os: string;
  osVersion?: string;
  device: string;
  deviceVersion?: string;
  browser: string;
  browserVersion?: string;
  keyboard: string;
};

type LogEntry = {
  id: number;
  time: string;
  type: string;
  data: Record<string, unknown>;
};

type DetectedEnv = {
  os: string;
  browser: string;
};

const formatTime = (d: Date) =>
  `${d.toISOString().split('T')[1]?.replace('Z', '') ?? ''}`;

function detectEnvironment(): DetectedEnv {
  if (typeof navigator === 'undefined') {
    return { os: '', browser: '' };
  }

  const ua = navigator.userAgent;
  const platform =
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    (navigator as unknown as { userAgentData?: { platform?: string } }).userAgentData
      ?.platform ?? navigator.platform;

  let os = '';
  if (/Win/i.test(platform) || /Windows/i.test(ua)) os = 'Windows';
  else if (/Mac/i.test(platform) || /Mac OS X/i.test(ua)) os = 'macOS';
  else if (/Linux/i.test(platform) || /X11/i.test(ua)) os = 'Linux';
  else if (/Android/i.test(ua)) os = 'Android';
  else if (/iPhone|iPad|iPod/i.test(ua)) os = 'iOS';

  let browser = '';
  if (/Edg\//.test(ua)) browser = 'Edge';
  else if (/Chrome\//.test(ua)) browser = 'Chrome';
  else if (/Safari\//.test(ua) && !/Chrome\//.test(ua)) browser = 'Safari';
  else if (/Firefox\//.test(ua)) browser = 'Firefox';

  return { os, browser };
}

export function CasePlayground(props: CasePlaygroundProps) {
  const [reportedEnv] = useState({
    os: props.os,
    device: props.device,
    browser: props.browser,
    keyboard: props.keyboard,
  });

  const detectedEnv = useMemo(() => detectEnvironment(), []);

  const [userEnv, setUserEnv] = useState({
    os: detectedEnv.os || reportedEnv.os,
    device: reportedEnv.device,
    browser: detectedEnv.browser || reportedEnv.browser,
    keyboard: reportedEnv.keyboard,
  });

  const [logs, setLogs] = useState<LogEntry[]>([]);
  const editableRef = useRef<HTMLDivElement>(null);
  const isInitializedRef = useRef(false);
  const logIdCounterRef = useRef(0);

  // Initialize content only once
  useEffect(() => {
    if (editableRef.current && !isInitializedRef.current) {
      editableRef.current.innerHTML = '<p>Use this editable area to reproduce the described case.</p>';
      isInitializedRef.current = true;
    }
  }, []);

  const resetLogs = () => {
    setLogs([]);
    logIdCounterRef.current = 0;
  };

  const pushLog = (type: string, data: Record<string, unknown>) => {
    logIdCounterRef.current += 1;
    setLogs((prev) => [
      {
        id: logIdCounterRef.current,
        time: formatTime(new Date()),
        type,
        data,
      },
      ...prev,
    ]);
  };

  const handleCopyIssueTemplate = async () => {
    const bodyLines = [
      '# contenteditable case report',
      '',
      '## Case',
      `- caseId: \`${props.id}\``,
      `- title: \`${props.caseTitle}\``,
      '',
      '## Reported environment (from case document)',
      `- os: \`${reportedEnv.os}\``,
      `- device: \`${reportedEnv.device}\``,
      `- browser: \`${reportedEnv.browser}\``,
      `- keyboard: \`${reportedEnv.keyboard}\``,
      '',
      '## Your environment (while reproducing)',
      `- os: \`${userEnv.os}\``,
      `- device: \`${userEnv.device}\``,
      `- browser: \`${userEnv.browser}\``,
      `- keyboard: \`${userEnv.keyboard}\``,
      '',
      '## Observed behavior',
      '_Describe what actually happened._',
      '',
      '## Expected behavior',
      '_Describe what you expected instead._',
      '',
      '## Logs',
      '',
      '```json',
      JSON.stringify(
        logs
          .slice()
          .reverse()
          .map(({ id, ...rest }) => rest),
        null,
        2,
      ),
      '```',
    ];

    const text = bodyLines.join('\n');

    try {
      await navigator.clipboard.writeText(text);
    } catch {
      // Ignore clipboard errors; user can still copy manually.
    }
  };

  return (
    <section
      aria-label="Case playground"
      className="grid grid-cols-[minmax(0,2fr)_minmax(0,3fr)] gap-6 mt-7 items-stretch"
    >
      <div className="flex flex-col gap-3.5">
        <header>
          <h2 className="text-lg mb-1.5">
            Playground for this case
          </h2>
          <p className="m-0 text-sm text-text-secondary">
            Use the reported environment as a reference and record what happens in your environment
            while interacting with the editable area.
          </p>
        </header>

        <div className="rounded-xl border border-border-light bg-bg-surface p-3.5 px-3.5 flex flex-col gap-2.5">
          <div className="text-sm leading-normal">
            <div className="mb-0.5 font-semibold">
              Reported environment
            </div>
            <div>
              OS: {reportedEnv.os}
              {props.osVersion && ` ${props.osVersion}`}
            </div>
            <div>
              Device: {reportedEnv.device}
              {props.deviceVersion && ` ${props.deviceVersion}`}
            </div>
            <div>
              Browser: {reportedEnv.browser}
              {props.browserVersion && ` ${props.browserVersion}`}
            </div>
            <div>Keyboard: {reportedEnv.keyboard}</div>
          </div>

          <div className="text-sm leading-normal">
            <div className="mb-0.5 font-semibold">Your environment</div>
            <div className="grid grid-cols-[repeat(auto-fit,minmax(120px,1fr))] gap-1.5 gap-x-2">
              <label className="flex flex-col gap-0.5">
                <span>OS</span>
                <input
                  type="text"
                  value={userEnv.os}
                  onChange={(e) => setUserEnv((prev) => ({ ...prev, os: e.target.value }))}
                  className="px-1.5 py-1 rounded-md border border-border-medium text-sm"
                />
              </label>
              <label className="flex flex-col gap-0.5">
                <span>Device</span>
                <input
                  type="text"
                  value={userEnv.device}
                  onChange={(e) => setUserEnv((prev) => ({ ...prev, device: e.target.value }))}
                  className="px-1.5 py-1 rounded-md border border-border-medium text-sm"
                />
              </label>
              <label className="flex flex-col gap-0.5">
                <span>Browser</span>
                <input
                  type="text"
                  value={userEnv.browser}
                  onChange={(e) => setUserEnv((prev) => ({ ...prev, browser: e.target.value }))}
                  className="px-1.5 py-1 rounded-md border border-border-medium text-sm"
                />
              </label>
              <label className="flex flex-col gap-0.5">
                <span>Keyboard</span>
                <input
                  type="text"
                  value={userEnv.keyboard}
                  onChange={(e) => setUserEnv((prev) => ({ ...prev, keyboard: e.target.value }))}
                  className="px-1.5 py-1 rounded-md border border-border-medium text-sm"
                />
              </label>
            </div>
          </div>

          <div className="flex gap-2 mt-0.5">
            <button
              type="button"
              onClick={resetLogs}
              className="px-3 py-1 text-sm rounded-full border border-border-light bg-bg-muted cursor-pointer hover:bg-bg-surface transition-colors"
            >
              Clear logs
            </button>
            <button
              type="button"
              onClick={handleCopyIssueTemplate}
              className="px-3 py-1 text-sm rounded-full border border-text-primary bg-text-primary text-bg-surface cursor-pointer hover:opacity-90 transition-opacity"
            >
              Copy GitHub issue template (with logs)
            </button>
          </div>

          <div className="border border-border-light rounded-xl p-2.5 bg-bg-surface mt-1">
            <div
              ref={editableRef}
              contentEditable
              suppressContentEditableWarning
              onInput={(event) => {
                const target = event.target as HTMLElement;
                // Don't update state - let the DOM manage itself
                // This prevents React from re-rendering and resetting cursor position
                pushLog('input', {
                  textContent: target.textContent,
                });
              }}
              onKeyDown={(event) => {
                pushLog('keydown', {
                  key: event.key,
                  code: event.code,
                  keyCode: (event as KeyboardEvent).keyCode,
                  ctrlKey: event.ctrlKey,
                  altKey: event.altKey,
                  metaKey: event.metaKey,
                  shiftKey: event.shiftKey,
                });
              }}
              onBeforeInput={(event) => {
                pushLog('beforeinput', {
                  inputType: event.inputType,
                  data: event.data,
                });
              }}
              onCompositionStart={(event) => {
                pushLog('compositionstart', {
                  data: event.data,
                });
              }}
              onCompositionUpdate={(event) => {
                pushLog('compositionupdate', {
                  data: event.data,
                });
              }}
              onCompositionEnd={(event) => {
                pushLog('compositionend', {
                  data: event.data,
                });
              }}
              className="min-h-[140px] border border-border-medium rounded-lg p-2.5 text-sm leading-normal outline-none overflow-y-auto"
            />
          </div>
        </div>
      </div>

      <section
        aria-label="Event log"
        className="border border-border-light rounded-xl p-3 bg-bg-muted flex flex-col gap-1.5 h-full"
      >
        <header className="flex justify-between items-center">
          <div>
            <div className="text-[0.95rem] font-semibold">Event log</div>
            <div className="text-sm text-text-secondary">
              Use this log together with the case description when filing or updating an issue.
            </div>
          </div>
          <div className="text-xs text-text-muted">
            {logs.length} event{logs.length === 1 ? '' : 's'}
          </div>
        </header>

        <div className="flex-1 min-h-[180px] overflow-y-auto border border-border-light rounded-lg bg-bg-surface p-2 font-mono text-[0.78rem]">
          {logs.length === 0 ? (
            <div className="text-text-faint p-1">
              Interact with the editable area to see events here.
            </div>
          ) : (
            logs.map((entry) => (
              <div
                key={entry.id}
                className="p-1 px-1.5 rounded border border-border-light mb-1 bg-bg-surface"
              >
                <div className="flex justify-between mb-0.5">
                  <span className="font-semibold lowercase">
                    {entry.type}
                  </span>
                  <span className="text-text-faint">{entry.time}</span>
                </div>
                <pre className="m-0 whitespace-pre-wrap break-words">
                  {JSON.stringify(entry.data, null, 2)}
                </pre>
              </div>
            ))
          )}
        </div>
      </section>
    </section>
  );
}


