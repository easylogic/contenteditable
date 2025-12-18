import React, { useState, useEffect } from 'react';

type DetectedEnv = {
  os: string;
  osName: string;
  browser: string;
  browserName: string;
};

function detectEnvironment(): DetectedEnv | null {
  if (typeof navigator === 'undefined') return null;

  const ua = navigator.userAgent;
  const platform =
    (navigator as unknown as { userAgentData?: { platform?: string } }).userAgentData?.platform ??
    navigator.platform;

  let os = '';
  let osName = '';
  if (/Win/i.test(platform) || /Windows/i.test(ua)) {
    os = 'Windows';
    osName = 'Windows';
  } else if (/Mac/i.test(platform) || /Mac OS X/i.test(ua)) {
    os = 'macOS';
    osName = 'macOS';
  } else if (/Linux/i.test(platform) || /X11/i.test(ua)) {
    os = 'Linux';
    osName = 'Linux';
  } else if (/Android/i.test(ua)) {
    os = 'Android';
    osName = 'Android';
  } else if (/iPhone|iPad|iPod/i.test(ua)) {
    os = 'iOS';
    osName = 'iOS';
  }

  let browser = '';
  let browserName = '';
  if (/Edg\//.test(ua)) {
    browser = 'Edge';
    browserName = 'Microsoft Edge';
  } else if (/Chrome\//.test(ua) && !/Edg\//.test(ua)) {
    browser = 'Chrome';
    browserName = 'Google Chrome';
  } else if (/Safari\//.test(ua) && !/Chrome\//.test(ua)) {
    browser = 'Safari';
    browserName = 'Safari';
  } else if (/Firefox\//.test(ua)) {
    browser = 'Firefox';
    browserName = 'Firefox';
  }

  if (!os && !browser) return null;

  return { os, osName, browser, browserName };
}

export function BrowserDetectionBanner() {
  const [env, setEnv] = useState<DetectedEnv | null>(null);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    // Check if already dismissed in this session
    const wasDismissed = sessionStorage.getItem('browser-banner-dismissed');
    if (wasDismissed) {
      setDismissed(true);
      return;
    }

    const detected = detectEnvironment();
    setEnv(detected);
  }, []);

  const handleDismiss = () => {
    setDismissed(true);
    sessionStorage.setItem('browser-banner-dismissed', 'true');
  };

  if (dismissed || !env || (!env.os && !env.browser)) return null;

  const filterUrl = `/cases?os=${encodeURIComponent(env.os)}&browser=${encodeURIComponent(env.browser)}`;

  return (
    <div className="flex items-center justify-center gap-4 py-2.5 px-4 bg-gradient-to-r from-accent-primary-light to-bg-surface border-b border-border-light text-sm">
      <span className="flex items-center gap-2">
        <span className="text-lg">🔍</span>
        <span className="text-text-secondary">
          Detected: <strong className="text-text-primary">{env.osName || 'Unknown OS'}</strong>
          {' + '}
          <strong className="text-text-primary">{env.browserName || 'Unknown Browser'}</strong>
        </span>
      </span>
      <a
        href={filterUrl}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-accent-primary text-white rounded-md text-xs font-medium no-underline transition-colors hover:bg-accent-primary-hover"
      >
        View cases for your environment
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M5 12h14M12 5l7 7-7 7" />
        </svg>
      </a>
      <button
        type="button"
        onClick={handleDismiss}
        className="flex items-center justify-center p-1 bg-transparent border-none cursor-pointer text-text-muted rounded transition-colors hover:text-text-primary"
        aria-label="Dismiss"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M18 6L6 18M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
}

export default BrowserDetectionBanner;

