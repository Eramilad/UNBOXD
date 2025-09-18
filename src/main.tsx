import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
// Vercel Analytics: capture page views and performance in production
import { inject } from '@vercel/analytics';

// Initialize Vercel Analytics only in production builds
inject();

createRoot(document.getElementById("root")!).render(<App />);
