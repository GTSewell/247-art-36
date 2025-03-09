
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { registerServiceWorker } from './registerServiceWorker'
import { logger } from './utils/logger'
import { getEnvironmentInfo, isLovablePreview } from './utils/environmentDetector'
import ErrorBoundary from './components/ErrorBoundary'

// Log essential startup information
logger.info('Application starting...', getEnvironmentInfo());
logger.info('Environment:', import.meta.env.MODE);
logger.info('PWA mode:', window.matchMedia('(display-mode: standalone)').matches ? 'standalone' : 'browser');
logger.info('Lovable preview:', isLovablePreview());

// Make sure the DOM is loaded before rendering
const renderApp = () => {
  const rootElement = document.getElementById("root");
  
  if (!rootElement) {
    logger.error("Root element not found! Trying again in 100ms...");
    setTimeout(renderApp, 100);
    return;
  }
  
  logger.info("Root element found, rendering app...");
  
  try {
    createRoot(rootElement).render(
      <ErrorBoundary>
        <App />
      </ErrorBoundary>
    );
    logger.info("App rendered successfully");
  } catch (error) {
    logger.error("Error rendering app:", error);
  }
};

// Start rendering process
renderApp();

// Register service worker for PWA capabilities (skipped in preview mode)
registerServiceWorker();
