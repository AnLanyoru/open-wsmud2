/**
 * deploy.mjs — 将编译产物从 server/dist/ 部署到项目根
 *
 * 保持 core/ res/ 目录名不变，import 路径天然正确，无需重写。
 */
import {copyFileSync, existsSync, mkdirSync, readdirSync, rmSync, statSync} from 'fs';
import {dirname, join, relative, resolve} from 'path';
import {fileURLToPath} from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const ROOT = resolve(__dirname, '../..');
const SRC_CORE = join(ROOT, 'server', 'dist', 'core');
const SRC_RES = join(ROOT, 'server', 'dist', 'res');
const DEST_CORE = join(ROOT, 'core');
const DEST_RES = join(ROOT, 'res');

function walkDir(dir) {
    const files = [];
    if (!existsSync(dir)) return files;
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
    if (cleaned > 0) console.log(`  清理残留: ${cleaned} 个文件 (${dir})`);
}

if (!existsSync(SRC_CORE)) {
    console.error('错误: server/dist/core/ 不存在，请先编译');
    process.exit(1);
}

// Phase 1: core/
cleanStale(DEST_CORE);
const coreFiles = walkDir(SRC_CORE);
let count = 0;
for (const src of coreFiles) {
    if (!src.endsWith('.js')) continue;
    const rel = relative(SRC_CORE, src);
    const dest = join(DEST_CORE, rel);
    const destDir = dirname(dest);
    if (!existsSync(destDir)) mkdirSync(destDir, {recursive: true});
    copyFileSync(src, dest);
    count++;
}
console.log(`部署 core/: ${count} 个文件`);

// Phase 2: res/ (保持原名，不重写路径)
if (existsSync(SRC_RES)) {
    cleanStale(DEST_RES);
    const resFiles = walkDir(SRC_RES);
    let resCount = 0;
    for (const src of resFiles) {
        if (!src.endsWith('.js')) continue;
        const rel = relative(SRC_RES, src);
        const dest = join(DEST_RES, rel);
        const destDir = dirname(dest);
        if (!existsSync(destDir)) mkdirSync(destDir, {recursive: true});
        copyFileSync(src, dest);
        resCount++;
    }
    console.log(`部署 res/: ${resCount} 个文件`);
}

// Phase 3: 清理 dist/
const DIST_DIR = join(ROOT, 'server', 'dist');
if (existsSync(DIST_DIR)) {
    rmSync(DIST_DIR, {recursive: true});
    console.log(`清理: ${DIST_DIR}`);
}
