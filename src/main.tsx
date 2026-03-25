import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import '@/styles/fonts.css';
import '@/styles/animations.css';
import '@/styles/globals.css';
import { App } from '@/app/App';

const rootElement = document.getElementById('root');
if (!rootElement) throw new Error('No se encontró el elemento #root en el DOM');

createRoot(rootElement).render(
  <StrictMode>
    <App />
  </StrictMode>
);
