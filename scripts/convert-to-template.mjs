/**
 * 将 send_room/send_combat 及 start_msg/finish_msg 中的字符串拼接转换为模板字面量
 *   "str1" + expr + "str2"  →  `str1${expr}str2`
 *
 * 用法: node scripts/convert-to-template.mjs [file...]
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');

/** 按 + 拆分拼接表达式为 tokens [{type:'str'|'expr', val}] */
function tokenize(expr) {
    const tokens = [];
    let remain = expr.trim();
    while (remain.length > 0) {
        remain = remain.trimStart();
        if (remain[0] === '"' || remain[0] === "'") {
            const q = remain[0];
            let s = '', i = 1;
            while (i < remain.length) {
                if (remain[i] === '\\') { s += remain[i] + remain[i + 1]; i += 2; continue; }
                if (remain[i] === q) { i++; break; }
                s += remain[i]; i++;
            }
            tokens.push({ type: 'str', val: s });
            remain = remain.slice(i);
        } else if (remain[0] === ',') {
            break;  // 参数结束
        } else if (remain[0] === '+') {
            remain = remain.slice(1);  // 跳过 +，继续读取下一个 token
        } else {
            let e = '', i = 0, d = 0;
            while (i < remain.length) {
                const ch = remain[i];
                if ((ch === '+' || ch === ',') && d === 0) break;
                if (ch === '(' || ch === '[') d++;
                else if (ch === ')' || ch === ']') d--;
                e += ch; i++;
            }
            const val = e.trim();
            if (val) tokens.push({ type: 'expr', val });
            remain = remain.slice(i);
        }
    }
    return tokens;
}

/** tokens → 模板字面量字符串 */
function tokensToTemplate(tokens) {
    let s = '`';
    for (const t of tokens) {
        if (t.type === 'str') s += t.val;
        else s += '${' + t.val + '}';
    }
    return s + '`';
}

// ============================================================
// 1) send_room / send_combat 调用拼接
// ============================================================

function processCalls(content) {
    const re = /(send_room|send_combat)\(["'][^"']*["']\s*\+/g;
    const replacements = [];
    let m;
    while ((m = re.exec(content)) !== null) {
        const callStart = m.index;
        // 找匹配的 )
        let j = m[0].indexOf('(') + callStart + 1, depth = 1, inStr = false, sq = '';
        while (j < content.length && depth > 0) {
            const ch = content[j];
            if (inStr) {
                if (ch === '\\') { j += 2; continue; }
                if (ch === sq) inStr = false;
                j++; continue;
            }
            if (ch === '"' || ch === "'" || ch === '`') { inStr = true; sq = ch; j++; continue; }
            if (ch === '(') depth++;
            else if (ch === ')') depth--;
            j++;
        }
        if (depth !== 0) continue;

        // 提取函数名和参数
        const funcName = m[1];
        const openParen = content.indexOf('(', callStart);
        const inner = content.slice(openParen + 1, j - 1); // 去掉外层括号

        // 找到第一个参数的结束（顶层逗号）
        let firstArgEnd = -1, d = 0; inStr = false; sq = '';
        for (let i = 0; i < inner.length; i++) {
            const ch = inner[i];
            if (inStr) {
                if (ch === '\\') { i++; continue; }
                if (ch === sq) { inStr = false; continue; }
                continue;
            }
            if (ch === '"' || ch === "'" || ch === '`') { inStr = true; sq = ch; continue; }
            if (ch === '(' || ch === '[') d++;
            else if (ch === ')' || ch === ']') d--;
            else if (ch === ',' && d === 0) { firstArgEnd = i; break; }
        }
        const firstArg = firstArgEnd === -1 ? inner : inner.slice(0, firstArgEnd);
        const rest = firstArgEnd === -1 ? '' : inner.slice(firstArgEnd);

        const tokens = tokenize(firstArg);
        if (tokens.filter(t => t.type === 'expr').length === 0) continue;

        const tmpl = tokensToTemplate(tokens);
        replacements.push({
            start: callStart,
            end: j,
            text: `${funcName}(${tmpl}${rest})`,
        });
    }

    // 从后往前替换
    for (let i = replacements.length - 1; i >= 0; i--) {
        const r = replacements[i];
        content = content.slice(0, r.start) + r.text + content.slice(r.end);
    }
    return { content, count: replacements.length };
}

// ============================================================
// 2) start_msg / finish_msg 属性拼接
// ============================================================

function processMsgProps(content) {
    const re = /(start_msg|finish_msg)\s*:\s*["'][^"']*["']\s*\+/g;
    const replacements = [];
    let m;
    while ((m = re.exec(content)) !== null) {
        const valStart = m.index + m[0].indexOf(':') + 1;
        // 从 : 后面找到属性值的结束（行尾逗号或换行）
        let j = valStart;
        let inStr = false, sq = '';
        while (j < content.length) {
            const ch = content[j];
            if (inStr) {
                if (ch === '\\') { j += 2; continue; }
                if (ch === sq) inStr = false;
                j++; continue;
            }
            if (ch === '"' || ch === "'") { inStr = true; sq = ch; j++; continue; }
            if (ch === ',') break;
            if (ch === '\n') break;
            j++;
        }

        const propExpr = content.slice(valStart, j).trim();
        const tokens = tokenize(propExpr);
        if (tokens.filter(t => t.type === 'expr').length === 0) continue;

        const tmpl = tokensToTemplate(tokens);
        const keyEnd = m.index + m[1].length; // "start_msg" or "finish_msg" end
        const keyPart = content.slice(m.index, valStart);
        replacements.push({
            start: m.index,
            end: j,
            text: keyPart.trimEnd() + ' ' + tmpl,
        });
    }

    for (let i = replacements.length - 1; i >= 0; i--) {
        const r = replacements[i];
        content = content.slice(0, r.start) + r.text + content.slice(r.end);
    }
    return { content, count: replacements.length };
}

// ============================================================
// main
// ============================================================

function processFile(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');
    const r1 = processCalls(content);
    content = r1.content;
    const r2 = processMsgProps(content);
    const total = r1.count + r2.count;
    if (total > 0) fs.writeFileSync(filePath, r2.content);
    return total;
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
    walk(path.join(ROOT, 'server', 'res'));
}

let total = 0;
for (const f of files) {
    const n = processFile(f);
    if (n > 0) { console.log(`  ${n}: ${path.relative(ROOT, f)}`); total += n; }
}
console.log(`Done. ${total} conversions.`);
