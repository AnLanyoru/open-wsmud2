/**
 * 为 server/res/skill/ 下所有未导入 CHARACTER 的 .ts 文件自动添加 import。
 * 运行: node tools/add-character-import.js
 */
const fs = require("fs");
const path = require("path");

const SKILL_DIR = path.resolve(__dirname, "../server/res/skill");
const TARGET = path.resolve(__dirname, "../server/core/char/character.js");
const IMPORT_LINE = (rel) => `import type { CHARACTER } from "${rel.replace(/\\/g, "/")}";`;

function findTsFiles(dir) {
  const results = [];
  const list = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of list) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results.push(...findTsFiles(full));
    } else if (entry.isFile() && entry.name.endsWith(".ts")) {
      results.push(full);
    }
  }
  return results;
}

function alreadyImportsCharacter(content) {
  return /\bCHARACTER\b/.test(content) && /import\s+.*CHARACTER/.test(content);
}

function processFile(filePath) {
  let content = fs.readFileSync(filePath, "utf-8");
  if (alreadyImportsCharacter(content)) return null;

  // 计算从该文件到 TARGET 的相对路径
  const fileDir = path.dirname(filePath);
  let rel = path.relative(fileDir, TARGET);
  // Windows 风格的路径分隔符转 POSIX
  rel = rel.replace(/\\/g, "/");

  const lines = content.split("\n");

  // 找到最后一条 import 语句所在行号 (0-based)
  let lastImportLine = -1;
  for (let i = 0; i < lines.length; i++) {
    if (/^\s*import\s+/.test(lines[i])) {
      lastImportLine = i;
    }
  }

  // 在最后一条 import 后面插入
  const newLine = IMPORT_LINE(rel);
  lines.splice(lastImportLine + 1, 0, newLine);
  fs.writeFileSync(filePath, lines.join("\n"), "utf-8");
  return newLine;
}

const files = findTsFiles(SKILL_DIR);
console.log(`找到 ${files.length} 个 .ts 文件`);

let added = 0;
for (const f of files) {
  const result = processFile(f);
  if (result) {
    console.log(`  ✓ ${path.relative(__dirname, f)} → ${result}`);
    added++;
  }
}

console.log(`\n完成: 为 ${added} 个文件添加了 CHARACTER 导入`);
