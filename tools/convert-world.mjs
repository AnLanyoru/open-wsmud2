/**
 * 将 world/ 下文件从 export default function() { this.inherits(X) } 转换为 export default class extends X
 * 用法: node tools/convert-world.mjs [--dry-run]
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import * as acorn from 'acorn';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const WORLD_DIR = path.join(__dirname, '..', 'world');
const OS_DIR = path.join(__dirname, '..', 'os');
const DRY_RUN = process.argv.includes('--dry-run');

const CLASS_FILE = {
    ROOM:'room/room.js', NPC:'char/npc.js', MONSTER:'char/monster.js',
    CHARACTER:'char/character.js', OBJ:'item/obj.js', EQUIPMENT:'item/equipment.js',
    CONTAINER:'item/container.js', CORPSE:'item/corpse.js', COMMAND:'command.js',
    SKILL:'skill/skill.js', PERFORM:'skill/skill.js', FAMILY:'skill/family.js',
    AREA:'room/area.js', FAMILY_AREA:'room/fam_area.js',
    USERTASK:'task/playertask.js', TASK:'task/task.js',
    MONEY:'item/money.js', BASE:'base.js',
};

const KNOWN_GLOBALS = [
    'WORLD','OBJ','UTIL','FAMILIES','SKILL','PERFORM','SKILL_TYPES',
    'BASE_SKILLS','EQUIP_TYPE','WEAPON_TYPE','PROPERTIES',
    'CHARACTER','MONSTER','NPC','AREA','ROOM','USER','FOLLOWER',
    'CORPSE','MONEY','EQUIPMENT','CONTAINER','ITEM','BASE',
    'FAMILY','FAMILY_AREA','TASK','USERTASK','EVENTS','COMMAND',
    '__CONFIG','__PATH',
];

let stats = { ok: 0, skip: 0, extends: 0, errors: [] };

function walk(dir) {
    const files = [];
    for (const e of fs.readdirSync(dir)) {
        const f = path.join(dir, e);
        if (fs.statSync(f).isDirectory()) files.push(...walk(f));
        else if (e.endsWith('.js')) files.push(f);
    }
    return files;
}

function indent(text, n) {
    const pad = ' '.repeat(n);
    return text.split('\n').map(l => l.trim() ? pad + l : l).join('\n');
}

function findGlobals(src, baseClass) {
    const used = [];
    for (const g of KNOWN_GLOBALS) {
        if (g === baseClass) continue;
        const re = new RegExp(`(?:^|[^a-zA-Z0-9_$.])${g}(?:[^a-zA-Z0-9_]|$)`, 'm');
        if (re.test(src)) used.push(g);
    }
    return used;
}

function convert(filePath) {
    const rel = path.relative(WORLD_DIR, filePath);
    let src;
    try { src = fs.readFileSync(filePath, 'utf8'); }
    catch (e) { stats.errors.push(`${rel}: read - ${e.message}`); return; }

    // Skip extends/
    if (filePath.replace(/\\/g, '/').includes('world/extends/')) {
        stats.extends++;
        if (!DRY_RUN) console.log(`  SKIP extends: ${rel}`);
        return;
    }

    // Check if already converted (contains export default class)
    if (/export default class/.test(src)) {
        stats.skip++;
        return;
    }

    // Must have export default function() wrapper from previous conversion
    if (!/export default function/.test(src)) {
        stats.skip++;
        console.log(`  SKIP (no wrapper): ${rel}`);
        return;
    }

    // Extract the function body content (inside export default function() { ... })
    let bodySrc;
    try {
        const ast = acorn.parse(src, {
            ecmaVersion: 2022, sourceType: 'module', locations: true,
            allowReturnOutsideFunction: true,
        });
        // Find the export default FunctionDeclaration/Expression
        let funcNode = null;
        for (const stmt of ast.body) {
            if (stmt.type === 'ExportDefaultDeclaration' &&
                stmt.declaration.type === 'FunctionDeclaration') {
                funcNode = stmt.declaration;
                break;
            }
        }
        if (!funcNode) {
            stats.errors.push(`${rel}: no function body found`);
            return;
        }
        bodySrc = src.substring(funcNode.body.start, funcNode.body.end);
    } catch (e) {
        stats.errors.push(`${rel}: parse - ${e.message}`);
        return;
    }

    // Parse the inner function body (which has this.inherits, etc.)
    let bodyAst;
    try {
        bodyAst = acorn.parse(bodySrc, {
            ecmaVersion: 2022, sourceType: 'script', locations: true,
            allowReturnOutsideFunction: true,
        });
    } catch (e) {
        stats.errors.push(`${rel}: body parse - ${e.message}`);
        return;
    }

    // bodyAst.body[0] is a BlockStatement wrapping the function body content
    const body = (bodyAst.body[0] && bodyAst.body[0].type === 'BlockStatement')
        ? bodyAst.body[0].body
        : bodyAst.body;

    // Find this.inherits(X)
    let baseClass = null;
    let inheritsIdx = -1;
    for (let i = 0; i < body.length; i++) {
        const stmt = body[i];
        if (stmt.type === 'ExpressionStatement' &&
            stmt.expression.type === 'CallExpression' &&
            stmt.expression.callee.type === 'MemberExpression' &&
            stmt.expression.callee.object.type === 'ThisExpression' &&
            stmt.expression.callee.property.name === 'inherits') {
            const arg = stmt.expression.arguments[0];
            if (arg?.type === 'Identifier') {
                baseClass = arg.name;
                inheritsIdx = i;
                break;
            }
        }
    }

    if (!baseClass || !CLASS_FILE[baseClass]) {
        stats.errors.push(`${rel}: unknown base class`);
        return;
    }

    // Categorize statements
    const classFields = [];
    const constructorBody = [];
    const classMethods = [];
    const moduleDecls = [];
    let needConstructor = false;

    for (let i = 0; i < body.length; i++) {
        if (i === inheritsIdx) continue;
        const stmt = body[i];
        const stmtSrc = bodySrc.substring(stmt.start, stmt.end);

        // Skip placeholder (empty statement)
        if (stmt.type === 'EmptyStatement') continue;

        // Function declarations → module-level
        if (stmt.type === 'FunctionDeclaration') {
            moduleDecls.push(stmtSrc);
            continue;
        }

        // Variable declarations → module-level
        if (stmt.type === 'VariableDeclaration') {
            moduleDecls.push(stmtSrc);
            continue;
        }

        if (stmt.type === 'ExpressionStatement') {
            const expr = stmt.expression;

            // this.set({...}) → expand to class fields
            if (expr.type === 'CallExpression' &&
                expr.callee.type === 'MemberExpression' &&
                expr.callee.object.type === 'ThisExpression' &&
                expr.callee.property.name === 'set' &&
                expr.arguments[0]?.type === 'ObjectExpression') {
                for (const prop of expr.arguments[0].properties) {
                    if (prop.type === 'Property' && prop.key.type === 'Identifier') {
                        classFields.push(`${prop.key.name} = ${bodySrc.substring(prop.value.start, prop.value.end)};`);
                    }
                }
                continue;
            }

            // this.method = function(...) { ... } or async function
            if (expr.type === 'AssignmentExpression' &&
                expr.left.type === 'MemberExpression' &&
                expr.left.object.type === 'ThisExpression' &&
                (expr.right.type === 'FunctionExpression' || expr.right.type === 'ArrowFunctionExpression')) {

                const name = expr.left.property.name;
                const func = expr.right;
                // Arrow functions with expression body (e.g., lv => ({...})) → keep as class field
                if (func.type === 'ArrowFunctionExpression' && func.expression) {
                    const full = bodySrc.substring(func.start, func.end);
                    classFields.push(`${name} = ${full};`);
                    continue;
                }
                const paramsStr = '(' + func.params.map(p => {
                    if (p.type === 'Identifier') return p.name;
                    return bodySrc.substring(p.start, p.end);
                }).join(', ') + ')';
                const cb = bodySrc.substring(func.body.start, func.body.end);
                const prefix = func.async ? 'async ' : '';
                classMethods.push(`${prefix}${name}${paramsStr} ${cb}`);
                continue;
            }

            // this.prop = value; (any assignment)
            if (expr.type === 'AssignmentExpression' &&
                expr.left.type === 'MemberExpression' &&
                expr.left.object.type === 'ThisExpression' &&
                expr.operator === '=' &&
                !expr.left.computed) {

                const name = expr.left.property.name;
                const val = bodySrc.substring(expr.right.start, expr.right.end);
                classFields.push(`${name} = ${val};`);
                continue;
            }

            // this.prop[i] = value; (computed assignment) → constructor
            if (expr.type === 'AssignmentExpression' &&
                expr.left.type === 'MemberExpression' &&
                expr.left.computed &&
                expr.left.object.type === 'MemberExpression' &&
                expr.left.object.object.type === 'ThisExpression') {

                constructorBody.push(stmtSrc.trim());
                needConstructor = true;
                continue;
            }

            // Bare this.prop; → class field
            if (expr.type === 'MemberExpression' &&
                expr.object.type === 'ThisExpression' &&
                !expr.computed) {
                classFields.push(`${expr.property.name};`);
                continue;
            }

            // this.method_call(args); → constructor
            if (expr.type === 'CallExpression' &&
                expr.callee.type === 'MemberExpression' &&
                expr.callee.object.type === 'ThisExpression') {

                constructorBody.push(stmtSrc.trim());
                needConstructor = true;
                continue;
            }

            // Any other expression → module-level
            moduleDecls.push(stmtSrc);
            continue;
        }

        // For / while loops at top-level using this → constructor
        if ((stmt.type === 'ForStatement' || stmt.type === 'ForInStatement' ||
            stmt.type === 'ForOfStatement' || stmt.type === 'WhileStatement') &&
            stmtSrc.includes('this.')) {
            constructorBody.push(stmtSrc.trim());
            needConstructor = true;
            continue;
        }

        // Anything else → module-level
        moduleDecls.push(stmtSrc);
    }

    // Collect variables already declared in the body (from previous converter's globals)
    const declaredVars = new Set();
    for (const decl of moduleDecls) {
        // Match "const NAME = globalThis.NAME;" or "const NAME = ..."
        const m = decl.match(/^(?:const|let|var)\s+(\w+)\s*=/);
        if (m) declaredVars.add(m[1]);
    }

    // Remove duplicate variable declarations from moduleDecls
    const seen = new Set();
    const dedupedDecls = [];
    for (const decl of moduleDecls) {
        const m = decl.match(/^(?:const|let|var)\s+(\w+)\s*=/);
        if (m) {
            if (seen.has(m[1])) continue;
            seen.add(m[1]);
        }
        dedupedDecls.push(decl);
    }

    // Scan for globals used in the body but not yet declared
    const usedGlobals = findGlobals(bodySrc, baseClass);
    const missingGlobals = usedGlobals.filter(g => !declaredVars.has(g));
    const globalDecls = missingGlobals.length > 0
        ? missingGlobals.map(g => `const ${g} = globalThis.${g};`).join('\n') + '\n'
        : '';

    // Compute import path
    const target = path.join(OS_DIR, CLASS_FILE[baseClass]);
    let importPath = path.relative(path.dirname(filePath), target).replace(/\\/g, '/');
    if (!importPath.startsWith('.')) importPath = './' + importPath;

    // Build output
    const out = [];
    out.push(`import { ${baseClass} } from "${importPath}";`);
    out.push('');
    out.push(`export default class extends ${baseClass} {`);

    // Global declarations (inside class body, before everything else — they become instance fields)
    // Actually no, they need to be at module level. But extends/ files already put them at module level.
    // For class files, if methods reference globals at runtime, they resolve via closure.
    // We add the declarations OUTSIDE the class.

    // Class fields
    if (classFields.length > 0) {
        for (const f of classFields) out.push(`    ${f}`);
    }

    // Constructor
    if (needConstructor || constructorBody.length > 0) {
        if (classFields.length > 0) out.push('');
        out.push('    constructor() {');
        out.push('        super();');
        for (const stmt of constructorBody) {
            out.push(indent(stmt, 8));
        }
        out.push('    }');
    }

    // Class methods
    if (classMethods.length > 0) {
        out.push('');
        for (const m of classMethods) out.push(`    ${m}`);
    }

    out.push('}');

    // Module-level globals + function declarations
    if (globalDecls || dedupedDecls.length > 0) {
        out.push('');
        if (globalDecls) out.push(globalDecls.trim());
        for (const decl of dedupedDecls) {
            out.push(decl);
        }
    }

    const result = out.join('\n').trimEnd() + '\n';

    if (DRY_RUN) {
        console.log(`  DRY: ${rel} (${baseClass})`);
    } else {
        fs.writeFileSync(filePath, result, 'utf8');
        console.log(`  OK: ${rel}`);
    }
    stats.ok++;
}

// Main
console.log(`World/ class conversion${DRY_RUN ? ' (DRY RUN)' : ''}\n`);

for (const file of walk(WORLD_DIR).sort()) convert(file);

console.log(`\n--- Done ---`);
console.log(`Converted: ${stats.ok}  Skipped: ${stats.skip}  Extends: ${stats.extends}  Errors: ${stats.errors.length}`);
for (const err of stats.errors) console.log(`  ! ${err}`);
