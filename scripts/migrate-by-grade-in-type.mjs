/**
 * Move public skills from public/gradeN/ back into their weapon-type directories
 * under <type>/gradeN/ subdirectories.
 *
 * Desired structure:
 *   server/res/skill/blade/grade3/kuangfengkuaidao.ts  (public, grade 3)
 *   server/res/skill/blade/ranmudao2.ts                 (SHAOLIN family, stays)
 */
import { readFileSync, writeFileSync, readdirSync, statSync, mkdirSync, renameSync, existsSync, unlinkSync, rmdirSync } from 'fs';
import { join, dirname, basename } from 'path';

const DRY_RUN = process.argv.includes('--dry-run');
const PUBLIC_DIR = 'server/res/skill/public';
const BASE = 'server/res/skill';

// Map can_enables first type to directory name
function getTypeDir(filePath) {
    const content = readFileSync(filePath, 'utf-8');
    const match = content.match(/can_enables\s*=\s*\[(.*?)\]/s);
    if (!match) return null;

    // Extract the first string value
    const firstMatch = match[1].match(/["'](\w+)["']/);
    if (!firstMatch) return null;

    return firstMatch[1]; // e.g., "blade", "dodge", "force", etc.
}

function fixImportPathsForType(content) {
    // Files are moving from public/gradeN/ to <type>/gradeN/
    // Both are 4 levels deep from server/, so import paths stay at 4 levels
    // Current path: ../../../../core/ — keep as is
    return content; // No change needed
}

// Collect all files to move
const moves = [];
for (let g = 1; g <= 6; g++) {
    const gradeDir = join(PUBLIC_DIR, `grade${g}`);
    if (!existsSync(gradeDir)) continue;

    for (const file of readdirSync(gradeDir)) {
        if (!file.endsWith('.ts')) continue;
        const srcPath = join(gradeDir, file);
        let typeDir = getTypeDir(srcPath);

        if (!typeDir) {
            // No can_enables — these are NPC/monster skills, put in new/gradeN/
            typeDir = 'new';
        }

        const destDir = join(BASE, typeDir, `grade${g}`);
        const destPath = join(destDir, file);
        moves.push({ src: srcPath, dest: destPath, file, typeDir, grade: g });
    }
}

// Also handle grade 0 from knowage/ (but those are knowledge skills, not public)

// Show plan
console.log('=== Migration Plan ===\n');
const byType = {};
for (const m of moves) {
    if (!byType[m.typeDir]) byType[m.typeDir] = { grades: {} };
    if (!byType[m.typeDir].grades[m.grade]) byType[m.typeDir].grades[m.grade] = [];
    byType[m.typeDir].grades[m.grade].push(m.file);
}

for (const [type, info] of Object.entries(byType).sort()) {
    console.log(`${type}/:`);
    for (const [g, files] of Object.entries(info.grades).sort((a,b) => a[0]-b[0])) {
        console.log(`  grade${g}/ (${files.length} files)`);
    }
}

console.log(`\nTotal: ${moves.length} files to move`);

if (DRY_RUN) {
    console.log('\n=== DRY RUN - Remove --dry-run to apply ===');
    process.exit(0);
}

// Apply moves
console.log('\n=== Applying moves... ===');
let moved = 0;

for (const m of moves) {
    const destDir = dirname(m.dest);
    if (!existsSync(destDir)) {
        mkdirSync(destDir, { recursive: true });
    }

    if (existsSync(m.dest)) {
        console.log(`SKIP: target exists: ${m.dest}`);
        continue;
    }

    const content = readFileSync(m.src, 'utf-8');
    // Import paths are already correct (4 levels deep)
    writeFileSync(m.dest, content, 'utf-8');
    unlinkSync(m.src);
    console.log(`OK: ${m.src} -> ${m.dest}`);
    moved++;
}

// Clean up empty public/gradeN directories
for (let g = 1; g <= 6; g++) {
    const gradeDir = join(PUBLIC_DIR, `grade${g}`);
    if (existsSync(gradeDir)) {
        const remaining = readdirSync(gradeDir).filter(f => f.endsWith('.ts'));
        if (remaining.length === 0) {
            rmdirSync(gradeDir);
            console.log(`Cleaned up empty dir: ${gradeDir}`);
        } else {
            console.log(`WARN: ${remaining.length} files remain in ${gradeDir}: ${remaining.join(', ')}`);
        }
    }
}

// Try to remove public/ if empty
if (existsSync(PUBLIC_DIR)) {
    const entries = readdirSync(PUBLIC_DIR);
    if (entries.length === 0) {
        rmdirSync(PUBLIC_DIR);
        console.log('Cleaned up empty dir: ' + PUBLIC_DIR);
    }
}

console.log(`\n=== Done: ${moved} files moved ===`);
