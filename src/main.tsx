
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { registerServiceWorker } from './registerServiceWorker'
import { logger } from './utils/logger'
import { getEnvironmentInfo, isLovablePreview } from './utils/environmentDetector'
import ErrorBoundary from './components/ErrorBoundary'
import { ModeAwareProvider } from './contexts/AppModeContext'

// Log essential startup information
logger.info('Application starting...', getEnvironmentInfo());
logger.info('Environment:', import.meta.env.MODE);
logger.info('Lovable preview:', isLovablePreview());

// Disable PWA features in preview mode
if (isLovablePreview() && typeof window !== 'undefined') {
  logger.info('Running in Lovable preview mode - PWA features disabled');
  // Set a flag to disable PWA features
  (window as any).__DISABLE_PWA__ = true;
  // Expose logger for debugging
  (window as any).__logger = logger;
}

// Make sure the DOM is loaded before rendering
const renderApp = () => {
  try {
    const rootElement = document.getElementById("root");
    
    if (!rootElement) {
      logger.error("Root element not found! Trying again in 100ms...");
      setTimeout(renderApp, 100);
      return;
    }
    
    logger.info("Root element found, rendering app...");
    
    // Wrap the entire app in our error boundary and mode aware provider
    createRoot(rootElement).render(
      <ErrorBoundary>
        <ModeAwareProvider>
          <App />
        </ModeAwareProvider>
      </ErrorBoundary>
    );
    
    logger.info("App rendered successfully");
  } catch (error) {
    logger.error("Error rendering app:", error);
    // Try to display a basic error message in the DOM
    try {
      const rootElement = document.getElementById("root");
      if (rootElement) {
        rootElement.innerHTML = `
          <div style="font-family: system-ui; padding: 20px; text-align: center;">
            <h2 style="color: #e11d48;">Application Error</h2>
            <p>The application failed to start. Please try refreshing the page.</p>
            <pre style="background: #f1f5f9; padding: 10px; border-radius: 4px; text-align: left; margin-top: 20px; overflow: auto;">${String(error)}</pre>
          </div>
        `;
      }
    } catch (displayError) {
      console.error("Failed to display error message:", displayError);
    }
  }
};

// Document ready check
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    logger.info('DOM content loaded, rendering app');
    renderApp();
  });
} else {
  logger.info('DOM already ready, rendering app immediately');
  renderApp();
}

// Skip service worker in preview mode
if (!isLovablePreview()) {
  registerServiceWorker();
}
