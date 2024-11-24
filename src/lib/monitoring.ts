import * as Sentry from '@sentry/react';
import { BrowserTracing } from '@sentry/tracing';
import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals';

export const initMonitoring = () => {
  // Initialize Sentry
  Sentry.init({
    dsn: import.meta.env.VITE_SENTRY_DSN,
    integrations: [new BrowserTracing()],
    tracesSampleRate: 1.0,
    environment: import.meta.env.MODE,
  });

  // Report Web Vitals
  const reportWebVital = ({ name, value, id }: { name: string; value: number; id: string }) => {
    // Send to Google Analytics
    window.gtag?.('event', name, {
      event_category: 'Web Vitals',
      event_label: id,
      value: Math.round(name === 'CLS' ? value * 1000 : value),
      non_interaction: true,
    });

    // Send to Sentry
    Sentry.captureMessage(`${name}: ${value}`, {
      level: 'info',
      tags: { webVital: name },
    });
  };

  // Measure and report each vital
  getCLS(reportWebVital);
  getFID(reportWebVital);
  getFCP(reportWebVital);
  getLCP(reportWebVital);
  getTTFB(reportWebVital);
};

// Error boundary component
export const SentryErrorBoundary = Sentry.ErrorBoundary;