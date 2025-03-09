
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { registerServiceWorker } from './registerServiceWorker'

// Log essential startup information
console.log('Application starting...');
console.log('Environment:', import.meta.env.MODE);
console.log('PWA mode:', window.matchMedia('(display-mode: standalone)').matches ? 'standalone' : 'browser');

// Make sure the DOM is loaded before rendering
const renderApp = () => {
  const rootElement = document.getElementById("root");
  
  if (!rootElement) {
    console.error("Root element not found! Trying again in 100ms...");
    setTimeout(renderApp, 100);
    return;
  }
  
  console.log("Root element found, rendering app...");
  
  try {
    createRoot(rootElement).render(<App />);
    console.log("App rendered successfully");
  } catch (error) {
    console.error("Error rendering app:", error);
  }
};

// Start rendering process
renderApp();

// Register service worker for PWA capabilities
registerServiceWorker();
