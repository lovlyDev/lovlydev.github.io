import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// relative base: the build works both on lovlydev.github.io and on /<repo>/ project pages
export default defineConfig({
  base: './',
  plugins: [react()],
});
