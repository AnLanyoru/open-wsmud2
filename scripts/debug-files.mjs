import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

const oldList = execSync('git ls-tree -r --name-only HEAD~1 server/res/skill/', { encoding: 'utf-8' });
const oldFiles = new Set(oldList.split('\n').filter(f => f));

function walk(d) {
    const files = [];
    for (const e of fs.readdirSync(d, {withFileTypes:true})) {
        const f = path.join(d, e.name).replace(/\\/g, '/');
        if (e.isDirectory()) files.push(...walk(f));
        else if (e.name.endsWith('.ts')) files.push(f);
    }
    return files;
}
const all = walk('server/res/skill');
const newFiles = all.filter(f => !oldFiles.has(f));

console.log('Old files count: ' + oldFiles.size);
console.log('All files on disk: ' + all.length);
console.log('New files: ' + newFiles.length);
console.log('Sample new:');
newFiles.slice(0, 5).forEach(f => console.log('  ' + f));
console.log('Sample old:');
[...oldFiles].slice(0, 5).forEach(f => console.log('  ' + f));
