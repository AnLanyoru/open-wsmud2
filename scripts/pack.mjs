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
const WWW_DIR = path.join(ROOT, 'www');

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
    // Pass 0: 扫描 status_msg / finish_msg 字面量定义
    // ============================================================

    /** 匹配 start_msg: "..."  或  finish_msg: "..."，排除换行防止跨行 */
    const STATUS_MSG_RE = /(start_msg|finish_msg)\s*:\s*(["'`])((?:[^"'`\\\n\r]|\\.)*?)\2/gs;

    console.log('[pack]   Pass 0: scanning status messages...');
    let statusMsgCount = 0;

    function collectStatusMsgs(dir) {
        if (!fs.existsSync(dir)) return;
        const entries = fs.readdirSync(dir, { withFileTypes: true });
        for (const entry of entries) {
            const full = path.join(dir, entry.name);
            if (entry.isDirectory()) {
                collectStatusMsgs(full);
            } else if (entry.name.endsWith('.js')) {
                const content = fs.readFileSync(full, 'utf8');
                let m;
                while ((m = STATUS_MSG_RE.exec(content)) !== null) {
                    const literal = unescapeJS(m[3], m[2]);
                    if (!templateMap.has(literal)) {
                        templateMap.set(literal, templateMap.size);
                        statusMsgCount++;
                    }
                }
            }
        }
    }

    collectStatusMsgs(CORE_DIR);
    collectStatusMsgs(RES_DIR);
    console.log(`[pack]   Found ${statusMsgCount} status messages (total: ${templateMap.size})`);

    // ============================================================
    // Pass 1: 收集所有 send_room / send_combat 字面量
    // ============================================================

    /** 匹配 .send_room('literal' 或 "literal" — 排除反引号和拼接，排除换行防止跨行 */
    const CALL_RE = /\.(send_room|send_combat)\((["'])((?:[^"'\\\n\r]|\\.)*?)\2(?!\s*\+)/gs;

    /** 匹配 .send_room(`literal`) — 反引号模板字面量（排除含 ${} 的动态模板），排除换行防止跨行 */
    const CALL_BT_RE = /\.(send_room|send_combat)\(`((?:[^`\\\n\r]|\\.)*?)`(?!\s*\+)/gs;

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
                // 反引号模板字面量（排除含 ${} 的动态模板）
                while ((m = CALL_BT_RE.exec(content)) !== null) {
                    const literal = unescapeJS(m[2], '`');
                    if (!literal.includes('${') && !templateMap.has(literal)) {
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
    // Pass 1.5: 收集 action 数组中的 $ 占位符字符串
    // ============================================================

    /** 匹配含 $ 或 ^ 占位符的字符串字面量（action 数组和模板表），排除换行，排除拼接 */
    const ACTION_STR_RE = /(["'])((?:[^"'\\\n\r]|\\.)*?)\1(?!\s*\+)/gs;

    let actionStrCount = 0;

    function collectActionStrings(dir) {
        if (!fs.existsSync(dir)) return;
        const entries = fs.readdirSync(dir, { withFileTypes: true });
        for (const entry of entries) {
            const full = path.join(dir, entry.name);
            if (entry.isDirectory()) {
                collectActionStrings(full);
            } else if (entry.name.endsWith('.js')) {
                const content = fs.readFileSync(full, 'utf8');
                let m;
                while ((m = ACTION_STR_RE.exec(content)) !== null) {
                    const literal = unescapeJS(m[2], m[1]);
                    if ((/\$(?!\{)/.test(literal) || /\^/.test(literal)) && literal.length >= 4 && !templateMap.has(literal)) {
                        templateMap.set(literal, templateMap.size);
                        actionStrCount++;
                    }
                }
            }
        }
    }

    collectActionStrings(CORE_DIR);
    collectActionStrings(RES_DIR);
    console.log(`[pack]   Found ${actionStrCount} action strings (total: ${templateMap.size})`);

    // ============================================================
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

        // 客户端模板表 (JSON, Express 自动 gzip)
        fs.writeFileSync(
            path.join(WWW_DIR, 'templates-data.json'),
            JSON.stringify({ v: 1, d: clientData })
        );
        console.log('[pack]   Generated www/templates-data.json');

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

        // 将 templates-build.js 的 import 注入到服务端入口 world.js
        // 使 getMask() 能在运行时返回正确的字段掩码
        const worldJsPath = path.join(CORE_DIR, 'world.js');
        if (fs.existsSync(worldJsPath)) {
            let worldContent = fs.readFileSync(worldJsPath, 'utf8');
            if (!worldContent.includes("templates-build.js")) {
                // 在 import './util.js' 之后插入（确保 templates.js 先于 templates-build.js 加载）
                worldContent = worldContent.replace(
                    /(import\s+['"]\.\/util\.js['"];)/,
                    "$1\nimport './templates-build.js';"
                );
                fs.writeFileSync(worldJsPath, worldContent);
                console.log('[pack]   Injected templates-build import into core/world.js');
            }
        }
    }

    // ============================================================
    // Pass 2: 替换 send_room("literal") → send_room_b(id)
    //         替换 send_combat("literal") → send_combat_b(id)
    // ============================================================

    console.log('[pack]   Pass 2: replacing calls...');
    let replacedFiles = 0;
    let replacedRoom = 0;
    let replacedCombat = 0;
    let replacedAction = 0;

    function transformDir(dir) {
        if (!fs.existsSync(dir)) return;
        const entries = fs.readdirSync(dir, { withFileTypes: true });
        for (const entry of entries) {
            const full = path.join(dir, entry.name);
            if (entry.isDirectory()) {
                transformDir(full);
            } else if (entry.name.endsWith('.js') && entry.name !== 'templates-build.js') {
                let content = fs.readFileSync(full, 'utf8');
                let changed = false;

                // typeof 分支自动路由，不需要 _b 后缀
                content = content.replace(CALL_RE, (match, funcName, quote, rawStr) => {
                    const literal = unescapeJS(rawStr, quote);
                    const id = templateMap.get(literal);
                    if (id !== undefined) {
                        changed = true;
                        if (funcName === 'send_room') replacedRoom++;
                        else replacedCombat++;
                        return `.${funcName}(${id}`;
                    }
                    return match;
                });

                // 替换反引号模板字面量 send_room(`literal`) → send_room(id)
                // 排除含 ${} 的动态模板（无法预编译）
                content = content.replace(CALL_BT_RE, (match, funcName, rawStr) => {
                    const literal = unescapeJS(rawStr, '`');
                    if (!literal.includes('${')) {
                        const id = templateMap.get(literal);
                        if (id !== undefined) {
                            changed = true;
                            if (funcName === 'send_room') replacedRoom++;
                            else replacedCombat++;
                            return `.${funcName}(${id}`;
                        }
                    }
                    return match;
                });

                // 替换 action 数组中的含 $ 字符串 "str" → id
                ACTION_STR_RE.lastIndex = 0; // 重置 exec 污染的状态
                let actionChanged = false;
                content = content.replace(ACTION_STR_RE, (match, quote, rawStr) => {
                    const literal = unescapeJS(rawStr, quote);
                    if ((/\$(?!\{)/.test(literal) || /\^/.test(literal)) && templateMap.has(literal)) {
                        actionChanged = true;
                        replacedAction++;
                        return String(templateMap.get(literal));
                    }
                    return match;
                });
                if (actionChanged) changed = true;

                if (changed) {
                    fs.writeFileSync(full, content);
                    replacedFiles++;
                }
            }
        }
    }

    transformDir(CORE_DIR);
    transformDir(RES_DIR);

    // 状态消息替换: start_msg: "literal" → start_msg: id
    let replacedStatus = 0;

    function replaceStatusMsgs(dir) {
        if (!fs.existsSync(dir)) return;
        const entries = fs.readdirSync(dir, { withFileTypes: true });
        for (const entry of entries) {
            const full = path.join(dir, entry.name);
            if (entry.isDirectory()) {
                replaceStatusMsgs(full);
            } else if (entry.name.endsWith('.js') && entry.name !== 'templates-build.js') {
                let content = fs.readFileSync(full, 'utf8');
                let changed = false;

                content = content.replace(STATUS_MSG_RE, (match, key, quote, rawStr) => {
                    const literal = unescapeJS(rawStr, quote);
                    const id = templateMap.get(literal);
                    if (id !== undefined) {
                        changed = true;
                        replacedStatus++;
                        return `${key}: ${id}`;
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

    replaceStatusMsgs(CORE_DIR);
    replaceStatusMsgs(RES_DIR);

    console.log(`[pack]   Replaced ${replacedRoom} send_room + ${replacedCombat} send_combat + ${replacedStatus} status_msg + ${replacedAction} actions in ${replacedFiles} files`);

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
            } else if (entry.name.endsWith('.js') && entry.name !== 'templates-build.js') {
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
                // 验证反引号模板字面量（排除含 ${} 的动态模板）
                while ((m = CALL_BT_RE.exec(content)) !== null) {
                    const literal = unescapeJS(m[2], '`');
                    if (!literal.includes('${') && templateMap.has(literal)) {
                        missed++;
                        if (missed <= 5) {
                            const preview = literal.length > 60
                                ? literal.slice(0, 60) + '...'
                                : literal;
                            console.log(`[pack]   ⚠ missed (backtick) in ${path.relative(ROOT, full)}: ${preview}`);
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
