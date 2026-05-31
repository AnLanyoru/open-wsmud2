import { defineConfig } from 'vite';
import dotenv from 'dotenv';

dotenv.config();

const raw = process.env.STARTUP_URL || 'http://localhost';
const hasProtocol = raw.includes('://');
const startupUrl = `${hasProtocol ? raw : 'http://' + raw}:${process.env.WEB_PORT || '8088'}`;

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
    open: startupUrl
  }
});
