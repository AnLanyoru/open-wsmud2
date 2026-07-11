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

    /** unescaped literal → (mask << 16) | pure_id */
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

    // --- Utility: 提取模板字面量中的 ${} 插值，替换为 ^ 占位符 ---
    // 返回 { template: 含 ^ 的纯模板, exprs: 表达式列表 }
    function extractInterpolation(literal) {
        const exprs = [];
        let template = '';
        let i = 0;
        while (i < literal.length) {
            if (literal[i] === '$' && literal[i + 1] === '{') {
                let depth = 1;
                let j = i + 2;
                while (j < literal.length && depth > 0) {
                    if (literal[j] === '{') depth++;
                    else if (literal[j] === '}') depth--;
                    if (depth === 0) break;
                    j++;
                }
                exprs.push(literal.slice(i + 2, j));
                template += '^';
                i = j + 1;
            } else {
                template += literal[i];
                i++;
            }
        }
        return { template, exprs };
    }

    // --- ID 掩码计算 (与 templates.ts computeIdMask 保持一致) ---
    // 3 位 idMask: A_ID=0x01 ($N $W $P $T), T_ID=0x02 ($n $w $p), HURT_PART=0x04 ($l)
    // 模板 ID 编码: (idMask << 16) | pure_id，0x12 帧按 idMask 携带 7B A_ID/T_ID + 内联部位
    function computeIdMask(text) {
        let m = 0;
        if (text.includes('$N') || text.includes('$W') || text.includes('$P') || text.includes('$T')) {
            m |= 0x01;  // A_ID
        }
        if (text.includes('$n') || text.includes('$w') || text.includes('$p')) {
            m |= 0x02;  // T_ID
        }
        if (text.includes('$l')) {
            m |= 0x04;  // HURT_PART
        }
        return m;
    }

    // --- 字段掩码计算 (与 templates.ts computeFieldMask 保持一致) ---
    // 8 位 fieldMask，导出到客户端 templates-data.json 供 sparse 构建
    function computeFieldMask(text) {
        let m = 0;
        if (text.includes('$N')) m |= 0x01;  // A_NAME
        if (text.includes('$W')) m |= 0x02;  // A_WEAPON
        if (text.includes('$P')) m |= 0x04;  // A_CALL3
        if (text.includes('$w')) m |= 0x08;  // T_WEAPON
        if (text.includes('$T')) m |= 0x10;  // A_THROW
        if (text.includes('$n')) m |= 0x20;  // T_NAME
        if (text.includes('$p')) m |= 0x80;  // T_CALL3
        return m;
    }

    /** 注册模板: value = (idMask << 16) | pure_id */
    function registerTemplate(literal) {
        let val = templateMap.get(literal);
        if (val !== undefined) return val;
        const pureId = templateMap.size;
        val = (computeIdMask(literal) << 16) | pureId;
        templateMap.set(literal, val);
        return val;
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
                        registerTemplate(literal);
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

    /** 匹配 .send_room('literal' 或 "literal" — 允许 ( 和引号间有空白（多行格式），排除拼接 */
    const CALL_RE = /\.(send_room|send_room_others|send_combat)\(\s*(["'])((?:[^"'\\\n\r]|\\.)*?)\2(?!\s*\+)/gs;

    /** 匹配 .send_room(`literal`) — 反引号模板字面量（排除含 ${} 的动态模板），允许多行格式 */
    const CALL_BT_RE = /\.(send_room|send_room_others|send_combat)\(\s*(`)((?:[^`\\\n\r]|\\.)*?)\2(?!\s*\+)/gs;

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
                        registerTemplate(literal);
                    }
                }
                // 反引号模板字面量（含 ${} 的动态模板提取表达式后注册纯模板）
                while ((m = CALL_BT_RE.exec(content)) !== null) {
                    const literal = unescapeJS(m[3], '`');
                    if (literal.includes('${')) {
                        const { template } = extractInterpolation(literal);
                        if (!templateMap.has(template)) {
                            registerTemplate(template);
                        }
                    } else if (!templateMap.has(literal)) {
                        registerTemplate(literal);
                    }
                }
            }
        }
    }

    collectFromDir(CORE_DIR);
    collectFromDir(RES_DIR);
    console.log(`[pack]   Scanned ${scannedFiles} files, found ${templateMap.size} unique literal templates`);

    // ============================================================
    // Pass 1.5: 收集已知安全上下文中的字符串字面量
    // 上下文已精确匹配，不依赖 $/^ 内容过滤：
    //   1. action 数组: attack_actions / dodge_actions / parry_actions / ..._vs_..._actions
    //   2. DoAttackPar 属性值: attack_msg / miss_msg / parry_msg / damage_msg / attack_before
    //   3. _to_b 后缀变量赋值（模板字符串优化标记）
    //   4. status_msg / WINNER_MSG / catch_hunt_msg / guard_msg 数组
    // ============================================================

    const STR_LIT_RE = /(["'])((?:[^"'\\\n\r]|\\.)*?)\1(?!\s*\+)/g;
    const ACTION_ARR_RE_C = /((?:this\.)?(?:attack_actions|dodge_actions|parry_actions|weapon_vs_weapon_actions|weapon_vs_unarmed_actions|unarmed_vs_weapon_actions)\s*[=:]\s*\[)([\s\S]*?)(\])/g;
    const PAR_PROP_RE_C = /(?:attack_msg|miss_msg|parry_msg|damage_msg|attack_before)\s*:\s*(["'])((?:[^"'\\\n\r]|\\.)*?)\1(?!\s*\+)/g;
    const TO_B_RE_C = /(\w+_to_b)\s*=\s*(["'])((?:[^"'\\\n\r]|\\.)*?)\2(?!\s*\+)/g;
    const MSG_ARR_RE_C = /((?:const\s+)?(?:status_msg|WINNER_MSG|catch_hunt_msg|guard_msg|DIE_MSG|ask_dunno|look_str|rollDesc)\s*[=:]\s*\[)([\s\S]*?)(\];?)/g;

    console.log('[pack]   Pass 1.5: scanning context string literals...');
    let ctxStrCount = 0;

    function collectCtxStr(literal) {
        if (literal.length === 0 || templateMap.has(literal)) return;
        registerTemplate(literal);
        ctxStrCount++;
    }

    function collectContextStrs(dir) {
        if (!fs.existsSync(dir)) return;
        const entries = fs.readdirSync(dir, { withFileTypes: true });
        for (const entry of entries) {
            const full = path.join(dir, entry.name);
            if (entry.isDirectory()) {
                collectContextStrs(full);
            } else if (entry.name.endsWith('.js')) {
                const content = fs.readFileSync(full, 'utf8');
                let m;

                // 1) action 数组
                ACTION_ARR_RE_C.lastIndex = 0;
                while ((m = ACTION_ARR_RE_C.exec(content)) !== null) {
                    let sm;
                    STR_LIT_RE.lastIndex = 0;
                    while ((sm = STR_LIT_RE.exec(m[2])) !== null) {
                        collectCtxStr(unescapeJS(sm[2], sm[1]));
                    }
                }

                // 2) DoAttackPar 属性值
                PAR_PROP_RE_C.lastIndex = 0;
                while ((m = PAR_PROP_RE_C.exec(content)) !== null) {
                    collectCtxStr(unescapeJS(m[2], m[1]));
                }

                // 3) _to_b 后缀变量赋值
                TO_B_RE_C.lastIndex = 0;
                while ((m = TO_B_RE_C.exec(content)) !== null) {
                    collectCtxStr(unescapeJS(m[3], m[2]));
                }

                // 4) status_msg / WINNER_MSG / catch_hunt_msg / guard_msg 数组
                MSG_ARR_RE_C.lastIndex = 0;
                while ((m = MSG_ARR_RE_C.exec(content)) !== null) {
                    let sm;
                    STR_LIT_RE.lastIndex = 0;
                    while ((sm = STR_LIT_RE.exec(m[2])) !== null) {
                        collectCtxStr(unescapeJS(sm[2], sm[1]));
                    }
                }
            }
        }
    }

    collectContextStrs(CORE_DIR);
    collectContextStrs(RES_DIR);
    console.log(`[pack]   Found ${ctxStrCount} context strings (total: ${templateMap.size})`);

    // ============================================================
    // Pass 2: 扫描 _tmpl('...') 标记 — 替换为模板 ID
    // ============================================================

    /** 匹配 _tmpl('literal') 或 _tmpl("literal") */
    const TMPL_RE = /_tmpl\((["'])((?:[^"'\\\n\r]|\\.)*?)\1\)/gs;

    console.log('[pack]   Pass 2: scanning _tmpl() markers...');
    let tmplCount = 0;

    function transformTmpl(dir) {
        if (!fs.existsSync(dir)) return;
        const entries = fs.readdirSync(dir, { withFileTypes: true });
        for (const entry of entries) {
            const full = path.join(dir, entry.name);
            if (entry.isDirectory()) {
                transformTmpl(full);
            } else if (entry.name.endsWith('.js')) {
                let content = fs.readFileSync(full, 'utf8');
                let changed = false;
                let m;
                // Reset regex state
                TMPL_RE.lastIndex = 0;
                while ((m = TMPL_RE.exec(content)) !== null) {
                    const literal = unescapeJS(m[2], m[1]);
                    const id = registerTemplate(literal);
                    // 替换 _tmpl('...') → 模板 ID (含 mask 编码)
                    content = content.slice(0, m.index) + String(id) + content.slice(m.index + m[0].length);
                    TMPL_RE.lastIndex = m.index + String(id).length;
                    tmplCount++;
                    changed = true;
                }
                if (changed) fs.writeFileSync(full, content);
            }
        }
    }

    transformTmpl(CORE_DIR);
    transformTmpl(RES_DIR);
    console.log(`[pack]   Registered ${tmplCount} _tmpl() calls (total templates: ${templateMap.size})`);

    // ============================================================
    // 生成客户端模板数据（带字段掩码）
    // ============================================================

    if (templateMap.size > 0) {
        const clientData = {};
        const serverLines = [];
        for (const [literal, val] of templateMap) {
            const pureId = val & 0xFFFF;
            // 客户端需要 8 位 fieldMask 构建 sparse，而非 2 位 idMask
            clientData[pureId] = { t: literal, m: computeFieldMask(literal) };
            serverLines.push(`register(${JSON.stringify(literal)});`);
        }

        // 客户端模板表 (JSON, 写到项目根目录避免被 vite build 清空)
        fs.writeFileSync(
            path.join(ROOT, 'templates-data.json'),
            JSON.stringify({ v: 1, d: clientData })
        );
        console.log('[pack]   Generated templates-data.json');

        // 客户端部位名表 (JSON, 供 0x12 帧 HURT_PART 1B 索引查名)
        const partsTable = {
            character: ['左脚', '右脚', '左腿', '右腿', '小腹', '胸前', '后背',
                '头部', '颈部', '后心', '左肩', '右肩', '左手', '左手', '腰间'],
            monster: ['左爪', '右爪', '后腿', '小腹', '胸前', '背部', '头部', '颈部', '前肢', '腰间'],
        };
        fs.writeFileSync(
            path.join(ROOT, 'parts-table.json'),
            JSON.stringify(partsTable)
        );
        console.log('[pack]   Generated parts-table.json');

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
    // Pass 3: 替换 send_room("literal") → send_room_b(id)
    //         替换 send_combat("literal") → send_combat_b(id)
    // ============================================================

    console.log('[pack]   Pass 3: replacing calls...');
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
                        if (funcName === 'send_combat') replacedCombat++;
                        else replacedRoom++;
                        return `.${funcName}(${id}`;
                    }
                    return match;
                });

                // 替换反引号模板字面量 send_room(`literal`) → send_room(id)
                // 含 ${} 的动态模板：提取表达式替换为 ^，表达式作为尾参追加到参数列表末尾
                CALL_BT_RE.lastIndex = 0;
                let btMatch;
                while ((btMatch = CALL_BT_RE.exec(content)) !== null) {
                    const funcName = btMatch[1];
                    const literal = unescapeJS(btMatch[3], '`');
                    const hasInterp = literal.includes('${');
                    let template, exprs;
                    if (hasInterp) {
                        const result = extractInterpolation(literal);
                        template = result.template;
                        exprs = result.exprs;
                    } else {
                        template = literal;
                        exprs = null;
                    }
                    const id = templateMap.get(template);
                    if (id === undefined) continue;

                    changed = true;
                    if (funcName === 'send_combat') replacedCombat++;
                    else replacedRoom++;

                    if (!hasInterp) {
                        // 简单替换：保留后面的参数
                        const replacement = `.${funcName}(${id}`;
                        content = content.slice(0, btMatch.index) + replacement + content.slice(btMatch.index + btMatch[0].length);
                        CALL_BT_RE.lastIndex = btMatch.index + replacement.length;
                    } else {
                        // 动态模板：从反引号结束位置开始，追踪括号深度找到函数调用的 )
                        const matchEnd = btMatch.index + btMatch[0].length;
                        let depth = 1;
                        let parenEnd = matchEnd;
                        while (parenEnd < content.length && depth > 0) {
                            if (content[parenEnd] === '(') depth++;
                            else if (content[parenEnd] === ')') depth--;
                            if (depth === 0) break;
                            parenEnd++;
                        }
                        if (depth !== 0) continue;
                        let argsStr = content.slice(matchEnd, parenEnd).trim();
                        // 去掉首尾逗号和空白（处理多行格式和尾逗号）
                        argsStr = argsStr.replace(/^,\s*/, '').replace(/\s*,\s*$/, '');
                        const newCall = `.${funcName}(${id}${argsStr ? ', ' + argsStr : ''}${exprs.length ? ', ' + exprs.join(', ') : ''})`;
                        content = content.slice(0, btMatch.index) + newCall + content.slice(parenEnd + 1);
                        CALL_BT_RE.lastIndex = btMatch.index + newCall.length;
                    }
                }

                // ============================================================
                // 替换已知安全上下文中的字符串字面量
                // 上下文已精确匹配，不依赖 $/^ 内容过滤：
                //   1. action 数组: attack_actions / dodge_actions / parry_actions / ..._vs_..._actions
                //   2. _DMG_TMPL 的 tmpl 值
                //   3. _DMG_FALLBACK 值
                //   4. status_msg / WINNER_MSG / catch_hunt_msg / guard_msg 数组
                //   5. DoAttackPar 属性值: attack_msg / miss_msg / parry_msg / damage_msg / attack_before
                //   6. _to_b 后缀变量赋值（模板字符串优化标记）
                // ============================================================

                /** 在已知数组/对象上下文中替换已注册的字符串字面量 */
                const STR_RE = /(["'])((?:[^"'\\\n\r]|\\.)*?)\1(?!\s*\+)/g;
                function replaceStr(_, quote, rawStr) {
                    const literal = unescapeJS(rawStr, quote);
                    if (templateMap.has(literal)) {
                        replacedAction++;
                        return String(templateMap.get(literal));
                    }
                    return _;
                }

                const preContent = content;

                // 1) action 数组: attack_actions: ["...", ...]
                const ACTION_ARR_RE = /((?:this\.)?(?:attack_actions|dodge_actions|parry_actions|weapon_vs_weapon_actions|weapon_vs_unarmed_actions|unarmed_vs_weapon_actions)\s*[=:]\s*\[)([\s\S]*?)(\])/g;
                content = content.replace(ACTION_ARR_RE, (_, prefix, body, suffix) => {
                    return prefix + body.replace(STR_RE, replaceStr) + suffix;
                });

                // 2) _DMG_TMPL 的 tmpl: "..."
                const DMG_TMPL_RE = /(tmpl\s*:\s*)(["'])((?:[^"'\\\n\r]|\\.)*?)\2/g;
                content = content.replace(DMG_TMPL_RE, (_, prefix, quote, rawStr) => {
                    const literal = unescapeJS(rawStr, quote);
                    if (templateMap.has(literal)) {
                        replacedAction++;
                        return prefix + String(templateMap.get(literal));
                    }
                    return _;
                });

                // 3) _DMG_FALLBACK = "..."
                const DMG_FB_RE = /(_DMG_FALLBACK\s*=\s*)(["'])((?:[^"'\\\n\r]|\\.)*?)\2/g;
                content = content.replace(DMG_FB_RE, (_, prefix, quote, rawStr) => {
                    const literal = unescapeJS(rawStr, quote);
                    if (templateMap.has(literal)) {
                        replacedAction++;
                        return prefix + String(templateMap.get(literal));
                    }
                    return _;
                });

                // 4) status_msg / WINNER_MSG / catch_hunt_msg / guard_msg / DIE_MSG / ask_dunno / look_str / rollDesc 数组
                const MSG_ARR_RE = /((?:const\s+)?(?:status_msg|WINNER_MSG|catch_hunt_msg|guard_msg|DIE_MSG|ask_dunno|look_str|rollDesc)\s*[=:]\s*\[)([\s\S]*?)(\];?)/g;
                content = content.replace(MSG_ARR_RE, (_, prefix, body, suffix) => {
                    return prefix + body.replace(STR_RE, replaceStr) + suffix;
                });

                // 5) DoAttackPar 属性值: attack_msg / miss_msg / parry_msg / damage_msg / attack_before
                const PAR_PROP_RE = /(attack_msg|miss_msg|parry_msg|damage_msg|attack_before)\s*:\s*(["'])((?:[^"'\\\n\r]|\\.)*?)\2(?!\s*\+)/g;
                content = content.replace(PAR_PROP_RE, (_, key, quote, rawStr) => {
                    const literal = unescapeJS(rawStr, quote);
                    if (templateMap.has(literal)) {
                        replacedAction++;
                        return key + ': ' + String(templateMap.get(literal));
                    }
                    return _;
                });

                // 6) _to_b 后缀变量赋值（模板字符串优化标记）
                const TO_B_RE = /(\w+_to_b\s*=\s*)(["'])((?:[^"'\\\n\r]|\\.)*?)\2(?!\s*\+)/g;
                content = content.replace(TO_B_RE, (_, prefix, quote, rawStr) => {
                    const literal = unescapeJS(rawStr, quote);
                    if (templateMap.has(literal)) {
                        replacedAction++;
                        return prefix + String(templateMap.get(literal));
                    }
                    return _;
                });

                if (content !== preContent) changed = true;

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
    // notify_hp → notify_hp_b: 二进制模式 HP/MP 通知走二进制通道
    // ============================================================

    let replacedHp = 0;
    let hpChangedFiles = 0;

    function replaceNotifyHp(dir) {
        if (!fs.existsSync(dir)) return;
        const entries = fs.readdirSync(dir, { withFileTypes: true });
        for (const entry of entries) {
            const full = path.join(dir, entry.name);
            if (entry.isDirectory()) {
                replaceNotifyHp(full);
            } else if (entry.name.endsWith('.js') && entry.name !== 'templates-build.js') {
                const content = fs.readFileSync(full, 'utf8');
                const count = (content.match(/\.notify_hp\(/g) || []).length;
                if (count > 0) {
                    const newContent = content.replace(/\.notify_hp\(/g, '.notify_hp_b(');
                    fs.writeFileSync(full, newContent);
                    replacedHp += count;
                    hpChangedFiles++;
                }
            }
        }
    }

    replaceNotifyHp(CORE_DIR);
    replaceNotifyHp(RES_DIR);
    console.log(`[pack]   Replaced ${replacedHp} notify_hp → notify_hp_b in ${hpChangedFiles} files`);

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
