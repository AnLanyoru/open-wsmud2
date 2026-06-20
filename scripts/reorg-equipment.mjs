/**
 * Reorganize equipment files:
 * - From: eq/new/ws_eq_XXX.ts
 * - To:   eq/lv{grade}/{pinyin}.ts
 */
import fs from 'fs';
import path from 'path';
import { pinyin } from 'pinyin';

const OBJ_DIR = 'server/res/obj/eq';

function toPinyin(name) {
    // Convert Chinese name to pinyin filename (lowercase, no spaces, no tones)
    const py = pinyin(name, {
        style: 0,  // STYLE_NORMAL = plain pinyin without tone marks
    });
    // Join all pinyin arrays into a single string
    let result = '';
    for (const seg of py) {
        result += seg[0];
    }
    // Clean: lowercase, remove non-alphanumeric
    result = result.toLowerCase().replace(/[^a-z0-9]/g, '');
    return result;
}

async function main() {
    // Read the new/ directory
    const newDir = path.join(OBJ_DIR, 'new');
    if (!fs.existsSync(newDir)) {
        console.log('No new/ directory found');
        return;
    }

    const files = fs.readdirSync(newDir).filter(f => f.endsWith('.ts'));
    console.log(`Found ${files.length} files to reorganize\n`);

    let movedCount = 0;
    const moved = [];
    const skipped = [];

    for (const file of files) {
        const filePath = path.join(newDir, file);
        const content = fs.readFileSync(filePath, 'utf-8');

        // Extract name and grade
        const nameMatch = content.match(/name\s*=\s*"([^"]+)"/);
        const gradeMatch = content.match(/grade\s*=\s*(\d+)/);
        if (!nameMatch || gradeMatch === null) {
            skipped.push({ file, reason: 'cannot extract name/grade' });
            continue;
        }

        const name = nameMatch[1];
        const grade = parseInt(gradeMatch[1]);
        let pinyinName = toPinyin(name);

        // Ensure non-empty filename
        if (!pinyinName || pinyinName.length < 2) {
            pinyinName = 'item_' + grade;
        }

        // Create target directory
        const targetDir = path.join(OBJ_DIR, `lv${grade}`);
        fs.mkdirSync(targetDir, { recursive: true });

        // Handle name collisions
        let targetName = pinyinName;
        let counter = 1;
        while (fs.existsSync(path.join(targetDir, targetName + '.ts'))) {
            targetName = pinyinName + '_' + counter;
            counter++;
        }

        const targetPath = path.join(targetDir, targetName + '.ts');

        // Move file (import paths are same depth: eq/lvN/ and eq/new/ both 4 levels to server/)
        fs.writeFileSync(targetPath, content, 'utf-8');
        fs.unlinkSync(filePath);

        moved.push({ name, from: file, to: `lv${grade}/${targetName}.ts` });
        movedCount++;
    }

    for (const s of skipped) {
        console.log(`SKIP: ${s.file} - ${s.reason}`);
    }

    console.log(`\nMoved ${movedCount} files:\n`);
    for (const m of moved) {
        console.log(`  ${m.name} → ${m.to}`);
    }

    // Remove empty new/ directory if possible
    try {
        const remaining = fs.readdirSync(newDir);
        if (remaining.length === 0) {
            fs.rmdirSync(newDir);
            console.log('\nRemoved empty new/ directory');
        } else {
            console.log(`\nnew/ directory still has ${remaining.length} files: ${remaining.join(', ')}`);
        }
    } catch (e) {
        // Directory doesn't exist
    }
}

main().catch(console.error);
