/**
 * Transform pfm_set mp values from lv=1000 consumption back to base values.
 * Formula from PERFORM.query_mp(): actual = base * (20 + lv) / 20
 * At lv=1000: actual = base * 51
 * So: base = actual / 51
 */
import { readFileSync, writeFileSync, readdirSync, statSync } from 'fs';
import { join } from 'path';

const DRY_RUN = process.argv.includes('--dry-run');
const LV_FACTOR = 51; // (20 + 1000) / 20

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

function transformFile(filePath) {
    let content = readFileSync(filePath, 'utf-8');
    if (!content.includes('pfm_set')) return null;
    if (!content.includes('mp:')) return null;

    // Check if this is an uncompleted skill (has TODO comments or static query_enable_prop)
    // Actually, we check by mp value magnitude

    let modified = false;
    const changes = [];

    // Match mp: <number> in pfm_set blocks
    // Pattern: mp: <value>,
    const mpRegex = /(\bmp:\s*)(\d+(?:\.\d+)?)([,\s]*)/g;
    let newContent = content;
    let m;

    while ((m = mpRegex.exec(content)) !== null) {
        const fullMatch = m[0];
        const prefix = m[1];
        const mpVal = parseFloat(m[2]);
        const suffix = m[3];

        // Only convert values that are exact multiples of 51 and >= 51
        // (Small values are already base values from old/completed skills)
        if (mpVal >= 50 && mpVal % LV_FACTOR === 0) {
            const baseVal = Math.round(mpVal / LV_FACTOR);
            const replacement = prefix + baseVal + suffix;
            changes.push({ old: mpVal, new: baseVal });
            modified = true;

            // Replace in content (careful with string positions)
            newContent = newContent.replace(fullMatch, replacement);
        } else if (mpVal >= 50 && mpVal % LV_FACTOR !== 0) {
            // Non-multiple — needs manual review
            const nearestBase = Math.round(mpVal / LV_FACTOR);
            const nearestLv1000 = nearestBase * LV_FACTOR;
            console.log(`  REVIEW: ${filePath}: mp=${mpVal} not divisible by ${LV_FACTOR}, nearest base=${nearestBase} (gives ${nearestLv1000})`);
        }
    }

    if (!modified) return null;

    return { content: newContent, changes };
}

// Main
const baseDir = 'server/res/skill';
const dirs = ['blade', 'club', 'dodge', 'force', 'parry', 'staff', 'sword', 'throwing', 'unarmed', 'whip'];

let totalFiles = 0;
let modifiedFiles = 0;

for (const d of dirs) {
    const dirPath = join(baseDir, d);
    try { if (!statSync(dirPath).isDirectory()) continue; } catch(e) { continue; }
    const files = walkDir(dirPath);
    for (const file of files) {
        totalFiles++;
        const result = transformFile(file);
        if (result) {
            modifiedFiles++;
            const shortName = file.replace(/\\/g, '/');
            console.log(`\n${shortName}:`);
            for (const c of result.changes) {
                console.log(`  mp: ${c.old} -> ${c.new} (base: ${c.new}, verify: ${c.new}*${LV_FACTOR}=${c.new * LV_FACTOR})`);
            }
            if (!DRY_RUN) {
                writeFileSync(file, result.content, 'utf-8');
            }
        }
    }
}

console.log(`\n=== Summary: ${modifiedFiles}/${totalFiles} files modified ===`);
if (DRY_RUN) {
    console.log('DRY RUN - no files were actually written. Remove --dry-run to apply changes.');
}
