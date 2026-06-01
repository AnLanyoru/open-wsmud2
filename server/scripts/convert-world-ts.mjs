/**
 * convert-world-ts.mjs — 将 world/ JS 文件转换为 server/res/ TS 文件
 *
 * 用法:
 *   node server/scripts/convert-world-ts.mjs cmd/action/go        # 单文件
 *   node server/scripts/convert-world-ts.mjs --batch family       # 整个文件夹
 *   node server/scripts/convert-world-ts.mjs --dry-run family     # 预览而不写入
 */
import { existsSync, mkdirSync, readFileSync, readdirSync, statSync, writeFileSync } from 'fs';
import { dirname, join, relative, resolve } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const ROOT = resolve(__dirname, '../..');
const WORLD = join(ROOT, 'world');
const RES = join(ROOT, 'server', 'res');

function convertFile(relPath, dryRun = false) {
  const src = join(WORLD, relPath + '.js');
  const dest = join(RES, relPath + '.ts');

  if (!existsSync(src)) {
    console.error(`源文件不存在: ${src}`);
    return false;
  }

  let content = readFileSync(src, 'utf-8');

  // 替换 import 路径中的 os/ → core/
  // 匹配: from "..../os/xxx" 或 from '...../os/xxx'
  const before = content;
  content = content.replace(
    /(from\s+["'](?:\.\.\/)+)os\//g,
    '$1core/',
  );

  // 同样处理 import() 动态导入
  content = content.replace(
    /(import\(["'](?:\.\.\/)+)os\//g,
    '$1core/',
  );

  if (dryRun) {
    if (content !== before) {
      console.log(`[DRY-RUN] ${relPath}.js → server/res/${relPath}.ts`);
      // 显示变更的行
      const oldLines = before.split('\n');
      const newLines = content.split('\n');
      for (let i = 0; i < oldLines.length; i++) {
        if (oldLines[i] !== newLines[i]) {
          console.log(`  - ${oldLines[i].trim()}`);
          console.log(`  + ${newLines[i].trim()}`);
        }
      }
    } else {
      console.log(`[SKIP] ${relPath}.js (无需更改)`);
    }
    return true;
  }

  // 确保目标目录存在
  const destDir = dirname(dest);
  if (!existsSync(destDir)) {
    mkdirSync(destDir, { recursive: true });
  }

  writeFileSync(dest, content, 'utf-8');
  const changed = content !== before ? ' (路径已替换)' : '';
  console.log(`转换: world/${relPath}.js → server/res/${relPath}.ts${changed}`);
  return true;
}

function walkJsFiles(dir) {
  const files = [];
  const entries = readdirSync(dir);
  for (const entry of entries) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) {
      files.push(...walkJsFiles(full));
    } else if (entry.endsWith('.js')) {
      files.push(full);
    }
  }
  return files;
}

function convertFolder(folder, dryRun = false) {
  const srcDir = join(WORLD, folder);
  if (!existsSync(srcDir)) {
    console.error(`源目录不存在: ${srcDir}`);
    return;
  }

  const jsFiles = walkJsFiles(srcDir);
  let count = 0;
  for (const file of jsFiles) {
    const relPath = relative(WORLD, file).replace(/\\/g, '/').replace(/\.js$/, '');
    if (convertFile(relPath, dryRun)) count++;
  }
  console.log(`\n${dryRun ? '[DRY-RUN] ' : ''}完成: ${count} 个文件${dryRun ? ' (预览)' : ''}`);
}

// Main
const arg = process.argv[2];
const dryRun = process.argv.includes('--dry-run');

if (!arg) {
  console.log('用法: node server/scripts/convert-world-ts.mjs <path> [--dry-run]');
  console.log('      node server/scripts/convert-world-ts.mjs --batch <folder> [--dry-run]');
  console.log('      node server/scripts/convert-world-ts.mjs --all [--dry-run]');
  console.log('');
  console.log('示例:');
  console.log('  node server/scripts/convert-world-ts.mjs cmd/action/go');
  console.log('  node server/scripts/convert-world-ts.mjs --batch family');
  console.log('  node server/scripts/convert-world-ts.mjs --batch cmd --dry-run');
  process.exit(1);
}

if (arg === '--batch') {
  const folder = process.argv[3];
  if (!folder) {
    console.error('请指定文件夹名称');
    process.exit(1);
  }
  convertFolder(folder, dryRun);
} else if (arg === '--all') {
  const worldDirs = readdirSync(WORLD).filter(d => statSync(join(WORLD, d)).isDirectory());
  for (const dir of worldDirs) {
    convertFolder(dir, dryRun);
  }
} else {
  convertFile(arg, dryRun);
}
