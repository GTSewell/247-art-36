
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { registerServiceWorker } from './registerServiceWorker'

// Log essential startup information
console.log('Application starting...');
console.log('Environment:', import.meta.env.MODE);
console.log('PWA mode:', window.matchMedia('(display-mode: standalone)').matches ? 'standalone' : 'browser');

createRoot(document.getElementById("root")!).render(<App />);

// Register service worker for PWA capabilities
registerServiceWorker();
