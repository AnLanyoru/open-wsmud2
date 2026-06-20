import { readFileSync, readdirSync, statSync } from 'fs';
import { join, basename, dirname } from 'path';

function walk(dir) {
    const results = [];
    for (const item of readdirSync(dir)) {
        const p = join(dir, item);
        if (statSync(p).isDirectory()) { results.push(...walk(p)); }
        else if (item.endsWith('.ts')) { results.push(p); }
    }
    return results;
}

const skills = [];
for (const file of walk('server/res/skill')) {
    const content = readFileSync(file, 'utf-8');
    const gradeMatch = content.match(/grade\s*=\s*(\d+)/);
    const familyMatch = content.match(/family\s*=\s*FAMILIES\.(\w+)/);
    const idMatch = content.match(/id\s*=\s*["']([^"']+)["']/);
    const nameMatch = content.match(/name\s*=\s*["']([^"']+)["']/);
    const typeMatch = content.match(/type\s*=\s*SKILL_TYPES\.(\w+)/);

    if (gradeMatch && idMatch) {
        const type = typeMatch ? typeMatch[1] : 'SKILL';
        skills.push({
            file: file.replace(/\\/g, '/'),
            grade: parseInt(gradeMatch[1]),
            family: familyMatch ? familyMatch[1] : 'PUBLIC',
            id: idMatch[1],
            name: nameMatch ? nameMatch[1] : '?',
            type,
        });
    }
}

// Show all PUBLIC (no family) skills grouped by grade
const publicSkills = skills.filter(s => s.family === 'PUBLIC' && s.type !== 'BASE');
console.log('=== PUBLIC skills by grade ===');
for (let g = 0; g <= 6; g++) {
    const list = publicSkills.filter(s => s.grade === g);
    if (list.length > 0) {
        console.log(`\n-- Grade ${g} (${list.length} skills) --`);
        for (const s of list) {
            const dir = dirname(s.file);
            console.log(`  [${dir}] ${s.id} (${s.name})`);
        }
    }
}

// Show family skills too
console.log('\n\n=== FAMILY skills ===');
const familySkills = skills.filter(s => s.family !== 'PUBLIC');
const byFamily = {};
for (const s of familySkills) {
    if (!byFamily[s.family]) byFamily[s.family] = [];
    byFamily[s.family].push(s);
}
for (const [fam, list] of Object.entries(byFamily).sort()) {
    console.log(`\n${fam}: ${list.length} skills`);
    for (const s of list) {
        console.log(`  grade=${s.grade} ${s.id} (${s.name}) - ${s.file}`);
    }
}

// Summary
console.log('\n\n=== SUMMARY ===');
console.log('Total skills:', skills.length);
console.log('Public:', publicSkills.length);
console.log('Family:', familySkills.length);
console.log('Base:', skills.filter(s => s.type === 'BASE').length);
console.log('Knowledge:', skills.filter(s => s.type === 'KNOWLEDGE').length);
