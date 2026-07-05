import fs from 'fs';
import path from 'path';

const skillDir = 'server/res/skill';

function findAllSkillFiles(dir) {
    const files = [];
    if (!fs.existsSync(dir)) return files;
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
        const full = path.join(dir, entry.name);
        if (entry.isDirectory()) files.push(...findAllSkillFiles(full));
        else if (entry.name.endsWith('.ts') && !entry.name.startsWith('.')) files.push(full);
    }
    return files;
}

const allFiles = findAllSkillFiles(skillDir);
const skills = [];

const GRADE_NAMES = ['基本', '普通', '高级', '稀有', '绝世', '神功', '无上'];
const GRADE_ICONS = ['⚪', '🟢', '🔵', '🟡', '🟣', '🟠', '🔴'];

const FAM_NAMES = {
    'HUASHAN': '华山派', 'GAIBANG': '丐帮', 'WUDANG': '武当派', 'SHAOLIN': '少林派',
    'EMEI': '峨眉派', 'XIAOYAO': '逍遥派', 'SHASHOU': '杀手楼', 'LIUSHAN': '六扇门',
    'WULANG': '无浪门', 'MONSTER': '怪物', '公共': '公共武功',
};

const TYPE_NAMES = {
    blade: '刀法', sword: '剑法', club: '棍法', staff: '杖法',
    whip: '鞭法', unarmed: '拳脚', throwing: '暗器',
    dodge: '轻功', force: '内功', parry: '招架', new: '特殊',
    knowage: '知识', base: '基础', monster: '怪物',
    emei: '峨眉派', gaibang: '丐帮', huashan: '华山派',
    shaolin: '少林派', shashou: '杀手楼', wudang: '武当派',
    wulang: '无浪门', xiaoyao: '逍遥派', liushan: '六扇门',
};

for (const f of allFiles) {
    const content = fs.readFileSync(f, 'utf-8');
    const nameMatch = content.match(/name\s*=\s*"(.+?)"/);
    const idMatch = content.match(/id\s*=\s*"(.+?)"/);
    const gradeMatch = content.match(/grade\s*=\s*(\d+)/);
    const familyMatch = content.match(/family\s*=\s*(.+?);/);
    const enablesMatch = content.match(/can_enables\s*=\s*(\[.+?\])/);
    const pfmCount = (content.match(/pfm_\d+/g) || []).length;
    const hasPfmSet = content.includes('pfm_set');
    const needsImpl = content.includes('TODO: Implement');
    const typeMatch = content.match(/type\s*=\s*SKILL_TYPES\.(\w+)/);

    if (nameMatch && idMatch) {
        const family = familyMatch ? familyMatch[1].replace('FAMILIES.', '').trim() : '公共';
        let enables = [];
        if (enablesMatch) {
            try {
                enables = JSON.parse(enablesMatch[1]);
            } catch {}
        }

        const relPath = f.replace(/\\/g, '/');
        const parts = relPath.split('/');
        const category = parts.length >= 4 ? parts[3] : 'other';

        skills.push({
            name: nameMatch[1],
            id: idMatch[1],
            grade: gradeMatch ? parseInt(gradeMatch[1]) : 0,
            family,
            enables,
            pfmCount,
            hasPfmSet,
            needsImpl,
            type: typeMatch ? typeMatch[1] : 'SKILL',
            file: relPath,
            category,
        });
    }
}

const total = skills.length;
const todoCount = skills.filter(s => s.needsImpl).length;
const completeCount = total - todoCount;

console.log('='.repeat(60));
console.log('  技能完善状态统计');
console.log('='.repeat(60));
console.log();
console.log(`  总技能数：${total} 个`);
console.log(`  已完善：  ${completeCount} 个 (${(completeCount/total*100).toFixed(1)}%)`);
console.log(`  未完善：  ${todoCount} 个 (${(todoCount/total*100).toFixed(1)}%)`);
console.log();

console.log('-'.repeat(60));
console.log('  按类型分类统计');
console.log('-'.repeat(60));
console.log();

const byType = {};
for (const s of skills) {
    const t = s.category;
    if (!byType[t]) byType[t] = { total: 0, todo: 0 };
    byType[t].total++;
    if (s.needsImpl) byType[t].todo++;
}

const typeOrder = ['sword', 'blade', 'unarmed', 'force', 'dodge', 'parry', 'club', 'staff', 'whip', 'throwing', 'knowage', 'new', 'base', 'monster', 'huashan', 'gaibang', 'wudang', 'shaolin', 'emei', 'xiaoyao', 'shashou', 'liushan', 'wulang'];

console.log(`  ${"类型".padEnd(10)}${"总数".padStart(6)}${"未完善".padStart(8)}${"完成率".padStart(10)}`);
console.log('  ' + '-'.repeat(40));

for (const t of typeOrder) {
    if (!byType[t]) continue;
    const data = byType[t];
    const rate = ((data.total - data.todo) / data.total * 100).toFixed(1);
    const typeName = TYPE_NAMES[t] || t;
    console.log(`  ${typeName.padEnd(10)}${String(data.total).padStart(6)}${String(data.todo).padStart(8)}${(rate + '%').padStart(10)}`);
}

console.log();
console.log('-'.repeat(60));
console.log('  按门派分类统计');
console.log('-'.repeat(60));
console.log();

const byFamily = {};
for (const s of skills) {
    const fam = s.family || '公共';
    if (!byFamily[fam]) byFamily[fam] = { total: 0, todo: 0 };
    byFamily[fam].total++;
    if (s.needsImpl) byFamily[fam].todo++;
}

const famOrder = ['HUASHAN', 'GAIBANG', 'WUDANG', 'SHAOLIN', 'EMEI', 'XIAOYAO', 'SHASHOU', 'LIUSHAN', 'WULANG', 'MONSTER', '公共'];

console.log(`  ${"门派".padEnd(10)}${"总数".padStart(6)}${"未完善".padStart(8)}${"完成率".padStart(10)}`);
console.log('  ' + '-'.repeat(40));

for (const fam of famOrder) {
    if (!byFamily[fam]) continue;
    const data = byFamily[fam];
    const rate = ((data.total - data.todo) / data.total * 100).toFixed(1);
    const famName = FAM_NAMES[fam] || fam;
    console.log(`  ${famName.padEnd(10)}${String(data.total).padStart(6)}${String(data.todo).padStart(8)}${(rate + '%').padStart(10)}`);
}

console.log();
console.log('-'.repeat(60));
console.log('  未完善技能列表（按门派）');
console.log('-'.repeat(60));

for (const fam of famOrder) {
    const famSkills = skills.filter(s => (s.family || '公共') === fam && s.needsImpl);
    if (famSkills.length === 0) continue;
    const famName = FAM_NAMES[fam] || fam;
    console.log();
    console.log(`  【${famName}】(${famSkills.length}个)`);
    for (const s of famSkills) {
        const gradeIcon = GRADE_ICONS[s.grade] || '⚪';
        const typeName = TYPE_NAMES[s.category] || s.category;
        console.log(`    ${gradeIcon} ${s.name.padEnd(16)} ${typeName.padEnd(6)} ${s.pfmCount}个绝招  [${s.file}]`);
    }
}

console.log();
console.log('='.repeat(60));
