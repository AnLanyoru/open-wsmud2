/**
 * deploy.mjs — 将编译产物从 server/dist/core/ 部署到 os/
 */
import { copyFileSync, existsSync, mkdirSync, readdirSync, statSync, writeFileSync } from 'fs';
import { dirname, join, relative, resolve } from 'path';
import { fileURLToPath } from 'url';

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

if (!existsSync(SRC)) {
  console.error('错误: dist/core/ 不存在，请先运行 npm run build');
  process.exit(1);
}

const files = walkDir(SRC);
let count = 0;

for (const src of files) {
  if (!src.endsWith('.js') && !src.endsWith('.js.map')) continue;

  const rel = relative(SRC, src);
  const dest = join(DEST, rel);
  const destDir = dirname(dest);

  if (!existsSync(destDir)) {
    mkdirSync(destDir, { recursive: true });
  }

  copyFileSync(src, dest);
  count++;
}

// 创建 os/util/data.js wrapper (world/ 模块通过此文件导入 DB)
const dataJs = join(DEST, 'util', 'data.js');
mkdirSync(dirname(dataJs), { recursive: true });
writeFileSync(dataJs, "export { default } from '../db.js';\n", 'utf-8');

console.log(`部署完成: ${count} 个文件复制到 ${DEST}`);
console.log(`  wrapper: os/util/data.js`);
