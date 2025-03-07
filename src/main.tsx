
import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { registerServiceWorker } from './registerServiceWorker';

// Enhance error handling with detailed logging
console.log('Application initialization started');

// Fix React initialization with explicit React import and more robust error handling
const rootElement = document.getElementById('root');

if (!rootElement) {
  console.error('Failed to find the root element. The app cannot be initialized.');
} else {
  try {
    console.log('Found root element, creating React root');
    const root = createRoot(rootElement);
    
    console.log('Rendering React application');
    root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
    
    console.log('React app successfully mounted to DOM');
  } catch (error) {
    console.error('Failed to render React application:', error);
    // Display fallback error UI
    rootElement.innerHTML = `
      <div style="padding: 20px; text-align: center; font-family: sans-serif;">
        <h2>Application Error</h2>
        <p>We're sorry, but the application failed to load properly. Please try refreshing the page.</p>
        <p>Error details: ${error instanceof Error ? error.message : 'Unknown error'}</p>
      </div>
    `;
  }
}

// Register service worker for PWA capabilities
registerServiceWorker();
