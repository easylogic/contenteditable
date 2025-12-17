import React, { useMemo, useState } from 'react';

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
  const [html, setHtml] = useState<string>(
    '<p>Use this editable area to reproduce the described case.</p>',
  );

  const resetLogs = () => setLogs([]);

  const pushLog = (type: string, data: Record<string, unknown>) => {
    setLogs((prev) => [
      {
        id: prev.length ? prev[prev.length - 1].id + 1 : 1,
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
      style={{
        display: 'grid',
        gridTemplateColumns: 'minmax(0, 2fr) minmax(0, 3fr)',
        gap: '1.5rem',
        marginTop: '1.75rem',
      }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
        <header>
          <h2
            style={{
              fontSize: '1.1rem',
              margin: '0 0 0.4rem 0',
            }}
          >
            Playground for this case
          </h2>
          <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            Use the reported environment as a reference and record what happens in your environment
            while interacting with the editable area.
          </p>
        </header>

        <div
          style={{
            borderRadius: '0.75rem',
            border: '1px solid var(--border-light)',
            background: 'var(--bg-surface)',
            padding: '0.8rem 0.9rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.6rem',
          }}
        >
          <div style={{ fontSize: '0.8rem', lineHeight: 1.5 }}>
            <div style={{ marginBottom: '0.2rem', fontWeight: 600 }}>
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

          <div style={{ fontSize: '0.8rem', lineHeight: 1.5 }}>
            <div style={{ marginBottom: '0.2rem', fontWeight: 600 }}>Your environment</div>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
                gap: '0.45rem 0.5rem',
              }}
            >
              <label style={{ display: 'flex', flexDirection: 'column', gap: '0.15rem' }}>
                <span>OS</span>
                <input
                  type="text"
                  value={userEnv.os}
                  onChange={(e) => setUserEnv((prev) => ({ ...prev, os: e.target.value }))}
                  style={{
                    padding: '0.25rem 0.4rem',
                    borderRadius: '0.375rem',
                    border: '1px solid var(--border-medium)',
                    fontSize: '0.8rem',
                  }}
                />
              </label>
              <label style={{ display: 'flex', flexDirection: 'column', gap: '0.15rem' }}>
                <span>Device</span>
                <input
                  type="text"
                  value={userEnv.device}
                  onChange={(e) => setUserEnv((prev) => ({ ...prev, device: e.target.value }))}
                  style={{
                    padding: '0.25rem 0.4rem',
                    borderRadius: '0.375rem',
                    border: '1px solid var(--border-medium)',
                    fontSize: '0.8rem',
                  }}
                />
              </label>
              <label style={{ display: 'flex', flexDirection: 'column', gap: '0.15rem' }}>
                <span>Browser</span>
                <input
                  type="text"
                  value={userEnv.browser}
                  onChange={(e) => setUserEnv((prev) => ({ ...prev, browser: e.target.value }))}
                  style={{
                    padding: '0.25rem 0.4rem',
                    borderRadius: '0.375rem',
                    border: '1px solid var(--border-medium)',
                    fontSize: '0.8rem',
                  }}
                />
              </label>
              <label style={{ display: 'flex', flexDirection: 'column', gap: '0.15rem' }}>
                <span>Keyboard</span>
                <input
                  type="text"
                  value={userEnv.keyboard}
                  onChange={(e) => setUserEnv((prev) => ({ ...prev, keyboard: e.target.value }))}
                  style={{
                    padding: '0.25rem 0.4rem',
                    borderRadius: '0.375rem',
                    border: '1px solid var(--border-medium)',
                    fontSize: '0.8rem',
                  }}
                />
              </label>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.2rem' }}>
            <button
              type="button"
              onClick={resetLogs}
              style={{
                padding: '0.25rem 0.75rem',
                fontSize: '0.8rem',
                borderRadius: '999px',
                border: '1px solid var(--border-light)',
                background: 'var(--bg-muted)',
                cursor: 'pointer',
              }}
            >
              Clear logs
            </button>
            <button
              type="button"
              onClick={handleCopyIssueTemplate}
              style={{
                padding: '0.25rem 0.75rem',
                fontSize: '0.8rem',
                borderRadius: '999px',
                border: '1px solid var(--text-primary)',
                background: 'var(--text-primary)',
                color: 'var(--bg-surface)',
                cursor: 'pointer',
              }}
            >
              Copy GitHub issue template (with logs)
            </button>
          </div>

          <div
            style={{
              border: '1px solid var(--border-light)',
              borderRadius: '0.75rem',
              padding: '0.7rem',
              background: 'var(--bg-surface)',
              marginTop: '0.3rem',
            }}
          >
            <div
              contentEditable
              suppressContentEditableWarning
              onInput={(event) => {
                setHtml((event.target as HTMLElement).innerHTML);
                pushLog('input', {
                  textContent: (event.target as HTMLElement).textContent,
                });
              }}
              onKeyDown={(event) => {
                pushLog('keydown', {
                  key: event.key,
                  code: event.code,
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
              style={{
                minHeight: '140px',
                border: '1px solid var(--border-medium)',
                borderRadius: '0.5rem',
                padding: '0.7rem',
                fontSize: '0.9rem',
                lineHeight: 1.5,
                outline: 'none',
                overflowY: 'auto',
              }}
              dangerouslySetInnerHTML={{ __html: html }}
            />
          </div>
        </div>
      </div>

      <section
        aria-label="Event log"
        style={{
          border: '1px solid var(--border-light)',
          borderRadius: '0.75rem',
          padding: '0.75rem',
          background: 'var(--bg-muted)',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.4rem',
        }}
      >
        <header
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <div>
            <div style={{ fontSize: '0.95rem', fontWeight: 600 }}>Event log</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
              Use this log together with the case description when filing or updating an issue.
            </div>
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            {logs.length} event{logs.length === 1 ? '' : 's'}
          </div>
        </header>

        <div
          style={{
            flex: 1,
            minHeight: '180px',
            maxHeight: '420px',
            overflowY: 'auto',
            border: '1px solid var(--border-light)',
            borderRadius: '0.5rem',
            background: 'var(--bg-surface)',
            padding: '0.5rem',
            fontFamily:
              'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
            fontSize: '0.78rem',
          }}
        >
          {logs.length === 0 ? (
            <div style={{ color: 'var(--text-faint)', padding: '0.25rem' }}>
              Interact with the editable area to see events here.
            </div>
          ) : (
            logs.map((entry) => (
              <div
                key={entry.id}
                style={{
                  padding: '0.25rem 0.35rem',
                  borderRadius: '0.35rem',
                  border: '1px solid var(--border-light)',
                  marginBottom: '0.25rem',
                  background: 'var(--bg-surface)',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    marginBottom: '0.15rem',
                  }}
                >
                  <span
                    style={{
                      fontWeight: 600,
                      textTransform: 'lowercase',
                    }}
                  >
                    {entry.type}
                  </span>
                  <span style={{ color: 'var(--text-faint)' }}>{entry.time}</span>
                </div>
                <pre
                  style={{
                    margin: 0,
                    whiteSpace: 'pre-wrap',
                    wordBreak: 'break-word',
                  }}
                >
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


