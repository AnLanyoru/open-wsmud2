/**
 * 给 dodge_actions / parry_actions / miss_msg / parry_msg 的字符串末尾加 \n
 * 用法: node scripts/fix-action-newlines.mjs [file...]
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');

function processFile(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');
    let changed = false;
    let count = 0;

    // 匹配数组或属性值中的字符串字面量（在 dodge/parry/miss 相关的赋值后）
    // 策略: 在 = [ ... ] 块内，给每个不以 \n 结尾的字符串追加 \n
    const lines = content.split('\n');
    const newLines = [];
    let inActionsBlock = false;

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];

        // 检测进入 actions 块
        if (/(?:dodge_actions|parry_actions|miss_msg|parry_msg)\s*[:=]\s*\[/.test(line)) {
            inActionsBlock = true;
        }

        if (inActionsBlock) {
            // 在 actions 块内，检查字符串字面量
            const m = line.match(/^(\s*)(["'])((?:[^"\\]|\\.)*)\2(\s*,?\s*)$/);
            if (m && !m[3].endsWith('\\n')) {
                const indent = m[1], quote = m[2], str = m[3], rest = m[4];
                newLines.push(`${indent}${quote}${str}\\n${quote}${rest}`);
                changed = true;
                count++;
                continue;
            }
            // 检测退出 actions 块
            if (/\];?\s*$/.test(line.trim())) {
                inActionsBlock = false;
            }
        }

        newLines.push(line);
    }

    if (changed) {
        fs.writeFileSync(filePath, newLines.join('\n'));
    }
    return count;
}

const targets = process.argv.slice(2);
const files = [];

if (targets.length > 0) {
    files.push(...targets);
} else {
    function walk(dir) {
        if (!fs.existsSync(dir)) return;
        const entries = fs.readdirSync(dir, { withFileTypes: true });
        for (const entry of entries) {
            const full = path.join(dir, entry.name);
            if (entry.isDirectory()) walk(full);
            else if (entry.name.endsWith('.ts')) files.push(full);
        }
    }
    walk(path.join(ROOT, 'server', 'res', 'skill'));
}

let total = 0;
for (const f of files) {
    const n = processFile(f);
    if (n > 0) { console.log(`  ${n}: ${path.relative(ROOT, f)}`); total += n; }
}
console.log(`Done. ${total} strings fixed.`);
