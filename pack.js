/**
 * pack.js — 编译打包脚本
 *
 * 用法:
 *   node pack.js           正常编译（不打包二进制）
 *   node pack.js --binary  编译 + send_room → send_room_b 转换
 *
 * 流程:
 *   1. tsc 编译 server/ → server/dist/
 *   2. server/dist/core/ → os/,  server/dist/res/ → world/
 *   3. 若 --binary: 扫描 os/ + world/ 中的 send_room/send_combat 字面量，
 *      注册模板、替换为 _b 版本、生成客户端模板数据文件
 */

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const args = process.argv.slice(2);
const IS_BINARY = args.includes('--binary');

const SERVER_DIR = path.join(__dirname, 'server');
const DIST_DIR = path.join(SERVER_DIR, 'dist');
const OS_DIR = path.join(__dirname, 'os');
const WORLD_DIR = path.join(__dirname, 'world');
const WEB_DIR = path.join(__dirname, 'web');

// ============================================================
// Step 1: Compile TypeScript
// ============================================================

console.log('[pack] Compiling TypeScript...');
fs.rmSync(DIST_DIR, { recursive: true, force: true });

try {
    execSync('npx tsc -p server/tsconfig.json', {
        cwd: __dirname,
        stdio: 'inherit',
    });
} catch (e) {
    console.error('[pack] TypeScript compilation failed');
    process.exit(1);
}

// ============================================================
// Step 2: Move to output directories
// ============================================================

console.log('[pack] Moving compiled output...');
fs.rmSync(OS_DIR, { recursive: true, force: true });
fs.rmSync(WORLD_DIR, { recursive: true, force: true });

const distCore = path.join(DIST_DIR, 'core');
const distRes = path.join(DIST_DIR, 'res');

// 使用 cpSync + rmSync 避免 Windows 跨设备 rename 的 EPERM
if (fs.existsSync(distCore)) {
    fs.cpSync(distCore, OS_DIR, { recursive: true });
}
if (fs.existsSync(distRes)) {
    fs.cpSync(distRes, WORLD_DIR, { recursive: true });
}

// 处理其他目录（types 等）→ os/
const remainingFiles = fs.readdirSync(DIST_DIR, { withFileTypes: true });
for (const entry of remainingFiles) {
    if (entry.name === 'core' || entry.name === 'res') continue;
    const src = path.join(DIST_DIR, entry.name);
    const dest = path.join(OS_DIR, entry.name);
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

    collectFromDir(OS_DIR);
    collectFromDir(WORLD_DIR);
    console.log(`[pack]   Scanned ${scannedFiles} files, found ${templateMap.size} unique templates`);

    // ============================================================
    // 生成客户端模板数据
    // ============================================================

    if (templateMap.size > 0) {
        const clientData = {};
        for (const [literal, id] of templateMap) {
            clientData[id] = literal;
        }
        fs.writeFileSync(
            path.join(WEB_DIR, 'templates-data.js'),
            `/**
 * 客户端模板映射表 — 由 pack.js --binary 自动生成
 * DO NOT EDIT MANUALLY
 */
export const PreloadedTable = ${JSON.stringify(clientData, null, 2)};
export const PreloadedVersion = 1;
`);
        console.log('[pack]   Generated web/templates-data.js');
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

    transformDir(OS_DIR);
    transformDir(WORLD_DIR);

    console.log(`[pack]   Replaced ${replacedRoom} send_room + ${replacedCombat} send_combat in ${replacedFiles} files`);

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
                            console.log(`[pack]   ⚠ missed in ${path.relative(__dirname, full)}: ${preview}`);
                        }
                    }
                }
            }
        }
    }

    verifyDir(OS_DIR);
    verifyDir(WORLD_DIR);
    if (missed > 0) {
        console.log(`[pack]   ⚠ ${missed} registered templates could not be replaced (edge cases)`);
    }
}

console.log(`[pack] Done. Mode: ${IS_BINARY ? 'binary' : 'normal'}`);
