import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { LangProvider } from '../i18n';
import { Cases } from './Cases';
import '../styles.css';
import './cases.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <LangProvider>
      <Cases />
    </LangProvider>
  </StrictMode>,
);
