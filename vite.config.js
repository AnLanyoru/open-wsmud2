import {defineConfig} from 'vite';
import dotenv from 'dotenv';

dotenv.config();

const raw = process.env.STARTUP_URL || 'http://localhost';
const hasProtocol = raw.includes('://');
const startupUrl = `${hasProtocol ? raw : 'http://' + raw}:${process.env.WEB_PORT || '8088'}`;

export default defineConfig({
    root: './web/',
    publicDir: false,
    build: {
        outDir: '../www/',
        emptyOutDir: true,
        cssMinify: 'esbuild',
        rollupOptions: {
            input: {
                index: 'index.html'
            },
            output: {
                entryFileNames: 'assets/ws.js',
                chunkFileNames: 'assets/ws-[name].js',
                assetFileNames: (assetInfo) => {
                    const name = assetInfo.name || '';
                    if (name.endsWith('.css')) return 'assets/ws.css';
                    if (name.endsWith('.png')) return 'assets/icon.png';
                    return 'assets/[name]-[hash][extname]';
                }
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
