import React, { useEffect, useMemo, useState } from 'react';

type Scenario = {
  id: string;
  os: string;
  device: string;
  browser: string;
  keyboard: string;
  caseTitle: string;
  description: string;
  reproductionSteps: string[];
  initialHtml: string;
};

type LogEntry = {
  id: number;
  time: string;
  type: string;
  data: Record<string, unknown>;
};

const initialScenarios: Scenario[] = [
  {
    id: 'ce-0001',
    os: 'Any',
    device: 'Desktop or Laptop',
    browser: 'Chrome',
    keyboard: 'US',
    caseTitle: 'Baseline typing and composition in a simple contenteditable region',
    description:
      'Use this scenario to observe the event order for basic typing, backspace, arrow keys, and IME composition in a plain contenteditable region.',
    reproductionSteps: [
      'Focus the editable area.',
      'Type ASCII text and observe keydown, beforeinput, and input events.',
      'Switch to an IME and type composed characters.',
      'Use Backspace and the arrow keys to move the caret.',
    ],
    initialHtml:
      '<p>Try typing here. Logs will appear on the right.</p><p>Use different OS, devices, browsers, and keyboard layouts in the real world. Record what actually happens as issues.</p>',
  },
  {
    id: 'ce-0002',
    os: 'Windows',
    device: 'Desktop or Laptop',
    browser: 'Chrome',
    keyboard: 'Korean (IME)',
    caseTitle: 'Composition is cancelled when pressing Enter inside contenteditable',
    description:
      'Use this scenario to inspect how Korean IME composition behaves when Enter is pressed before the composition is finalized.',
    reproductionSteps: [
      'Focus the editable area.',
      'Activate a Korean IME.',
      'Start composing text but do not finalize the composition.',
      'Press Enter and check whether the last composed syllable is preserved.',
    ],
    initialHtml:
      '<p>Use a Korean IME here. Start composing text and press Enter before composition finishes.</p>',
  },
  {
    id: 'ce-0003',
    os: 'macOS',
    device: 'Laptop',
    browser: 'Safari',
    keyboard: 'US',
    caseTitle: 'Pressing Enter inserts two line breaks in contenteditable',
    description:
      'Use this scenario to examine how Enter inserts line breaks and how the browser structures the DOM when extra blank lines appear.',
    reproductionSteps: [
      'Focus the editable area.',
      'Type a short word.',
      'Press Enter once.',
      'Type another word and compare the visual gap and DOM structure.',
    ],
    initialHtml:
      '<p>Type a short word, press Enter once, and then type another word. Inspect the visual gap and DOM.</p>',
  },
];

const formatTime = (d: Date) =>
  `${d.toISOString().split('T')[1]?.replace('Z', '') ?? ''}`;

export function Playground() {
  const [selectedId, setSelectedId] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const scenarioParam = params.get('scenario');
      if (scenarioParam) {
        return scenarioParam;
      }
    }
    return initialScenarios[0]?.id ?? '';
  });
  const [logs, setLogs] = useState<LogEntry[]>([]);

  const scenario = useMemo(
    () => initialScenarios.find((s) => s.id === selectedId) ?? initialScenarios[0],
    [selectedId],
  );

  const [html, setHtml] = useState<string>(scenario.initialHtml);

  const resetLogs = () => setLogs([]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const scenarioParam = params.get('scenario');
      if (scenarioParam && scenarioParam !== selectedId) {
        const found = initialScenarios.find((s) => s.id === scenarioParam);
        if (found) {
          setSelectedId(scenarioParam);
          setHtml(found.initialHtml);
          setLogs([]);
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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

  const handleScenarioChange = (id: string) => {
    const next = initialScenarios.find((s) => s.id === id);
    setSelectedId(id);
    if (next) {
      setHtml(next.initialHtml);
    }
    resetLogs();
  };

  const handleCopyIssueTemplate = async () => {
    const metadata = {
      scenarioId: scenario.id,
      os: scenario.os,
      device: scenario.device,
      browser: scenario.browser,
      keyboard: scenario.keyboard,
      caseTitle: scenario.caseTitle,
    };

    const bodyLines = [
      '# contenteditable case report',
      '',
      '## Scenario',
      `- scenarioId: \`${metadata.scenarioId}\``,
      `- os: \`${metadata.os}\``,
      `- device: \`${metadata.device}\``,
      `- browser: \`${metadata.browser}\``,
      `- keyboard: \`${metadata.keyboard}\``,
      `- case: \`${metadata.caseTitle}\``,
      '',
      '## Reproduction steps',
      ...scenario.reproductionSteps.map((step, index) => `${index + 1}. ${step}`),
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
      '',
      '## Environment notes',
      '',
      '- OS version:',
      '- Device model:',
      '- Browser version:',
      '- Keyboard layout and input method:',
    ];

    const text = bodyLines.join('\n');

    try {
      await navigator.clipboard.writeText(text);
      // No user-facing notification here to avoid assumptions about UI style.
    } catch {
      // Swallow clipboard errors; user can still select and copy manually.
    }
  };

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'minmax(0, 2fr) minmax(0, 3fr)',
        gap: '1.5rem',
        alignItems: 'stretch',
      }}
    >
      <section style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <header style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 600 }}>contenteditable playground</h1>
          <p style={{ fontSize: '0.9rem', color: '#555' }}>
            Combine your real OS, device, browser, and keyboard. Use this page only as a
            controlled surface to inspect and record event behavior.
          </p>
        </header>

        <div
          style={{
            border: '1px solid #ddd',
            borderRadius: '0.75rem',
            padding: '0.75rem 0.75rem 0.5rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.75rem',
          }}
        >
          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            <label style={{ fontSize: '0.85rem', fontWeight: 500 }}>
              Scenario
              <select
                value={scenario.id}
                onChange={(e) => handleScenarioChange(e.target.value)}
                style={{
                  marginLeft: '0.5rem',
                  padding: '0.25rem 0.5rem',
                  fontSize: '0.85rem',
                }}
              >
                {initialScenarios.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.caseTitle}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div style={{ fontSize: '0.8rem', lineHeight: 1.5 }}>
            <div style={{ marginBottom: '0.25rem', fontWeight: 500 }}>Metadata</div>
            <div>OS: {scenario.os}</div>
            <div>Device: {scenario.device}</div>
            <div>Browser: {scenario.browser}</div>
            <div>Keyboard: {scenario.keyboard}</div>
          </div>

          <div style={{ fontSize: '0.8rem', lineHeight: 1.5 }}>
            <div style={{ marginBottom: '0.25rem', fontWeight: 500 }}>Description</div>
            <div>{scenario.description}</div>
          </div>

          <div style={{ fontSize: '0.8rem', lineHeight: 1.5 }}>
            <div style={{ marginBottom: '0.25rem', fontWeight: 500 }}>
              Suggested reproduction steps
            </div>
            <ol style={{ paddingLeft: '1.25rem', margin: 0 }}>
              {scenario.reproductionSteps.map((step) => (
                <li key={step}>{step}</li>
              ))}
            </ol>
          </div>

          <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.25rem' }}>
            <button
              type="button"
              onClick={resetLogs}
              style={{
                padding: '0.25rem 0.75rem',
                fontSize: '0.8rem',
                borderRadius: '999px',
                border: '1px solid #ddd',
                background: '#fafafa',
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
                border: '1px solid #111',
                background: '#111',
                color: '#fff',
                cursor: 'pointer',
              }}
            >
              Copy GitHub issue template (with logs)
            </button>
          </div>
        </div>

        <div
          style={{
            border: '1px solid #ddd',
            borderRadius: '0.75rem',
            padding: '0.75rem',
            background: '#fff',
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
              minHeight: '160px',
              border: '1px solid #ccc',
              borderRadius: '0.5rem',
              padding: '0.75rem',
              fontSize: '0.9rem',
              lineHeight: 1.5,
              outline: 'none',
              overflowY: 'auto',
            }}
            dangerouslySetInnerHTML={{ __html: html }}
          />
        </div>
      </section>

      <section
        aria-label="Event log"
        style={{
          border: '1px solid #ddd',
          borderRadius: '0.75rem',
          padding: '0.75rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.5rem',
          background: '#fafafa',
        }}
      >
        <header
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '0.25rem',
          }}
        >
          <div>
            <div style={{ fontSize: '0.95rem', fontWeight: 600 }}>Event log</div>
            <div style={{ fontSize: '0.8rem', color: '#555' }}>
              Newest events appear at the top. Use this when preparing GitHub issues.
            </div>
          </div>
          <div style={{ fontSize: '0.75rem', color: '#777' }}>
            {logs.length} event{logs.length === 1 ? '' : 's'}
          </div>
        </header>

        <div
          style={{
            flex: 1,
            minHeight: '180px',
            maxHeight: '420px',
            overflowY: 'auto',
            border: '1px solid #e0e0e0',
            borderRadius: '0.5rem',
            background: '#fff',
            padding: '0.5rem',
            fontFamily:
              'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
            fontSize: '0.78rem',
          }}
        >
          {logs.length === 0 ? (
            <div style={{ color: '#999', padding: '0.25rem' }}>
              Interact with the editable area to see events here.
            </div>
          ) : (
            logs.map((entry) => (
              <div
                key={entry.id}
                style={{
                  padding: '0.25rem 0.35rem',
                  borderRadius: '0.35rem',
                  border: '1px solid #f0f0f0',
                  marginBottom: '0.25rem',
                  background: '#fcfcfc',
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
                  <span style={{ color: '#999' }}>{entry.time}</span>
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
    </div>
  );
}


