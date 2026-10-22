import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// relative base: the build works both on lovlydev.github.io and on /<repo>/ project pages
export default defineConfig({
  base: './',
  plugins: [react()],
  // two pages; lab.html is a dev-only playground and stays out of the build
  build: { rollupOptions: { input: { main: 'index.html', price: 'price.html' } } },
});
