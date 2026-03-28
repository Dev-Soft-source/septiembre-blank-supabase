
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './styles/index.css'
import { resourceErrorHandler } from './utils/resourceErrorHandler'
import './utils/resizeObserverFix'

// Initialize global error handling for resource loading issues
resourceErrorHandler.init();

// Add structured logging for better debugging
console.log('Application starting...', {
  timestamp: new Date().toISOString(),
  environment: import.meta.env.MODE,
  version: import.meta.env.VITE_APP_VERSION || 'development'
});

// Create root with null check to ensure element exists
const rootElement = document.getElementById("root");
if (!rootElement) throw new Error("Root element not found");

createRoot(rootElement).render(<App />);
