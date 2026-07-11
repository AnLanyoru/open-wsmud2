import {defineConfig} from 'vite';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import zlib from 'zlib';
import { fileURLToPath } from 'url';

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const RES_DIR = path.join(__dirname, 'res');
const WWW_DIR = path.join(__dirname, 'www');

const raw = process.env.STARTUP_URL || 'http://localhost';
const hasProtocol = raw.includes('://');
const startupUrl = `${hasProtocol ? raw : 'http://' + raw}:${process.env.WEB_PORT || '8088'}`;

/**
 * Vite 插件：构建完成后将 res/templates-data.json + res/parts-table.json
 * 合并 → gzip 压缩 → www/tmpl_<hash>.gz + www/tmpl-hash.json
 * 在 emptyOutDir 清空 www/ 之后执行，避免被清空。
 */
function tmplGzPlugin() {
    return {
        name: 'tmpl-gz',
        // closeBundle 在 emptyOutDir 之后、vite 写入产物之后执行
        apply: 'build',
        closeBundle() {
            const tmplPath = path.join(RES_DIR, 'templates-data.json');
            const partsPath = path.join(RES_DIR, 'parts-table.json');
            if (!fs.existsSync(tmplPath) || !fs.existsSync(partsPath)) {
                console.warn('[tmpl-gz] res/templates-data.json 或 res/parts-table.json 不存在，跳过');
                return;
            }

            const tmplData = JSON.parse(fs.readFileSync(tmplPath, 'utf8'));
            const partsData = JSON.parse(fs.readFileSync(partsPath, 'utf8'));

            // 合并两个 JSON → gzip 压缩
            const combined = JSON.stringify({ templates: tmplData, parts: partsData });
            const gzipped = zlib.gzipSync(combined);
            const hash = crypto.createHash('sha256').update(gzipped).digest('hex').slice(0, 12);
            const gzFileName = `tmpl_${hash}.gz`;

            // 确保 www/ 存在
            if (!fs.existsSync(WWW_DIR)) fs.mkdirSync(WWW_DIR, { recursive: true });

            // 清理旧的 tmpl_*.gz 文件
            for (const oldFile of fs.readdirSync(WWW_DIR)) {
                if (/^tmpl_[0-9a-f]+\.gz$/.test(oldFile) && oldFile !== gzFileName) {
                    fs.unlinkSync(path.join(WWW_DIR, oldFile));
                }
            }

            fs.writeFileSync(path.join(WWW_DIR, gzFileName), gzipped);
            fs.writeFileSync(
                path.join(WWW_DIR, 'tmpl-hash.json'),
                JSON.stringify({ hash, file: gzFileName })
            );
            console.log(`[tmpl-gz] Generated www/${gzFileName} (${(gzipped.length / 1024).toFixed(1)}KB)`);
            console.log('[tmpl-gz] Generated www/tmpl-hash.json');
        },
    };
}

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
    plugins: [tmplGzPlugin()],
    server: {
        port: 3333,
        open: startupUrl
    }
});
