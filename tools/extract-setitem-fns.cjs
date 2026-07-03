/**
 * Auto-extract inline anonymous functions in set_item() calls
 * into named class methods following the 物品名_do_操作名 convention.
 *
 * Usage: node tools/extract-setitem-fns.cjs [--dry-run] [file1.ts file2.ts ...]
 *   If no files specified, scans server/res/map/ recursively.
 */

const fs = require('fs');
const path = require('path');

const MAP_DIR = path.resolve(__dirname, '../server/res/map');

function findFiles(dir) {
    const results = [];
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
        const full = path.join(dir, entry.name);
        if (entry.isDirectory()) {
            results.push(...findFiles(full));
        } else if (entry.name.endsWith('.ts')) {
            results.push(full);
        }
    }
    return results;
}

/**
 * Find all set_item calls with inline function(me) or function(me, par) bodies.
 */
function findInlineSetItemFns(content, filePath) {
    const results = [];

    // Find each this.set_item(...) call
    const setItemRegex = /this\.set_item\s*\(/g;
    let match;

    while ((match = setItemRegex.exec(content)) !== null) {
        const callStart = match.index;

        // Extract item_id: first string argument after set_item(
        const afterParen = content.slice(match.index + match[0].length);
        const itemIdMatch = afterParen.match(/^\s*"([^"]*)"/);
        if (!itemIdMatch) continue;
        const itemId = itemIdMatch[1];

        // Find the matching closing paren for the set_item call
        let depth = 0;
        let callEnd = match.index;
        let inString = false;
        let stringChar = '';

        for (let i = match.index; i < content.length; i++) {
            const ch = content[i];
            const prev = i > 0 ? content[i - 1] : '';

            if (inString) {
                if (ch === stringChar && prev !== '\\') inString = false;
                continue;
            }
            if (ch === '"' || ch === "'" || ch === '`') {
                inString = true;
                stringChar = ch;
                continue;
            }
            if (ch === '(') depth++;
            else if (ch === ')') {
                depth--;
                if (depth === 0) {
                    callEnd = i + 1;
                    break;
                }
            }
        }

        const fullCall = content.slice(callStart, callEnd);

        // Find inline function expressions: function (me[, ...]) {
        const fnRegex = /\bfunction\s*\(([^)]*)\)\s*\{/g;
        let fnMatch;

        while ((fnMatch = fnRegex.exec(fullCall)) !== null) {
            const params = fnMatch[1].trim();
            const fnBodyStart = callStart + fnMatch.index + fnMatch[0].length;

            // Find matching closing brace
            let braceDepth = 1;
            let j = fnBodyStart;
            inString = false;
            stringChar = '';

            for (; j < content.length; j++) {
                const ch = content[j];
                const prev = j > 0 ? content[j - 1] : '';

                if (inString) {
                    if (ch === stringChar && prev !== '\\') inString = false;
                    continue;
                }
                if (ch === '"' || ch === "'" || ch === '`') {
                    inString = true;
                    stringChar = ch;
                    continue;
                }
                if (ch === '{') braceDepth++;
                else if (ch === '}') {
                    braceDepth--;
                    if (braceDepth === 0) {
                        j++;
                        break;
                    }
                }
            }

            const fnBody = content.slice(fnBodyStart, j - 1);
            const fnStartInFile = callStart + fnMatch.index;
            const fnEndInFile = j;

            // Find action name: look backwards from function for ["action", "desc",
            const beforeFn = fullCall.slice(0, fnMatch.index);
            // Match the inner array: ["action", "desc", (with optional whitespace/newlines)
            const actionMatch = beforeFn.match(/\[\s*"(\w+)"\s*,\s*"[^"]*"\s*,\s*$/);
            const actionName = actionMatch ? actionMatch[1] : null;

            if (!actionName) {
                console.warn(`  [WARN] Could not parse action in ${filePath} for item "${itemId}"`);
                console.warn(`    beforeFn ends with: ${JSON.stringify(beforeFn.slice(-60))}`);
                continue;
            }

            results.push({
                fnStart: fnStartInFile,
                fnEnd: fnEndInFile,
                itemId,
                action: actionName,
                params,
                body: fnBody,
            });
        }
    }

    return results;
}

function processFile(filePath, dryRun) {
    const content = fs.readFileSync(filePath, 'utf8');
    const findings = findInlineSetItemFns(content, filePath);

    if (findings.length === 0) return { filePath, changes: 0, methods: [] };

    console.log(`\n${dryRun ? '[DRY RUN] ' : ''}Processing: ${path.relative(process.cwd(), filePath)}`);

    let newContent = content;

    // Process in reverse order to preserve positions
    const sorted = [...findings].sort((a, b) => b.fnStart - a.fnStart);

    for (const f of sorted) {
        const methodName = `${f.itemId}_do_${f.action}`;

        // Type the params: 'me' → 'me: USER', others keep as-is
        let typedParams = f.params;
        if (!typedParams.includes(':')) {
            typedParams = typedParams.split(',').map(p => {
                const trimmed = p.trim();
                if (!trimmed) return trimmed;
                if (trimmed === 'me') return 'me: USER';
                if (trimmed === 'par') return 'par: string';
                return trimmed; // arg, etc. — leave untyped
            }).join(', ');
        }

        // Re-indent body: original body at 20-24 spaces → 8 spaces (2 levels)
        let bodyLines = f.body.split('\n');
        // Strip leading/trailing blank lines
        while (bodyLines.length > 0 && bodyLines[0].trim() === '') bodyLines.shift();
        while (bodyLines.length > 0 && bodyLines[bodyLines.length - 1].trim() === '') bodyLines.pop();
        // Detect common leading whitespace to strip
        let minIndent = Infinity;
        for (const line of bodyLines) {
            if (line.trim() === '') continue;
            const indent = line.match(/^(\s*)/)[1].length;
            if (indent < minIndent) minIndent = indent;
        }
        if (minIndent === Infinity) minIndent = 0;

        const indentedBody = bodyLines.map(line => {
            if (line.trim() === '') return '';
            const stripped = line.slice(minIndent);
            return '        ' + stripped; // 8 spaces for method body
        }).join('\n');

        const trimmedBody = indentedBody.replace(/\s+$/, '');
        const methodDef = `    ${methodName}(${typedParams}) {\n${trimmedBody}\n    }`;

        console.log(`  - ${methodName}(${typedParams})`);

        // Replace the inline function with this.methodName
        newContent = newContent.slice(0, f.fnStart) + `this.${methodName}` + newContent.slice(f.fnEnd);
    }

    // Insert the new methods after the constructor's closing brace
    // Find constructor closing brace
    const ctorStartMatch = newContent.match(/\bconstructor\s*\([^)]*\)\s*\{/);
    if (!ctorStartMatch) {
        console.warn(`  [WARN] No constructor found in ${filePath}`);
        return { filePath, changes: 0, methods: [] };
    }

    const ctorOpen = ctorStartMatch.index + ctorStartMatch[0].length;
    let depth = 1;
    let j = ctorOpen;
    let inString = false;
    let stringChar = '';

    for (; j < newContent.length; j++) {
        const ch = newContent[j];
        const prev = j > 0 ? newContent[j - 1] : '';
        if (inString) {
            if (ch === stringChar && prev !== '\\') inString = false;
            continue;
        }
        if (ch === '"' || ch === "'" || ch === '`') {
            inString = true;
            stringChar = ch;
            continue;
        }
        if (ch === '{') depth++;
        else if (ch === '}') {
            depth--;
            if (depth === 0) {
                j++;
                break;
            }
        }
    }

    // Collect method defs in original order (not reverse)
    const methodDefs = findings.map(f => {
        const methodName = `${f.itemId}_do_${f.action}`;
        let typedParams = f.params;
        if (!typedParams.includes(':')) {
            typedParams = typedParams.split(',').map(p => {
                const trimmed = p.trim();
                if (!trimmed) return trimmed;
                if (trimmed === 'me') return 'me: USER';
                return trimmed;
            }).join(', ');
        }
        let bodyLines = f.body.split('\n');
        // Strip leading/trailing blank lines
        while (bodyLines.length > 0 && bodyLines[0].trim() === '') bodyLines.shift();
        while (bodyLines.length > 0 && bodyLines[bodyLines.length - 1].trim() === '') bodyLines.pop();
        let minIndent = Infinity;
        for (const line of bodyLines) {
            if (line.trim() === '') continue;
            const indent = line.match(/^(\s*)/)[1].length;
            if (indent < minIndent) minIndent = indent;
        }
        if (minIndent === Infinity) minIndent = 0;
        const indentedBody = bodyLines.map(line => {
            if (line.trim() === '') return '';
            return '        ' + line.slice(minIndent);
        }).join('\n');
        const trimmedBody = indentedBody.replace(/\s+$/, '');
        return `    ${methodName}(${typedParams}) {\n${trimmedBody}\n    }`;
    });

    const methodsStr = '\n\n' + methodDefs.join('\n\n');
    newContent = newContent.slice(0, j) + methodsStr + newContent.slice(j);

    if (!dryRun) {
        fs.writeFileSync(filePath, newContent, 'utf8');
        console.log(`  -> Written ${findings.length} method(s)`);
    } else {
        // Show preview of what would be inserted
        console.log(`  [DRY RUN] Would insert after constructor:`);
        for (const def of methodDefs) {
            console.log(def);
        }
    }

    return { filePath, changes: findings.length };
}

// Main
const args = process.argv.slice(2);
const dryRun = args.includes('--dry-run');
const fileArgs = args.filter(a => a !== '--dry-run');

let files;
if (fileArgs.length > 0) {
    files = fileArgs.map(f => path.resolve(f));
} else {
    files = findFiles(MAP_DIR);
}

console.log(`Scanning ${files.length} file(s)...`);

let totalChanges = 0;
const results = [];

for (const f of files) {
    const result = processFile(f, dryRun);
    if (result.changes > 0) {
        totalChanges += result.changes;
        results.push(result);
    }
}

console.log(`\n${dryRun ? '[DRY RUN] ' : ''}Done. ${results.length} file(s) modified, ${totalChanges} method(s) extracted.`);

if (dryRun) {
    console.log('\nRun without --dry-run to apply changes.');
}
