import { readFileSync, readdirSync, statSync } from 'fs';
import { join } from 'path';

function walkDir(dir) {
    const results = [];
    const list = readdirSync(dir);
    for (const item of list) {
        const fullPath = join(dir, item);
        if (statSync(fullPath).isDirectory()) {
            results.push(...walkDir(fullPath));
        } else if (item.endsWith('.ts')) {
            results.push(fullPath);
        }
    }
    return results;
}

const baseDir = 'server/res/skill';
const dirs = ['blade', 'club', 'dodge', 'force', 'new', 'parry', 'staff', 'sword', 'throwing', 'unarmed', 'whip'];

const allProps = new Map(); // propName -> Set of values

for (const d of dirs) {
    const dirPath = join(baseDir, d);
    try { if (!statSync(dirPath).isDirectory()) continue; } catch(e) { continue; }
    const files = walkDir(dirPath);
    for (const file of files) {
        const content = readFileSync(file, 'utf-8');
        if (!content.includes('query_enable_prop')) continue;

        // Find the function
        const fnStart = content.indexOf('query_enable_prop(');
        if (fnStart === -1) continue;

        // Extract from the function start to the closing brace
        let braceCount = 0;
        let fnEnd = fnStart;
        let inFn = false;
        for (let i = fnStart; i < content.length; i++) {
            if (content[i] === '{') {
                braceCount++;
                inFn = true;
            } else if (content[i] === '}') {
                braceCount--;
                if (inFn && braceCount === 0) {
                    fnEnd = i + 1;
                    break;
                }
            }
        }

        const fn = content.substring(fnStart, fnEnd);
        if (fn.includes('lv *') || fn.includes('lv +') || fn.includes('lv -') ||
            fn.includes('lv /') || fn.includes('parseInt(lv') || fn.includes('Math.floor(lv')) continue;

        // Extract static properties
        const props = {};
        const propRegex = /(\w+):\s*(-?\d+(?:\.\d+)?)/g;
        let m;
        while ((m = propRegex.exec(fn)) !== null) {
            if (!['name', 'id', 'grade', 'distime', 'mp', 'release_time', 'duration'].includes(m[1])) {
                const val = parseFloat(m[2]);
                props[m[1]] = val;
                if (!allProps.has(m[1])) allProps.set(m[1], new Set());
                allProps.get(m[1]).add(val);
            }
        }

        if (Object.keys(props).length > 0) {
            console.log(file.replace(/\\/g, '/') + ' | ' + JSON.stringify(props));
        }
    }
}

// Print summary of all property keys and value ranges
console.log('\n=== Property Summary ===');
for (const [propName, values] of allProps) {
    const sorted = [...values].sort((a,b) => a-b);
    console.log(propName + ': ' + sorted.join(', '));
}
