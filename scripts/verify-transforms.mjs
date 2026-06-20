import { readFileSync, readdirSync, statSync } from 'fs';
import { join } from 'path';

function walk(dir) {
    const results = [];
    for (const item of readdirSync(dir)) {
        const p = join(dir, item);
        if (statSync(p).isDirectory()) { results.push(...walk(p)); }
        else if (item.endsWith('.ts')) { results.push(p); }
    }
    return results;
}

const allGains = [];
let totalDynamic = 0;
let totalStatic = 0;

for (const file of walk('server/res/skill')) {
    const content = readFileSync(file, 'utf-8');
    if (!content.includes('query_enable_prop')) continue;

    const fnStart = content.indexOf('query_enable_prop(');
    if (fnStart === -1) continue;

    let braceCount = 0, fnEnd = fnStart, inFn = false;
    for (let i = fnStart; i < content.length; i++) {
        if (content[i] === '{') { braceCount++; inFn = true; }
        else if (content[i] === '}') { braceCount--; if (inFn && braceCount === 0) { fnEnd = i + 1; break; } }
    }

    const fn = content.substring(fnStart, fnEnd);

    // Find all lv * gain patterns
    const dynamicPattern = /lv\s*\*\s*([\d.]+)/g;
    let dm;
    while ((dm = dynamicPattern.exec(fn)) !== null) {
        totalDynamic++;
        const gain = parseFloat(dm[1]);
        allGains.push({ file: file.replace(/\\/g, '/'), gain });
    }

    // Count static values
    for (const line of fn.split('\n')) {
        const sm = line.match(/^\s*(\w+):\s*(-?\d+(?:\.\d+)?)[,\s]*$/);
        if (sm && !['name','id','grade','distime','mp','release_time','duration','desc'].includes(sm[1])) {
            if (!line.includes('lv ') && !line.includes('Math.floor')) {
                totalStatic++;
            }
        }
    }
}

console.log('Total dynamic expressions:', totalDynamic);
console.log('Total remaining static values:', totalStatic);

// Check for gains with >3 significant digits
let badGains = 0;
for (const g of allGains) {
    if (g.gain === 0) continue;
    // Count significant digits properly
    const s = Math.abs(g.gain).toExponential();
    const m = s.match(/^(\d)\.(\d+)e/);
    const digits = m ? (m[1] + m[2]).length : String(Math.abs(g.gain)).replace('.','').replace(/^0+/,'').length;
    if (digits > 3) {
        badGains++;
        console.log(`WARN: ${digits} sig digits: ${g.file} gain=${g.gain}`);
    }
}

if (badGains === 0) console.log('All gains have <=3 significant digits - OK');

// Gain distribution
const gains = [...new Set(allGains.map(g => g.gain))].sort((a,b) => a-b);
console.log('\nGain distribution (' + gains.length + ' unique):');
console.log('  <1:', gains.filter(g => g < 1).length);
console.log('  1-2:', gains.filter(g => g >= 1 && g < 2).length);
console.log('  2-3:', gains.filter(g => g >= 2 && g < 3).length);
console.log('  3-10:', gains.filter(g => g >= 3 && g < 10).length);
console.log('  10-100:', gains.filter(g => g >= 10 && g < 100).length);
console.log('  100+:', gains.filter(g => g >= 100).length);
console.log('\nSample gains:', gains.filter(g => g < 5).slice(0, 30).join(', '));
