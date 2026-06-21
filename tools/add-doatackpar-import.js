/**
 * 为 server/res/skill/ 下所有 .ts 文件的 import type { CHARACTER } 行追加 DoAttackPar。
 * （跳过已有 DoAttackPar 的文件）
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const SKILL_DIR = path.resolve(__dirname, "../server/res/skill");

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

function alreadyHasDoAttackPar(content) {
  return /import\s+.*\bDoAttackPar\b/.test(content);
}

function processFile(filePath) {
  let content = fs.readFileSync(filePath, "utf-8");
  if (alreadyHasDoAttackPar(content)) return null;

  const lines = content.split("\n");
  for (let i = 0; i < lines.length; i++) {
    if (/^\s*import\s+(type\s+)?\{[^}]*\bCHARACTER\b[^}]*\}\s+from\s+/.test(lines[i])) {
      lines[i] = lines[i].replace(/\bCHARACTER\b/, "CHARACTER, DoAttackPar");
      fs.writeFileSync(filePath, lines.join("\n"), "utf-8");
      return true;
    }
  }
  return null;
}

const files = findTsFiles(SKILL_DIR);
console.log(`扫描 ${files.length} 个文件...`);

let added = 0;
for (const f of files) {
  if (processFile(f)) {
    console.log(`  ✓ ${path.relative(__dirname, f)}`);
    added++;
  }
}

console.log(`\n完成: 为 ${added} 个文件追加了 DoAttackPar 导入`);
