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
const dirs = ['blade', 'club', 'dodge', 'force', 'parry', 'staff', 'sword', 'throwing', 'unarmed', 'whip'];

const allMpValues = [];
const filesWithMp = new Map();

for (const d of dirs) {
    const dirPath = join(baseDir, d);
    try { if (!statSync(dirPath).isDirectory()) continue; } catch(e) { continue; }
    const files = walkDir(dirPath);
    for (const file of files) {
        const content = readFileSync(file, 'utf-8');
        // Find all mp values in pfm_set blocks
        const mpRegex = /\bmp:\s*(-?\d+(?:\.\d+)?)/g;
        let m;
        while ((m = mpRegex.exec(content)) !== null) {
            const mpVal = parseFloat(m[1]);
            allMpValues.push({ file: file.replace(/\\/g, '/'), mp: mpVal });
            if (!filesWithMp.has(file)) filesWithMp.set(file, []);
            filesWithMp.get(file).push(mpVal);
        }
    }
}

console.log('All mp values found:');
console.log('='.repeat(60));

// Group by value
const valueMap = new Map();
for (const item of allMpValues) {
    if (!valueMap.has(item.mp)) valueMap.set(item.mp, []);
    valueMap.get(item.mp).push(item.file);
}

// Sort by mp value
const sortedVals = [...valueMap.keys()].sort((a, b) => a - b);
for (const val of sortedVals) {
    const files = valueMap.get(val);
    const baseVal = Math.round(val / 51);
    const verify = baseVal * 51;
    const match = verify === Math.round(val) ? '' : ' MISMATCH';
    console.log(`mp: ${val} -> base: ${baseVal} (verify: ${baseVal}*51=${verify})${match} — ${files.length} files`);
}

console.log('\n='.repeat(60));
console.log('Total unique mp values:', sortedVals.length);
console.log('Total mp occurrences:', allMpValues.length);
