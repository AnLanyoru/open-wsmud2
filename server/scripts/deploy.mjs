/**
 * deploy.mjs — 将编译产物从 server/dist/core/ 部署到 os/
 */
import {copyFileSync, existsSync, mkdirSync, readdirSync, readFileSync, rmSync, statSync, writeFileSync} from 'fs';
import {dirname, join, relative, resolve} from 'path';
import {fileURLToPath} from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const ROOT = resolve(__dirname, '../..');
const SRC = join(ROOT, 'server', 'dist', 'core');
const DEST = join(ROOT, 'os');

function walkDir(dir) {
    const files = [];
    const entries = readdirSync(dir);
    for (const entry of entries) {
        const full = join(dir, entry);
        if (statSync(full).isDirectory()) {
            files.push(...walkDir(full));
        } else {
            files.push(full);
        }
    }
    return files;
}

/**
 * 清理目标目录中的编译残留文件（.js.map / .d.ts / .d.ts.map）
 * 这些文件不应该出现在运行时目录中
 */
function cleanStale(dir) {
    if (!existsSync(dir)) return;
    const files = walkDir(dir);
    let cleaned = 0;
    for (const f of files) {
        if (f.endsWith('.js.map') || f.endsWith('.d.ts') || f.endsWith('.d.ts.map')) {
            rmSync(f);
            cleaned++;
        }
    }
    if (cleaned > 0) {
        console.log(`  清理残留: ${cleaned} 个文件 (${dir})`);
    }
}

if (!existsSync(SRC)) {
    console.error('错误: dist/core/ 不存在，请先运行 npm run build');
    process.exit(1);
}

// 部署前清理目标目录中的编译残留
cleanStale(DEST);

const files = walkDir(SRC);
let count = 0;

for (const src of files) {
    if (!src.endsWith('.js')) continue;

    const rel = relative(SRC, src);
    const dest = join(DEST, rel);
    const destDir = dirname(dest);

    if (!existsSync(destDir)) {
        mkdirSync(destDir, {recursive: true});
    }

    copyFileSync(src, dest);
    count++;
}

console.log(`部署完成: ${count} 个文件复制到 ${DEST}`);
console.log(`  wrapper: os/util/data.js`);

// ============================================================
// Phase 2: 部署 server/dist/res/ → world/ (路径重写 core/ → os/)
// ============================================================
const RES_SRC = join(ROOT, 'server', 'dist', 'res');
const RES_DEST = join(ROOT, 'world');

if (existsSync(RES_SRC)) {
    // 部署前清理目标目录中的编译残留
    cleanStale(RES_DEST);

    const resFiles = walkDir(RES_SRC);
    let resCount = 0;

    for (const src of resFiles) {
        if (!src.endsWith('.js')) continue;

        const rel = relative(RES_SRC, src);
        const dest = join(RES_DEST, rel);
        const destDir = dirname(dest);

        if (!existsSync(destDir)) {
            mkdirSync(destDir, {recursive: true});
        }

        // 重写 import 路径: core/ → os/
        let content = readFileSync(src, 'utf-8');
        content = content.replace(/(from\s+["'](?:\.\.\/)+)core\//g, '$1os/');
        writeFileSync(dest, content, 'utf-8');
        resCount++;
    }

    console.log(`资源部署完成: ${resCount} 个文件复制到 ${RES_DEST} (路径已重写)`);
}
