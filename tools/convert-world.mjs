/**
 * 将 world/ 下所有文件转换为 ESM：import + export default function() { ... }
 * 保持 this.inherits() 模式不变，仅改模块系统。
 * 用法: node tools/convert-world.mjs
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import * as acorn from 'acorn';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const WORLD_DIR = path.join(__dirname, '..', 'world');
const OS_DIR = path.join(__dirname, '..', 'os');

const CLASS_FILE = {
    ROOM: 'room/room.js', NPC: 'char/npc.js', MONSTER: 'char/monster.js',
    CHARACTER: 'char/character.js', OBJ: 'item/obj.js', EQUIPMENT: 'item/equipment.js',
    CONTAINER: 'item/container.js', CORPSE: 'item/corpse.js', COMMAND: 'command.js',
    SKILL: 'skill/skill.js', PERFORM: 'skill/skill.js', FAMILY: 'skill/family.js',
    AREA: 'room/area.js', FAMILY_AREA: 'room/fam_area.js',
    USERTASK: 'task/playertask.js', TASK: 'task/task.js',
    MONEY: 'item/money.js', BASE: 'base.js',
};

function walk(dir) {
    const files = [];
    for (const entry of fs.readdirSync(dir)) {
        const full = path.join(dir, entry);
        if (fs.statSync(full).isDirectory()) files.push(...walk(full));
        else if (entry.endsWith('.js')) files.push(full);
    }
    return files;
}

function convert(filePath) {
    const rel = path.relative(WORLD_DIR, filePath);
    const src = fs.readFileSync(filePath, 'utf8');

    // Find this.inherits(X) to determine base class
    let baseClass = null;
    let inheritsMatch = null;

    try {
        const ast = acorn.parse(src, {
            ecmaVersion: 2022, sourceType: 'script', locations: true,
            allowReturnOutsideFunction: true,
        });
        for (const stmt of ast.body) {
            if (stmt.type === 'ExpressionStatement' &&
                stmt.expression.type === 'CallExpression' &&
                stmt.expression.callee.type === 'MemberExpression' &&
                stmt.expression.callee.object.type === 'ThisExpression' &&
                stmt.expression.callee.property.name === 'inherits') {
                const arg = stmt.expression.arguments[0];
                if (arg && arg.type === 'Identifier') {
                    baseClass = arg.name;
                    inheritsMatch = src.substring(stmt.start, stmt.end);
                    break;
                }
            }
        }
    } catch (e) {
        // Parse error — likely an extends/ file, just wrap
    }

    // Compute import path
    let importLine = '';
    if (baseClass && CLASS_FILE[baseClass]) {
        const target = path.join(OS_DIR, CLASS_FILE[baseClass]);
        let relPath = path.relative(path.dirname(filePath), target).replace(/\\/g, '/');
        if (!relPath.startsWith('.')) relPath = './' + relPath;
        importLine = `import { ${baseClass} } from "${relPath}";`;
    } else if (!baseClass) {
        // extends/ files: no import needed for now (they use global objects)
        importLine = '';
    }

    // For extends/ files that don't have inherits: add global decls + empty export
    if (!baseClass) {
        const knownGlobals = [
            'WORLD', 'OBJ', 'UTIL', 'FAMILIES', 'SKILL', 'SKILL_TYPES',
            'BASE_SKILLS', 'EQUIP_TYPE', 'WEAPON_TYPE', 'PROPERTIES',
            'CHARACTER', 'MONSTER', 'NPC', 'AREA', 'ROOM', 'USER',
            'CORPSE', 'MONEY', 'EQUIPMENT', 'CONTAINER', 'ITEM', 'BASE',
            'FAMILY', 'FAMILY_AREA', 'TASK', 'USERTASK', 'EVENTS', 'COMMAND',
            '__CONFIG', '__PATH',
        ];
        const usedGlobals = [];
        for (const g of knownGlobals) {
            const re = new RegExp(`(?:^|[^a-zA-Z0-9_$.])${g}(?:[^a-zA-Z0-9_]|$)`, 'm');
            if (re.test(src)) usedGlobals.push(g);
        }
        const globalDecls = usedGlobals.length > 0
            ? usedGlobals.map(g => `const ${g} = globalThis.${g};`).join('\n') + '\n\n'
            : '';
        const result = globalDecls + src.trimEnd() + '\nexport default function() {}\n';
        fs.writeFileSync(filePath, result, 'utf8');
        console.log(`  OK (extends): ${rel}${usedGlobals.length > 0 ? ' +globals:' + usedGlobals.join(',') : ''}`);
        return { type: 'extends' };
    }

    // For regular files: wrap in export default function() { ... }
    // Scan for global identifiers used in the file body (outside strings/comments)
    const knownGlobals = [
        'WORLD', 'OBJ', 'UTIL', 'FAMILIES', 'SKILL', 'PERFORM', 'SKILL_TYPES',
        'BASE_SKILLS', 'EQUIP_TYPE', 'WEAPON_TYPE', 'PROPERTIES',
        'CHARACTER', 'MONSTER', 'NPC', 'AREA', 'ROOM', 'USER', 'FOLLOWER',
        'CORPSE', 'MONEY', 'EQUIPMENT', 'CONTAINER', 'ITEM', 'BASE',
        'FAMILY', 'FAMILY_AREA', 'TASK', 'USERTASK', 'EVENTS', 'COMMAND',
        '__CONFIG', '__PATH',
    ];
    const usedGlobals = [];
    for (const g of knownGlobals) {
        if (g === baseClass) continue; // already imported
        // Simple check: the identifier appears as a word boundary in source
        // Exclude: inside strings, after '.', as property key
        const re = new RegExp(`(?:^|[^a-zA-Z0-9_$.])${g}(?:[^a-zA-Z0-9_]|$)`, 'm');
        if (re.test(src)) {
            usedGlobals.push(g);
        }
    }
    const globalDecls = usedGlobals.length > 0
        ? usedGlobals.map(g => `const ${g} = globalThis.${g};`).join(' ')
        : '';

    const result = `${importLine}\n\nexport default function() {\n${globalDecls ? '    ' + globalDecls + '\n' : ''}${src.trim()}\n}\n`;
    fs.writeFileSync(filePath, result, 'utf8');
    console.log(`  OK: ${rel} (${baseClass})${usedGlobals.length > 0 ? ' +globals:' + usedGlobals.join(',') : ''}`);
    return { type: 'class', baseClass };
}

// Main
console.log('Converting world/ to ESM (import + export default function)...\n');

const stats = { ok: 0, extends: 0, errors: [] };
for (const file of walk(WORLD_DIR).sort()) {
    try {
        const r = convert(file);
        if (r.type === 'extends') stats.extends++;
        else stats.ok++;
    } catch (e) {
        stats.errors.push(`${path.relative(WORLD_DIR, file)}: ${e.message}`);
    }
}

console.log(`\n--- Done ---`);
console.log(`Regular: ${stats.ok}  Extends: ${stats.extends}  Errors: ${stats.errors.length}`);
for (const err of stats.errors) console.log(`  ! ${err}`);
