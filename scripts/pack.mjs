/**
 * scripts/pack.mjs — 编译打包脚本
 *
 * 用法:
 *   node scripts/pack.mjs           正常编译（不打包二进制）
 *   node scripts/pack.mjs --binary  编译 + send_room → send_room_b 转换
 *
 * 流程:
 *   1. tsc 编译 server/ → server/dist/
 *   2. server/dist/core/ → core/,  server/dist/res/ → res/ (保持原名)
 *   3. 若 --binary: 扫描 core/ + res/ 中的 send_room/send_combat 字面量，
 *      注册模板、替换为 _b 版本、生成客户端模板数据文件
 */

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const args = process.argv.slice(2);
const IS_BINARY = args.includes('--binary');

const SERVER_DIR = path.join(ROOT, 'server');
const DIST_DIR = path.join(SERVER_DIR, 'dist');
const CORE_DIR = path.join(ROOT, 'core');
const RES_DIR = path.join(ROOT, 'res');
const WEB_DIR = path.join(ROOT, 'web');

// ============================================================
// Step 1: Compile TypeScript
// ============================================================

console.log('[pack] Compiling TypeScript...');
fs.rmSync(DIST_DIR, { recursive: true, force: true });

try {
    execSync('npx tsc -p server/tsconfig.json', {
        cwd: ROOT,
        stdio: 'inherit',
    });
} catch (e) {
    console.error('[pack] TypeScript compilation failed');
    process.exit(1);
}

// ============================================================
// Step 2: 复制到输出目录（保持 core/ res/ 原名，不破坏 import 路径）
// ============================================================

console.log('[pack] Deploying compiled output...');
fs.rmSync(CORE_DIR, { recursive: true, force: true });
fs.rmSync(RES_DIR, { recursive: true, force: true });

const distCore = path.join(DIST_DIR, 'core');
const distRes = path.join(DIST_DIR, 'res');

if (fs.existsSync(distCore)) {
    fs.cpSync(distCore, CORE_DIR, { recursive: true });
}
if (fs.existsSync(distRes)) {
    fs.cpSync(distRes, RES_DIR, { recursive: true });
}

// 处理其他目录（types 等）→ core/
const remainingFiles = fs.readdirSync(DIST_DIR, { withFileTypes: true });
for (const entry of remainingFiles) {
    if (entry.name === 'core' || entry.name === 'res') continue;
    const src = path.join(DIST_DIR, entry.name);
    const dest = path.join(CORE_DIR, entry.name);
    fs.cpSync(src, dest, { recursive: true, force: true });
}

// 清理 dist
fs.rmSync(DIST_DIR, { recursive: true, force: true });

// ============================================================
// Step 3: If --binary, transform send_room → send_room_b
// ============================================================

if (IS_BINARY) {
    console.log('[pack] Binary mode: scanning and transforming...');

    /** unescaped literal → template id */
    const templateMap = new Map();

    // --- Utility: JS string unescape (仅用于 JSON 输出) ---
    function unescapeJS(str, quote) {
        return str.replace(/\\(.)/g, (_, c) => {
            if (c === quote) return quote;
            if (c === 'n') return '\n';
            if (c === 't') return '\t';
            if (c === 'r') return '\r';
            if (c === '\\') return '\\';
            return c;
        });
    }

    // ============================================================
    // Pass 1: 收集所有 send_room / send_combat 字面量
    // ============================================================

    /** 匹配 .send_room('literal' 或 "literal" 或 `literal` — 排除拼接（后面紧跟 + 号） */
    const CALL_RE = /\.(send_room|send_combat)\((["'`])((?:[^"'`\\]|\\.)*?)\2(?!\s*\+)/gs;

    console.log('[pack]   Pass 1: collecting template strings...');
    let scannedFiles = 0;

    function collectFromDir(dir) {
        if (!fs.existsSync(dir)) return;
        const entries = fs.readdirSync(dir, { withFileTypes: true });
        for (const entry of entries) {
            const full = path.join(dir, entry.name);
            if (entry.isDirectory()) {
                collectFromDir(full);
            } else if (entry.name.endsWith('.js')) {
                scannedFiles++;
                const content = fs.readFileSync(full, 'utf8');
                let m;
                while ((m = CALL_RE.exec(content)) !== null) {
                    const literal = unescapeJS(m[3], m[2]);
                    if (!templateMap.has(literal)) {
                        templateMap.set(literal, templateMap.size);
                    }
                }
            }
        }
    }

    collectFromDir(CORE_DIR);
    collectFromDir(RES_DIR);
    console.log(`[pack]   Scanned ${scannedFiles} files, found ${templateMap.size} unique literal templates`);

    // ============================================================
    // Pass 1b: 收集 "lit1" + var + "lit2" 拼接模式
    // ============================================================

    /** 匹配 .send_room("lit1" + varExpr + "lit2" — 两段字面量夹一个变量 */
    const CONCAT_RE = /\.(send_room|send_combat)\((["'`])((?:[^"'`\\]|\\.)*?)\2\s*\+\s*([^,+]+?)\s*\+\s*(["'`])((?:[^"'`\\]|\\.)*?)\5/gs;

    /** concat 模板 → { parts: [lit1, lit2], varCount: 1 } */
    const concatInfo = new Map();

    function collectConcatFromDir(dir) {
        if (!fs.existsSync(dir)) return;
        const entries = fs.readdirSync(dir, { withFileTypes: true });
        for (const entry of entries) {
            const full = path.join(dir, entry.name);
            if (entry.isDirectory()) {
                collectConcatFromDir(full);
            } else if (entry.name.endsWith('.js')) {
                const content = fs.readFileSync(full, 'utf8');
                let m;
                while ((m = CONCAT_RE.exec(content)) !== null) {
                    const lit1 = unescapeJS(m[3], m[2]);
                    const lit2 = unescapeJS(m[6], m[5]);
                    const tmpl = lit1 + '^' + lit2;
                    if (!concatInfo.has(tmpl)) {
                        concatInfo.set(tmpl, { funcName: m[1], lit1, lit2 });
                    }
                }
            }
        }
    }

    collectConcatFromDir(CORE_DIR);
    collectConcatFromDir(RES_DIR);

    // 将拼接模板加入注册表
    let concatAdded = 0;
    for (const [tmpl, info] of concatInfo) {
        if (!templateMap.has(tmpl)) {
            templateMap.set(tmpl, templateMap.size);
            concatAdded++;
        }
    }
    console.log(`[pack]   Found ${concatAdded} concat templates (total: ${templateMap.size})`);

    // ============================================================
    // 生成客户端模板数据（带字段掩码）
    // ============================================================

    function computeMask(text) {
        let m = 0;
        // A_NAME 和 T_NAME 至少有一个时，双方都带（客户端视角转换需要名字）
        const hasN = text.includes('$N');
        const hasn = text.includes('$n');
        if (hasN || hasn) m |= 0x01 | 0x20;  // A_NAME | T_NAME
        if (text.includes('$P')) m |= 0x04;  // A_CALL3
        if (text.includes('$p')) m |= 0x80;  // T_CALL3
        if (text.includes('$l')) m |= 0x08;  // A_PART
        if (text.includes('$W') || text.includes('$w')) m |= 0x02;  // A_WEAPON
        if (text.includes('$i')) m |= 0x40;  // T_WEAPON
        if (text.includes('$T')) m |= 0x10;  // A_THROW
        return m;
    }

    if (templateMap.size > 0) {
        const clientData = {};
        const serverLines = [];
        for (const [literal, id] of templateMap) {
            const mask = computeMask(literal);
            clientData[id] = { t: literal, m: mask };
            serverLines.push(`register(${JSON.stringify(literal)});`);
        }

        // 客户端模板表
        fs.writeFileSync(
            path.join(WEB_DIR, 'templates-data.js'),
            `/**
 * 客户端模板映射表 — 由 scripts/pack.mjs --binary 自动生成
 * DO NOT EDIT MANUALLY
 * 格式: { tid: { t: "template text", m: fieldMask }, ... }
 */
export const PreloadedTable = ${JSON.stringify(clientData, null, 2)};
export const PreloadedVersion = 1;
`);
        console.log('[pack]   Generated web/templates-data.js');

        // 服务端模板注册（供 getMask() 使用）
        fs.writeFileSync(
            path.join(CORE_DIR, 'templates-build.js'),
            `/**
 * 服务端模板注册 — 由 scripts/pack.mjs --binary 自动生成
 * 启动时自动加载，填充 getMask() 所需的掩码数据
 */
import { register } from './templates.js';
${serverLines.join('\n')}
`);
        console.log('[pack]   Generated core/templates-build.js');
    }

    // ============================================================
    // Pass 2: 替换 send_room("literal") → send_room_b(id)
    //         替换 send_combat("literal") → send_combat_b(id)
    // ============================================================

    console.log('[pack]   Pass 2: replacing calls...');
    let replacedFiles = 0;
    let replacedRoom = 0;
    let replacedCombat = 0;

    function transformDir(dir) {
        if (!fs.existsSync(dir)) return;
        const entries = fs.readdirSync(dir, { withFileTypes: true });
        for (const entry of entries) {
            const full = path.join(dir, entry.name);
            if (entry.isDirectory()) {
                transformDir(full);
            } else if (entry.name.endsWith('.js')) {
                let content = fs.readFileSync(full, 'utf8');
                let changed = false;

                // 使用与 Pass 1 完全相同的正则做替换，
                // 避免 unescape → escape 往返导致的匹配失败
                content = content.replace(CALL_RE, (match, funcName, quote, rawStr) => {
                    const literal = unescapeJS(rawStr, quote);
                    const id = templateMap.get(literal);
                    if (id !== undefined) {
                        changed = true;
                        if (funcName === 'send_room') replacedRoom++;
                        else replacedCombat++;
                        return `.${funcName}_b(${id}`;
                    }
                    return match;
                });

                if (changed) {
                    fs.writeFileSync(full, content);
                    replacedFiles++;
                }
            }
        }
    }

    transformDir(CORE_DIR);
    transformDir(RES_DIR);

    // 拼接模式替换（手动循环，保留尾部参数和变量表达式）
    let replacedConcat = 0;

    function transformConcatDir(dir) {
        if (!fs.existsSync(dir)) return;
        const entries = fs.readdirSync(dir, { withFileTypes: true });
        for (const entry of entries) {
            const full = path.join(dir, entry.name);
            if (entry.isDirectory()) {
                transformConcatDir(full);
            } else if (entry.name.endsWith('.js')) {
                let content = fs.readFileSync(full, 'utf8');
                let changed = false;
                let m;

                // 用 exec 遍历匹配，记录替换位置
                CONCAT_RE.lastIndex = 0;
                const replacements = [];
                while ((m = CONCAT_RE.exec(content)) !== null) {
                    const tmpl = unescapeJS(m[3], m[2]) + '^' + unescapeJS(m[6], m[5]);
                    const id = templateMap.get(tmpl);
                    if (id === undefined) continue;

                    const funcName = m[1];
                    const varExpr = m[4];
                    const matchEnd = m.index + m[0].length;

                    // 读 match 之后的文本，收集剩余参数
                    const rest = content.slice(matchEnd);
                    const tailMatch = rest.match(/^(\s*,\s*[^)]*?)\)/s);
                    const tailArgs = tailMatch ? tailMatch[1] : '';  // e.g. ", target" or ", target, true"

                    replacements.push({
                        start: m.index,
                        end: matchEnd + (tailMatch ? tailMatch[0].length : rest.indexOf(')') + 1),
                        replacement: `.${funcName}_b(${id}${tailArgs}, ${varExpr})`,
                    });
                }

                // 从后往前替换，避免位置偏移
                for (let i = replacements.length - 1; i >= 0; i--) {
                    const r = replacements[i];
                    content = content.slice(0, r.start) + r.replacement + content.slice(r.end);
                    changed = true;
                    replacedConcat++;
                }

                if (changed) {
                    fs.writeFileSync(full, content);
                    replacedFiles++;
                }
            }
        }
    }

    transformConcatDir(CORE_DIR);
    transformConcatDir(RES_DIR);

    console.log(`[pack]   Replaced ${replacedRoom} send_room + ${replacedCombat} send_combat + ${replacedConcat} concat in ${replacedFiles} files`);

    // ============================================================
    // Pass 3: 验证 — 列出未被替换的字面量（可能是正则边缘情况）
    // ============================================================

    let missed = 0;
    function verifyDir(dir) {
        if (!fs.existsSync(dir)) return;
        const entries = fs.readdirSync(dir, { withFileTypes: true });
        for (const entry of entries) {
            const full = path.join(dir, entry.name);
            if (entry.isDirectory()) {
                verifyDir(full);
            } else if (entry.name.endsWith('.js')) {
                const content = fs.readFileSync(full, 'utf8');
                let m;
                while ((m = CALL_RE.exec(content)) !== null) {
                    const literal = unescapeJS(m[3], m[2]);
                    if (templateMap.has(literal)) {
                        // 已注册但未被替换 — 可能是正则边缘情况
                        missed++;
                        if (missed <= 5) {
                            const preview = literal.length > 60
                                ? literal.slice(0, 60) + '...'
                                : literal;
                            console.log(`[pack]   ⚠ missed in ${path.relative(ROOT, full)}: ${preview}`);
                        }
                    }
                }
            }
        }
    }

    verifyDir(CORE_DIR);
    verifyDir(RES_DIR);
    if (missed > 0) {
        console.log(`[pack]   ⚠ ${missed} registered templates could not be replaced (edge cases)`);
    }
}

console.log(`[pack] Done. Mode: ${IS_BINARY ? 'binary' : 'normal'}`);
