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

    /** literal string → template id */
    const templateMap = new Map();

    // --- Utility: JS string unescape ---
    function unescapeJS(str, quote) {
        return str.replace(/\\(.)/g, (_, c) => {
            if (c === quote) return quote;
            if (c === 'n') return '\n';
            if (c === 't') return '\t';
            if (c === '\\') return '\\';
            return c;
        });
    }

    /** Escape a string for use in a regex replacement pattern */
    function escapeRegex(str) {
        return str.replace(/[.*+?^${}()|[\]\\\/]/g, '\\$&');
    }

    /** Collect unique literal strings from all .js files in a directory */
    function collectFromDir(dir) {
        if (!fs.existsSync(dir)) return;
        const entries = fs.readdirSync(dir, { withFileTypes: true });
        for (const entry of entries) {
            const full = path.join(dir, entry.name);
            if (entry.isDirectory()) {
                collectFromDir(full);
            } else if (entry.name.endsWith('.js')) {
                const content = fs.readFileSync(full, 'utf8');
                // 匹配 .send_room('literal' 或 "literal" 或 `literal`
                // 排除后面有 + 的（动态拼接），只看纯字面量
                const re = /\.send_room\((["'`])((?:[^"'`\\]|\\.)*?)\1(?!\s*[+)])/gs;
                let m;
                while ((m = re.exec(content)) !== null) {
                    const literal = unescapeJS(m[2], m[1]);
                    if (!templateMap.has(literal)) {
                        templateMap.set(literal, templateMap.size);
                    }
                }
            }
        }
    }

    console.log('[pack]   Pass 1: collecting template strings...');
    collectFromDir(OS_DIR);
    collectFromDir(WORLD_DIR);
    console.log(`[pack]   Found ${templateMap.size} unique templates`);

    if (templateMap.size > 0) {
        // --- Generate client template data ---
        const clientData = {};
        for (const [literal, id] of templateMap) {
            clientData[id] = literal;
        }
        const clientJS = `/**
 * 客户端模板映射表 — 由 pack.js --binary 自动生成
 * DO NOT EDIT MANUALLY
 */
export const PreloadedTable = ${JSON.stringify(clientData, null, 2)};
export const PreloadedVersion = 1;
`;
        fs.writeFileSync(path.join(WEB_DIR, 'templates-data.js'), clientJS);
        console.log('[pack]   Generated web/templates-data.js');

        // --- Transform JS files ---
        console.log('[pack]   Pass 2: replacing send_room → send_room_b...');
        let replacedCount = 0;

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

                    for (const [literal, id] of templateMap) {
                        const escaped = escapeRegex(literal);
                        // 匹配 .send_room("literal" 或 'literal' 或 `literal`
                        // 替换为 .send_room_b(id
                        const re = new RegExp(
                            `(\\.send_room)\\((["'\`])${escaped}\\2(?!\\s*[+)])`,
                            'gs'
                        );
                        const newContent = content.replace(re, `.send_room_b(${id}`);
                        if (newContent !== content) {
                            content = newContent;
                            changed = true;
                            replacedCount++;
                        }
                    }

                    if (changed) {
                        fs.writeFileSync(full, content);
                    }
                }
            }
        }

        transformDir(OS_DIR);
        transformDir(WORLD_DIR);
        console.log(`[pack]   Replaced ${replacedCount} call sites`);
    }
}

console.log(`[pack] Done. Mode: ${IS_BINARY ? 'binary' : 'normal'}`);
