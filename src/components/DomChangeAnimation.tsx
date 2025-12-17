import React from 'react';

type DomStep = {
  label: string;
  html: string;
  description?: string;
};

type DomChangeAnimationProps = {
  steps: DomStep[];
};

export function DomChangeAnimation({ steps }: DomChangeAnimationProps) {
  if (!steps || steps.length < 2) return null;

  // Simple before/after comparison
  const before = steps[0];
  const after = steps.find(s => s.label.includes('❌') || s.label.includes('결과') || s.label.includes('After') || s.label.includes('Enter')) || steps[1];
  const expected = steps.find(s => s.label.includes('Expected') || s.label.includes('✅'));

  return (
    <div className="dom-compare">
      <div className="dom-compare-row">
        <div className="dom-compare-card">
          <div className="dom-compare-label">{before.label}</div>
          <div 
            className="dom-compare-preview"
            dangerouslySetInnerHTML={{ __html: before.html }}
          />
          {before.description && (
            <div className="dom-compare-desc">{before.description}</div>
          )}
        </div>

        <div className="dom-compare-arrow">→</div>

        <div className="dom-compare-card problem">
          <div className="dom-compare-label">{after.label}</div>
          <div 
            className="dom-compare-preview"
            dangerouslySetInnerHTML={{ __html: after.html }}
          />
          {after.description && (
            <div className="dom-compare-desc">{after.description}</div>
          )}
        </div>

        {expected && (
          <>
            <div className="dom-compare-vs">vs</div>
            <div className="dom-compare-card expected">
              <div className="dom-compare-label">{expected.label}</div>
              <div 
                className="dom-compare-preview"
                dangerouslySetInnerHTML={{ __html: expected.html }}
              />
              {expected.description && (
                <div className="dom-compare-desc">{expected.description}</div>
              )}
            </div>
          </>
        )}
      </div>

      <style>{`
        .dom-compare {
          margin: 1.5rem 0;
          padding: 1rem;
          background: var(--bg-muted);
          border-radius: 12px;
        }

        .dom-compare-row {
          display: flex;
          align-items: stretch;
          gap: 0.5rem;
          flex-wrap: wrap;
        }

        .dom-compare-card {
          flex: 1;
          min-width: 150px;
          background: var(--bg-surface);
          border: 2px solid var(--border-light);
          border-radius: 8px;
          overflow: hidden;
        }

        .dom-compare-card.problem {
          border-color: #ef4444;
        }

        .dom-compare-card.expected {
          border-color: #22c55e;
        }

        .dom-compare-label {
          padding: 0.4rem 0.75rem;
          font-size: 0.75rem;
          font-weight: 600;
          background: var(--bg-muted);
          border-bottom: 1px solid var(--border-light);
        }

        .dom-compare-card.problem .dom-compare-label {
          background: #fee2e2;
          color: #dc2626;
        }

        .dom-compare-card.expected .dom-compare-label {
          background: #dcfce7;
          color: #16a34a;
        }

        [data-theme="dark"] .dom-compare-card.problem .dom-compare-label {
          background: #450a0a;
          color: #fca5a5;
        }

        [data-theme="dark"] .dom-compare-card.expected .dom-compare-label {
          background: #052e16;
          color: #86efac;
        }

        .dom-compare-preview {
          padding: 1rem;
          min-height: 60px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.1rem;
        }

        .dom-compare-preview [contenteditable] {
          padding: 0.3rem 0.5rem;
          border: 1px dashed var(--border-medium);
          border-radius: 4px;
          background: var(--bg-muted);
        }

        .dom-compare-preview span[style*="underline"] {
          background: #fef08a;
          padding: 0 2px;
        }

        .dom-compare-desc {
          padding: 0.5rem 0.75rem;
          font-size: 0.8rem;
          color: var(--text-muted);
          border-top: 1px solid var(--border-light);
          text-align: center;
        }

        .dom-compare-arrow,
        .dom-compare-vs {
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.25rem;
          font-weight: 700;
          color: var(--text-muted);
          padding: 0 0.25rem;
        }

        .dom-compare-vs {
          font-size: 0.75rem;
          text-transform: uppercase;
        }

        @media (max-width: 640px) {
          .dom-compare-row {
            flex-direction: column;
          }
          .dom-compare-arrow,
          .dom-compare-vs {
            transform: rotate(90deg);
            padding: 0.5rem 0;
          }
        }
      `}</style>
    </div>
  );
}

export default DomChangeAnimation;
