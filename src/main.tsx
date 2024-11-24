import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { Profiler } from 'react';
import App from './App.tsx';
import './index.css';
import './i18n';
import { initGA } from './lib/analytics';
import { initMonitoring } from './lib/monitoring';

// Initialize analytics and monitoring
initGA();
initMonitoring();

// Add axe-core in development
if (process.env.NODE_ENV === 'development') {
  const axe = await import('@axe-core/react');
  axe.default(React, createRoot, 1000);
}

function onRenderCallback(
  id: string,
  phase: "mount" | "update",
  actualDuration: number,
  baseDuration: number,
  startTime: number,
  commitTime: number
) {
  // Log only slow renders (> 16ms)
  if (actualDuration > 16) {
    console.log(`[Profiler] ${id}:
      Phase: ${phase}
      Actual Duration: ${actualDuration.toFixed(2)}ms
      Base Duration: ${baseDuration.toFixed(2)}ms
      Start Time: ${startTime.toFixed(2)}ms
      Commit Time: ${commitTime.toFixed(2)}ms
    `);
  }
}

createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Profiler id="App" onRender={onRenderCallback}>
      <HelmetProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </HelmetProvider>
    </Profiler>
  </React.StrictMode>
);