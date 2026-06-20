/**
 * Migrate PUBLIC skills from weapon-type directories to public/grade0-6/ directories.
 * - Moves files
 * - Updates import paths (one level deeper now)
 * - Preserves family skills in their current locations
 */
import { readFileSync, writeFileSync, readdirSync, statSync, mkdirSync, renameSync, existsSync } from 'fs';
import { join, dirname, basename, relative, resolve } from 'path';

const DRY_RUN = process.argv.includes('--dry-run');
const BASE = 'server/res/skill';
const PUBLIC_DIR = join(BASE, 'public');

// Track what we do
const moves = [];
const errors = [];

function walk(dir) {
    const results = [];
    for (const item of readdirSync(dir)) {
        const p = join(dir, item);
        if (statSync(p).isDirectory()) {
            // Skip family directories, base, knowage, monster
            if (['emei', 'gaibang', 'huashan', 'shaolin', 'wudang', 'xiaoyao', 'shashou', 'base', 'knowage', 'monster', 'public'].includes(item)) {
                continue;
            }
            results.push(...walk(p));
        } else if (item.endsWith('.ts')) {
            results.push(p);
        }
    }
    return results;
}

function isPublicSkill(filePath) {
    const content = readFileSync(filePath, 'utf-8');
    // Has no family assignment
    if (/family\s*=\s*FAMILIES\./.test(content)) return false;
    // Must have a grade
    if (!/grade\s*=\s*\d+/.test(content)) return false;
    // Skip base/type skills
    if (/type\s*=\s*SKILL_TYPES\.BASE/.test(content)) return false;
    if (/type\s*=\s*SKILL_TYPES\.KNOWLEDGE/.test(content)) return false;
    return true;
}

function fixImportPaths(content) {
    // Import paths use ../../../core/... style
    // Moving from skill/<type>/ to skill/public/gradeN/ adds one more level
    // So ../../../core/ becomes ../../../../core/
    // And ../../core/ becomes ../../../core/

    return content
        // Fix: "../../../core/" -> "../../../../core/"
        .replace(/from\s+["']\.\.\/\.\.\/\.\.\/core\//g, 'from "../../../../core/')
        .replace(/from\s+["']\.\.\/\.\.\/\.\.\/types\//g, 'from "../../../../types/')
        // Fix: "../../core/" -> "../../../core/"
        .replace(/from\s+["']\.\.\/\.\.\/core\//g, 'from "../../../core/')
        .replace(/from\s+["']\.\.\/\.\.\/types\//g, 'from "../../../types/');
}

// Find all public skills
console.log('Scanning for public skills...');
const publicSkills = [];
for (const file of walk(BASE)) {
    if (isPublicSkill(file)) {
        publicSkills.push(file);
    }
}

console.log(`Found ${publicSkills.length} public skills\n`);

// Group by grade
for (const file of publicSkills) {
    const content = readFileSync(file, 'utf-8');
    const gradeMatch = content.match(/grade\s*=\s*(\d+)/);
    const grade = parseInt(gradeMatch[1]);
    const nameMatch = content.match(/name\s*=\s*["']([^"']+)["']/);
    const idMatch = content.match(/id\s*=\s*["']([^"']+)["']/);
    const name = nameMatch ? nameMatch[1] : '?';
    const id = idMatch ? idMatch[1] : '?';

    const gradeDir = join(PUBLIC_DIR, `grade${grade}`);
    const newPath = join(gradeDir, basename(file));

    if (file === newPath) {
        console.log(`SKIP (already in place): ${file}`);
        continue;
    }

    moves.push({ file, newPath, grade, name, id });
}

// Show plan
console.log('=== Migration Plan ===');
for (let g = 0; g <= 6; g++) {
    const group = moves.filter(m => m.grade === g);
    if (group.length > 0) {
        console.log(`\nGrade ${g} (${group.length} skills):`);
        for (const m of group) {
            console.log(`  ${m.file} -> ${m.newPath}`);
        }
    }
}

if (DRY_RUN) {
    console.log('\n=== DRY RUN - no changes made. Remove --dry-run to apply. ===');
    process.exit(0);
}

// Apply moves
console.log('\n=== Applying moves... ===');
let movedCount = 0;

for (const m of moves) {
    try {
        // Ensure target directory exists
        const targetDir = dirname(m.newPath);
        if (!existsSync(targetDir)) {
            mkdirSync(targetDir, { recursive: true });
        }

        // Check if target already exists
        if (existsSync(m.newPath)) {
            console.log(`WARN: Target exists, skipping: ${m.newPath}`);
            continue;
        }

        // Read content, fix paths, write to new location
        let content = readFileSync(m.file, 'utf-8');
        const newContent = fixImportPaths(content);

        // Verify the fix looks reasonable
        if (newContent.includes('from "../../../core/') || newContent.includes("from '../../../core/")) {
            // After fix, it should NOT have 3-level paths anymore
            console.log(`WARN: Possible path issue in ${m.file}`);
        }

        writeFileSync(m.newPath, newContent, 'utf-8');
        console.log(`OK: ${m.file} -> ${m.newPath}`);
        movedCount++;
    } catch (e) {
        console.error(`ERROR moving ${m.file}:`, e.message);
        errors.push({ file: m.file, error: e.message });
    }
}

console.log(`\n=== Moved ${movedCount}/${moves.length} files ===`);
if (errors.length > 0) {
    console.log('Errors:');
    for (const e of errors) {
        console.log(`  ${e.file}: ${e.error}`);
    }
}

console.log('\nIMPORTANT: Old files still exist. Delete them manually after verifying.');
console.log('Run: git clean -fd server/res/skill/  (after committing the new files)');
