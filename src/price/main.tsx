import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { LangProvider } from '../i18n';
import { Price } from './Price';
import '../styles.css';
import './price.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <LangProvider>
      <Price />
    </LangProvider>
  </StrictMode>,
);
