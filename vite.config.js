import { defineConfig } from 'vite';

export default defineConfig({
  root: './src/',
  publicDir: false,
  build: {
    outDir: '../www/',
    emptyOutDir: true,
    cssMinify: 'esbuild',
    rollupOptions: {
      input: {
        index: 'index.html'
      }
    }
  },
  css: {
    transformer: 'postcss'
  },
  server: {
    port: 3333,
    open: true
  }
});
