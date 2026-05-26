import { defineConfig } from 'vite';

export default defineConfig({
  root: './src/',
  publicDir: false,
  build: {
    outDir: '../www/',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        index: 'index.html'
      }
    }
  },
  server: {
    port: 3333,
    open: true
  }
});
