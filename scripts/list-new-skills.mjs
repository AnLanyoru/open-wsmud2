/**
 * Generate a list of new skills with their implementation status
 * for documentation purposes.
 */
import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

// Collect ALL skill files on disk
function findAllSkillFiles(dir) {
    const files = [];
    if (!fs.existsSync(dir)) return files;
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
        const full = path.join(dir, entry.name);
        if (entry.isDirectory()) files.push(...findAllSkillFiles(full));
        else if (entry.name.endsWith('.ts')) files.push(full);
    }
    return files;
}

// Get the set of files that existed before our additions (from the parent commit)
const oldFiles = new Set();
try {
    const oldList = execSync('git ls-tree -r --name-only HEAD~1 server/res/skill/', { encoding: 'utf-8' });
    oldList.split('\n').filter(f => f).forEach(f => oldFiles.add(f));
} catch {
    // Fallback: use a hardcoded baseline
    console.error('Warning: could not get old file list from git');
}

// Filter to only new files (not in old commit)
const allDiskFiles = findAllSkillFiles('server/res/skill');
// Normalize paths for comparison
const allFiles = allDiskFiles.filter(f => {
    const normalized = f.replace(/\\/g, '/');
    return !oldFiles.has(normalized);
});
const output = [];
const GRADE_NAMES = ['白', '绿', '青', '黄', '紫', '橙', '红'];

for (const f of allFiles) {
    const content = fs.readFileSync(f, 'utf-8');
    const nameMatch = content.match(/name\s*=\s*"(.+?)"/);
    const idMatch = content.match(/id\s*=\s*"(.+?)"/);
    const gradeMatch = content.match(/grade\s*=\s*(\d+)/);
    const familyMatch = content.match(/family\s*=\s*(.+?);/);
    const enablesMatch = content.match(/can_enables\s*=\s*(\[.+?\])/);
    const pfmCount = (content.match(/pfm_\d+/g) || []).length;
    const needsImpl = content.includes('TODO: Implement');

    if (nameMatch && idMatch) {
        const family = familyMatch ? familyMatch[1].replace('FAMILIES.', '') : '公共';
        const enables = enablesMatch ? JSON.parse(enablesMatch[1]) : [];
        output.push({
            name: nameMatch[1],
            id: idMatch[1],
            grade: gradeMatch ? parseInt(gradeMatch[1]) : 0,
            family,
            enables,
            pfmCount,
            needsImpl,
            file: f.replace(/\\/g, '/'),
        });
    }
}

// Group by type directory
const byDir = {};
for (const s of output) {
    // Path format: server/res/skill/{dir}/file.ts
    const parts = s.file.split('/');
    const dir = parts.length >= 4 ? parts[3] : 'other'; // skill/{dir}/file.ts
    if (!byDir[dir]) byDir[dir] = [];
    byDir[dir].push(s);
}

// Print as markdown
console.log('# 新增武功待完善列表\n');
console.log('> 自动生成于 ' + new Date().toISOString().split('T')[0]);
console.log('> 总计 **' + output.length + '** 个技能，其中 **' + output.filter(s => s.needsImpl).length + '** 个绝招为桩代码，需手动实现核心逻辑。\n');
console.log('> 品级：🔲白 ⬜绿 🟩青 🟨黄 🟪紫 🟧橙 🟥红\n');

console.log('## 概览\n');
console.log('| 目录 | 数量 | 待实现绝招 |');
console.log('|------|------|-----------|');
for (const [dir, skills] of Object.entries(byDir).sort()) {
    const needWork = skills.filter(s => s.needsImpl).length;
    console.log('| ' + dir + ' | ' + skills.length + ' | ' + needWork + ' |');
}

// ---- Group by faction ----
const byFamily = {};
for (const s of output) {
    const fam = s.family || '公共';
    if (!byFamily[fam]) byFamily[fam] = [];
    byFamily[fam].push(s);
}

const FAM_NAMES = {
    'HUASHAN': '华山派', 'GAIBANG': '丐帮', 'WUDANG': '武当派', 'SHAOLIN': '少林派',
    'EMEI': '峨眉派', 'XIAOYAO': '逍遥派', 'SHASHOU': '杀手楼', 'LIUSHAN': '六扇门',
    'WULANG': '无浪门', 'MONSTER': '怪物', '公共': '公共武功',
};

console.log('\n## 门派分类\n');
console.log('| 门派 | 数量 | 待实现 |');
console.log('|------|------|--------|');
for (const [fam, skills] of Object.entries(byFamily).sort((a, b) => {
    // Sort: known factions first, then 公共, then others
    const order = ['HUASHAN','GAIBANG','WUDANG','SHAOLIN','EMEI','XIAOYAO','SHASHOU','LIUSHAN','WULANG','MONSTER','公共'];
    return order.indexOf(a[0]) - order.indexOf(b[0]);
})) {
    const needWork = skills.filter(s => s.needsImpl).length;
    const famName = FAM_NAMES[fam] || fam;
    console.log('| ' + famName + ' | ' + skills.length + ' | ' + needWork + ' |');
}

console.log('');

for (const [fam, skills] of Object.entries(byFamily).sort((a, b) => {
    const order = ['HUASHAN','GAIBANG','WUDANG','SHAOLIN','EMEI','XIAOYAO','SHASHOU','LIUSHAN','WULANG','MONSTER','公共'];
    return order.indexOf(a[0]) - order.indexOf(b[0]);
})) {
    const famName = FAM_NAMES[fam] || fam;
    console.log('### ' + famName + ' — ' + skills.length + ' 个\n');
    console.log('| 名称 | ID | 品级 | 类型 | 装备 | 绝招 | 状态 |');
    console.log('|------|-----|------|------|------|------|------|');
    for (const s of skills) {
        const gradeIcon = ['⚪','🟢','🔵','🟡','🟣','🟠','🔴'][s.grade] || '⚪';
        const status = s.needsImpl ? '⚠' : '✅';
        console.log('| ' + s.name + ' | `' + s.id + '` | ' + gradeIcon + ' | ' + s.enables[0] + ' | ' + s.enables.join(',') + ' | ' + s.pfmCount + ' | ' + status + ' |');
    }
    console.log('');
}

console.log('\n## 按类型详细列表\n');

for (const [dir, skills] of Object.entries(byDir).sort()) {
    // Map dir to Chinese type name
    const typeNames = {
        blade: '刀法', sword: '剑法', club: '棍法', staff: '杖法',
        whip: '鞭法', unarmed: '拳脚', throwing: '暗器',
        dodge: '轻功', force: '内功', parry: '招架', new: '特殊',
    };
    const typeName = typeNames[dir] || dir;

    console.log('### ' + typeName + '（' + dir + '） — ' + skills.length + ' 个\n');
    console.log('| 名称 | ID | 品级 | 门派 | 装备类型 | 绝招数 | 状态 |');
    console.log('|------|-----|------|------|----------|--------|------|');

    for (const s of skills) {
        const gradeIcon = ['⚪','🟢','🔵','🟡','🟣','🟠','🔴'][s.grade] || '⚪';
        const status = s.needsImpl ? '⚠ 待实现' : '✅ 完成';
        console.log('| ' + s.name + ' | `' + s.id + '` | ' + gradeIcon + ' | ' + s.family + ' | ' + s.enables.join(', ') + ' | ' + s.pfmCount + ' | ' + status + ' |');
    }
    console.log('');
}

console.log('---\n');
console.log('## 待实现绝招详情\n');
console.log('以下技能的绝招需要手动补充核心战斗逻辑：\n');

const needsWork = output.filter(s => s.needsImpl);
for (const s of needsWork) {
    console.log('### ' + s.name + ' (`' + s.id + '`)\n');
    console.log('- **文件**: `' + s.file + '`');
    console.log('- **品级**: ' + GRADE_NAMES[s.grade] + ' (' + s.grade + ')');
    console.log('- **门派**: ' + s.family);
    console.log('- **装备类型**: ' + s.enables.join(', '));
    console.log('- **绝招数**: ' + s.pfmCount + ' 个（桩代码）');

    // Read the file to extract perform descriptions
    try {
        const content = fs.readFileSync(s.file, 'utf-8');
        const descMatches = content.matchAll(/query_desc.*?return\s*"(.+?)"/gs);
        const descs = [...descMatches].map(m => m[1]);
        if (descs.length > 0) {
            console.log('- **绝招描述**:');
            for (const d of descs) {
                console.log('  - ' + d);
            }
        }
    } catch (e) {}

    console.log('');
}
