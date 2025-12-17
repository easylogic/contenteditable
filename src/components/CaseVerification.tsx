import React, { useState, useEffect } from 'react';

type CaseVerificationProps = {
  caseId: string;
  caseTitle: string;
  os: string;
  browser: string;
  status: string;
};

type VerificationData = {
  verifiedAt: string;
  environment: {
    userAgent: string;
  };
};

const STORAGE_KEY = 'contenteditable-verifications';
const GITHUB_REPO = 'barocss/contenteditable';

export function CaseVerification({
  caseId,
  caseTitle,
  os,
  browser,
  status,
}: CaseVerificationProps) {
  const [verification, setVerification] = useState<VerificationData | null>(null);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const verifications = JSON.parse(stored) as Record<string, VerificationData>;
        if (verifications[caseId]) {
          setVerification(verifications[caseId]);
        }
      } catch {
        // Invalid data
      }
    }
  }, [caseId]);

  const handleVerify = () => {
    const data: VerificationData = {
      verifiedAt: new Date().toISOString(),
      environment: {
        userAgent: navigator.userAgent,
      },
    };

    const stored = localStorage.getItem(STORAGE_KEY);
    const verifications = stored ? JSON.parse(stored) : {};
    verifications[caseId] = data;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(verifications));

    setVerification(data);
    setShowConfirmDialog(false);
  };

  const handleUnverify = () => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const verifications = JSON.parse(stored);
      delete verifications[caseId];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(verifications));
    }
    setVerification(null);
    setShowDetails(false);
  };

  const generateGitHubIssueUrl = () => {
    const title = `[Verification] ${caseId}: ${caseTitle}`;
    const body = `## Case Verification Report

**Case ID:** \`${caseId}\`
**Case Title:** ${caseTitle}
**Original Environment:** ${os} + ${browser}

---

### My Environment
- **OS:** [Your OS]
- **OS Version:** [Version]
- **Browser:** [Your Browser]
- **Browser Version:** [Version]

### Reproduction Result
- [ ] ✅ I can reproduce the issue as described
- [ ] ❌ I cannot reproduce the issue
- [ ] ⚠️ Behavior differs from description

### Additional Notes
[Add any observations, screenshots, or details here]

---
*Verification submitted via contenteditable.lab*
`;

    return `https://github.com/${GITHUB_REPO}/issues/new?title=${encodeURIComponent(title)}&body=${encodeURIComponent(body)}&labels=verification`;
  };

  const formatDate = (isoString: string) => {
    const date = new Date(isoString);
    return date.toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="verification-container">
      {verification ? (
        <div className="verification-badge verified">
          <button
            type="button"
            className="verification-main"
            onClick={() => setShowDetails(!showDetails)}
          >
            <span className="verification-icon">✓</span>
            <span className="verification-text">
              You verified this case
            </span>
            <span className="verification-date">
              {formatDate(verification.verifiedAt)}
            </span>
          </button>

          {showDetails && (
            <div className="verification-details">
              <p className="detail-label">Verified with:</p>
              <p className="detail-value">{verification.environment.userAgent}</p>
              <div className="detail-actions">
                <button
                  type="button"
                  className="btn-unverify"
                  onClick={handleUnverify}
                >
                  Remove verification
                </button>
                <a
                  href={generateGitHubIssueUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-github"
                >
                  Share on GitHub
                </a>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="verification-badge not-verified">
          <button
            type="button"
            className="verification-main"
            onClick={() => setShowConfirmDialog(true)}
          >
            <span className="verification-icon">○</span>
            <span className="verification-text">
              Can you reproduce this case?
            </span>
          </button>

          {showConfirmDialog && (
            <>
              <div
                className="dialog-backdrop"
                onClick={() => setShowConfirmDialog(false)}
              />
              <div className="confirm-dialog">
                <h4>Confirm Verification</h4>
                <p>
                  By verifying, you confirm that you tested this case in <strong>{os}</strong> + <strong>{browser}</strong> (or similar) and observed the described behavior.
                </p>
                <p className="dialog-note">
                  This verification is stored locally. For official confirmation, share it on GitHub.
                </p>
                <div className="dialog-actions">
                  <button
                    type="button"
                    className="btn-cancel"
                    onClick={() => setShowConfirmDialog(false)}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    className="btn-verify"
                    onClick={handleVerify}
                  >
                    ✓ I verified this
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      )}

      <style>{`
        .verification-container {
          margin-top: 1.25rem;
        }

        .verification-badge {
          background: var(--bg-surface);
          border: 1px solid var(--border-light);
          border-radius: 10px;
          overflow: hidden;
        }

        .verification-badge.verified {
          border-color: var(--status-confirmed);
        }

        .verification-main {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          width: 100%;
          padding: 0.75rem 1rem;
          background: transparent;
          border: none;
          cursor: pointer;
          font-size: 0.85rem;
          color: var(--text-secondary);
          text-align: left;
          transition: background 0.15s;
        }

        .verification-main:hover {
          background: var(--bg-muted);
        }

        .verified .verification-main {
          background: var(--status-confirmed-light);
        }

        .verified .verification-main:hover {
          background: #c6f6d5;
        }

        [data-theme="dark"] .verified .verification-main:hover {
          background: #065f46;
        }

        .verification-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 22px;
          height: 22px;
          border-radius: 50%;
          font-size: 0.75rem;
          font-weight: 700;
        }

        .verified .verification-icon {
          background: var(--status-confirmed);
          color: white;
        }

        .not-verified .verification-icon {
          background: var(--bg-muted);
          color: var(--text-muted);
          border: 1px solid var(--border-light);
        }

        .verification-text {
          flex: 1;
          color: var(--text-primary);
          font-weight: 500;
        }

        .verification-date {
          font-size: 0.75rem;
          color: var(--text-muted);
        }

        .verification-details {
          padding: 1rem;
          border-top: 1px solid var(--border-light);
          background: var(--bg-muted);
        }

        .detail-label {
          margin: 0 0 0.25rem;
          font-size: 0.75rem;
          color: var(--text-muted);
        }

        .detail-value {
          margin: 0 0 0.75rem;
          font-size: 0.8rem;
          color: var(--text-secondary);
          word-break: break-all;
        }

        .detail-actions {
          display: flex;
          gap: 0.5rem;
        }

        .btn-unverify {
          padding: 0.4rem 0.75rem;
          background: transparent;
          border: 1px solid var(--border-light);
          border-radius: 6px;
          font-size: 0.8rem;
          color: var(--text-muted);
          cursor: pointer;
          transition: all 0.15s;
        }

        .btn-unverify:hover {
          border-color: #ef4444;
          color: #ef4444;
        }

        .btn-github {
          display: inline-flex;
          align-items: center;
          gap: 0.35rem;
          padding: 0.4rem 0.75rem;
          background: #24292e;
          border: none;
          border-radius: 6px;
          font-size: 0.8rem;
          color: white;
          text-decoration: none;
          cursor: pointer;
          transition: background 0.15s;
        }

        .btn-github:hover {
          background: #1a1e22;
          color: white;
        }

        .dialog-backdrop {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.4);
          z-index: 100;
        }

        .confirm-dialog {
          position: fixed;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 90%;
          max-width: 400px;
          background: var(--bg-surface);
          border: 1px solid var(--border-light);
          border-radius: 12px;
          padding: 1.25rem;
          z-index: 101;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.2);
        }

        .confirm-dialog h4 {
          margin: 0 0 0.75rem;
          font-size: 1rem;
        }

        .confirm-dialog p {
          margin: 0 0 0.75rem;
          font-size: 0.875rem;
          color: var(--text-secondary);
          line-height: 1.5;
        }

        .dialog-note {
          font-size: 0.8rem !important;
          color: var(--text-muted) !important;
          padding: 0.5rem 0.75rem;
          background: var(--bg-muted);
          border-radius: 6px;
        }

        .dialog-actions {
          display: flex;
          justify-content: flex-end;
          gap: 0.5rem;
          margin-top: 1rem;
        }

        .btn-cancel {
          padding: 0.5rem 1rem;
          background: var(--bg-muted);
          border: 1px solid var(--border-light);
          border-radius: 6px;
          font-size: 0.85rem;
          color: var(--text-secondary);
          cursor: pointer;
          transition: all 0.15s;
        }

        .btn-cancel:hover {
          background: var(--bg-surface);
          border-color: var(--border-medium);
        }

        .btn-verify {
          padding: 0.5rem 1rem;
          background: var(--status-confirmed);
          border: none;
          border-radius: 6px;
          font-size: 0.85rem;
          font-weight: 500;
          color: white;
          cursor: pointer;
          transition: background 0.15s;
        }

        .btn-verify:hover {
          background: #059669;
        }
      `}</style>
    </div>
  );
}

export default CaseVerification;

